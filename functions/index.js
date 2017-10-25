'use strict';

process.env.DEBUG = 'actions-on-google:*';
const DialogflowApp = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const firebase = require('firebase');
const WaterLog = require('./water-log.js');
const Conversation = require('./conversation.js');
const UserManager = require('./user-manager.js');
const Actions = require('./assistant-actions');

firebase.initializeApp(functions.config().firebase);

exports.waterLog = functions.https.onRequest((request, response) => {
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));

    const dialogflowApp = new DialogflowApp({request, response});

    const userManager = new UserManager(firebase);
    const waterLog = new WaterLog(firebase, userManager);
    const conversation = new Conversation(dialogflowApp, userManager, waterLog);

    let actionMap = new Map();
    actionMap.set(Actions.ACTION_WELCOME, () => conversation.actionWelcomeUser());
    actionMap.set(Actions.ACTION_LOG_WATER, () => conversation.actionLogWater());
    actionMap.set(Actions.ACTION_GET_LOGGED_WATER, () => conversation.actionGetLoggedWater());
    dialogflowApp.handleRequest(actionMap);
});
