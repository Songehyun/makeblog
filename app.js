const http = require('http');
const fs = require('fs');
const path = require('path');
const loadserver = require('./loadserver.js');

const server = http.createServer((req, res) => {
  if (req.method === "GET"){
  loadserver("/", "index.html", req, res);
  loadserver("/index.html", "index.html", req, res);
  loadserver("/indexstyle.css", "indexstyle.css", req, res);
  loadserver("/writenote.html", "writenote.html", req, res);
  loadserver("/writenotestyle.css", "writenotestyle.css", req, res);
  } else if (req.method === "POST") {
    if (req.url === "/test"){
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const parsedData = new URLSearchParams(body);
        const writetitle = parsedData.get("writetitle");
        const writecontent = parsedData.get("writecontent");

        const jsonData = {
          writetitle : writetitle,
          writecontent : writecontent
        };
        const jsonDataString = JSON.stringify(jsonData, null, 2);
        fs.writeFile(path.join(__dirname, "data.json"), jsonDataString, (err) => {
          if (err) {
            res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
            res.end("서버 자체 에러");
            return;
          }
          res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
          res.end();
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