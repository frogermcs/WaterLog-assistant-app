const sinon = require('sinon');
const chai = require('chai');

const UserManager = require('../user-manager.js');
const firebase = require('firebase');
const functions = require('firebase-functions');

const {
    exampleUser
} = require('./utils/mocking');

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
        it('Should return first usage when user doesnt exist in DB', (done) => {
            const dataUserDoesntExist = new functions.database.DeltaSnapshot(null, null, null, null);
            const fakeEvent = {data: dataUserDoesntExist};
            const onceStub = sinon.stub().withArgs('value').returns(Promise.resolve(fakeEvent.data));
            const refStub = sinon.stub().withArgs('users/' + exampleUser.userId).returns({once: onceStub});
            const databaseStub = sinon.stub(firebase, 'database').returns({ref: refStub});

            userManagerInstance.isFirstUsage(exampleUser.userId).then(firstUsage => {
                chai.assert.equal(firstUsage, true);
                done();

                databaseStub.restore();
            });
        });

        it('Shouldnt return first usage when user exists in DB', (done) => {
            const dataUserExists = new functions.database.DeltaSnapshot(null, null, null, "exampleUser");
            const fakeEvent = {data: dataUserExists};
            const onceStub = sinon.stub().withArgs('value').returns(Promise.resolve(fakeEvent.data));
            const refStub = sinon.stub().withArgs('users/' + exampleUser.userId).returns({once: onceStub});
            const databaseStub = sinon.stub(firebase, 'database').returns({ref: refStub});

            userManagerInstance.isFirstUsage(exampleUser.userId).then(firstUsage => {
                chai.assert.equal(firstUsage, false);
                done();

                databaseStub.restore();
            });
        });

    });

    describe('loadAssistantUser', () => {
        it('Shouldnt load expected user from DB', (done) => {
            const dataUserExists = new functions.database.DeltaSnapshot(null, null, null, exampleUser);
            const fakeEvent = {data: dataUserExists};
            const onceStub = sinon.stub().withArgs('value').returns(Promise.resolve(fakeEvent.data));
            const refStub = sinon.stub().withArgs('users/' + exampleUser.userId).returns({once: onceStub});
            const databaseStub = sinon.stub(firebase, 'database').returns({ref: refStub});

            userManagerInstance.loadAssistantUser(exampleUser.userId).then(user => {
                chai.assert.deepEqual(user, exampleUser);
                done();

                databaseStub.restore();
            });
        });

    });

    describe('saveAssistantUser', () => {
        it('Should save assistant user into DB', (done) => {
            const setSpy = sinon.spy();
            const refStub = sinon.stub().withArgs('users/' + exampleUser.userId).returns({set: setSpy});
            const databaseStub = sinon.stub(firebase, 'database').returns({ref: refStub});

            userManagerInstance.saveAssistantUser(exampleUser.userId).then(() => {
                chai.assert(setSpy.calledWith({userId: exampleUser.userId}));
                done();

                databaseStub.restore();
            });
        });
    });

    describe('saveAssistantUserName', () => {
        const expectedUserNameToSave = {
            displayName: "expectedDisplayName",
            givenName: "expectedGivenName",
            familyName: "expectedFamilyName",
        };

        it('Should save assistant user name into DB', (done) => {
            const setSpy = sinon.spy();
            const refStub = sinon.stub().withArgs('users/' + exampleUser.userId).returns({set: setSpy});
            const databaseStub = sinon.stub(firebase, 'database').returns({ref: refStub});

            userManagerInstance.saveAssistantUserName(exampleUser.userId, expectedUserNameToSave).then(() => {
                chai.assert(setSpy.calledWith(expectedUserNameToSave));
                done();

                databaseStub.restore();
            });
        });
    });
});