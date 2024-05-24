function isString(value) {
    return value instanceof String || value instanceof String;
}

function fhello(msg){
    if (msg.content === '!hello'){          //if statement
        msg.reply('(・ω・)ノ');
    }
}

function fedit(msg){
    console.log(`${msg.author.username}更新了${msg.content} -> ${msg.reactions.message.content}`);      
    //`something` : 一般文字 ${something} : code
    msg.reply('偷改訊息!? <@'+ msg.author.id +'>');
    //msg.channel.send('<@' + msg.author.id + '>');
}

function fdel(msg){
    console.log(msg);
    console.log(`${msg.author.id}刪除了${msg.content}`);
    //`something` : 一般文字 ${something} : code
    msg.channel.send('why u delete msg? <@' + msg.author.id + '>');
    //msg.channel.send('<@' + msg.author.id + '>');
}

function getURL(str){
    if(str){
        if (str.indexOf('https')<0){
            console.log('this is not a link');
            return;
        }
        const cutter = /https?:\/\/[^\s/$.?#].[^\s]*/g; //regex
        const url = str.match(cutter).toString();
        return url;
    }else{
        console.log("url is null");
        return;
    }
}

function getFront(pattern, str) {
    const index = str.indexOf(pattern);         //index that finds the pattern
  
    if (index !== -1) {
      const result = str.substring(0, index);   //front part
      return result;
    }else{
      return 'pattern not found in str';
    }
}

function getLatter(pattern, str) {
    const index = str.indexOf(pattern);         //index that finds the pattern

    if (index !== -1) {
        const result = str.substring(index + pattern.length);   //latter part 
        return result;
    }else{
        return 'pattern not found in str';
    }
}

function isPL(url){
    //check if its playlist, to distinguish between single song link & playlist
    return (url.indexOf('&list') < 0 && url.indexOf('music.youtube') < 0) ? true : false;
}

function cleanURL(url){
    //if shorten link with si, remove
    const pattern = /\?si=/;
    if(url.match(pattern)){
      console.log(`url before removing si = ${url}`);
      temp = userF.getFront('?si=', url);   //take front part before ?si=
      return temp;
      console.log(`the new url = ${url}`);
    }else{
        return url;
    }
}


/*
https://www.youtube.com/playlist?  list=PLuP13mtmD9Hq99FnJV9EgMi9XNsmoFFRe

https://www.youtube.com/ [/=24] 
watch? [?=31]                               code for playing vid id
v=5QkhyEoqhcY& [&]                          vid id 
list= [=]                                   code of list id
PLuP13mtmD9Hq99FnJV9EgMi9XNsmoFFRe& [&]     list id
index=2                                     code of x-th video in list id
*/

//export statement 
module.exports = {
    fhello,
    fdel,
    fedit,
    getURL,
    isString,
    getFront,
    getLatter,
    isPL,
    cleanURL
};


// module.exports = fdel;
// module.exports = fedit; 
// module.exports = fhello;