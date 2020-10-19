const User = require('../models/user');
const passport = require('passport');
const {body, validationResult} = require('express-validator')


exports.login_get = function(req, res, next){
    res.render('user_login', {locals: {title: 'Login'}});
}

exports.login_post = [   
    body('username').trim().isLength({min:1}).withMessage('Username Required').isAlphanumeric().withMessage("Username can only contain Alphanumeric values"),
    body('password').trim().isLength({min:1}).withMessage('Password Required'),
    function(req, res, next){
        let err = validationResult(req);
        let extractedErrorMessages = [];

        if(!err.isEmpty())
        {
            err.array().map((er)=>{extractedErrorMessages.push(er.param.toUpperCase()+': '+er.msg)});
            res.render('user_login', {locals: {title: 'Login', error: extractedErrorMessages}});
            return;
        }

        passport.authenticate('signin', function(err, user, info){
            if(err){return next(err);}
            if(!user){  console.log('user doesnt exist'); return res.render('user_login', {error:req.body.username+" doesn't exists Or you entered a wrong password"} )};
            req.login(user, {session: false}, function(err){
                if(err){return next(err);};
                console.log('returning jwt in ...')
                return res.json(req.user.toAuthJson());
            })
        })(req, res, next);
    }
];

exports.register_get = function(req, res, next){
    res.render('user_register', {locals:{title: 'register'}});
};

exports.register_post = [
    body('username').trim().isLength({min:1}).withMessage('Username Required').isAlphanumeric().withMessage("Username can only contain Alphanumeric"),
    body('password').trim().isLength({min:1}).withMessage('Password Required'),
    body('confirmpassword').trim().custom((value, {req})=>{
        if(value!==req.body.password)
        {
            throw new Error("Password and Confirmpassword do not match");
        }
        return true;
    }),
    function(req, res, next){
        let err = validationResult(req);
        let extractedErrorMessages = [];
        if(!err.isEmpty() || (req.body.isManager!='true' && req.body.isManager!=undefined))
        {
            let newUser = {
                username: req.body.username,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
                isManager: req.body.isManager
            }

            if(req.body.isManager!='true' && req.body.isManager!=undefined)
                extractedErrorMessages.push('Invalid input for Usertype');


            err.array().map((er)=>{extractedErrorMessages.push(er.param.toUpperCase()+': '+er.msg)})
            res.render('user_register', {locals: {title: 'register', user: newUser, error: extractedErrorMessages}});
            return;
        }
        else{
            User.findOne({username: req.body.username}, async function(err, user){
                if(err)
                {
                    return next(err);
                }
                if(user)
                {
                    extractedErrorMessages.push('Username '+req.body.username+' already taken!')
                    res.render('user_register', {locals: {title: 'register', error: extractedErrorMessages}})
                }
                else{

                    let newuser = new User({
                        username: req.body.username,
                        password: req.body.password,
                        isManager: req.body.isManager===undefined?false:true
                        })
        
                    await newuser.encryptPassword(); 
                    
                    newuser.save(function(err){
                        if(err){throw err;}
                        })
        
                    res.redirect('/auth/login');
                }
           });
        }

    }];
