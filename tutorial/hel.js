//this function is to reply on hello
// client.on(Events.MessageCreate, (message) => {
    
//     if (message.content === '!hello'){          //if statement
//         message.reply('Hello!');
//     }
// });

function fhello(message){
    if (message.content === '!hello'){          //if statement
        message.reply('Hello!');
    }
}
 
module.exports = fhello;
