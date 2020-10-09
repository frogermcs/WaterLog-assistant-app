const PackageJson = require('./package.json');
const Actions = require('./assistant-actions');

class Analytics {

    constructor() {

    }

    logUserMessage(msg, intent) {
        //TBD

        // Old chatbase code below v

        // let userMessage = this.chatbase
        //     .newMessage()
        //     .setMessage(msg)
        //     .setAsTypeUser()
        //     .setIntent(intent)
        //     .setVersion(PackageJson.version);

        // if (intent === Actions.ACTION_DEFAULT_FALLBACK) {
        //     userMessage = userMessage.setAsNotHandled();
        // } else {
        //     userMessage = userMessage.setAsHandled();
        // }

        // userMessage.send()
        //     .then(msg => {
        //         console.log(msg.getCreateResponse());
        //     })
        //     .catch(err => console.error(err));
    }

    logAgentReply(msg) {
        //TBD

        // Old chatbase code below v
        
        // this.chatbase
        //     .newMessage()
        //     .setMessage(msg)
        //     .setAsTypeAgent()
        //     .setVersion(PackageJson.version)
        //     .send()
        //     .then(msg => {
        //         console.log(msg.getCreateResponse())
        //     })
        //     .catch(err => console.error(err));
    }

}

module.exports = Analytics;