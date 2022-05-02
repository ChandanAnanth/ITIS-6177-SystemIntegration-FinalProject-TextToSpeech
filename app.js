const express = require("express")
const bodyParser = require('body-parser');
require('dotenv').config()
const SpeechController = require('./controller/speechController');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/texttospeech', SpeechController);

app.get("/", (req, res) => {
    result  = 
    {
        "Text To Speech API" : "digitalOceanIP:8080/text2speech?text=<your text>",
    }
    res.json(result);
});

app.get("*", (req, res) => {
    res.json({"Error" : "404 - API Not found"});
});

app.listen(process.env.PORT, () =>
    console.log(`The Application is listning on port ${process.env.PORT}!`),
);
