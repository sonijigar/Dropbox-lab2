var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongoURL = "mongodb://localhost:27017/login";
var kafka = require('./kafka/client');

module.exports = function(passport) {

    passport.use('login', new LocalStrategy(function(username, password, done){
        try{
            kafka.make_request('login_topic', {"operation":"login","username":username, "password":password}, function(err, results){
                if(err)
                    done(err,{});
            else
            {
                if (results.code == 200) {
                    done(null, results.user);
                }
                else {
                    done(null, false);
                }
            }
            }
            )
        }
        catch(e){
            done(e,{});
        }
    }));

    // passport.use('signup', new LocalStrategy(function(username, password, done){
    //     try{
    //         mongo.connect(mongoURL, function(){
    //             console.log('Conected to mongo at: ' + mongoURL);
    //             var coll = mongo.collection('login');
    //
    //             coll.findOne({username: username, password: password}, function (err, user) {
    //                 if(user){
    //                     done(null, user);
    //                 }
    //                 else{
    //                     done(null);
    //                 }
    //             })
    //         })
    //     }
    //     catch(e){
    //         done(e, {})
    //     }
    // }))
};


