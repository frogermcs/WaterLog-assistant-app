const sinon = require('sinon');
const chai = require('chai');

const DialogflowApp = require('actions-on-google').DialogflowApp;
const FactsRepository = require('../facts-repository');
const Str = require('../strings');

describe('FactsRepository', () => {
    let dialogFlowAppInstance;
    let factsRepositoryInstance;

    before(() => {
        dialogFlowAppInstance = new DialogflowApp();
        factsRepositoryInstance = new FactsRepository(dialogFlowAppInstance);
    });

    describe('getRandomWaterFact', () => {
        it('Returned water fact should keep consistent interface', (done) => {
            let waterFact = factsRepositoryInstance.getRandomWaterFact();
            chai.assert.hasAllKeys(waterFact, [
                "TITLE",
                "TEXT",
                "SPEECH_TEXT",
                "BUTTON",
                "LINK",
                "TITLE_IMG_URL",
                "TITLE_IMG"
            ]);
            done();
        });
    });

    describe('getWaterFactAudioTextResponse', () => {
        it('Should return audio text from water fact', (done) => {
            const waterFact = Str.WATER_FACT_THE_TELEGRAPH;
            let waterFactResponse = factsRepositoryInstance.getWaterFactAudioTextResponse(waterFact);
            chai.assert.equal(waterFactResponse, waterFact.SPEECH_TEXT);
            done();
        });
    });

    describe('getWaterFactRichResponse', () => {
        it('Should return rich card response from water fact', (done) => {
            const waterFact = Str.WATER_FACT_THE_TELEGRAPH;
            const expectedFinal = "expectedFinalResponse";

            const addBasicCardStub = sinon.stub().returns(expectedFinal);
            const addSimpleResponseStub = sinon.stub().returns({addBasicCard: addBasicCardStub});
            const buildRichResponseStub = sinon.stub(dialogFlowAppInstance, 'buildRichResponse').returns({addSimpleResponse: addSimpleResponseStub});

            let waterFactResponse = factsRepositoryInstance.getWaterFactRichResponse(waterFact);

            chai.assert.equal(waterFactResponse, expectedFinal);

            done();

            addBasicCardStub.restore();
            addSimpleResponseStub.restore();
            buildRichResponseStub.restore();
        });
    });
});