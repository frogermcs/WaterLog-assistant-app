const sinon = require('sinon');

const DialogflowApp = require('actions-on-google').DialogflowApp;
const UserManager = require('../user-manager.js');
const WaterLog = require('../water-log.js');
const Conversation = require('../conversation');
const Str = require('../strings');
const util = require('util');

describe('Conversation', () => {
    let conversationInstance;
    let dialogFlowAppInstance;
    let userManagerInstance;
    let waterLogInstance;

    const expectedUser = {userId: "abc123"};

    before(() => {
        dialogFlowAppInstance = new DialogflowApp();
        userManagerInstance = new UserManager();
        waterLogInstance = new WaterLog();
        conversationInstance = new Conversation(dialogFlowAppInstance, userManagerInstance, waterLogInstance);

        sinon.stub(dialogFlowAppInstance, 'getUser').returns(expectedUser);
    });

    describe('actionWelcomeUser', () => {
        before(() => {

        });

        it('Should create new anonymous user', (done) => {
            const userManagerStub = sinon.stub(userManagerInstance, 'isFirstUsage').resolves(true);
            const userManagerMock = sinon.mock(userManagerInstance);
            const dialogFlowStub = sinon.stub(dialogFlowAppInstance, 'ask').returns(true);

            userManagerMock
                .expects('saveAssistantUser')
                .once().withArgs(expectedUser.userId);

            conversationInstance.actionWelcomeUser().then(() => {
                userManagerMock.verify();
                done();

                dialogFlowStub.restore();
                userManagerStub.restore();
            });
        });

        it('Should greet new user', (done) => {
            const userManagerStub = sinon.stub(userManagerInstance, 'isFirstUsage').resolves(true);
            const userManagerStub2 = sinon.stub(userManagerInstance, 'saveAssistantUser').returns();
            const dialogFlowAppMock = sinon.mock(dialogFlowAppInstance);
            dialogFlowAppMock
                .expects('ask')
                .once().withArgs(Str.GREETING_NEW_USER, Str.GREETING_NEW_USER_NO_INPUT_PROMPT)
                .returns(true);

            conversationInstance.actionWelcomeUser().then(() => {
                dialogFlowAppMock.verify();
                done();

                userManagerStub.restore();
                userManagerStub2.restore();
            });
        });

        it('Should greet existing user', (done) => {
            const expectedLoggedWater = 100;
            const userManagerStub = sinon.stub(userManagerInstance, 'isFirstUsage').resolves(false);
            const waterLogStub = sinon.stub(waterLogInstance, 'getLoggedWaterForUser').resolves(expectedLoggedWater);
            const dialogFlowAppMock = sinon.mock(dialogFlowAppInstance);

            dialogFlowAppMock
                .expects('ask')
                .once().withArgs(
                util.format(Str.GREETING_EXISTING_USER, expectedLoggedWater),
                Str.GREETING_EXISTING_USER_NO_INPUT_PROMPT
            ).returns(true);

            conversationInstance.actionWelcomeUser().then(() => {
                dialogFlowAppMock.verify();
                done();

                userManagerStub.restore();
                waterLogStub.restore();
            });
        });
    });

    describe('actionGetLoggedWater', () => {
        it('Should tell about logged water for given user', (done) => {
            const expectedLoggedWater = 123;
            const waterLogStub = sinon.stub(waterLogInstance, 'getLoggedWaterForUser').resolves(expectedLoggedWater);
            const dialogFlowAppMock = sinon.mock(dialogFlowAppInstance);

            dialogFlowAppMock
                .expects('tell')
                .once().withArgs(util.format(Str.WATER_LOGGED_OVERALL, expectedLoggedWater))
                .returns(true);

            conversationInstance.actionGetLoggedWater().then(() => {
                dialogFlowAppMock.verify();
                done();

                waterLogStub.restore();
            });
        });
    });

    describe('actionLogWater', () => {
        it('Should save given amount of water and response with saved value', (done) => {
            const expectedLoggedWaterBefore = {amount: 100, unit: 'ml'};
            const expectedLoggedWaterAfter = 100;
            const dialogFlowAppMock = sinon.mock(dialogFlowAppInstance);
            const waterLogMock = sinon.mock(waterLogInstance);
            const waterLogStub = sinon.stub(waterLogInstance, 'getLoggedWaterForUser').resolves(expectedLoggedWaterAfter);

            dialogFlowAppMock
                .expects('getArgument')
                .once().withArgs('water_volume')
                .returns(expectedLoggedWaterBefore);

            dialogFlowAppMock
                .expects('tell')
                .once().withArgs(
                util.format(Str.WATER_LOGGED_NOW,
                    expectedLoggedWaterBefore.amount,
                    expectedLoggedWaterBefore.unit,
                    expectedLoggedWaterAfter
                ))
                .returns(true);

            waterLogMock
                .expects('saveLoggedWater')
                .once().withArgs(expectedUser.userId, expectedLoggedWaterBefore);

            conversationInstance.actionLogWater().then(() => {
                dialogFlowAppMock.verify();
                waterLogMock.verify();
                done();

                waterLogStub.restore();
            });
        });
    });
});