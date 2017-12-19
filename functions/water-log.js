const Constants = require('./constants.js');
const math = require('mathjs');

class WaterLog {
    constructor(firebaseAdmin, timeManager) {
        this.firebaseAdmin = firebaseAdmin;
        this.timeManager = timeManager;
    }

    saveLoggedWater(assistantUserId, loggedWater) {
        let mililiters = 0;
        if (loggedWater.unit === "L") {
            mililiters = loggedWater.amount * 1000;
        } else if (loggedWater.unit === "ml") {
            mililiters = loggedWater.amount;
        } else if (loggedWater.unit === "fl oz") {
            mililiters = math.round(loggedWater.amount * Constants.OZ_TO_ML);
        }

        const waterLogData = {
            userId: assistantUserId,
            mililiters: mililiters,
            timestamp: Date.now()
        };

        const newWaterLogKey = this.firebaseAdmin.database().ref().child('waterLogs').push().key;
        this.firebaseAdmin.database()
            .ref('waterLogs/' + newWaterLogKey)
            .set(waterLogData);
    }

    getLoggedWaterForUser(assistantUserId) {
        return Promise.resolve(
            this.firebaseAdmin.database()
                .ref('waterLogs')
                .orderByChild("userId").equalTo(assistantUserId)
                .once('value')
        ).then(waterLogs => {
            let loggedMililiters = 0;
            return this.timeManager.getTodayStartTimestampForAssistantUser(assistantUserId).then(todayStartsAt => {
                waterLogs.forEach(waterLog => {
                    if (waterLog.val().timestamp >= todayStartsAt) {
                        loggedMililiters += waterLog.val().mililiters;
                    }
                });
                return math.round(loggedMililiters);
            });
        });
    }
}

module.exports = WaterLog;
