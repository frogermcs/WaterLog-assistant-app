module.exports = {
    GREETING_NEW_USER: 'Hey! Welcome to Water Log. Do you know that you should drink about 3 liters of water each day to stay healthy? How much did you drink so far?',
    GREETING_NEW_USER_NO_INPUT_PROMPT: [
        'How much water did you drink today?',
        'Please tell me how much water did you drink.',
        'See you later!'
    ],
    GREETING_EXISTING_USER: `Hey! You have drunk %sml today. How much water should I add now?`,
    GREETING_EXISTING_USER_NO_INPUT_PROMPT: [
        `How much water did you drink since last time?`,
        `How much water did you drink since last time?`,
        `See you later!`
    ],
    WATER_LOGGED_NOW: `Ok, I’ve added %s%s of water to your daily log. In sum you have drunk $sml today. Let me know when you drink more! See you later.`,
    WATER_LOGGED_OVERALL: `In sum you have drunk %sml today. Let me know when you drink more! See you later.`
};