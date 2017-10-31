var express = require('express');
var multer  =   require('multer');
var crypto = require('crypto');
var app = express();
const fs = require('fs');
const uuidv4 = require('uuid/v4');
var mkdirp = require('mkdirp');
var mongoURL = "mongodb://localhost:27017/login";
var mongo = require("./mongo");
var kafka = require('./kafka/client');
var fileUpload = require('express-fileupload')

var router = express.Router();

router.use(fileUpload());

router.post('/upload', function(req, res){
    if(!req.files)
        return res.status(400).send('No files were uploaded.');
    if(req.session.user._id && req.session.cookie.expires) {
        let sampleFile = req.files.file;
        console.log(sampleFile);
        var fileObj = {};
        fileObj.path = './uploads/' + req.session.user._id;
        fileObj.name = req.files.file.name;
        fileObj.encoding = req.files.file.encoding;
        fileObj.mimetype = req.files.file.mimetype;
        kafka.make_request('file_topic', {
            "operation": "upload",
            "data": req.files.file.data,
            "filedetails": fileObj,
            "user_id": req.session.user._id
        }, function (err, result) {
            if (result.code = 200) {
                res.status(201).json({message: "upload working"});
            }
            else
                res.status(400).json({message: "upload not working"});
        })
    }
    else{
        res.status(400).json({message: "session expired"});
    }
})

router.post('/createdir', function(req, res, next){
        if(req.session.user._id) {
            var userId = req.session.user._id;
            mkdirp('./uploads/' + userId, function (err) {
                var name = req.body.name;
                fs.lstat('./uploads/' + userId + '/' + name, function (err, stats) {
                    if (err) {
                        mkdirp('./uploads/' + userId + '/' + name, function (err) {
                            res.status(201).json({message: 'dir created'});
                        });
                    }
                    else if (stats.isDirectory()) {
                        mkdirp('./uploads/' + userId + '/' + name + '-copy', function (err) {
                            res.status(201).json({message: 'copy dir created'});
                        })
                    }
                })
            })
        }
})

router.post('/list', function(req, res, next){
    if(req.session.user._id){
        var userId = req.session.user._id;
        kafka.make_request('file_topic', {"operation":"list","dirname":userId}, function(err, results){
            if(err){
                res.status(401).send()
            }
            else{
                res.status(200).send(results)
            }
        })
    }
    else{
        res.status(401).json({message:"session expired"})
    }
})

module.exports = router;
