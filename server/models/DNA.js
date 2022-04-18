

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const DNASchema = new Schema({
    name: {
        type: String,
        required: true
    },
    brain: {
        type: Object,
        required: true

    },
    features: {
        type: Object,
        required: false
    }
});



exports.DNA = mongoose.model('DNA', DNASchema);
exports.DNASchema = DNASchema;
