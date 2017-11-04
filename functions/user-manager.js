class UserManager {
    constructor(firebase) {
        this.firebase = firebase;
        this.user = null;
    }

    ensureAuthUser() {
        if (this.user !== null) {
            return Promise.resolve(this.user);
        } else {
            return new Promise((resolve, reject) => {
                this.firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                        resolve(user);
                    } else {
                        this.firebase.auth().signInAnonymously()
                            .then(result => resolve(result.user))
                            .catch(error => reject(error));
                    }
                });
            })
                .then(user => this.user = user)
        }
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
        return this.ensureAuthUser()
            .then(() => this.firebase.database().ref('users/' + assistantUserId));
    }
}

module.exports = UserManager;
