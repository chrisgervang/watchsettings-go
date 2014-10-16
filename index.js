//fireware redirection command: iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8080

//imports
var db         = require("./db.js");
var fs         = require("fs");
var Handlebars = require("handlebars");

//data reference
var appsRef = new db('apps');

//local 'apps' data record. This reflects the current state of the server.
var appsRecord = {};

//on ramp up, fill up appsRecord
appsRef.root.once('value', function (snapshot) {
    appsRecord = snapshot.val();
    // console.log("firebase load all: " + JSON.stringify(appsRecord, null, " "));
    console.log("firebase load all");
    init();
});

function init() {

  appsRef.root.on('child_changed', function (snapshot) {
    console.log(JSON.stringify(snapshot.val(), null, " "));
    var child = snapshot.val();

    if(child.configuration.landing.lastSaved !== appsRecord[child.id].configuration.landing.lastSaved) {
      console.log("timestamp changed, regenerate landing html");
      generate.landingHtml(child.id, child.configuration.landing, child.settingsList)
    }

  });
  
}

var generate = {
  landingHtml: function(filename, configuration, settings) {
    var content;
    // First I want to read the file
    var template = "landing-page";
    fs.readFile('./templates/' + template + '.html', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;

        // Invoke the next step here however you like
        //console.log(content);   // Put all of the code here (not the best solution)
        console.log("in landing Html")
        processFile();          // Or put the next step in a function and invoke it
    });

    function processFile() {
        console.log("in process file: ", settings);

        Handlebars.registerHelper('list', function(items, options) {
            console.log("in callback!", settings,"items: " , items)
            var out = '';
            if(!items){
                items = settings
            }

            for(var i=0, l=items.length; i<l; i++) {
                out = out + options.fn(items[i]);
            }
            //callback
            return out;
        });

        Handlebars.registerHelper('ifvalue', function (conditional, options) {
            if (options.hash.value === conditional) {
                return options.fn(this)
            } else {
                return options.inverse(this);
            }
        });

        var result = Handlebars.compile(content.toString());
        //console.log("result: ", result(settings));

        fs.writeFile("./" + filename + '.html', result(), function (err) {
          if (err) return console.log(err);
          console.log('Write complete -> '+filename+'.html');
        });

    }

  },
  settingsHtml: function(filename, configuration) {

  }
}
