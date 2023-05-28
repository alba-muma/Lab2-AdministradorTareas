const http = require('http');
const fs = require('fs');

const PORT = 3000; // Cambio de puerto del 80 al 3000

const serveStaticFile = async (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, function(err, data) {
      if(err) reject(err);
      resolve(data);
    });
  });
} 

const sendResponse = (response, content, contentType) => {
  response.writeHead(200, {"Content-Type": contentType});
  response.end(content);
}

const handleRequest = async (request, response) => {
  const url = request.url;
  response.setHeader("Access-Control-Allow-Origin" , "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (request.method === "OPTIONS") {
    response.writeHead(200);
    response.end();
  } else if(request.method === "GET"){
    let content;
    let contentType;
    switch(url){
      case "/":
      case "/index.html":
        content = await serveStaticFile("www/index.html");
        contentType = "text/html";
        break;
      case "/script.js":
        content = await serveStaticFile("www/script.js");
        contentType = "text/javascript";
        break;
      case "/style.css":
        content = await serveStaticFile("www/style.css");
        contentType = "text/css";
        break;
      case "/tasks/get":
        content = await serveStaticFile("tasks.json");
        contentType = "application/json"
        break;
      default:
        content = "Ruta no v&aacutelida\r\n";
        contentType = "text/html";
    }

     sendResponse(response, content, contentType);
  } else if (request.method === "POST" && url === "/tasks/update" ){
      let data = '';
      request.on('data', chunk => {
        data += chunk.toString();
      });
      
      request.on('end', () => {
        fs.writeFile("tasks.json", data, (err) => {
          if (err) throw err;
          console.log("Tareas actualizadas en el json");
        });
        sendResponse(response, "Tareas actualizadas", "text/plain");
      });
  }
  
   else{
     response.writeHead(405, {"Content-Type": "text/html"});
     response.write(`M&eacutetodo ${request.method} no permitido!\r\n`);
  }
}


const server = http.createServer(handleRequest);
server.listen(PORT , () => {
  console.log("Escuchando")
});