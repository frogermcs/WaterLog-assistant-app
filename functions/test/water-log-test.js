const sinon = require('sinon');
const chai = require('chai');

const WaterLog = require('../water-log.js');
const UserManager = require('../user-manager.js');
const Utils = require('../utils');
const firebase = require('firebase');
const functions = require('firebase-functions');

describe('WaterLog', () => {
    let userManagerInstance;
    let waterLogInstance;

    const userId = "abc123";

    before(() => {
        userManagerInstance = new UserManager();
        waterLogInstance = new WaterLog(firebase, userManagerInstance);
        sinon.stub(userManagerInstance, 'ensureAuthUser').returns(Promise.resolve(true));
    });

    describe('saveLoggedWater', () => {
        let dateStub;
        const expectedWaterLogKey = "abc123";

        beforeEach(() => {
            dateStub = sinon.stub(Date, 'now').returns(123);
        });

        afterEach(() => {
            dateStub.restore();
        });

        it('Should save logged mililiters of water', (done) => {
            const expectedMililiters = 1000;
            const loggedWaterInput = {unit: "ml", amount: expectedMililiters};
            const expectedLoggedWater = {userId: userId, mililiters: expectedMililiters, timestamp: Date.now()};

            const setSpy = sinon.spy();
            const pushStub = sinon.stub().withArgs().returns({key: expectedWaterLogKey});
            const childStub = sinon.stub().withArgs('waterLogs').returns({push: pushStub});
            const refStub = sinon.stub();
            refStub.withArgs('waterLogs/' + expectedWaterLogKey).returns({set: setSpy});
            refStub.returns({child: childStub});
            const databaseStub = sinon.stub(firebase, 'database').returns({ref: refStub});

            waterLogInstance.saveLoggedWater(userId, loggedWaterInput).then(() => {
                chai.assert(setSpy.calledWith(expectedLoggedWater));
                done();

                databaseStub.restore();
            });
        });

        it('Should save logged liters of water', (done) => {
            const expectedMililiters = 1000;
            const loggedWaterInput = {unit: "L", amount: 1};
            const expectedLoggedWater = {userId: userId, mililiters: expectedMililiters, timestamp: Date.now()};

            const setSpy = sinon.spy();
            const pushStub = sinon.stub().withArgs().returns({key: expectedWaterLogKey});
            const childStub = sinon.stub().withArgs('waterLogs').returns({push: pushStub});
            const refStub = sinon.stub();
            refStub.withArgs('waterLogs/' + expectedWaterLogKey).returns({set: setSpy});
            refStub.returns({child: childStub});
            const databaseStub = sinon.stub(firebase, 'database').returns({ref: refStub});

            waterLogInstance.saveLoggedWater(userId, loggedWaterInput).then(() => {
                chai.assert(setSpy.calledWith(expectedLoggedWater));
                done();

                dateStub.restore();
                databaseStub.restore();
            });
        });
    });

    describe('getLoggedWaterForUser', () => {
        it('Should load logged water for given user and present data from recent day', (done) => {
            //Fake timestamps to distinguish "today" and "yesterday"
            const timestampYesterday = 10;
            const timestampMidnight = 50;
            const timestampToday = 100;
            const expectedRequestData = {
                abc: {userId: userId, mililiters: 100, timestamp: timestampYesterday},
                def: {userId: userId, mililiters: 50, timestamp: timestampToday}
            };
            const dataUserExists = new functions.database.DeltaSnapshot(null, null, null, expectedRequestData);
            const fakeEvent = {data: dataUserExists};
            const onceStub = sinon.stub().withArgs('value').returns(Promise.resolve(fakeEvent.data));
            const equalToStub = sinon.stub().withArgs(userId).returns({once: onceStub});
            const orderByChildStub = sinon.stub().withArgs('userId').returns({equalTo: equalToStub});
            const refStub = sinon.stub().withArgs('waterLogs').returns({orderByChild: orderByChildStub});
            const databaseStub = sinon.stub(firebase, 'database').returns({ref: refStub});

            const todayStartTimestampStub = sinon.stub(Utils, 'getTodayStartTimestamp').returns(timestampMidnight);

            waterLogInstance.getLoggedWaterForUser(userId).then(loggedMililiters => {
                chai.assert.equal(50, loggedMililiters);
                done();

                databaseStub.restore();
                todayStartTimestampStub.restore();
            });
        });
    });
});