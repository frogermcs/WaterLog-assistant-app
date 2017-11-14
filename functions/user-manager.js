class UserManager {
    constructor(firebaseAdmin) {
        this.firebaseAdmin = firebaseAdmin;
        this.user = null;
    }

    isFirstUsage(assistantUserId) {
        return this.loadAssistantUser(assistantUserId)
            .then(user => user === null);
    }

    loadAssistantUser(assistantUserId) {
        return this._dbRefToAssistantUserPromise(assistantUserId)
            .then(ref => ref.once('value'))
            .then(snapshot => snapshot.val());
    }

    saveAssistantUser(assistantUserId) {
        return this._dbRefToAssistantUserPromise(assistantUserId)
            .then(ref => ref.set({userId: assistantUserId}));
    }

    saveAssistantUserName(assistantUserId, assistantUserName) {
        return this._dbRefToAssistantUserPromise(assistantUserId)
            .then(ref => ref.set({
                displayName: assistantUserName.displayName,
                givenName: assistantUserName.givenName,
                familyName: assistantUserName.familyName
            }));
    }

    _dbRefToAssistantUserPromise(assistantUserId) {
        return Promise.resolve(this.firebaseAdmin.database().ref('users/' + assistantUserId));
    }
}

module.exports = UserManager;
