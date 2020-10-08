const User = require('../../schema/schemaUser.js');
const Root = require('./root.js');
function cryptpw(pw){
    return require("crypto").createHash("sha256").update(pw).digest("hex");
}
function signup(req, res) {
    if (!req.body.email || !req.body.password || !req.body.pseudo) {
        //Le cas où l'email ou bien le password ne serait pas soumit ou nul
        console.log(req.body);
        res.status(400).json({
            "text": "Requête invalide"
        })
    } else {
        var user = {
            email: req.body.email,
            pseudo: req.body.pseudo,
            password: cryptpw(req.body.password)
        }
        var findUser = new Promise(function (resolve, reject) {
            User.findOne({
                email: user.email
            }, function (err, result) {
                if (err) {
                    reject(500);
                } else {
                    if (result) {
                        reject(200)
                    } else {
                        resolve(true)
                    }
                }
            })
        })

        findUser.then(function () {
            var _u = new User(user);
            _u.save(function (err, user) {
                if (err) {
                    res.status(500).json({
                        "text": "Erreur interne"
                    });
                } else {
                    req.session.token = user.getToken();
                    req.session.userid = user._id;
                    req.session.email = user.email;
                    console.log('lid de luser venant de se connecter est',user._id);
                    //voir si utilisateur admin ou pas
                    if (Root.includes(user.email)) {//pseudo : mypseudo, password: mypassword
                        req.session.admin = true;
                        
                        req.session.save(); //un administrateur se connecte et dans le programme
                        //on connait son email pour le reconnaitre
                    } else {
                        req.session.admin = false;
                        req.session.save(); //un administrateur se connecte et dans le programme
                    }
                    res.redirect('../../ticket/');
                }
            })
        }, function (error) {
            switch (error) {
                case 500:
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
                    break;
                case 200:
                    res.status(200).json({
                        "text": "L'adresse email existe déjà"
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

function signupForm(req, res) {
    res.status(200).render('account/signup', {title: 'Inscription'});
}

function login(req, res) {
    if (!req.body.email || !req.body.password) {
        //Le cas où l'email ou bien le password ne serait pas soumit ou nul
        res.status(400).json({
            "text": "Requête invalide"
        })
    } else {
        User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (err) {
                res.status(500).json({
                    "text": "Erreur interne"
                })
            }
            else if(!user){
                res.status(401).json({
                    "text": "L'utilisateur n'existe pas"
                })
            }
            else {
                if (user.authenticate(cryptpw(req.body.password))) {
                    req.session.token = user.getToken();
                    req.session.userid = user._id;
                    req.session.email = user.email;
                    console.log('lid de luser venant de se connecter est',user._id);
                    //voir si utilisateur admin ou pas
                    if (Root.includes(user.email)) {//pseudo : mypseudo, password: mypassword
                        req.session.admin = true;
                        
                        req.session.save(); //un administrateur se connecte et dans le programme
                        //on connait son email pour le reconnaitre
                    } else {
                        req.session.admin = false;
                        req.session.save(); //un administrateur se connecte et dans le programme
                    }

                    res.redirect('../../ticket/');
                }
                else{
                    res.status(401).json({
                        "text": "Mot de passe incorrect"
                    })
                }
            }
        })
    }
}

function loginForm(req, res) {
    res.status(200).render('account/login', {title: 'Connexion'});
}

function signout(req, res) {
    delete req.session.token;
    delete req.session.admin;
    delete req.session.userid;
    res.redirect('login');
}
function welcome(req,res){
    var connecte = req.session.userid ? true : false;
    res.status(200).render('account/index', {title: 'Bienvenue sur le site de gestion de tickets',connecte});
};

exports.login = login;
exports.loginForm = loginForm;
exports.signup = signup;
exports.signupForm = signupForm;
exports.signout = signout;
exports.welcome = welcome;
