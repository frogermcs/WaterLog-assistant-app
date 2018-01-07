module.exports = {
    GREETING_NEW_USER: 'Hey! Welcome to Water Log. Do you know that you should drink about 3 liters of water each day to stay healthy? How much did you drink so far?',
    GREETING_NEW_USER_NO_INPUT_PROMPT: [
        'How much water did you drink today?',
        'Please tell me how much water did you drink.',
        'See you later!'
    ],
    GREETING_EXISTING_USER: `Hey%s! You have drunk %sml today. How much water should I add now?`,
    GREETING_EXISTING_USER_NO_INPUT_PROMPT: [
        `How much water did you drink since last time?`,
        `How much water did you drink since last time?`,
        `See you later!`
    ],
    GREETING_USER_SUGGESTION_CHIPS: ['100ml', '200ml', '500ml', '1L'],
    WATER_LOGGED_NOW: `Ok, I’ve added %s%s of water to your daily log. In sum you have drunk %sml today. Let me know when you drink more! See you later.`,
    WATER_LOGGED_OVERALL: `In sum you have drunk %sml today. Let me know when you drink more! See you later.`,

    PERMISSIONS_DENIED: 'Sure thing! You can ask me to personalise your experience whenever you want.',
    PERMISSIONS_UNEXPECTED_ISSUES: 'We\'re encountering some technical problems. Please come back later.',
    PERMISSIONS_ASK_FOR_NAME: 'Sure, to customise settings',
    PERMISSIONS_ASK_FOR_LOCATION: 'Ok %s. My clock shows me %s. If that’s not your time, to adjust my settings to your timezone',
    SETTINGS_UPDATE: 'Ok, now it\'s all set!',

    CARD_SIMPLE_RESPONSE: 'Here are some facts I found about drinking water:',
    WATER_FACT_HUFFPOST: {
        TITLE: 'How much water should we drink per day?',
        TEXT: 'According to Huffington Post, The exact amount of water we need per day depends on factors like our body size, metabolism, the environment (i.e. weather), what foods we eat and our activity levels. As a general guide aim for 2.1 litres per day (for women) or 2.6 litres (for men), and drink more during and after exercise and on hot days.',
        SPEECH_TEXT: 'According to Huffington Post, as a general guide aim for 2.1 litres per day for women or 2.6 litres for men. Drink more during and after exercise and on hot days.',
        BUTTON: 'Read more on Huffington Post',
        LINK: 'http://www.huffingtonpost.com.au/2017/07/27/how-much-water-you-should-drink-per-day_a_23053224/',
        TITLE_IMG_URL: 'https://firebasestorage.googleapis.com/v0/b/waterlog-3215a.appspot.com/o/huffpost.png?alt=media&token=9a2047a2-22c2-47f6-a8aa-1e5b46706b6e',
        TITLE_IMG: 'Huffingot Post'
    },
    WATER_FACT_THE_TELEGRAPH: {
        TITLE: 'How much water should I drink?',
        TEXT: 'According to The Telegraph, The National Health Service (NHS) advises that, in climates such as the UK, we should be drinking around 1-2 litres of water. That’s roughly six to eight glasses a day. In hotter climates, the body will usually need more than this.',
        SPEECH_TEXT: 'According to The Telegraph, in climates such as the UK, we should be drinking around 1-2 litres of water. In hotter climates, the body will usually need more.',
        BUTTON: 'Read more on The Telegraph',
        LINK: 'http://www.telegraph.co.uk/health-fitness/nutrition/diet/much-water-should-drink/',
        TITLE_IMG_URL: 'https://firebasestorage.googleapis.com/v0/b/waterlog-3215a.appspot.com/o/thetelegraph.png?alt=media&token=30041391-e891-48fc-84b3-b510c9b601c8',
        TITLE_IMG: 'The Telegraph'
    },
    WATER_FACT_HEALTHLINE: {
        TITLE: 'How Much Water You Need to Drink',
        TEXT: 'According to healthline.com, The current IOM recommendation for people ages 19 and older is around 3.7 liters for men and 2.7 liters for women. This is your overall fluid intake per day, including anything you eat or drink containing water in it, like fruits or vegetables. Of this total, men should drink around 13 cups from beverages. For women, it’s 9 cups.',
        SPEECH_TEXT: 'According to healthline.com, The current IOM recommendation for people ages 19 and older is around 3.7 liters for men and 2.7 liters for women.',
        BUTTON: 'Read more on healthline.com',
        LINK: 'https://www.healthline.com/health/how-much-water-should-I-drink',
        TITLE_IMG_URL: 'https://firebasestorage.googleapis.com/v0/b/waterlog-3215a.appspot.com/o/healthline.png?alt=media&token=5253db29-df4a-46df-b09a-d00feb1cca61',
        TITLE_IMG: 'healthline.com'
    },
    DEFAULT_FALLBACK: [
        'I didn\'t get that. Can you say it again?',
        'I missed what you said. Say it again?',
        'Sorry, could you say that again?',
        'Sorry, can you say that again?',
        'Can you say that again?',
        'Sorry, I didn\'t get that.',
        'Sorry, what was that?',
        'One more time?',
        'What was that?',
        'Say that again?',
        'I didn\'t get that.',
        'I missed that.'
    ]
};