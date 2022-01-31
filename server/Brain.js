

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const brainSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    brain: {
        type: Object,
        required: true

    }
});



exports.Brain = mongoose.model('Brain', brainSchema);
exports.brainSchema = brainSchema;
