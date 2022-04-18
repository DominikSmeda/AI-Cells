
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const Database = require('./Database.js');
const DNA = require('./models/DNA.js').DNA;
const Map = require('./models/Map.js').Map;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/brain-hub";
const PORT = 3000;

const dbConnection = new Database(MONGODB_URI)
dbConnection.connect()


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static('static'));


app.get('/dnas', async (req, res, next) => {
    let dnas = await DNA.find({});

    res.status(200).json({
        dnas
    })

})

app.get('/dnas/:id', async (req, res, next) => {
    let dnas = await DNA.find({ _id: req.params / id });
    if (dnas.length) {
        res.status(200).json({ dna: dnas[0] })
    }
    else {
        res.status(400).json({ error: 'Cannot find brain with this id' });
    }

})

app.delete('/dnas/:id', async (req, res, next) => {
    await DNA.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'ok' })
})

app.post('/dnas', async (req, res, next) => {
    const { name, brain, features } = req.body;

    let newDNA = new DNA({
        name,
        brain,
        features
    })

    await newDNA.save();
    res.status(200).json({ message: 'ok' })
})

app.post('/maps', async (req, res, next) => {
    const { name, mapData } = req.body;

    let map = new Map({
        name,
        mapData
    })

    await map.save();

    res.status(200).json({ message: 'ok' })

})

app.get('/maps', async (req, res, next) => {

    let maps = await Map.find({});

    res.status(200).json({
        maps
    })
})

app.delete('/maps/:id', async (req, res, next) => {
    await Map.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'ok' })
})

app.listen(PORT, () => {
    console.log(`Working on ${PORT}`);
})