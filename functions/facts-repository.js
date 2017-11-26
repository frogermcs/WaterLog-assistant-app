const Str = require('./strings');

class FactsRepository {

    constructor(dialogflowApp) {
        this.dialogflowApp = dialogflowApp;
    }

    getRandomWaterFact() {
        let factsArray = [
            Str.WATER_FACT_HUFFPOST,
            Str.WATER_FACT_THE_TELEGRAPH,
            Str.WATER_FACT_HEALTHLINE
        ];
        return factsArray[Math.floor(Math.random() * factsArray.length)];
    };

    getWaterFactRichResponse(waterFact) {
        return this.dialogflowApp.buildRichResponse()
            .addSimpleResponse(Str.CARD_SIMPLE_RESPONSE)
            .addBasicCard(this.dialogflowApp
                .buildBasicCard(waterFact.TEXT)
                .setTitle(waterFact.TITLE)
                .addButton(waterFact.BUTTON, waterFact.LINK)
                .setImage(waterFact.TITLE_IMG_URL, waterFact.TITLE_IMG)
            )
    }

    getWaterFactAudioTextResponse(waterFact) {
        return waterFact.SPEECH_TEXT;
    }
}

module.exports = FactsRepository;