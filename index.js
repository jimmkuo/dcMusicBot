//same name as package.json --> "main": "index.js",
// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, messageLink, version, Collection, Intents } = require('discord.js');
const { token, YTkey, botPrefix, } = require('./config.json');

////youtube music bot
const ytpl = require('ytpl');
const play_dl = require('play-dl');
const ytdl = require('ytdl-core');
//const ytdl = require('ytdl-core-discord');
const { exec } = require('child_process');
const player = require('play-sound')(opts = {});
const sugar_rush = 'https://youtu.be/_c3JIkgfo4Q?si=UF32oFWhbBy3mXYh';
const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');
////

//user function
const userF = require('./tutorial/userF.js');

//user class control
 const c1 = require('./control.js');
const { CLIENT_RENEG_LIMIT } = require('tls');

//create a queue for storing ids of the vids in playlist
var q = {};

// Create a new client instance
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,           // Add intent for voice state (musicbot)
    ],
  });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag})`)
});

// Log in to Discord with your client's token
client.login(token);

//////////////////////////////////////////////////////////////////////////////////////////////////////
//以上 : dc bot 必須code //以下 : tutorial codes
//////////////////////////////////////////////////////////////////////////////////////////////////////

// const fhello = require('./tutorial/hel.js');
// const fdel = require('./tutorial/del.js');
// const fedit = require('./tutorial/edit.js');
// const { fhello , fdel, fedit, getURL } = require('./tutorial/tut.js')

client.on(Events.MessageCreate, (msg) => {
  //check if its !hello  
  userF.fhello(msg);
});

client.on(Events.MessageDelete, (msg) => {
  userF.fdel(msg);
});

client.on(Events.MessageUpdate, (msg) => {
  userF.fedit(msg);
});


//////////////////////////////////////////////////////////////////////////////////////////////////////
//以上 : tutorial codes //以下 : music bot 
//////////////////////////////////////////////////////////////////////////////////////////////////////
function isCommand(msg){
  temp = msg.content;
  if(temp.indexOf('!play')>-1){
    temp = userF.getFront(' ', msg.content);
  }
  
  switch(temp){// ||  ||  ||  ||  || '!resume' || 
    case '!help':
    case '!delq':
    case '!quit':
    case '!pause':
    case '!play':
    case '!q':
    case '!resume':
    case '!skip':
      console.log(temp);
      return true;
    default:
      console.log('haa u gay! false for isCommand');
      return false;
  }
}

client.on(Events.MessageCreate, async (msg) => {
	//return if this msg is from bot, 
  if(msg.author.bot) return;
  
  //check if is one of the commands
  if (!isCommand(msg)) return;

  // check if is !play
  temp = msg.content
  if(temp.indexOf('!play')>-1){
    temp = userF.getFront(' ', msg.content);
  }

  //check which command
	try {
		switch(temp){
      case '!help':
        c1.help(msg);
        break;
      case '!delq':
        c1.delq(msg);
        break;
      case '!quit':
        c1.quit(msg);
        break;
      case '!pause':
        c1.pause(msg);
        break;
      case '!play':
        c1.play(msg);
        break;
      case '!q':
        c1.q(msg);
        break;
      case '!resume':
        c1.resume(msg);
        break;
      case '!skip':
        c1.skip(msg);
        break;
    default:
      console.log('no command chosen... ');
      return false;
    }
	} catch (error) {
		console.error(error);
    console.error('error in index.js ');
		msg.reply("Error bruh");
	}
});