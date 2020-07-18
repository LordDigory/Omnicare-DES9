module.exports = (app, passport) => {

    const Referencia = require('../models/referencia');
    const User = require('../models/user');
    //login
    app.get('/Login', (req, res) => {
        res.type('text/html');
        res.render('paciente-doctor/login', {
            message: req.flash('loginMessage')
        });
    });

    //ruta de solicitud de numero de referencia para acceder a la clinica
    app.get('/Verificacion', isLoggedIn,(req, res) => {
        res.type('text/html');
        res.render('paciente-doctor/num-referencia');
    });

    app.post('/Verificacion', async (req, res) => {
        
        /*const reference = await Referencia.find(
           {numero: req.body.numero}
        )
        console.log(reference);
        if(reference.length == 1){
            res.redirect('/Datos-Paciente');
        }*/
        res.redirect('/Datos-Paciente');
        
    });

    //ruta de solicitud de datos del paciente para mostrar en dashboard
    app.get('/Datos-Paciente', (req, res) => {
        res.type('text/html');
        res.render('paciente-doctor/datos-paciente');
    });


       //aqui se supone que deberia funcionanr esta MIERDA
        app.post('/Datos-Paciente', async (req, res, next) => {
        const email = req.user.email_user;
        const tipo_san =  req.body.tipo_sangre;
        const ced = req.body.cedula;
        const dir = req.body.direccion;
        const tel = req.body.telefono;
        const sex = req.body.sexo;
        console.log(email)
        await User.update({email_user: email},
            {
                $set:
                { 
                    acceso: true,
                    tipo_user: 1,
                    tipo_sangre: tipo_san,
                    cedula: ced,
                    direccion: dir,
                    telefono: tel,
                    sexo: sex
                }
            })
            res.redirect('/');
        });

    /*app.put("/usuarios/:id", async (req, res) => {
        const id = req.params.id;
        const updated = req.body;
        try {
          await User.findByIdAndUpdate(id,updated).exec();
          res.send("actualizado correctamente");
        } catch (error) {
          console.log(`error actualizando paciente ${error}`);
          res.json({});
        }
      });*/


    //ruta donde validaremos el usuario para logearnos (paciente-login es el tipo de autenticacion que creamos en passport)
    app.post('/Login', passport.authenticate('user-login', {

        successRedirect: '/',
        failureRedirect: '/Login',
        failureFlash: true // allow flash messages
    }));


    // signup view
    app.get('/Registro', (req, res) => {
        res.type('text/html');
        res.render('paciente-doctor/register', {
            message: req.flash('signupMessage')
        });
    });


    //ruta donde creamos un nuevo usuario (paciente-signup lo creamos en passport)
    app.post('/Registro', passport.authenticate('user-signup', {
        successRedirect: '/',
        failureRedirect: '/Registro',
        failureFlash: true // allow flash messages
    }));


    

    // logout
    app.get('/Logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

};


function IsPaciente(req, res, next) {
    if (req.user.acceso) {
        return next();
    }
    res.redirect('/');
}


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/Login');
}