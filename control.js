const play_dl = require('play-dl');
const ytpl = require('ytpl');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');
const { Client, Events, GatewayIntentBits, messageLink, version, Collection, Intents } = require('discord.js');

//user function
const userF = require('./tutorial/userF.js');

class Control {
    constructor(isPlaying, q, connection, player){
        this.isPlaying = {};        //check if its playing or not
        this.queue = {};            //queue of songs
        this.connection = {};       //check connection for VC
        this.player = {};           //stores the current player, so i can access globally
    }

    // show instructions for this bot
    help(msg) {
        msg.reply('Integrated by **loliking**  \n\n**[!play + "Youtube link" / !play + "Youtube playlist link"]** to play a song / a list of song \n\n**[!pause]** to pause the music \n\n**[!resume]** to resume the music \n\n**[!skip]** to skip current song \n\n**[!q]** to display the queue \n\n**[!quit]** the bot rage quits');
    }

    // check if its playlist
    isPlayList(url) {
        if (url.indexOf('list=') > -1 && url.indexOf('music.youtube') < 0) {
            return true;
        }
        return false;
    }

    // adds bot into VC, process commands, song info etc.
    async play(msg) {

        // 
        const guildID = msg.guildId;

        // check if in VC
        if (msg.member.voice.channel === null) {
            msg.reply({ content: 'Bruh you not in VC', ephemeral: true });
            return;
        }

        // bot join VC
        this.connection[guildID] = joinVoiceChannel({
            channelId: msg.member.voice.channel.id,
            guildId: guildID,
            adapterCreator: msg.guild.voiceAdapterCreator
        });

        //check if its a link
        let t1 = userF.getLatter(' ', msg.content);
        if (t1.indexOf('https')<0){
            console.log('this is not a link');
            msg.reply('Please enter a link, this is not youtube search bar');
        }

        //get url from "!play url" message
        let musicURL = userF.getURL(msg.content);

        //
        try {
            // if theres no queue, make an empty array
            if (!this.queue[guildID]) {
                this.queue[guildID] = [];
            }

            let music_name = null;
            let list_name = null;

            // check if is playlist (isPL)
            const isPL = this.isPlayList(musicURL);

            //if link = playlist
            if (isPL) {

                // get playlist info into res
                const res = await play_dl.playlist_info(musicURL);
                list_name = res.title;      //music

                // get first 5 musics info 
                const videoTitles = res.videos.map((v, i) => `[${i+1}] ${v.title}`).slice(0, 5).join('\n');
                msg.channel.send(`**Playlist : ${list_name}**\n Playlist ID : [${res.id}]\n==========================\n${videoTitles}\n……以及其他 ${res.videos.length - 10} 首歌 `);

                // write each (forEach) video's info, and push into queue
                res.videos.forEach(v => {
                    this.queue[guildID].push({
                        id: res.id,
                        name: v.title,
                        url: v.url
                    });
                });

            } else {        //if this is not a playlist

                // get video info
                const res = await play_dl.video_basic_info(musicURL);
                let music_name = res.video_details.title;

                // write into queue
                this.queue[guildID].push({
                    id: res.video_details.id,
                    name: music_name,
                    url: musicURL
                });

            }

            // if now playing, add this song into the queue, else play now
            if (this.isPlaying[guildID]) {
                if(isPL){
                    // get playlist info into res
                    const res = await play_dl.playlist_info(musicURL);
                    list_name = res.title;      //music
                    msg.reply(`**${list_name}** added into the queue`)
                }else{
                    const res = await play_dl.video_basic_info(musicURL);
                    let music_name = res.video_details.title;
                    msg.reply(`${music_name} added into the queue`)
                }
            } else {
                this.isPlaying[guildID] = true;
                msg.reply(`Playing：${this.queue[guildID][0].name}`);
                this.playMusic(msg, this.queue[guildID][0], true);
            }

        } catch(e) {
            console.log(e);
            console.log('Error in play()');
        }

    }

    // auto play next song
    playNextMusic(msg) {

        const guildID = msg.guildId;

        // if queue have songs, play it, else isPlaying = false
        if (this.queue[guildID].length > 0) {
            this.playMusic(msg, this.queue[guildID][0], false);
        } else {
            this.isPlaying[guildID] = false;
        }
    }

