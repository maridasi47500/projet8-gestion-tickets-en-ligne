const Ticket = require('../../schema/schemaTicket.js');
const Comment = require('../../schema/schemaComment.js');
const User = require('../../schema/schemaUser.js');
var ObjectId = require('mongodb').ObjectID;
//var mongoose = require('mongoose'); 
//const db = mongoose.connection;

function create(req, res) {
        var iduser=req.session.userid;
	if (!req.body.description || !req.body.responsible || !req.body.priority) {
		res.status(400).json({
			"text": "Requête invalide"
		})
	} else {
		var ticket = {
			title: req.body.title,
			description: req.body.description,
			responsible: req.body.responsible,
			user_id: iduser,
			priority: req.body.priority
		}
		console.log(ticket);

		var _t = new Ticket(ticket);
		console.log(_t);
		_t.save(function (err, ticket) {
			if (err) {
				res.status(500).json({
					"text": "Erreur interne"
				})
			} else {
				res.redirect(`${ticket.getId()}`);
			}
		})
	}
}

function createForm(req, res) {
        var iduser=req.session.userid;
        var emailuser=req.session.email;
	res.status(200).render('ticket/create', {title: 'Créer ticket',iduser,emailuser});
}

function show(req, res) {
	if (!req.params.id) {
		res.status(400).json({
			"text": "Requête invalide"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			Ticket.findById(req.params.id, function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			})
		})

		findTicket.then(function (ticket) {
			res.status(200).render('ticket/show', {title: `Ticket n°${ticket._id}`, ticket});
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Erreur interne"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "Le ticket n'existe pas"
					})
					break;
				default:
					res.status(500).json({
						"text": "Erreur interne"
					})
			}
		})
	}
}

function edit(req, res) {
        var useridconnected = ObjectId(req.session.userid);
        var adminconnected = req.session.admin;
			var idduticket=req.params.id;

	if (!req.params.id) {
		res.status(400).json({
			"text": "Requête invalide"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {


			//console.log('===USERS===',users);
                                    Ticket.find({_id:ObjectId(idduticket)},function (err,tickets) { 
				if (err) {
					console.log('error');
					reject(500);
				} else {
					if (tickets) {
console.log(tickets);
var ticket=tickets[0];
                                    var utilisateurdeceticket = useridconnected.toString() === ticket.user_id.toString();
				User.distinct('email').then(function(users,err){
	
				console.log(users);
			res.status(200).render('ticket/edit', {users,title: `Modifier ticket n°${idduticket}`, ticket,useridconnected,utilisateurdeceticket,adminconnected});
});
						//resolve(result)
					} else {
						reject(200)
					}
				}
			})
		})

		findTicket.then(function (ticket) {

                                    console.log(ticket, useridconnected, ticket.user_id)


		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Erreur interne"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "Le ticket n'existe pas"
					})
					break;
				default:
					res.status(500).json({
						"text": "Erreur interne"
					})
			}
		})
	}
}

function update(req, res) {
	console.log(req.body);
	if (!req.params.id || !req.body.description || !req.body.responsible || !req.body.priority) {
		res.status(400).json({
			"text": "Requête invalide"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			req.body.completed = typeof req.body.completed !== 'undefined' ? true : false;

			Ticket.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			})
		})

		findTicket.then(function (ticket) {
			res.redirect(`../${ticket.getId()}`);
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Erreur interne"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "Le ticket n'existe pas"
					})
					break;
				default:
					res.status(500).json({
						"text": "Erreur interne"
					})
			}
		})
	}
}

