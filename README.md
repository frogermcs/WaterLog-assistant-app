# WaterLog

Track your daily water intake with Google Assistant and voice interfaces.

App is available live through Google Assistant directory on your device or under this link: https://assistant.google.com/services/a/id/12872514ba525cc6

# About this project

The main goal for this project is to show full stack solution for voice-interface application. Source code will be developed over time to handle new features and platforms in the future.
How this project is different from guides or "hello world" projects at Actions on Google or Dialogflow? It's designed to be production-ready app, contains basic unit tests and clean code to be ready for further development or adaptation in similar apps.

_If you have experience in Node.js/JavaScript development, you are more than welcome to contribute in this project. Especially when it comes to good practice in clean code architecture and scaling up this kind of code base. Author of this project is professional mobile developer (statically typed, class based languages) and doesn't have great experience with JavaScript development.

Current tech stack:
- [Actions on Google](https://developers.google.com/actions/extending-the-assistant)
- [Firebase](https://firebase.google.com/): Cloud Functions and Realtime Database - app backend
- [Dialogflow](https://dialogflow.com/) - conversation definitions and natural language understanding
- Node.js - Cloud Function implementation

Structure of project:
- `/functions` directory contains code for Firebase Cloud Functions
- `/Dialogflow` directory contains code and data for Dialogflow platform (conversation definitions, actions, intents)

