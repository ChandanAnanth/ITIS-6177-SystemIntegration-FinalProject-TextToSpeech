const express = require('express')
const Router = express.Router();
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const { Buffer } = require('buffer');
const { PassThrough } = require('stream');
const fs = require('fs');
class TextTospeech {
    constructor() {
        this.response = {
            message: "ok"
        }
        this.status = 200
        Router.get('/', this.Get);

    }
    Get = async (req, res) => {
        try {
            if (!req.query.text) {
                this.status = 400
                this.response.message = "Text is empty, please enter a text message to convert"
                this.writeResponse(res)
            }
            const audioStream = await this.textToSpeech(process.env.AZURE_KEY, process.env.AZURE_REGION, req.query.text);
            res.set({
                'Content-Type': 'audio/mpeg',
                'Transfer-Encoding': 'chunked'
            });
            audioStream.pipe(res);
        } catch (err) {
            this.response.message = err.message
            this.status = 500
            this.writeResponse(res)
        }
    }

    writeResponse = (res) => {
        res.status(this.status).json(this.response);
    }
    textToSpeech = async (key, region, text) => {
        return new Promise((resolve, reject) => {
            const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
            speechConfig.speechSynthesisOutputFormat = 5;
            let audioConfig = null;

            const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
            synthesizer.speakTextAsync(
                text,
                function(result){
                    const { audioData } = result;
                    synthesizer.close();
                    const bufferStream = new PassThrough();
                    bufferStream.end(Buffer.from(audioData));
                    resolve(bufferStream);
                },
                function(error){
                    synthesizer.close();
                    reject(error);
                });
        });
    };

}

new TextTospeech();
module.exports = Router;