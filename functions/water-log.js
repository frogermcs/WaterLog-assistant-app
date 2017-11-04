class WaterLog {
    constructor(firebase, userManager, timeManager) {
        this.firebase = firebase;
        this.userManager = userManager;
        this.timeManager = timeManager;
    }

    saveLoggedWater(assistantUserId, loggedWater) {
        return this.userManager.ensureAuthUser()
            .then(() => {
                let mililiters = 0;
                if (loggedWater.unit === "L") {
                    mililiters = loggedWater.amount * 1000;
                } else if (loggedWater.unit === "ml") {
                    mililiters = loggedWater.amount;
                }

                const waterLogData = {
                    userId: assistantUserId,
                    mililiters: mililiters,
                    timestamp: Date.now()
                };

                const newWaterLogKey = this.firebase.database().ref().child('waterLogs').push().key;
                this.firebase.database()
                    .ref('waterLogs/' + newWaterLogKey)
                    .set(waterLogData);
            });
    }

    getLoggedWaterForUser(assistantUserId) {
        return this.userManager.ensureAuthUser().then(() => {
            return this.firebase.database()
                .ref('waterLogs')
                .orderByChild("userId").equalTo(assistantUserId)
                .once('value');
        }).then(waterLogs => {
            let loggedMililiters = 0;
            return this.timeManager.getTodayStartTimestampForAssistantUser(assistantUserId).then(todayStartsAt => {
                waterLogs.forEach(waterLog => {
                    if (waterLog.val().timestamp >= todayStartsAt) {
                        loggedMililiters += waterLog.val().mililiters;
                    }
                });
                return loggedMililiters;
            });
        });
    }
}

module.exports = WaterLog;
