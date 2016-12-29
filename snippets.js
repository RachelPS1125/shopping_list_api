var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost', function(err, db){
    if (err){
        console.error(err);
        return;
    }
    var collection = db.collection('snippets');
    
    var create = function(name, content){
        var snippet = {name: name, content: content};
        collection.insert(snippet, function(err, result){
            if (err){
                console.error(err);
                db.close();
                return;
            }
            console.log('Snippet ' + name + ' created');
            db.close();
        });
    };
    var read = function(name){
        var query = {name: name};        
        collection.findOne(query, function(err, snippet){
            if (err){
                console.error(err);
                db.close();
                return;
            } else if (!snippet){
                console.log('Snippet not found');
                db.close();
                return;
            }
            console.log(snippet.content);
            db.close();
        });
    };
    var update = function(name, newContent){
        var query = {name: name};
        var updateObj = {
            $set: {content: newContent}
        };
        collection.findAndModify(query, null, updateObj, function(err, snippet){
            if (err){
                console.error(err);
                db.close();
                return;
            } else if (!snippet){
                console.log('snippet not found');
                db.close();
                return;
            }
            console.log('snippet updated with ' + newContent);
            db.close();
        });
    };
    var remove = function(name){
        var query = {name: name};
        collection.findAndRemove(query, function(err, result){
            if (err){
                console.error(err);
                db.close();
                return;
            } else if (!result.value){
                console.log('Record not found');
                db.close();
                return;
            }
            console.log('snippet removed');
            db.close();
        });
    };
    
   var main = function() {
        if (process.argv[2] == 'create') {
            create(process.argv[3], process.argv[4]);
        }
        else if (process.argv[2] == 'read') {
            read(process.argv[3]);
        }
        else if (process.argv[2] == 'update') {
            update(process.argv[3], process.argv[4]);
        }
        else if (process.argv[2] == 'remove') {
            remove(process.argv[3]);
        }
        else {
            console.error('Command not recognized');
            db.close();
        }
    };

    main();
})