/**
 * Created by anastasiya on 12.1.17.
 */
const async = require('async'),
    fileType = require('file-type'),
    PDFDocument = require('pdfkit');

let db = require('../libs/data-base'),
    connection = db.connection.get();


module.exports.post = function (req, res) {

    async.waterfall([
        extractName,
        findUsers,
        createPDF
    ], function (err) {
        let response = {result: true};
        if (err) response.result = false;
        res.json(response);
    });

    function extractName(callback) {
        let firstName = req.body.firstName.trim();
        if (firstName) {
            callback(null, firstName);
        } else {
            callback(new Error());
        }
    }

};

function findUsers(firstName, callback) {
    let query = `SELECT * FROM user WHERE firstName = ${connection.escape(firstName)}`;
    connection.query(query, function (err, records) {
        if (err) {
            callback(err);
        } else if (records.length == 0) {
            callback(new Error());
        } else {
            callback(null, records);
        }
    });
}

function checkImage(file) {
    let type = fileType(file);
    let extension;
    if (type) extension = type.ext;
    if (!extension) return false;

    const imageExt = ['jpeg', 'jpg', 'gif', 'bmp', 'png'];
    return ~imageExt.indexOf(extension);

}

function getFullName(firstName, lastName) {
    firstName = firstName || '';
    lastName = lastName || '';
    return `${firstName} ${lastName}`
}


function savePDF(buffer, user, callback) {
    let query = `UPDATE user SET pdf = ? WHERE iduser = ${user.iduser}`;
    connection.query(query, buffer, function (err) {
        if (err) {
            callback(err);
            return;
        }
        callback(null);
    });
}


function generatePDF(user, callback) {
    let document = new PDFDocument(),
        buffers = [];

    document.on('data', buffers.push.bind(buffers));

    document.on('end', function () {
        savePDF(Buffer.concat(buffers), user, function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    });

    document.text(getFullName(user.firstName, user.lastName), 0, 0);

    if (user.image && checkImage(user.image)) {
        document.image(user.image, 100, 100, {width: 350, height: 200});
    }
    document.end();
}


function createPDF(users, callback) {

    async.each(users, function (user, callback) {
            generatePDF(user, callback);
        },
        function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);

        }
    )

}