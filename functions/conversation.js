const ARG_WATER_VOLUME = 'water_volume';
const Str = require('./strings');
const util = require('util');

class Conversation {
    constructor(dialogflowApp, userManager, waterLog, timeManager) {
        this.dialogflowApp = dialogflowApp;
        this.userManager = userManager;
        this.waterLog = waterLog;
        this.timeManager = timeManager;
    }

    //Intent input.welcome
    actionWelcomeUser() {
        return this.userManager.isFirstUsage(this._getCurrentUserId())
            .then(isFirstUsage => {
                if (isFirstUsage) {
                    this.userManager.saveAssistantUser(this._getCurrentUserId());
                    this._greetNewUser();
                } else {
                    return this._greetExistingUser();
                }

                return isFirstUsage;
            });
    }

    _greetNewUser() {
        this.dialogflowApp.ask(Str.GREETING_NEW_USER, Str.GREETING_NEW_USER_NO_INPUT_PROMPT);
    }

    _greetExistingUser() {
        const loggedWaterPromise = this.waterLog.getLoggedWaterForUser(this._getCurrentUserId());
        const userNamePromise = this.userManager.loadAssistantUser(this._getCurrentUserId());

        return Promise.all([loggedWaterPromise, userNamePromise])
            .then(values => {
                const loggedWater = values[0];
                const userGivenName = values[1].givenName;
                let formattedName = '';
                if (userGivenName) {
                    formattedName = ' ' + userGivenName;
                }
                this.dialogflowApp.ask(
                    util.format(Str.GREETING_EXISTING_USER, formattedName, loggedWater),
                    Str.GREETING_EXISTING_USER_NO_INPUT_PROMPT
                );
            });
    }

    //Intent log_water
    actionLogWater() {
        //Get argument extracted by Dialogflow
        let waterToLog = this.dialogflowApp.getArgument(ARG_WATER_VOLUME);
        //Save logged water into Firebase Realtime Database
        this.waterLog.saveLoggedWater(this._getCurrentUserId(), waterToLog);
        //Load sum of logged water for current user and reply user
        //with how much water he or she logged so far.
        //End the conversation.
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

    //Intent get_logged_water
    actionGetLoggedWater() {
        return this.waterLog.getLoggedWaterForUser(this._getCurrentUserId())
            .then(loggedWater => this.dialogflowApp.tell(util.format(Str.WATER_LOGGED_OVERALL, loggedWater)));
    }

    //Intent update_settings
    actionUpdateSettings() {
        this._askForUserName();
    }

    _askForUserName() {
        const permission = this.dialogflowApp.SupportedPermissions.NAME;
        this.dialogflowApp.askForPermission(Str.PERMISSIONS_ASK_FOR_NAME, permission);
    }

    _askForUserPreciseLocation(userName) {
        const permission = this.dialogflowApp.SupportedPermissions.DEVICE_PRECISE_LOCATION;
        return this.timeManager.getPlatformTime().then(platformTime => {
            this.dialogflowApp.askForPermission(
                util.format(Str.PERMISSIONS_ASK_FOR_LOCATION, userName, platformTime),
                permission
            );
        })
    }

    //Intent user_data
    actionUserData() {
        if (this.dialogflowApp.isPermissionGranted()) {
            const userName = this.dialogflowApp.getUserName();
            if (userName) {
                this.userManager.saveAssistantUserName(this._getCurrentUserId(), userName);
                const deviceLocation = this.dialogflowApp.getDeviceLocation();
                if (deviceLocation) {
                    return this._setupUserTimezoneAndFinish(deviceLocation);
                } else {
                    return this._askForUserPreciseLocation(userName.givenName)
                }
            } else {
                this._finishWithUnexpectedProblems();
            }
        } else {
            this._finishWithPermissionsDenied();
        }

        return Promise.resolve(true);
    }

    _setupUserTimezoneAndFinish(deviceLocation) {
        const timezone = this.timeManager.getTimeZoneFromCoordinates(deviceLocation.coordinates);
        return this.timeManager.saveAssistantUserTimezone(this._getCurrentUserId(), timezone).then(() => {
            this.dialogflowApp.tell(Str.SETTINGS_UPDATE);
        });
    }

    _finishWithUnexpectedProblems() {
        this.dialogflowApp.tell(Str.PERMISSIONS_UNEXPECTED_ISSUES);
    }

    _finishWithPermissionsDenied() {
        this.dialogflowApp.tell(Str.PERMISSIONS_DENIED);
    }

    _getCurrentUserId() {
        return this.dialogflowApp.getUser().userId;
    }
}

module.exports = Conversation;
