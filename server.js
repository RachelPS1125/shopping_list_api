var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Item = require('./models/item');

var mongoUrl = (process.env.NODE_ENV === 'production' ?
                    'mongodb://localhost/shopping-list' :
                    'mongodb://localhost/shopping-list-dev');

var jsonParser = bodyParser.json();

var app = express(); 

app.use(express.static('public'));
app.get('/items', function(req, res){
	Item.find(function(err, items){
		if (err){
			res.status(500).json({message: err});
			return;
		}
		res.json(items);
	});
	
});
app.post('/items', jsonParser, function(req, res){
	if(!req.body.name){
		res.status(400).json({message: 'Missing Name'});
		return;
	}
	Item.create({name: req.body.name}, function(err, item){
		if (err){
			res.status(500).json({message: err});
			return;
		}
		res.status(201).json(item);
	});
});
app.put('/items/:id', jsonParser, function(req, res){
	Item.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true}, function(err, item){
		if (err){
			res.status(500).json({message: err});
			return;
		}
		res.json(item);
	});
});
app.delete('/items/:id', function(req, res){
	Item.findByIdAndRemove(req.params.id, function(err, item){
		if (err){
			res.status(500).json({message: err});
			return;
		} else if (!item){
			res.status(400).json({message: 'Item does not exist'});
			return;
		}
		res.json({});
	});
});

var runServer = function(callback) {
    mongoose.connect(mongoUrl, function(err) {
        if (err && callback) {
            return callback(err);
        }
        app.listen(8080, function() {
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
}

exports.app = app;
exports.runServer = runServer;