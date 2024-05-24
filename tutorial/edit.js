//this function is to reply on edit
// module.exports = client.on(Events.MessageUpdate, (message) => {
//     console.log(message);
//     console.log(`${message.author.username}更新了${message.content} -> ${message.reactions.message.content}`);      
//     //`something` : 一般文字 ${something} : code
//     message.channel.send('偷改訊息!?')
// });

function fedit(message){
    console.log(message);
    console.log(`${message.author.username}更新了${message.content} -> ${message.reactions.message.content}`);      
    //`something` : 一般文字 ${something} : code
    message.channel.send('偷改訊息!?')
    message.channel.send('<@' + message.author.id + '>');
}

module.exports = fedit; //export statement