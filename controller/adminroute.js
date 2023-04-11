module.exports = (express, bodyParser) => {
    let router = express.Router();
    let jwt = require('jsonwebtoken'),
        passport = require('passport'),
        bcrypt = require('../helper/passgen'),

        // Database file import
        Admin = require('../model/Admin'),
        Key = require('../model/Key'),
        Server = require('../model/Server');

    ///////////////////////////////////////////////////////////
    ///////////////                          //////////////////
    //////////////                           //////////////////
    //////////////      Admin Account          ////////////////
    //////////////                           //////////////////
    //////////////                           //////////////////
    ///////////////////////////////////////////////////////////


    // Admin login route

    router.post('/login/admin', (req, res) => {

        let email = req.body.email;
        let password = req.body.password;

        Admin.findByAdminemail(email)
            .then(admin => {
                bcrypt.compare(password, admin.password)
                    .then(result => {
                        if (result) {
                            let payload = { email: admin.email, name: admin.name };
                            let token = jwt.sign(payload, process.env.SECRET);
                            res.json({ con: true, token: token, name: admin });
                        } else {
                            res.json({ con: false, msg: 'password wrong' })
                        }
                    }).catch(err => res.send({ con: false, msg: err }));
            })
            .catch(err => res.send({ con: false, msg: "admin login error" }));
    });

    // Admin Register route

    router.post('/register/admin', (req, res) => {
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        bcrypt.encrypt(password)
            .then(result => {
                let adminobj = {
                    'email': email,
                    'name': name,
                    'password': result
                };
                Admin.save_admin(adminobj)
                    .then(admin => res.json({ con: true, msg: admin }))
                    .catch(err => res.json({ con: false, msg: err }));

            })
            .catch(err => res.json({ con: false, msg: err }));
    });

    // Admin all 
    router.get('/get/admins', passport.authenticate('jwt', { session: false }), (req, res) => {
        Admin.all_admin()
            .then(result => res.json({ con: true, msg: result }))
            .catch(err => res.json({ con: false, msg: err }));

    });

    // Admin update
    router.post('/update/admin', passport.authenticate('jwt', { session: false }), (req, res) => {
        let adminobj = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };

        Admin.update_admin(adminobj)
            .then(result => res.send({ con: true, msg: result }))
            .catch(err => res.send({ con: false, msg: err }));
    })

    ///////////////////////////////////////////////////////////
    ///////////////                          //////////////////
    //////////////                           //////////////////
    //////////////      Admin Server         //////////////////
    //////////////                           //////////////////
    //////////////                           //////////////////
    ///////////////////////////////////////////////////////////

    // Admin Server Part Start

    router.get('/get/servers', passport.authenticate('jwt', { session: false }), (req, res) => {
        Server.all_server()
            .then(result => res.json({ con: true, msg: result }))
            .catch(err => res.json({ con: false, msg: err }));

    })
    // Admin Post Server

    router.post('/create/server', passport.authenticate('jwt', { session: false }), (req, res) => {
        let serverObj = {
            name: req.body.name,
            url: req.body.url,
        };
        Server.save_server(serverObj)
            .then(result => res.json({ con: true, msg: result }))
            .catch(err => res.json({ con: false, msg: err }));
    })

    // Admin Post Server

    // Admin Update Server

    router.post('/update/server', passport.authenticate('jwt', { session: false }), (req, res) => {
        let serverObj = {
            name: req.body.name,
            url: req.body.url,
        };
        Server.update_server(serverObj)
            .then(result => res.send({ con: true, msg: result }))
            .catch(err => res.send({ con: false, msg: err }));
    })


    // Admin Server details

    // router.get('/detail/server/:id', (req, res) => {
    //     let movieid = req.param('movieid');
    //     Movie.increase(String(movieid))
    //         .then(result => res.json({ con: true, msg: result }))
    //         .catch(err => res.json({ con: false, msg: err }));
    // })

    // Admin Server paginate

    router.get('/paginate/server/:start/:count', passport.authenticate('jwt', { session: false }), (req, res) => {
        let start = req.param('start');
        let count = req.param('count');

        Server.paginate(Number(start), Number(count))
            .then(result => res.send({ con: true, msg: result }))
            .catch(err => res.send({ con: false, msg: err }));
    });

    // Admin delete Server

    router.post('/delete/server', passport.authenticate('jwt', { session: false }), (req, res) => {
        let servername = req.body.servername;
        Server.delete_server(servername)
            .then(result => res.send({ con: true, msg: result }))
            .catch(err => res.send({ con: false, msg: err }));
    })

    // Admin Server Part End


    ///////////////////////////////////////////////////////////
    ///////////////                          //////////////////
    //////////////                           //////////////////
    //////////////        Admin Key          //////////////////
    //////////////                           //////////////////
    //////////////                           //////////////////
    ///////////////////////////////////////////////////////////

    // Admin Key Part Start

    // Admin Get all keys

    router.get('/get/keys', passport.authenticate('jwt', { session: false }), (req, res) => {
        Key.all_key()
            .then(result => res.json({ con: true, msg: result }))
            .catch(err => res.json({ con: false, msg: err }));

    })

    // Admin Create key

    router.post('/create/key', passport.authenticate('jwt', { session: false }), (req, res) => {
        let keyObj = {
            name: req.body.name,
            sskey: req.body.sskey,
            data_limit: req.body.data_limit,
            date_limit: req.body.date_limit
        };
        Key.save_key(keyObj)
            .then(result => res.json({ con: true, msg: result }))
            .catch(err => res.json({ con: false, msg: err }));
    })

    // Admin Update key

    router.post('/update/key', passport.authenticate('jwt', { session: false }), (req, res) => {
        let keyObj = {
            name: req.body.name,
            sskey: req.body.sskey,
            data_limit: req.body.data_limit,
            date_limit: req.body.date_limit
        };
        Key.update_key(keyObj)
            .then(result => res.send({ con: true, msg: result }))
            .catch(err => res.send({ con: false, msg: err }));
    })

    // Admin key details

    router.get('/detail/key', (req, res) => {
        let sskey = req.body.sskey;
        Key.findByKeyName(sskey)
            .then(result => res.json({ con: true, msg: result }))
            .catch(err => res.json({ con: false, msg: err }));
    })

    // Admin Key paginate

    router.get('/paginate/key/:start/:count', passport.authenticate('jwt', { session: false }), (req, res) => {
        let start = req.param('start');
        let count = req.param('count');

        Key.paginate(Number(start), Number(count))
            .then(result => res.send({ con: true, msg: result }))
            .catch(err => res.send({ con: false, msg: err }));
    });

    // Admin delete movie

    router.post('/delete/key', passport.authenticate('jwt', { session: false }), (req, res) => {
        let keyname = req.body.keyname;
        Key.delete_key(keyname)
            .then(result => res.send({ con: true, msg: result }))
            .catch(err => res.send({ con: false, msg: err }));
    })

    // Admin Key Part

    return router;

}