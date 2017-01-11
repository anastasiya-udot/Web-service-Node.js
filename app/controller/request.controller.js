/**
 * Created by anastasiya on 12.1.17.
 */
const async = require('async');
const connection = require('../libs/data-base').connection;

module.exports.post = function(req, res){

    async.waterfall([
        extractName,
        findUser,
        createPDF
    ], function(err){
        let response = { result: true };
        if(err) response.resule = false;
        res.json(response);
    });

    function extractName(callback){
        let firstName = req.body.firstName;
        if(firstName.trim()){
            callback(null,firstName.trim());
        } else {
            callback(new Error());
        }
    }

};

function findUser(){

}