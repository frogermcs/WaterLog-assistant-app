const chai = require('chai');
const sinon = require('sinon');

const Actions = require('../assistant-actions');
const Conversation = require('../conversation');
const Analytics = require('../analytics');
const DialogflowApp = require('actions-on-google').DialogflowApp;
const firebaseAdmin = require('firebase-admin');
const functions = require('firebase-functions');
const ChatbaseFactory = require('@google/chatbase');

const {
    MockResponse,
    MockRequest,
    basicBodyRequest,
    basicHeaderRequest
} = require('./utils/mocking');

describe('Cloud Functions', () => {
    let firebaseInitStub;
    let configStub;
    let mockResponse;
    let mockRequest;
    let waterLogFunctions;
    let chatbaseSetUserIdStub;
    let chatbaseSetPlatformStub;
    let chatbaseSetApiKeyStub;
    let analyticsStub;

    before(() => {
        //Prevent from sending analytics
        analyticsStub = sinon.stub(Analytics.prototype, "logUserMessage");
        chatbaseSetUserIdStub = sinon.stub().returns();
        chatbaseSetPlatformStub = sinon.stub().returns({setUserId: chatbaseSetUserIdStub});
        chatbaseSetApiKeyStub = sinon.stub(ChatbaseFactory, 'setApiKey').returns({setPlatform: chatbaseSetPlatformStub});

        firebaseInitStub = sinon.stub(firebaseAdmin, 'initializeApp');
        configStub = sinon.stub(functions, 'config').returns({
            firebase: {
                databaseURL: 'https://not-a-project.firebaseio.com',
                storageBucket: 'not-a-project.appspot.com',
            }
        });

        waterLogFunctions = require('../index');
        mockResponse = new MockResponse();
        mockRequest = new MockRequest(basicHeaderRequest, basicBodyRequest);
    });

    after(() => {
        configStub.restore();
        firebaseInitStub.restore();
    });

    describe('waterLog', () => {
        it('Should displatch Dialogflow actions properly', (done) => {
            //Disable console.log temporary
            let consoleStub = sinon.stub(console, "log");
            //Prevent from warnings
            let conversationStub1 = sinon.stub(Conversation.prototype, "actionWelcomeUser");
            let conversationStub2 = sinon.stub(Conversation.prototype, "actionLogWater");
            let conversationStub3 = sinon.stub(Conversation.prototype, "actionGetLoggedWater");

            let conversation = new Conversation();

            let actionMap = new Map();
            actionMap.set(Actions.ACTION_WELCOME, () => conversation.actionWelcomeUser());
            actionMap.set(Actions.ACTION_LOG_WATER, () => conversation.actionLogWater());
            actionMap.set(Actions.ACTION_GET_LOGGED_WATER, () => conversation.actionGetLoggedWater());
            actionMap.set(Actions.ACTION_UPDATE_SETTINGS, () => conversation.actionUpdateSettings());
            actionMap.set(Actions.ACTION_USER_DATA, () => conversation.actionUserData());
            actionMap.set(Actions.ACTION_FACTS_DRINKING_WATER, () => conversation.getFactForDrinkingWater());
            const handleRequestSpy = sinon.spy(DialogflowApp.prototype, 'handleRequest');

            waterLogFunctions.waterLog(mockRequest, mockResponse);

            const args = handleRequestSpy.args[0][0];
            actionMap.forEach((value, key) => {
                chai.assert.equal(args.get(key).toString(), value.toString());
            });
            chai.assert.equal(args.size, actionMap.size);

            done();

            consoleStub.restore();
            conversationStub1.restore();
            conversationStub2.restore();
            conversationStub3.restore();
        });
    });
})