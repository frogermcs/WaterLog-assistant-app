const PackageJson = require('./package.json');
const Actions = require('./assistant-actions');

class Analytics {

    constructor(chatbase) {
        this.chatbase = chatbase;
    }

    logUserMessage(msg, intent) {
        let userMessage = this.chatbase
            .newMessage()
            .setMessage(msg)
            .setAsTypeUser()
            .setIntent(intent)
            .setVersion(PackageJson.version);

        if (intent === Actions.ACTION_DEFAULT_FALLBACK) {
            userMessage = userMessage.setAsNotHandled();
        } else {
            userMessage = userMessage.setAsHandled();
        }

        userMessage.send()
            .then(msg => {
                console.log(msg.getCreateResponse());
            })
            .catch(err => console.error(err));
    }

    logAgentReply(msg) {
        this.chatbase
            .newMessage()
            .setMessage(msg)
            .setAsTypeAgent()
            .setVersion(PackageJson.version)
            .send()
            .then(msg => {
                console.log(msg.getCreateResponse())
            })
            .catch(err => console.error(err));
    }

}

module.exports = Analytics;