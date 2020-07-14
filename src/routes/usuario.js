module.exports = (app, passport) => {


    //login
    app.get('/Login', (req, res) => {
        res.type('text/html');
        res.render('paciente-doctor/login', {
            message: req.flash('loginMessage')
        });
    });

    //ruta de solicitud de numero de referencia para acceder a la clinica
    app.get('/Verificacion', (req, res) => {
        res.type('text/html');
        res.render('paciente-doctor/num-referencia');
    });

    //ruta de solicitud de datos del paciente para mostrar en dashboard
    app.get('/Datos-Paciente', (req, res) => {
        res.type('text/html');
        res.render('paciente-doctor/datos-paciente');
    });

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
        res.redirect('/Login');
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