function list(req, res) {
	//var findTicket = new Promise(function (resolve, reject) {
		Ticket.aggregate([
   {$lookup:
     {
       from: "users",
       localField: "user_id",
       foreignField: "_id",
       as: "users"
     }
},
                        {"$unwind": "$users"},
  {"$project": {
                          "midEq": {"$eq": ["$email","$users.email"]}, 
                          "_id": 1, "completed": 1, "title": 1, "email":"$users.email"
                        }}
                ]).then(function (tickets, err) { //aggregate mongodb
			if (err) {
                                    console.log(err)
				reject(500);
			} else {
				if (tickets) {
                                    console.log(tickets)
					//resolve(tickets)
                                        res.status(200).render('ticket/index', {title: 'Liste des tickets', tickets});
				} else {
					reject(200)
				}
			}
		})

	//});


//	findTicket.then(function (tickets) {
//		res.status(200).render('ticket/index', {title: 'Liste des tickets', tickets});
//	}, function (error) {
//		switch (error) {
//			case 500:
//				res.status(500).json({
//					"text": "Erreur interne"
//				})
//				break;
//			case 200:
//				res.status(200).json({
//					"text": "Il n'y a pas encore de ticket"
//				})
//				break;
//			default:
//				res.status(500).json({
//					"text": "Erreur interne"
//				})
//		}
//	})
}
function voirUnTicket(req, res) {
    var currentuser=req.session.userid;
    console.log(currentuser);
    var currentticket=req.params.id;
    console.log(currentticket);
                        Ticket.aggregate([
 {$addFields: { "ticket_id": "$_id" }},

   {$lookup:
     {
       from: "comments",
       localField: "ticket_id",
       foreignField: "ticket_id",
       as: "comment"
     }
},
                    {$addFields: { "commenttocount": "$comment" }},

        {"$unwind": "$comment"},

 {$addFields: { "userid": "$comment.user_id" }},
 {$addFields: { "dateandtime": { $dateToString: { format: "Le %d/%m/%G à %H:%M", date: "$comment._id", timezone: "+02:00" } }}},

   {$lookup:
     {
       from: "users",
       localField: "userid",
       foreignField: "_id",
       as: "user"
     }
},
                    {$addFields: { "usersforproject": "$user" }},
                   {"$unwind": "$user"},
                   { "$redact": {
    "$cond": {
        "if": {  "$eq": [ "$_id", ObjectId(currentticket) ] },
        "then": "$$KEEP",
        "else": "$$PRUNE"
    }
}},
  {"$project": {
                          "_id": 1, 
                  "completed": 1, 
                 "title": 1, 
                 "description": 1, 
                 "ticketid":1,
                 "responsible": 1, 
                 "dateandtime": {
                    $cond: {
                       if: { $eq: [ "", "$dateandtime" ] },
                       then: "$$REMOVE",
                       else: "$dateandtime"
                    }
                 }, 
                 "priority": 1, 
                 "content":{
                    $cond: {
                       if: { $eq: [ [], "$commenttocount" ] },
                       then: "$$REMOVE",
                       else: "$comment.content"
                    }
                 },
                 "pseudo":{
                    $cond: {
                       if: { $eq: [ [], "$usersforproject" ] },
                       then: "$$REMOVE",
                       else: "$user.pseudo"
                    }
                 },
                 "nbcomments":{
                    $cond: {
                       if: { $eq: [ [], "$commenttocount" ] },
                       then: "$$REMOVE",
                       else: {$size:"$commenttocount"}
                    }
                 },
                 "email":{
                    $cond: {
                       if: { $eq: [ [], "$usersforproject" ] },
                       then: "$$REMOVE",
                       else: "$user.email"
                    }
                 }
             }}

    ]).then(function (ticket, err) { //aggregate mongodb
			if (err) {
                                    console.log(err)
				reject(500);
			} else {
                                //ticket=ticket.filter(x=>x.matched);
				if (ticket && ticket.length > 0) {
                                        console.log(ticket)
                        console.log(ObjectId(currentticket))
					//resolve(tickets)
                                        res.status(200).render('ticket/show', {title: 'Voir le ticket n° '+currentticket, ticket,currentuser,currentticket});
				} else {
                                    Ticket.find({_id:{$in :[ObjectId(currentticket)]}}).then(function (ticket, err) { 

                                        if (err) {
                                                    console.log(err)
                                                reject(500);
                                        } else {

                                            res.status(200).render('ticket/show', {title: 'Voir le ticket', ticket:ticket,currentuser,currentticket});
                                        }
                                    })
                                }
			}
		})

}

const responsable2 = (req, res) => {
    const admin = req.session.admin;
var responsiblename = req.query ? req.query.nomresponsable : null;
    if (admin) {
        var findTicket = new Promise(function (resolve, reject) {
		Ticket.find({responsible: responsiblename},function (err, responsible) {
			if (err) {
				reject(500);
			} else {
				if (responsible) {
                                    console.log(responsible)
					resolve(responsible)
				} else {
					reject(200)
				}
			}
		})
	})

	findTicket.then(function (responsible) {
		res.status(200).json(responsible);
	}, function (error) {
		switch (error) {
			case 500:
				res.status(500).json({
					"text": "Erreur interne"
				})
				break;
			case 200:
				res.status(200).json({
					"text": "Il n'y a pas encore de ticket"
				})
				break;
			default:
				res.status(500).json({
					"text": "Erreur interne"
				})
		}
	})        
    } else {
        res.status(200).render('account/login', {title: 'Connexion'});
    }
};
const responsable = (req, res) => {
    const admin = req.session.admin;

    if (admin) {
	var findTicket = new Promise(function (resolve, reject) {
		Ticket.distinct( "responsible",function (err, responsible) {
			if (err) {
				reject(500);
			} else {
				if (responsible) {
                                    console.log(responsible)
					resolve(responsible)
				} else {
					reject(200)
				}
			}
		})
	})

	findTicket.then(function (responsible) {
		res.status(200).render('ticket/responsable', {title: 'Liste des tickets par responsable', responsible});
	}, function (error) {
		switch (error) {
			case 500:
				res.status(500).json({
					"text": "Erreur interne"
				})
				break;
			case 200:
				res.status(200).json({
					"text": "Il n'y a pas encore de ticket"
				})
				break;
			default:
				res.status(500).json({
					"text": "Erreur interne"
				})
		}
	})
    } else {
        res.status(200).render('account/login', {title: 'Connexion'});
    }
};
const sansresponsable = (req, res) => {
    const admin = req.session.admin;

    if (admin) {
	var findTicket = new Promise(function (resolve, reject) {
		Ticket.find({responsible:{ $in : [ null, "","aucun responsable" ] },completed: false},function (err, tickets) {
			if (err) {
				reject(500);
			} else {
				if (tickets) {
                                    console.log(tickets)
					resolve(tickets)
				} else {
					reject(200)
				}
			}
		})
	})

	findTicket.then(function (tickets) {
		res.status(200).render('ticket/sansresponsable', {title: 'Voir les tickets sans responsable', tickets});
	}, function (error) {
		switch (error) {
			case 500:
				res.status(500).json({
					"text": "Erreur interne"
				})
				break;
			case 200:
				res.status(200).json({
					"text": "Il n'y a pas encore de ticket"
				})
				break;
			default:
				res.status(500).json({
					"text": "Erreur interne"
				})
		}
	})
    } else {
        res.status(200).render('account/login', {title: 'Connexion'});
    }
};
exports.create = create;
exports.responsable = responsable;
exports.sansresponsable = sansresponsable;
exports.responsable2 = responsable2;
exports.createForm = createForm;
exports.show = show;
exports.edit = edit;
exports.update = update;
exports.voirUnTicket = voirUnTicket;
exports.list = list;
