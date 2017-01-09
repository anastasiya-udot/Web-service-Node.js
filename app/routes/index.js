module.exports = function(app){
    app.get('/', require('./../controller/start-page.contoller').get);
};
