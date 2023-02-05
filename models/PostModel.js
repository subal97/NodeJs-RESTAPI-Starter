let mongoose = require('mongoose');

const {Schema} = mongoose;

let PostSchema = new Schema({
    Title: {type: String, required: true},
    Content: {type: String, default: ""},
    Tags: [String],
    CreatedOn: {type: mongoose.SchemaTypes.Date, default: Date.now},
    Author: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Posts', PostSchema);