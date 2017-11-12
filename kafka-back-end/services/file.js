var mongo = require("./mongo")
var mongoURL = "mongodb://localhost:27017/login";
var mkdirp = require('mkdirp');
const fs = require('fs');
var ObjectId = require('mongodb').ObjectId;

function list(msg, callback){
    fs.readdir('./uploads/' + msg.dirname, function(err, files){
        if(err){

            callback(err);
        }
        else {
            var obj = {}
            obj.filelist = [];
            obj.dirlist = [];
            var item = 0;
            files.forEach(eachfile => {
                mongo.connect(mongoURL, function(){
                    var coll = mongo.collection('file')
                    coll.findOne({user_id:msg.dirname, "filedetail.name":eachfile},{starred:1}, function(err, ress) {
                        console.log(ress)
                        console.log(eachfile)
                        var ob = {}
                    if (ress != null) {

                        if (ress.starred.indexOf(msg.dirname) == -1) {
                            ob.star = false
                        }
                        else {
                            ob.star = true
                        }
                    }
                        fs.lstat('./uploads/' + msg.dirname + '/' + eachfile, function (err, stats) {

                            if (err) {
                                console.log(err)
                            }
                            else {

                                if (stats.isFile()) {

                                    ob.name = eachfile
                                    ob.path = './uploads/' + msg.dirname + '/'
                                    obj.filelist.push(ob);
                                }
                                else if (stats.isDirectory()) {
                                    ob.name = eachfile;
                                    obj.dirlist.push(ob);
                                }

                            }
                            item++;
                            if (item == files.length) {
                                callback(null, obj);
                            }
                        })
                    })

            })
        })
        }
        })
}

function sharedfilelist(msg, callback){
    try{
        var res = {}
        var objct = {}
        objct.filelist = []
        objct.dirlist = []
        mongo.connect(mongoURL, function(){
            var coll = mongo.collection('login')
            coll.findOne({_id:ObjectId(msg.userId)}, {shared_paths:1}, function(err, results){
                if(err){
                    console.log(err)
                }
                else{
                    var j =0;
                    results.shared_paths.forEach(eachpath => {
                        fs.lstat(eachpath, function(err, stats){
                            if(err){
                                console.log("error")
                            }
                            else{
                                if(stats.isFile()){
                                    var strpath = eachpath.split("/");
                                    objct.filelist.push(strpath[strpath.length-1]);
                                }
                                else if(satts.isDirectory()){
                                    objct.dirlist.push(eachpath)
                                }
                                j++;
                                if(j == results.shared_paths.length){
                                    callback(null,objct)
                                }
                            }
                        })
                    })
                }
            })
        })
    }
    catch(e){
        console.log(e)
    }
}

function starredfilelist(msg, callback){
    try{
        var res = {}
        var obj = {}
        obj.files = [];
        obj.dirs = [];
        mongo.connect(mongoURL, function(){
            var coll = mongo.collection('file')
            var coll2 = mongo.collection('login')
            coll.find({starred:{$elemMatch:{$eq:msg.userId}}}, {"filedetail.name":1, "filedetail.path":1}, function(err, ress){
                ress.toArray(function(err, items){
                    console.log("query output",items)
                    var j =0;
                    var it1 = items;
                    items.forEach(eachitem => {
                        console.log("paaaath:", eachitem.filedetail.path + eachitem.filedetail.name)
                    fs.lstat(eachitem.filedetail.path + eachitem.filedetail.name, function(err, stats){
                        if(err){
                            console.log("err")
                        }
                        else{
                            if(stats.isFile()){
                                obj.files.push(eachitem.filedetail.name)
                            }
                            else if(stats.isDirectory()){}
                            obj.dirs.push(eachitem.filedetail.name)
                        }
                        j++;
                        if(j == it1.length){
                            callback(null, obj)
                        }
                    })
                    })
                })
            })
        })
    }
    catch(e){
        console.log(e)
    }
}

