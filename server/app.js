
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const Database = require('./Database.js');
const Brain = require('./Brain.js').Brain;
const Map = require('./Map.js').Map;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/brain-hub"
const PORT = 3000;

const dbConnection = new Database(MONGODB_URI)
dbConnection.connect()


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static('static'));


app.get('/brain/list', async (req, res, next) => {
    let brains = await Brain.find({}).select('name');

    res.status(200).json({
        brains
    })

})

app.get('/brain/:id', async (req, res, next) => {
    let brains = await Nrain.find({ _id: req.params / id });
    if (brains.length) {
        res.status(200).json({ brain: brains[0] })
    }
    else {
        res.status(400).json({ error: 'Cannot find brain with this id' });
    }

})

app.delete('/brain/:id', async (req, res, next) => {
    await Brain.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'ok' })
})

app.post('/brain', async (req, res, next) => {
    const { name, brain } = req.body;

    let newBrain = new Brain({
        name,
        brain
    })

    await newBrain.save();
    res.status(200).json({ message: 'ok' })
})

app.post('/map', async (req, res, next) => {
    const { name, mapData } = req.body;

    let map = new Map({
        name,
        mapData
    })

    await map.save();

    res.status(200).json({ message: 'ok' })

})

app.get('/map', async (req, res, next) => {

    let maps = await Map.find({});

    res.status(200).json({
        maps
    })
})

app.delete('/map/:id', async (req, res, next) => {
    await Map.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'ok' })
})

app.listen(PORT, () => {
    console.log(`Working on ${PORT}`);
})