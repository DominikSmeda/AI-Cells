const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const mapSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    mapData: {
        type: Object,
        required: true

    }
});



exports.Map = mongoose.model('Map', mapSchema);
exports.mapSchema = mapSchema;