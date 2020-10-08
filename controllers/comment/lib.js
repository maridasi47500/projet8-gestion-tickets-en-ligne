const Ticket = require('../../schema/schemaTicket.js');
const Comment = require('../../schema/schemaComment.js');
var ObjectId = require('mongodb').ObjectID;

function create(req, res) {
        var currentticket=req.body.currentticket;
	if (!req.body.currentticket || !req.body.currentuser || !req.body.content) {
		res.status(400).json({
			"text": "Requête invalide"
		})
	} else {
		var comment = {
			user_id: ObjectId(req.body.currentuser),
			content: req.body.content,
			ticket_id: ObjectId(currentticket)
		}

		var _t = new Comment(comment);
		_t.save(function (err, comment) {
			if (err) {
				res.status(500).json({
					"text": "Erreur interne"
				})
			} else {
				res.redirect(`${currentticket}`);
			}
		})
	}
}

exports.create = create;
