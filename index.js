//fireware redirection command: iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8080


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
    var template = "landing-page";
    fs.readFile('./templates/' + template + '.html', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;

        // Invoke the next step here however you like
        //console.log(content);   // Put all of the code here (not the best solution)
        processFile();          // Or put the next step in a function and invoke it
    });

    function processFile() {
        console.log("content: ", content);
        var result = Handlebars.compile(content.toString());

        fs.writeFile("./" + filename + '.html', result, function (err) {
          if (err) return console.log(err);
          console.log('Write complete -> '+filename+'.html');
        });


        //console.log("result: ", result);
    }

  },
  settingsHtml: function(filename, configuration) {

  }
}


var settingsList = [{
    "type": "title",
    "data": {
        "value": "Settings"
    }
},
{
    "type": "text",
    "data": {
        "value": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    }
},
{
    "type": "toggle",
    "data": {
        "name": "Show Ads",
        "id": "showAds"
    }
}];

Handlebars.registerHelper('list', function(items, options) {
    var out = '';
    if(!items){
        items = settingsList
    }

    for(var i=0, l=items.length; i<l; i++) {
        out = out + options.fn(items[i]);
    }

    return out;
});
Handlebars.registerHelper('ifvalue', function (conditional, options) {
    if (options.hash.value === conditional) {
        return options.fn(this)
    } else {
        return options.inverse(this);
    }
});
