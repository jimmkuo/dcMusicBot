//this function is to reply on delete
// client.on(Events.MessageDelete, (message) => {
//     console.log(message);
//     console.log(`${message.author.username}刪除了${message.content}`);
//     //`something` : 一般文字 ${something} : code
//     message.channel.send('why u delete msg?');
//     message.channel.send('<@' + message.author.id + '>');

// });

function fdel(message){
    console.log(message);
    console.log(`${message.author.id}刪除了${message.content}`);
    //`something` : 一般文字 ${something} : code
    message.channel.send('why u delete msg?');
    message.channel.send('<@' + message.author.id + '>');
}

module.exports = fdel;