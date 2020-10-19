const Opening = require('../models/opening');
const User = require('../models/user');
const {body, validationResult} = require('express-validator');
const { reset } = require('nodemon');
var async = require('async');

exports.opening_list = function(req, res, next){

    Opening.find({status:'Open'}, (err, newOpenings)=>{
        if(err){ return next(err);}
        res.render('opening_list', {locals: {title:'Current Openings', openings: newOpenings }});
        })
}

exports.opening_detail = function(req, res, next){

    Opening.findById({_id: req.params.id}, (err, currentOpening)=>{
        if(err){ return next(err);}
        if(!currentOpening)
        {
            var eror = new Error('Opening does Not exist');
            eror.status = 404;
            return next(eror);
        }
        else{
            res.render('opening_detail', {locals:{title: currentOpening.projectname, opening: currentOpening}});
        }
    })
}

exports.opening_create_get = function(req, res, next){

    res.render('opening_create', {locals:{title: 'Create Opening'}})
}

exports.opening_create_post = [
    
    body('projectname').trim().isLength({min:1}).withMessage('Project Name Required'),
    body('clientname').trim().isLength({min:1}).withMessage('Client Name Required'),
    body('technologies').trim().isLength({min:1}).withMessage('Technologies Required'),
    body('role').trim().isLength({min:1}).withMessage('Role Required'),
    body('jobdescription').trim().isLength({min:1}).withMessage('Job Decription Required'),
    body('status').trim().isLength({min:1}).withMessage('Status Required'),
     
    function(req, res, next){

        let er = validationResult(req);
        let extractedErrorMessages = [];

        if(!er.isEmpty())
        {
            er.array().map((e)=>{extractedErrorMessages.push(e.param.toUpperCase()+': '+e.msg)});

            let openingObj = {
                'projectname': req.body.projectname,
                'clientname': req.body.clientname,
                'technologies': req.body.technologies,
                'role': req.body.role,
                'jobdescription': req.body.jobdescription,
                'status': req.body.status
            }
            return res.render('opening_create', {locals: {title: 'Create Opening', opening: openingObj, errors: extractedErrorMessages}});
        }
        else{

             let newOpening = new Opening({
                projectname: req.body.projectname,
                clientname: req.body.clientname,
                technologies: req.body.technologies,
                role: req.body.role,
                jobdescription: req.body.jobdescription,
                status: req.body.status,
                createdby: '5f8d25b28092261e806ec142',     // hard coded for now
                dateadded: Date.now(),
                datemodified: Date.now()
            })

            //check if same opening already present in the database

             Opening.findOne({projectname:req.body.projectname, clientname:req.body.clientname, technologies: req.body.technologies, role: req.body.role, jobdescription: req.body.jobdescription, createdby: req.body.createdby}, (err, isOpening)=>{
                 if(err){return next(err);}
                 if(isOpening){
                     res.render('opening_detail', {locals:{title:'Opening detail', opening: isOpening}});
                 }
                 else{
                    newOpening.save(function(err){
                        if(err)
                        {
                            return next(err);
                        }
                        console.log('returning opening:'+isOpening);
                        res.render('opening_detail', {locals:{title:'Opening detail', opening: newOpening}});
                    })
                 }
             })
        }
}]

exports.opening_update_get = function(req, res, next){

    /// on the basis of id findbyid and get details
    Opening.findById({_id: req.params.id}, (err, results)=>{
        if(err){ return next(err);}
        if(!results.isEmpty())
        {
            // not found
            var eror = new Error('Opening does Not exist');
            eror.status = 404;
            return next(eror);
        }
        else{
            res.render('opening_update', {locals:{title:'Update Opening', opening: results}});
        }
    })
}

exports.opening_update_post = [
    
    body('projectname').trim().isLength({min:1}).withMessage('Project Name Required'),
    body('clientname').trim().isLength({min:1}).withMessage('Client Name Required'),
    body('technologies').trim().isLength({min:1}).withMessage('Technologies Required'),
    body('role').trim().isLength({min:1}).withMessage('Role Required'),
    body('jobdescription').trim().isLength({min:1}).withMessage('Job Decription Required'),
    body('status').trim().isLength({min:1}).withMessage('Status Required'),
     
    function(req, res, next){

        let er = validationResult(req);
        let extractedErrorMessages = [];

        if(!er.isEmpty())
        {
            er.array().map((e)=>{extractedErrorMessages.push(e.param.toUpperCase()+': '+e.msg)});

            let openingObj = {
                'projectname': req.body.projectname,
                'clientname': req.body.clientname,
                'technologies': req.body.technologies,
                'role': req.body.role,
                'jobdescription': req.body.jobdescription,
                'status': req.body.status
            }
            return res.render('opening_update', {locals: {title: 'Update Opening', opening: openingObj, errors: extractedErrorMessages}});
        }
        else{

             let updateOpening = new Opening({
                projectname: req.body.projectname,
                clientname: req.body.clientname,
                technologies: req.body.technologies,
                role: req.body.role,
                jobdescription: req.body.jobdescription,
                status: req.body.status,
                createdby: '5f866f8875bdf06048a53ce2',     // hard coded for now
                dateadded: Date.now(),
                datemodified: Date.now()
            })

            //check if same opening already present in the database

            updateOpening.findByIdAndUpdate( req.params.id, opening, {},    function(err, theOpening){
                if(err)
                {
                    return next(err);
                }
                res.render('opening_detail', {locals:{title:'Opening detail', opening: theOpening}});
            })          
        }
}]

exports.opening_apply_post = function(req, res, next){

    let openingID = req.params.id;
    let userID = req.params.userid;
    let bearerHeader = req.headers['authorization'];

    // check whether user with above userID has already applied for the opening

    async.parallel({
        user: function(callback){
            User.findById(userID)
            .exec(callback)
        },
        opening: function(callback){
            Opening.findById({_id: openingID})
            .exec(callback);
        },

    }, function(err, results){
        if(err){
            return next(err);
        }
        if(results.opening==null)
        {
            var eror = new Error('Opening does Not exist');
            eror.status = 404;
            return next(eror);
        }
        if(results.user==null)
        {
            return res.render('user_login', {locals:{title: 'Login', error: 'user doesnot exist please login again'}});
        }
          
        res.render('user_login', {title: results.opening.projectname, opening: results.opening});
    })
}