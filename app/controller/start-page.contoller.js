/**
 * Created by anastasiya on 10.1.17.
 */
const path = require('path');
const url = '../public/index.html';

 module.exports.get = function(req,res){
 let fs = require('fs');
 let file = new fs.ReadStream(url);
 file.pipe(res);
 };