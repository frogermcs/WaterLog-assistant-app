class TimeManager {

    constructor(firebaseAdmin, geoTz, moment) {
        this.firebaseAdmin = firebaseAdmin;
        this.geoTz = geoTz;
        this.moment = moment;
    }

    getTodayStartTimestampForAssistantUser(assistantUserId) {
        return this.getAssistantUserTimeData(assistantUserId)
            .then(userTimeData => {
                if (userTimeData) {
                    return this.moment.tz(userTimeData.timezone).startOf("day").toDate();
                } else {
                    return this.moment.tz(this.moment.tz.guess()).startOf("day").toDate();
                }
            });
    }

    getPlatformTime(timeFormat = 'h:mm a') {
        const localTimezone = this.moment.tz.guess();
        return Promise.resolve(this.moment.tz(localTimezone).format(timeFormat));
    }

    getTimeZoneFromCoordinates(coordinates) {
        return this.geoTz.tz(coordinates.latitude, coordinates.longitude);
    }

    saveAssistantUserTimezone(assistantUserId, timezone) {
        return this._dbRefToAssistantUserTimeDataPromise(assistantUserId)
            .then(ref => ref.set({timezone: timezone}));
    }

    getAssistantUserTimeData(assistantUserId) {
        return this._dbRefToAssistantUserTimeDataPromise(assistantUserId)
            .then(ref => ref.once('value'))
            .then(snapshot => snapshot.val());
    }

    _dbRefToAssistantUserTimeDataPromise(assistantUserId) {
        return Promise.resolve(this.firebaseAdmin.database().ref('userTime/' + assistantUserId));
    }
}

module.exports = TimeManager;