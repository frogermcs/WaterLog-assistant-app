'use strict';

const MockRequest = class {
    constructor(headers, body) {
        if (headers) {
            this.headers = headers;
        } else {
            this.headers = {};
        }
        if (body) {
            this.body = body;
        } else {
            this.body = {};
        }
    }

    get(header) {
        return this.headers[header];
    }
};

const MockResponse = class {
    constructor() {
        this.statusCode = 200;
        this.headers = {};
    }

    status(statusCode) {
        this.statusCode = statusCode;
        return this;
    }

    send(body) {
        this.body = body;
        return this;
    }

    append(header, value) {
        this.headers[header] = value;
        return this;
    }
};

const basicHeaderRequest = {
    "content-type": "application/json; charset=UTF-8",
};

const basicBodyRequest = {
    "originalRequest": {
        "source": "google",
        "version": "2",
        "data": {
            "isInSandbox": true,
            "surface": {
                "capabilities": [
                    {
                        "name": "actions.capability.AUDIO_OUTPUT"
                    },
                    {
                        "name": "actions.capability.SCREEN_OUTPUT"
                    }
                ]
            },
            "inputs": [
                {
                    "rawInputs": [
                        {
                            "query": "500 ml",
                            "inputType": "VOICE"
                        }
                    ],
                    "arguments": [
                        {
                            "rawText": "500 ml",
                            "textValue": "500 ml",
                            "name": "text"
                        }
                    ],
                    "intent": "actions.intent.TEXT"
                }
            ],
            "user": {
                "locale": "en-US",
                "userId": "ABwppHFnJKhUEKfWAKnJYth8zyRZ3fKczsaCAwyCQ8L8X5F8Lhh-hOPLJitevhCnPrb_OYgqW98C_7sifF9Y"
            },
            "device": {},
            "conversation": {
                "conversationId": "1508455291994",
                "type": "ACTIVE",
                "conversationToken": "[\"_actions_on_google_\"]"
            },
            "availableSurfaces": [
                {
                    "capabilities": [
                        {
                            "name": "actions.capability.AUDIO_OUTPUT"
                        },
                        {
                            "name": "actions.capability.SCREEN_OUTPUT"
                        }
                    ]
                }
            ]
        }
    },
    "id": "def8667b-6813-4ef6-8937-2c1d06ae08e0",
    "timestamp": "2017-10-19T23:21:52.971Z",
    "lang": "en-us",
    "result": {
        "source": "agent",
        "resolvedQuery": "500 ml",
        "speech": "",
        "action": "log_water",
        "actionIncomplete": false,
        "parameters": {
            "water_volume": {
                "amount": 500,
                "unit": "ml"
            }
        },
        "contexts": [
            {
                "name": "actions_capability_screen_output",
                "parameters": {
                    "water_volume": {
                        "amount": 500,
                        "unit": "ml"
                    },
                    "water_volume.original": "500 ml"
                },
                "lifespan": 0
            },
            {
                "name": "_actions_on_google_",
                "parameters": {
                    "water_volume": {
                        "amount": 500,
                        "unit": "ml"
                    },
                    "water_volume.original": "500 ml"
                },
                "lifespan": 98
            },
            {
                "name": "google_assistant_input_type_voice",
                "parameters": {
                    "water_volume": {
                        "amount": 500,
                        "unit": "ml"
                    },
                    "water_volume.original": "500 ml"
                },
                "lifespan": 0
            },
            {
                "name": "actions_capability_audio_output",
                "parameters": {
                    "water_volume": {
                        "amount": 500,
                        "unit": "ml"
                    },
                    "water_volume.original": "500 ml"
                },
                "lifespan": 0
            }
        ],
        "metadata": {
            "matchedParameters": [
                {
                    "required": true,
                    "dataType": "@sys.unit-volume",
                    "name": "water_volume",
                    "value": "$water_volume",
                    "prompts": [
                        {
                            "lang": "en",
                            "value": "How much of water did you drink so far?"
                        },
                        {
                            "lang": "en",
                            "value": "How much of water should I log?"
                        }
                    ],
                    "isList": false
                }
            ],
            "intentName": "log_water",
            "intentId": "9d87e786-f42c-40bb-a711-7c8a9df612bb",
            "webhookUsed": "true",
            "webhookForSlotFillingUsed": "false",
            "nluResponseTime": 52
        },
        "fulfillment": {
            "speech": "",
            "messages": [
                {
                    "type": 0,
                    "id": "49d7ca3c-c181-47e7-b5f4-818c561eb84e",
                    "speech": ""
                }
            ]
        },
        "score": 0.9900000095367432
    },
    "status": {
        "code": 200,
        "errorType": "success"
    },
    "sessionId": "1508455291994"
};

const exampleUser = {
    userId: "abc123",
    displayName: 'expectedDisplayName',
    givenName: 'expectedGivenName',
    familyName: 'expectedFamilyName'
};

module.exports = {
    MockRequest,
    MockResponse,
    basicHeaderRequest,
    basicBodyRequest,
    exampleUser
};