function groupMembers(msg, callback) {
    try{
        var res = {}
        res.users = []
        mongo.connect(mongoURL, function(){
            var coll = mongo.collection('groups')
            var coll2 = mongo.collection('login')
            coll.findOne({user_id:ObjectId(msg.userId), name:msg.name}, {_id:0, users:1}, function(err, ress){
                if(err){
                    console.log("err")
                    callback(null, res)
                }
                else{
                    console.log("ress",ress)
                    var j =0;

                    ress.users.forEach(eachuser => {
                        console.log(eachuser)
                        coll2.findOne({_id:ObjectId(eachuser._id)}, {username:1}, function(err, result){
                            res.users.push(result.username)
                            j++;
                            if(j==ress.users.length){

                                console.log("users", msg)
                                callback(null,res)
                            }
                        })
                    })

                }
            })
        })
    }
    catch(e) {
        console.log(e)
    }
}

function grouplist(msg, callback){
    console.log("everywhere")
    try{
        console.log("here and there")
        var res = {}
        res.grouplist = []
        mongo.connect(mongoURL, function(){
            var coll = mongo.collection('groups')
            var colLogin = mongo.collection('login')
            coll.find({user_id:ObjectId(msg.userId)},{_id:0, users:1, name:1}, function(err, results){
                if(err){
                    console.log("shows some error",err)
                    callback(null, res)
                }
                else{
                    results.toArray(function(err, items){
                        console.log("Items:", items)
                        var j =0;

                        res.grouplist = items;
                        callback(null, res)
                        // for(var j =0; j<items.length;j++){
                        //     console.log(items[j].users)
                        //     var arr = [];
                        //     var n =0;
                        //     itemobject = items[j]
                        //     items[j].users.forEach(user => {
                        //         console.log("id1::::",items[j].users.length)
                        //         console.log("id2::::",items[j].users)
                        //         colLogin.findOne({_id:ObjectId(user._id)}, {username:1}, function(err, resp){
                        //             arr.push(resp.username)
                        //             console.log("resp email:", resp)
                        //             console.log("array:", arr)
                        //             console.log("d1::::",itemobject.users.length)
                        //             console.log("d2::::",itemobject.users)
                        //             n++;
                        //
                        //             if(n == itemobject.users.length){
                        //                 n = 0;
                        //                 res.grouplist.push({name: itemobject.name, users:arr})
                        //                 console.log("arr", arr)
                        //                 console.log("grouplist",res.grouplist);
                        //                 console.log("item length:", items.length)
                        //                 console.log("j ", j)
                        //                 if(j == (items.length)){
                        //
                        //                     console.log("hehehehere", res.grouplist[1].users)
                        //                     callback(null, res)
                        //                 }
                        //             }
                        //         })
                        //     })
                        //
                        // }
                        console.log(res)

                    })
                }
            })

        })
    }
    catch(e){
        console.log(e)
    }
}

function listfromdir(msg, callback){

    fs.readdir('./uploads/' + msg.dirname + '/' + msg.name, function(err, files){
        console.log("path",'./uploads/' + msg.dirname + '/' + msg.name)
        if(err){
            callback(err);
        }
        else {
            var obj = {}
            obj.filelist = [];
            obj.dirlist = [];
            var item = 0;
            if(files.length == 0){
                console.log("null returned")
                callback(null, null)
            }
            files.forEach(eachfile => {
                fs.lstat('./uploads/' + msg.dirname + '/' + msg.name+ '/' + eachfile, function (err, stats) {

                    if (err) {
                        console.log(err)
                    }
                    else {
                        var ob = {}
                        ob.name = eachfile;
                        if (stats.isFile()) {
                            ob.path = './uploads/' + msg.dirname + '/' + msg.name+ '/'
                            obj.filelist.push(ob);
                        }
                        else if(stats.isDirectory()){
                            obj.dirlist.push(ob)
                        }
                    }
                    item++;
                    if(item == files.length){
                        console.log("object:", obj);
                        callback(null, obj);
                    }
                })
            })
        }
    })
}
function upload(msg, callback){
    try{
        mongo.connect(mongoURL, function() {
            var coll = mongo.collection('file')
            var collLogin = mongo.collection('login')
            var res = {};
            // console.log("data", msg.filedetails.name);
            mkdirp(msg.filedetails.path, function (err) {
            fs.writeFile(msg.filedetails.path +'/'+msg.filedetails.name , Buffer.from(msg.data.data), function (err) {
                if (err)
                    console.log("error", err)
                else
                    console.log("cool");
            })
        })
            coll.insertOne({filedetail:msg.filedetails, user_id:msg.user_id, created_at:new Date(), deleted_at:'', members:[], starred:[], isFile:1}, function(err, result){
                console.log("id::",msg.user_id)
                var strId = "ObjectId(\""+msg.user_id+"\")"
                //var srtId = "ObjectId(\"59e7e29cb9977c181c9aedf4\")"
                console.log(strId)
                // collLogin.updateOne({_id:"ObjectId(\""+msg.user_id+"\")"}, {$push:{activity: {file_id:'', filename: "name", flag:1, time:''}}}, function(err, results){
                collLogin.update({_id:ObjectId(msg.user_id)}, {$push:{activity: {file_id:result["ops"][0]["_id"], filename:msg.filedetails.name, flag:1, time:result["ops"][0]["created_at"]}}})

                    //console.log("there", results)
                    //console.log("file id::", results["ops"][0]);
                    if(err)
                        res.code = 400;
                    else {
                        res.code = 200;
                    }
                    callback(null, res);
            //
            })
       })
    }
    catch (e){
        console.log(e);
    }
}

