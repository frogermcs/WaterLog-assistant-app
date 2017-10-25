class UserManager {
    constructor(firebase) {
        this.firebase = firebase;
        this.user = null;
    }

    ensureAuthUser() {
        return new Promise((resolve, reject) => {
            if (this.user !== null) {
                resolve(this.user);
            }

            this.firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    this.user = user;
                    resolve(user);
                } else {
                    this.firebase.auth().signInAnonymously()
                        .then(result => {
                            this.user = result.user;
                            resolve(result.user);
                        })
                        .catch(error => reject(error));
                }
            });
        });
    }

    isFirstUsage(assistantUserId) {
        return this.ensureAuthUser().then(() => {
            return this.firebase.database()
                .ref('users/' + assistantUserId)
                .once('value').then(snapshot => {
                    let user = snapshot.val();
                    return user === null;
                });
        });
    }

    saveAssistantUser(assistantUserId) {
        return this.ensureAuthUser().then(() => {
            this.firebase.database()
                .ref('users/' + assistantUserId)
                .set({userId: assistantUserId});
        });
    }
}

module.exports = UserManager;
