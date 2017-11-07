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

router.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    defCharset: 'Buffer'
}));

router.post('/upload', function(req, res){
    if(!req.files)
        return res.status(400).send('No files were uploaded.');
    if(req.session.user._id && req.session.cookie.expires) {
        let sampleFile = req.files.file;
        console.log(sampleFile);
        var fileObj = {};
        fileObj.path = './uploads/' + req.session.user._id;
        console.log("path reqvest::", req.body);
        //for(var j=0; j<req.body.pathabc.length; j++){
            fileObj.path += '/' + req.body.pathabc;
        //}
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
            path = './uploads/'+userId;
            for(var j=0; j<req.body.patharr.length; j++){
                path += '/' + req.body.patharr[j];
            }
            kafka.make_request('file_topic', {"operation": "createDir", "dirname":userId, "path":path, "name":req.body.name}, function(err, results){
                if(results.code == 200){
                    res.status(201).json({message: 'dir created'});
                }
                else if(results.code == 201){
                    res.status(201).json({message: 'copy dir created'});
                }
                else if(result.code == 400){
                    res.status(401).json({message:'not created'});
                }
            })
            // mkdirp('./uploads/' + userId, function (err) {
            //     var name = req.body.name;
            //     fs.lstat('./uploads/' + userId + '/' + name, function (err, stats) {
            //         if (err) {
            //             mkdirp('./uploads/' + userId + '/' + name, function (err) {
            //                 res.status(201).json({message: 'dir created'});
            //             });
            //         }
            //         else if (stats.isDirectory()) {
            //             mkdirp('./uploads/' + userId + '/' + name + '-copy', function (err) {
            //                 res.status(201).json({message: 'copy dir created'});
            //             })
            //         }
            //     })
            // })
        }
        else{
            res.status(401).json({message: 'session expired'});
        }
})

router.post('/list', function(req, res, next){
    if(req.session.user._id){
        var userId = req.session.user._id;
        kafka.make_request('file_topic', {"operation":"list","dirname":userId}, function(err, results){
            if(err){
                res.status(401).send(results)
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

router.post('/listfromdir', function(req, res, next){
    if(req.session.user._id){
        var userId = req.session.user._id;
        kafka.make_request('file_topic', {"operation":"listfromdir","dirname":userId, "name":req.body.dirname}, function(err, results){
            if(err){
                res.status(401).send()
            }
            else{
                console.log("res are:", results);
                res.status(200).send(results)
            }
        })
    }
    else{
        res.status(401).json({message:"session expired"})
    }
})

router.post('/delete', function(req, res, next){
    console.log(req.session)
    if(req.session.user._id){
        var userId = req.session.user._id;
        var path = './uploads/' + req.session.user._id;
        var name = req.body.name;
        console.log("reqvest",req.body);
        kafka.make_request('file_topic', {"operation":"delete", "dirname":userId, "path":path, "name":name},function(err, results){
            if(err){
                res.status(401).send()
            }
            else{
                res.status(200).send(results)
            }
        })
    }
    else{
        res.status(400).json({message:"session expired"})
    }
})

router.post('/deletedir', function(req, res, next){
    if(req.session.user._id){
        var userId = req.session.user._id;
        var path = './uploads/' + req.session.user._id;
        var name = req.body.name;
        console.log("reqvest",req.body);
        kafka.make_request('file_topic', {"operation":"deletedir", "dirname":userId, "path":path, "name":name},function(err, results){
            if(err){
                res.status(401).send()
            }
            else{
                res.status(200).send(results)
            }
        })
    }
    else{
        res.status(400).json({message:"session expired"})
    }
})

router.post('/download', function(req, res, next){
    if(req.session.user._id){
        console.log(req.session)
        var userId = req.session.user._id;
        var path = './uploads/' + req.session.user._id;
        var name = req.body.name;
        //console.log("reqvest",req.body);
        kafka.make_request('file_topic', {"operation":"download", "dirname":userId, "path":path, "name":name},function(err, results){
            if(err){
                res.status(401).send()
            }
            else{
                var obj = {}
                obj.data = Buffer.from(results.data.data);
                obj.name = results.name;
                //console.log("got results: ", obj);
                res.status(200).json(obj)
            }
        })
    }
    else{
        res.status(400).json({message:"session expired"})
    }
})

router.post('/share', function(req, res, next){
    console.log("boddy::::::::::::::::::::::",req.body)
    if(req.session.user._id){
        kafka.make_request('file_topic', {"operation":"share", "emails":req.body.holders, "owner":req.session.user._id, "name":req.body.name}, function(err, results){
            if(err){
                res.status(401).send()
            }
            else{
                res.status(201).send()
            }
        })

    }
})
module.exports = router;
