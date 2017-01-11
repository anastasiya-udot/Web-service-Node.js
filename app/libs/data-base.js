/**
 * Created by anastasiya on 11.1.17.
 */
const mysql = require('mysql'),
    constant = require('./constant');

let config = constant.db;
let connection = mysql.createConnection(config);

function initialize() {
    connection.connect();
}
function check(){
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user', function (err) {
            if (err){
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function get(){
    return connection;
}

module.exports.connection = {
    initialize: initialize,
    check: check,
    get: get
};