function deleteFile(msg, callback){
    try{
        mongo.connect(mongoURL, function() {
            var coll = mongo.collection('file')
            var res = {};
            //fs.unlinkSync(msg.path+'/'+msg.name);

            coll.deleteOne({"filedetail.name":msg.name}, function(err, result){
                if(err)
                    res.code = 400;
                else {
                    res.code = 200;
                }
                callback(null, res);
            })
        })
    }
    catch (e){
        console.log(e);
    }
}

function deleteDir(msg, callback){
    try{
        mongo.connect(mongoURL, function() {
            var coll = mongo.collection('file')
            var res = {};
            var rimraf = require('rimraf');
            rimraf(msg.path+'/'+msg.name, function(){

                callback(null, res);
            });
            //database is yet to maintain for directory structure
            // coll.deleteOne({"filedetail.name":msg.name}, function(err, result){
            //     if(err)
            //         res.code = 400;
            //     else {
            //         res.code = 200;
            //     }
            // })
        })
    }
    catch (e){
        console.log(e);
    }
}

function downloadFile(msg, callback){
    try{
        var res = {};
        fs.readFile(msg.path+'/'+msg.name, (err, data) => {
            res.data = data;
            res.name = msg.name;
            console.log("result is::",res);
            callback(null,res);
        });

    }
    catch (e){
        console.log(e);
    }
}

function createDir(msg, callback){
    mkdirp(msg.path, function (err) {
        var res = {};
        fs.lstat(msg.path + '/' + msg.name, function (err, stats) {
            if (err) {
                mkdirp(msg.path + '/' + msg.name, function (err) {
                    res.code = 200;
                    callback(null, res)
                });
            }
            else if (stats.isDirectory()) {
                mkdirp(msg.path + '/' + msg.name + '-copy', function (err) {
                    res.code = 201;
                    callback(null, res)
                })
            }
        })
    })
}

function activity(msg, callback) {
    try{
        var res = {}
        res.activity = [];
        mongo.connect(mongoURL, function() {
            var coll = mongo.collection('login')
            coll.findOne({_id: ObjectId(msg.userId)}, {_id:0, activity: 1}, function (err, ress) {
                if (err) {
                    console.log("err")
                    callback(null, res)
                }
                else {
                    console.log("activity:::", ress)
                    res.activity = ress.activity
                    callback(null, res)
                    // ress.toArray(function (err, items) {
                    //     res.activity = items;
                    //     console.log("activity:", items)
                    //     callback(null, res)
                    // })
                }
            })
        })
    }
    catch(e){
        console.log(e)
    }
}

function starfile(msg, callback){
    try{
        var res = {}
        mongo.connect(mongoURL, function() {
            var coll = mongo.collection('file')
        if(msg.val == "star"){
            coll.update({
                user_id: msg.userId,
                "filedetail.name": msg.filename
            }, {$push: {starred: msg.userId}}, function (err, ress) {
                if (err) {
                    callback(null, ress)
                }
                else {
                    res.code = 200
                    callback(null, res)
                }
            })
        }
        else if(msg.val == "unstar"){
            coll.update({
                user_id: msg.userId,
                "filedetail.name": msg.filename
            }, {$pull: {starred: msg.userId}}, function (err, ress) {
                if (err) {
                    callback(null, ress)
                }
                else {
                    res.code = 200
                    callback(null, res)
                }
            })
        }
        })
    }
    catch(e){
        console.log(e)
    }
}

