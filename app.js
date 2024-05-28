const http = require('http');
const fs = require('fs');
const path = require('path');
const loadserver = require('./loadserver.js');

const server = http.createServer((req, res) => {
  if (req.method === "GET"){
  loadserver("/", "index.html", "text/html", req, res);
  loadserver("/index.html", "index.html","text/html", req, res);
  loadserver("/indexadd.js", "indexadd.js","text/javascript", req, res);
  loadserver("/indexstyle.css", "indexstyle.css","text/css", req, res);
  loadserver("/writenote.html", "writenote.html","text/html", req, res);
  loadserver("/writenotestyle.css", "writenotestyle.css","text/css", req, res);
  } else if (req.method === "POST") {
    if (req.url === "/submit"){
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const parsedData = new URLSearchParams(body);
        const writetitle = parsedData.get("writetitle");
        const writecontent = parsedData.get("writecontent");

        let today = new Date();

        const jsonData = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>note</title>
        </head>
        <link rel="stylesheet" href="allnotestyle.css">
        <body>
          <div id="root">
            <div>
              <div>
                <h2 onclick="location.href='./index.html'">${writetitle}</h2>
              </div>
            </div>
            <div>
              <div>
                <pre>${writecontent}</pre>
              </div>
            </div>
          </div>
        </body>
        </html>`;

        // let addlink = today.toLocaleDateString()+writetitle
        
        fs.writeFile(path.join(__dirname, `${today.toLocaleDateString()}${writetitle}.html`), jsonData, (err) => {
          if (err) {
            res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
            res.end("서버 자체 에러");
            return;
          }
          fs.readFile('./index.html',(err,data)=>{
            if(err){
              res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
            res.end("서버 자체 에러");
            return;
            }
            res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"});
            res.end(data);
          });
        });
      });
    } else {
      res.writeHead(404, {"Content-Type": "text/plain; charset=utf-8"});
      res.end("404 code는 페이지를 찾을 수 없음");
    }
  } 
  else {
    res.writeHead(404, {"Content-Type": "text/plain; charset=utf-8"});
    res.end("404 code는 페이지를 찾을 수 없음");
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});