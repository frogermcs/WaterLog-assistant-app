const ARG_WATER_VOLUME = 'water_volume';
const Str = require('./strings');
const util = require('util');

class Conversation {
    constructor(dialogflowApp, userManager, waterLog) {
        this.dialogflowApp = dialogflowApp;
        this.userManager = userManager;
        this.waterLog = waterLog;
    }

    actionWelcomeUser() {
        return this.userManager.isFirstUsage(this._getCurrentUserId())
            .then(isFirstUsage => {
                if (isFirstUsage) {
                    this.userManager.saveAssistantUser(this._getCurrentUserId());
                    this._greetNewUser();
                } else {
                    this._greetExistingUser();
                }

                return isFirstUsage;
            });
    }

    _greetNewUser() {
        this.dialogflowApp.ask(Str.GREETING_NEW_USER, Str.GREETING_NEW_USER_NO_INPUT_PROMPT);
    }

    _greetExistingUser() {
        this.waterLog.getLoggedWaterForUser(this._getCurrentUserId())
            .then(loggedWater => {
                this.dialogflowApp.ask(
                    util.format(Str.GREETING_EXISTING_USER, loggedWater),
                    Str.GREETING_EXISTING_USER_NO_INPUT_PROMPT);
            });
    }

    actionLogWater() {
        let waterToLog = this.dialogflowApp.getArgument(ARG_WATER_VOLUME);
        this.waterLog.saveLoggedWater(this._getCurrentUserId(), waterToLog);
        return this.waterLog.getLoggedWaterForUser(this._getCurrentUserId())
            .then(loggedWater => {
                this.dialogflowApp.tell(
                    util.format(Str.WATER_LOGGED_NOW,
                        waterToLog.amount,
                        waterToLog.unit,
                        loggedWater
                    )
                );
            });
    }

    actionGetLoggedWater() {
        return this.waterLog.getLoggedWaterForUser(this._getCurrentUserId())
            .then(loggedWater => this.dialogflowApp.tell(util.format(Str.WATER_LOGGED_OVERALL, loggedWater)));
    }

    _getCurrentUserId() {
        return this.dialogflowApp.getUser().userId;
    }
}

module.exports = Conversation;
