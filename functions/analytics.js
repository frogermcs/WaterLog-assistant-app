const PackageJson = require('./package.json');

class Analytics {

    constructor(chatbase) {
        this.chatbase = chatbase;
    }

    logUserMessage(msg, intent) {
        this.chatbase
            .newMessage()
            .setMessage(msg)
            .setAsTypeUser()
            .setIntent(intent)
            .setVersion(PackageJson.version)
            .send()
            .then(msg => {
                console.log(msg);
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
                console.log(msg);
                console.log(msg.getCreateResponse())
            })
            .catch(err => console.error(err));
    }

}

module.exports = Analytics;