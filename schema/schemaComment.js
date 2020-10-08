const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

var commentSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        required: true
    },
    ticket_id: {
        type: ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    }
},{ timestamps: { createdAt: 'created_at' }}) 

commentSchema.methods = {
	getId: function () {
        return this.id;
    }
}

module.exports = mongoose.model('Comment', commentSchema);