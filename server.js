
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime-types');
var url = require('url');
const ROOT = './public_html';
const DATA = './heroes';
// Adapt from code during lecture
var server = http.createServer(handleRequest);
server.listen(1996);
console.log('Server listening on port 1996');

// Handler for incoming requests
// @param: req the requests from browser
//         res the responds sends to the browser
// output: handle requests and send responds to browser
function handleRequest(req, res){
    var urlObj = url.parse(req.url, true);
    var query = urlObj.query;
    var pathname = urlObj.pathname;
    var filename = ROOT + pathname;
    var code;
    var data="";
    console.log("Requested "+ req.url);
    if(pathname === '/allHeroes'){
      code = 200;
      filename = '.json';
      var heroes_list = fs.readdirSync(DATA+'/info');
      data = JSON.stringify(heroes_list);

    } else if (pathname === '/hero'){
      console.log("Request JSON for: "+query['name']);
      filename = DATA +"/info/"+ query['name']+ '.json';
      console.log(filename);
      if (fs.existsSync(filename)){
        code =200;
        data = getFileContents(filename);
      } else{
        console.log("File NOT found");
        code = 404;
        filename = ROOT +'/404.html';
        data = getFileContents(filename);
      }

    } else if (fs.existsSync(filename)){
      code = 200;
      var stats = fs.statSync(filename);
      if (stats.isDirectory())
        filename += "/index.html";
      data = getFileContents(filename);

    } else {
      console.log("File NOT found");
      code = 404;
      filename = ROOT +'/404.html';
      data = getFileContents(filename);
    }

    res.writeHead(code, {'content-type': mime.lookup(filename)|| 'text/html'});
    res.end(data);
}

//read a file and returns its contents
// @param filename the filename to get content
// @return contents the contents of the file
function getFileContents(filename){

	var contents;

	//handle good requests
	console.log("Getting file");
	contents = fs.readFileSync(filename);
	return contents;
}
