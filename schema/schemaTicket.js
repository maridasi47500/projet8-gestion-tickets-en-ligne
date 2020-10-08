const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

var ticketSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    responsible: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    user_id: {
        type: ObjectId,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
},{ timestamps: { createdAt: 'created_at' }})


ticketSchema.methods = {
	getId: function () {
        return this.id;
    }
}

module.exports = mongoose.model('Ticket', ticketSchema);