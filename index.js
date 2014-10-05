var db = require("./db.js");
var fs = require("fs");
var Handlebars = require("handlebars");

var appsRef = new db('apps');

var appRecord = {};
var startup = false;
appsRef.root.once('value', function (snapshot) {
    appRecord = snapshot.val();
    console.log("firebase load all: " + JSON.stringify(appRecord, null, " "));
    init()
})
function init() {
  appsRef.root.on('child_changed', function (snapshot) {
    console.log(JSON.stringify(snapshot.val(), null, " "));
    var child = snapshot.val();

    if(child.configuration.landing.lastSaved !== appRecord[child.id].configuration.landing.lastSaved) {
      console.log("timestamp changed, regenerate landing html");
      generate.landingHtml(child.id, child.configuration.landing)
    }

  })
}

var generate = {
  landingHtml: function(filename, configuration) {
    var content;
    // First I want to read the file
    var template = "landing"
    fs.readFile('./' + template + '.html', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;

        // Invoke the next step here however you like
        console.log(content);   // Put all of the code here (not the best solution)
        processFile();          // Or put the next step in a function and invoke it
    });

    function processFile() {
        console.log(content);
        var template = Handlebars.compile(content.toString());

        var data = { "name": "Alan", "hometown": "Somewhere, TX",
                     "kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};
        var result = template(data);
        console.log(result);
    }

  },
  settigngsHtml: function(filename, configuration) {

  }
}