function shareFile(msg, callback){
    try{
        mongo.connect(mongoURL, function() {
            var coll = mongo.collection('file')
            var collLogin = mongo.collection('login')
            var res = {}
            console.log("val is:", msg.emails[0].email)
            // for(var j=0;j<msg.emails.length;j++){
            //     console.log("caught", j)
            //   collLogin.findOne({email:msg.emails[j].email}, {_id:1}, function(err, results){
            //       console.log("ress",results)
            //       if(results == null){
            //
            //           console.log("mial:", msg.emails[j-1].email)
            //           res.code = 201;
            //           res.message = "user not found"
            //           res.femail = msg.emails[j-1].email
            //           callback(null, res)
            //       }
            //       else
            //           collLogin.update({email:msg.emails[j].email}, {$push:{shared_paths:msg.name}}, function(err, results){
            //           res.code = 200
            //           callback(null, res)
            //       })
            //   })
            //
            // }
            msg.emails.forEach(eachMail => {
                collLogin.findOne({email:eachMail.email}, {_id:1}, function(err, results){
                          console.log("ress",results)
                          if(results == null){

                              console.log("mail:", eachMail.email)
                              res.code = 201;
                              res.message = "user not found"
                              res.femail = eachMail.email
                              console.log(res)
                              callback(null, res)
                          }
                          else
                              collLogin.update({email:eachMail.email}, {$push:{shared_paths:msg.name}}, function(err, results){
                              res.code = 200
                              callback(null, res)
                          })
                      })
            })

            res.code = 200
            res.message = "shared successfully"
            callback(null, res)

            //Do something with database
            //Add file id to all the shared user's database
            //Add shared flag equal to true to the file being shared
            //
            console.log("emails", msg)
        });
    }
    catch(e){
        console.log(e);
    }
}

function createGroup(msg, callback){
    try{
        mongo.connect(mongoURL, function() {
            var coll = mongo.collection('file')
            var collLogin = mongo.collection('login')
            var collGroup = mongo.collection('groups')
            var res = {}
            console.log("val is:", msg.emails[0].email)
             var j = 0;
            var arr = []
            msg.emails.forEach(eachMail => {

                collLogin.findOne({email:eachMail.email}, {_id:1}, function(err, results){
                    console.log("ress",results)
                    if(results == null){
                        console.log("mail:", eachMail.email)
                        res.code = 201;
                        res.message = "user not found"
                        res.femail = eachMail.email
                        console.log(res)
                        callback(null, res)
                    }
                    else
                        // collLogin.update({email:eachMail.email}, {$push:{shared_paths:msg.name}}, function(err, results){
                        //     res.code = 200
                        //     callback(null, res)
                        // })
                    {
                        arr.push(results)
                        j++;
                        if(j == msg.emails.length){
                            console.log("array is", arr)
                            collGroup.insert({user_id:ObjectId(msg.owner), users:arr, name:msg.name}, function(err, result){
                                res.code = 200
                                res.message = "shared successfully"
                                callback(null, res)
                            })
                        }
                        // collGroup.save({user_id:ObjectId(msg.groupName)}, {$push:{users:results}, name:msg.groupname}, function(err, result){
                        //     res.code = 200
                        //     callback(null, res)
                        // })
                    }
                })
            })


            //Do something with database
            //Add file id to all the shared user's database
            //Add shared flag equal to true to the file being shared

        });
    }
    catch(e){
        console.log(e);
    }
}

exports.activity = activity;
exports.starredfilelist = starredfilelist;
exports.starfile = starfile;
exports.sharedfilelist = sharedfilelist;
exports.grouplist = grouplist;
exports.createGroup = createGroup;
exports.shareFile = shareFile;
exports.deleteDir = deleteDir;
exports.createDir = createDir;
exports.downloadFile = downloadFile;
exports.deleteFile = deleteFile;
exports.upload = upload;
exports.list = list;
exports.groupMembers = groupMembers;
exports.listfromdir = listfromdir;