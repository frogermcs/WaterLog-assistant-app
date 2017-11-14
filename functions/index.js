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
const Actions = require('./assistant-actions');

firebaseAdmin.initializeApp(functions.config().firebase);

exports.waterLog = functions.https.onRequest((request, response) => {
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));

    //Initialise app dependencies
    const dialogflowApp = new DialogflowApp({request, response});
    const userManager = new UserManager(firebaseAdmin);
    const timeManager = new TimeManager(firebaseAdmin, geoTz, moment);
    const waterLog = new WaterLog(firebaseAdmin, timeManager);
    const conversation = new Conversation(dialogflowApp, userManager, waterLog, timeManager);

    //Define map of Dialogflow agent Intents
    let actionMap = new Map();
    actionMap.set(Actions.ACTION_WELCOME, () => conversation.actionWelcomeUser());
    actionMap.set(Actions.ACTION_LOG_WATER, () => conversation.actionLogWater());
    actionMap.set(Actions.ACTION_GET_LOGGED_WATER, () => conversation.actionGetLoggedWater());
    actionMap.set(Actions.ACTION_UPDATE_SETTINGS, () => conversation.actionUpdateSettings());
    actionMap.set(Actions.ACTION_USER_DATA, () => conversation.actionUserData());

    //Handle request from Dialogflow (will be dispatched into appropriate action defined above)
    dialogflowApp.handleRequest(actionMap);
});
