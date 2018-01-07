'use strict';

process.env.DEBUG = 'actions-on-google:*';
const DialogflowApp = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const geoTz = require('geo-tz');
const moment = require('moment-timezone');
const WaterLog = require('./water-log.js');
const Conversation = require('./conversation.js');
const UserManager = require('./user-manager.js');
const TimeManager = require('./time-manager.js');
const FactsRepository = require('./facts-repository');
const Analytics = require('./analytics');
const Actions = require('./assistant-actions');
const ChatbaseFactory = require('@google/chatbase');

//Load config, API keys etc.
require('dotenv').config({path: __dirname + "/.env"});

firebaseAdmin.initializeApp(functions.config().firebase);

exports.waterLog = functions.https.onRequest((request, response) => {
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));

    //Initialise app dependencies
    const dialogflowApp = new DialogflowApp({request, response});
    const userManager = new UserManager(firebaseAdmin);
    const timeManager = new TimeManager(firebaseAdmin, geoTz, moment);
    const waterLog = new WaterLog(firebaseAdmin, timeManager);
    const factsRepository = new FactsRepository(dialogflowApp);

    const chatbase = ChatbaseFactory
        .setApiKey(process.env.MY_CHATBASE_KEY)
        .setPlatform('GoogleAssistant')
        .setUserId(dialogflowApp.getUser().userId);

    const analytics = new Analytics(chatbase);

    const conversation = new Conversation(dialogflowApp, userManager, waterLog, timeManager, factsRepository, analytics);

    //Define map of Dialogflow agent Intents
    let actionMap = new Map();
    actionMap.set(Actions.ACTION_WELCOME, () => conversation.actionWelcomeUser());
    actionMap.set(Actions.ACTION_LOG_WATER, () => conversation.actionLogWater());
    actionMap.set(Actions.ACTION_GET_LOGGED_WATER, () => conversation.actionGetLoggedWater());
    actionMap.set(Actions.ACTION_UPDATE_SETTINGS, () => conversation.actionUpdateSettings());
    actionMap.set(Actions.ACTION_USER_DATA, () => conversation.actionUserData());
    actionMap.set(Actions.ACTION_FACTS_DRINKING_WATER, () => conversation.getFactForDrinkingWater());
    actionMap.set(Actions.ACTION_DEFAULT_FALLBACK, () => conversation.actionsDefaultMessage());

    analytics.logUserMessage(
        dialogflowApp.getRawInput(),
        dialogflowApp.getIntent()
    );

    //Handle request from Dialogflow (will be dispatched into appropriate action defined above)
    dialogflowApp.handleRequest(actionMap);
});