    //actually plays the song
    async playMusic(msg, musicInfo, isReplied) {
        //guildID
        const guildID = msg.guildId;

        try {
            // show music name
            if (!isReplied) {
                const content = `Playing : ${musicInfo.name}`;
                msg.channel.send(content);
            }
            
            // plays music, use play_dl, AudioResources,
            const stream = await play_dl.stream(musicInfo.url);
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type
            });

            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Play
                }
            });

            player.play(resource);
            
            //join VC
            this.connection[guildID].subscribe(player);
            this.player[guildID] = player;

            // remove the song palying now, shift() = pop the 1st song from array
            this.queue[guildID].shift();    

            // event when song finish playing, 
            //check the player state, if change from non-idle to idle, plays next song using playNextMusic
            player.on('stateChange', (oldState, newState) => {
                if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                    this.playNextMusic(msg);
                }

            });
        } catch(e) {
            console.log(e);
            console.log('Error in playMusic()');
            msg.channel.send('Some shitting error for this music');

            // pop the song out
            this.queue[guildID].shift();

            // plays next music
            this.playNextMusic(msg);
        }

    }

    // resume song after pause
    resume(msg) {
        const guildID = msg.guildId;
        if (this.isPlaying[guildID]) {
            this.player[guildID].unpause();     //built in function unpause from audioPlayer
            let gif1 = 'https://tenor.com/bTOxF.gif';
            msg.reply(gif1);
            msg.channel.send('時は動き出す');
        } else {
            msg.reply('Bruh no song to resume');
        }

    }

    // pause for a while
    pause(msg) {

        const guildID = msg.guildId;
        if (this.player[guildID]) {
            this.player[guildID].pause();
            
            let gif2 = 'https://tenor.com/78aJ.gif';
            msg.reply(gif2);
            msg.channel.send('Za Warudooo! 時よ止まれ！')
        } else {
            msg.reply('Bruh the bot not in VC');
        }
    }

    // skipp current song
    skip(msg) {
        const guildID = msg.guildId;
        if (this.player[guildID]) {
            if(this.queue[guildID].length == 0){
                if(this.isPlaying[guildID] = true){
                    msg.reply('Last song in the queue bruh, get some more');
                    this.player[guildID].stop();
                }else{
                    msg.reply('No songs in the queue, you cant skip nothing');
                }
            }else{
                this.player[guildID].stop();
                msg.reply('Get this song out of here');
            }
        } else {
            msg.reply('Bruh u sure im playing something?');
        }

    }

    // get the queue info
    q(msg) {
        const guildID = msg.guildId;

        // if have queue, show it
        console.log(this.queue[guildID].length);
        if (this.queue[guildID] && this.queue[guildID].length > 0) {
            let queueString = '';

            // parsing the object's attribute into a string, using map
            let queue = this.queue[guildID].map((item, index) => `[${index+1}] ${item.name}`);
            if (queue.length > 5) {
                queue = queue.slice(0, 5);
                queueString = `Queue：\n${queue.join('\n')}\n …… and ${this.queue[guildID].length - 5} other songs`;
            } else {
                queueString = `Queue：\n${queue.join('\n')}`;
            }

            msg.reply(queueString);
        } else {
            msg.reply('No songs in the queue');
        }
    }

    // delete all songs in the queue
    delq(msg) {
        const guildID = msg.guildId;

        //make sure
        msg.reply('Sure? You got 5 seconds to type yes / no.')

        // Filter to only accept input from the same user
        const filter = (user_reply) => user_reply.author.id === msg.author.id;
        
        // Collect only one message from the user within 5 seconds
        const collector = msg.channel.createMessageCollector({ filter, max: 1, time: 5000 }); 

        collector.on('collect', (collected) => {

            // Handle the collected input message
            console.log(`User input: ${collected.content}`);
            const r = collected.content.toLowerCase();

            //if yes
            if(r === 'yes'){
                // delete all songs in the queue
                this.queue[guildID] = [];
                msg.reply(`The queue is now empty`);

            }//if no
            else if(r === 'no'){
                msg.reply('~~ha! puss~~ ok then._.');

            }//if not yes or no
            else{
                msg.reply('Bruh its just a yes no question ==');    
            }

        });

        //if not replied within 5 seconds
        collector.on('end', (collected) => {
            if (collected.size === 0) {
                //reply wif a gif
                let gif3 = "https://tenor.com/buJuD.gif";

                // Send the message with the GIF attachment
                msg.reply(gif3);
                msg.channel.send('判断が遅い！');
            }
        });
        
    }

    // make the bot leave
    quit(msg) {
        const guildID = msg.guildId;

        // check if bot is in VC
        if (this.connection[guildID]) {

            // if bot played some song
            if (this.queue.hasOwnProperty(guildID)) {

                // clear the queue
                delete this.queue[guildID];

                // change isPlaying to false
                this.isPlaying[guildID] = false;
            }

            // leave channel
            this.connection[guildID].disconnect();

            msg.reply('Man fk this VC');
        } else {
            msg.reply({ content: 'Bruh never joined the VC', ephemeral: true });
        }
    }
    
}
module.exports = new Control();         //already make an object when require it tmd