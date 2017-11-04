const sinon = require('sinon');

const DialogflowApp = require('actions-on-google').DialogflowApp;
const UserManager = require('../user-manager.js');
const WaterLog = require('../water-log.js');
const Conversation = require('../conversation.js');
const TimeManager = require('../time-manager.js');
const Str = require('../strings');
const util = require('util');

const {
    exampleUser
} = require('./utils/mocking');

describe('Conversation', () => {
    let conversationInstance;
    let dialogFlowAppInstance;
    let userManagerInstance;
    let waterLogInstance;
    let timeManagerInstance;

    before(() => {
        dialogFlowAppInstance = new DialogflowApp();
        //Set supported permissions (normally initlialised in Dialogflow c-tor)
        dialogFlowAppInstance.SupportedPermissions = {
            NAME: 'NAME',
            DEVICE_PRECISE_LOCATION: 'DEVICE_PRECISE_LOCATION',
            DEVICE_COARSE_LOCATION: 'DEVICE_COARSE_LOCATION'
        };

        userManagerInstance = new UserManager();
        waterLogInstance = new WaterLog();
        timeManagerInstance = new TimeManager();
        conversationInstance = new Conversation(dialogFlowAppInstance, userManagerInstance, waterLogInstance, timeManagerInstance);

        sinon.stub(dialogFlowAppInstance, 'getUser').returns(exampleUser);
    });

    describe('actionWelcomeUser', () => {
        it('Should create new anonymous user', (done) => {
            const userManagerStub = sinon.stub(userManagerInstance, 'isFirstUsage').resolves(true);
            const userManagerMock = sinon.mock(userManagerInstance);
            const dialogFlowStub = sinon.stub(dialogFlowAppInstance, 'ask').returns(true);

            userManagerMock
                .expects('saveAssistantUser')
                .once().withArgs(exampleUser.userId);

            conversationInstance.actionWelcomeUser().then(() => {
                userManagerMock.verify();
                done();

                dialogFlowStub.restore();
                userManagerStub.restore();
            });
        });

        it('Should greet new user', (done) => {
            const userManagerStub = sinon.stub(userManagerInstance, 'isFirstUsage').resolves(true);
            const userManagerStub2 = sinon.stub(userManagerInstance, 'saveAssistantUser');
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

        it('Should greet existing user with name if exists', (done) => {
            const expectedLoggedWater = 100;

            const expectedFormattedName = ' ' + exampleUser.givenName;
            const userManagerStub = sinon.stub(userManagerInstance, 'isFirstUsage').resolves(false);
            const waterLogStub = sinon.stub(waterLogInstance, 'getLoggedWaterForUser').resolves(expectedLoggedWater);
            const dialogFlowAppMock = sinon.mock(dialogFlowAppInstance);
            const loadAssistantUserStub = sinon.stub(userManagerInstance, 'loadAssistantUser').resolves(exampleUser);

            dialogFlowAppMock
                .expects('ask')
                .once()
                .withArgs(
                    util.format(Str.GREETING_EXISTING_USER, expectedFormattedName, expectedLoggedWater),
                    Str.GREETING_EXISTING_USER_NO_INPUT_PROMPT
                )
                .returns(true);

            conversationInstance.actionWelcomeUser().then(() => {
                dialogFlowAppMock.verify();
                done();

                loadAssistantUserStub.restore();
                userManagerStub.restore();
                waterLogStub.restore();
            });
        });

        it('Should greet existing user with general message if name doesnt exists', (done) => {
            const expectedLoggedWater = 100;

            const expectedFormattedName = '';
            const userManagerStub = sinon.stub(userManagerInstance, 'isFirstUsage').resolves(false);
            const waterLogStub = sinon.stub(waterLogInstance, 'getLoggedWaterForUser').resolves(expectedLoggedWater);
            const dialogFlowAppMock = sinon.mock(dialogFlowAppInstance);
            const loadAssistantUserStub = sinon.stub(userManagerInstance, 'loadAssistantUser').resolves({userId: "123"});

            dialogFlowAppMock
                .expects('ask')
                .once()
                .withArgs(
                    util.format(Str.GREETING_EXISTING_USER, expectedFormattedName, expectedLoggedWater),
                    Str.GREETING_EXISTING_USER_NO_INPUT_PROMPT
                )
                .returns(true);

            conversationInstance.actionWelcomeUser().then(() => {
                dialogFlowAppMock.verify();
                done();

                dialogFlowAppMock.restore();
                loadAssistantUserStub.restore();
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

                dialogFlowAppMock.restore();
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
                .once().withArgs(exampleUser.userId, expectedLoggedWaterBefore);

            conversationInstance.actionLogWater().then(() => {
                dialogFlowAppMock.verify();
                waterLogMock.verify();
                done();

                dialogFlowAppMock.restore();
                waterLogMock.restore();
                waterLogStub.restore();
            });
        });
    });

    describe('actionUpdateSettings', () => {
        it('Should ask for user name permission', (done) => {
            const dialogFlowAppMock = sinon.mock(dialogFlowAppInstance)
                .expects('askForPermission')
                .once().withArgs(Str.PERMISSIONS_ASK_FOR_NAME, dialogFlowAppInstance.SupportedPermissions.NAME)
                .returns(true);

            conversationInstance.actionUpdateSettings();

            dialogFlowAppMock.verify();
            done();

            dialogFlowAppMock.restore();
        });
    });

    describe('actionUserData', () => {
        it('Should finish with permission denied when permission isnt granted', (done) => {
            const permissionGrantedStub = sinon.stub(dialogFlowAppInstance, 'isPermissionGranted').returns(false);
            const dialogFlowAppMock = sinon.mock(dialogFlowAppInstance)
                .expects('tell')
                .once().withArgs(Str.PERMISSIONS_DENIED)
                .returns(true);

            conversationInstance.actionUserData();

            dialogFlowAppMock.verify();
            done();

            dialogFlowAppMock.restore();
            permissionGrantedStub.restore();
        });

        it('Should finish with unexpected error when permission granted but empty data', (done) => {
            const permissionGrantedStub = sinon.stub(dialogFlowAppInstance, 'isPermissionGranted').returns(true);
            const userNameStub = sinon.stub(dialogFlowAppInstance, 'getUserName').returns(null);
            const deviceLocationStub = sinon.stub(dialogFlowAppInstance, 'getDeviceLocation').returns(null);

            const dialogFlowAppMock = sinon.mock(dialogFlowAppInstance)
                .expects('tell')
                .once().withArgs(Str.PERMISSIONS_UNEXPECTED_ISSUES)
                .returns(true);

            conversationInstance.actionUserData();

            dialogFlowAppMock.verify();
            done();

            dialogFlowAppMock.restore();
            permissionGrantedStub.restore();
            userNameStub.restore();
            deviceLocationStub.restore();
        });

        it('Should ask for precise location permission when permission granted, name exists but location doesnt', (done) => {
            const permissionGrantedStub = sinon.stub(dialogFlowAppInstance, 'isPermissionGranted').returns(true);
            const userNameStub = sinon.stub(dialogFlowAppInstance, 'getUserName').returns(exampleUser);
            const deviceLocationStub = sinon.stub(dialogFlowAppInstance, 'getDeviceLocation').returns(null);

            const expectedPlatformTime = "13:37";
            const getPlatformTimeStub = sinon.stub(timeManagerInstance, 'getPlatformTime').resolves(expectedPlatformTime);
            const saveAssistantUserNameStub = sinon.stub(userManagerInstance, 'saveAssistantUserName').resolves(expectedPlatformTime);

            const dialogFlowAppMock = sinon.mock(dialogFlowAppInstance)
                .expects('askForPermission')
                .once().withArgs(
                    util.format(Str.PERMISSIONS_ASK_FOR_LOCATION, exampleUser.givenName, expectedPlatformTime),
                    dialogFlowAppInstance.SupportedPermissions.DEVICE_PRECISE_LOCATION
                )
                .returns();

            conversationInstance.actionUserData().then(() => {
                dialogFlowAppMock.verify();
                done();

                getPlatformTimeStub.restore();
                saveAssistantUserNameStub.restore();
                dialogFlowAppMock.restore();
                permissionGrantedStub.restore();
                userNameStub.restore();
                deviceLocationStub.restore();
            });
        });

        it('Should save user name when permission granted and name exists', (done) => {
            const permissionGrantedStub = sinon.stub(dialogFlowAppInstance, 'isPermissionGranted').returns(true);
            const userNameStub = sinon.stub(dialogFlowAppInstance, 'getUserName').returns(exampleUser);
            const deviceLocationStub = sinon.stub(dialogFlowAppInstance, 'getDeviceLocation').returns(null);

            const expectedPlatformTime = "13:37";
            const dialogFlowAppStub = sinon.stub(dialogFlowAppInstance, 'askForPermission').resolves(true);
            const getPlatformTimeStub = sinon.stub(timeManagerInstance, 'getPlatformTime').resolves(expectedPlatformTime);

            const userManagerMock = sinon.mock(userManagerInstance)
                .expects('saveAssistantUserName')
                .once().withArgs(exampleUser.userId, exampleUser)
                .returns(Promise.resolve(true));

            conversationInstance.actionUserData().then(() => {
                userManagerMock.verify();
                done();

                userManagerMock.restore();
                dialogFlowAppStub.restore();
                permissionGrantedStub.restore();
                userNameStub.restore();
                deviceLocationStub.restore();
                getPlatformTimeStub.restore();
            });
        });

        it('Should save user timezone and finish when permission granted, name exists and location exists', (done) => {
            const expectedPlatformTime = "13:37";
            const expectedDeviceLocation = {coordinates: {latitude: 37.4265994, longitude: -122.08058050000001}};
            const expectedTimezone = 'America/Los_Angeles';

            const permissionGrantedStub = sinon.stub(dialogFlowAppInstance, 'isPermissionGranted').returns(true);
            const userNameStub = sinon.stub(dialogFlowAppInstance, 'getUserName').returns(exampleUser);
            const deviceLocationStub = sinon.stub(dialogFlowAppInstance, 'getDeviceLocation').returns(expectedDeviceLocation);

            const saveAssistantUserNameStub = sinon.stub(userManagerInstance, 'saveAssistantUserName').resolves(expectedPlatformTime);
            const getTimeZoneFromCoordinatesStub = sinon.stub(timeManagerInstance, 'getTimeZoneFromCoordinates');
            getTimeZoneFromCoordinatesStub.withArgs(expectedDeviceLocation.coordinates).returns(expectedTimezone);

            const timeManagerMock = sinon.mock(timeManagerInstance)
                .expects('saveAssistantUserTimezone')
                .once().withArgs(exampleUser.userId, expectedTimezone)
                .resolves(true);

            const dialogFlowAppMock = sinon.mock(dialogFlowAppInstance)
                .expects('tell')
                .once().withArgs(Str.SETTINGS_UPDATE)
                .returns(true);


            conversationInstance.actionUserData().then(() => {
                timeManagerMock.verify();
                dialogFlowAppMock.verify();
                done();

                dialogFlowAppMock.restore();
                timeManagerMock.restore();
                getTimeZoneFromCoordinatesStub.restore();
                saveAssistantUserNameStub.restore();
                permissionGrantedStub.restore();
                userNameStub.restore();
                deviceLocationStub.restore();
            });
        });
    });
});