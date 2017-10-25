const sinon = require('sinon');
const chai = require('chai');

const UserManager = require('../user-manager.js');
const firebase = require('firebase');
const functions = require('firebase-functions');

describe('UserManager', () => {
    let userManagerInstance;
    let onAuthStateChangedStub;
    let authStub;

    before(() => {
        onAuthStateChangedStub = sinon.stub().callsArgWith(0, "ExampleUser");
        authStub = sinon.stub(firebase, 'auth').returns({onAuthStateChanged: onAuthStateChangedStub});
        userManagerInstance = new UserManager(firebase);
    });

    afterEach(() => {
        userManagerInstance.user = null;
    });

    describe('isFirstUsage', () => {
        const expectedUserId = "abc123";

        it('Should return first usage when user doesnt exist in DB', (done) => {
            const dataUserDoesntExist = new functions.database.DeltaSnapshot(null, null, null, null);
            const fakeEvent = {data: dataUserDoesntExist};
            const onceStub = sinon.stub().withArgs('value').returns(Promise.resolve(fakeEvent.data));
            const refStub = sinon.stub().withArgs('users/' + expectedUserId).returns({once: onceStub});
            const databaseStub = sinon.stub(firebase, 'database').returns({ref: refStub});

            userManagerInstance.isFirstUsage(expectedUserId).then(firstUsage => {
                chai.assert.equal(firstUsage, true);
                done();

                databaseStub.restore();
            });
        });

        it('Shouldnt return first usage when user exists in DB', (done) => {
            const dataUserExists = new functions.database.DeltaSnapshot(null, null, null, "exampleUser");
            const fakeEvent = {data: dataUserExists};
            const onceStub = sinon.stub().withArgs('value').returns(Promise.resolve(fakeEvent.data));
            const refStub = sinon.stub().withArgs('users/' + expectedUserId).returns({once: onceStub});
            const databaseStub = sinon.stub(firebase, 'database').returns({ref: refStub});

            userManagerInstance.isFirstUsage(expectedUserId).then(firstUsage => {
                chai.assert.equal(firstUsage, false);
                done();

                databaseStub.restore();
            });
        });

    });

    describe('saveAssistantUser', () => {
        const expectedUserId = "abc123";

        it('Should save assistant user into DB', (done) => {
            const setSpy = sinon.spy();
            const refStub = sinon.stub().withArgs('users/' + expectedUserId).returns({set: setSpy});
            const databaseStub = sinon.stub(firebase, 'database').returns({ref: refStub});

            userManagerInstance.saveAssistantUser(expectedUserId).then(() => {
                chai.assert(setSpy.calledWith({userId: expectedUserId}));
                done();

                databaseStub.restore();
            });
        });
    });

    describe('ensureAuthUser', () => {
        const expectedResponse = {user: "user1"};

        it('Should authenticate anonymous user when user isnt authenticated', (done) => {
            onAuthStateChangedStub.callsArgWith(0, null);
            const signInAnonymouslyStub = sinon.stub().returns(Promise.resolve(expectedResponse));

            authStub.restore();
            authStub = sinon.stub(firebase, 'auth').returns({
                onAuthStateChanged: onAuthStateChangedStub,
                signInAnonymously: signInAnonymouslyStub
            });

            userManagerInstance.ensureAuthUser().then(result => {
                chai.assert.equal(result, expectedResponse.user);
                done();
            });
        });

        it('Should return authenticated user', (done) => {
            onAuthStateChangedStub.callsArgWith(0, expectedResponse.user);

            userManagerInstance.ensureAuthUser().then(result => {
                chai.assert.equal(result, expectedResponse.user);
                done();
            });
        });
    });
});