const http = require('http');
const fs = require('fs');
const path = require('path');
const loadserver = require('./loadserver.js')

const server = http.createServer((req, res) => {
  if (req.method === "GET"){
    if (req.url === "/"){
      fs.readFile(path.join(__dirname, "index.html"), (err, data) =>{
        if (err) {
          res.writeHead(500, {"Content-Type": "text/plain"});
          res.end("500 code는 서버 자체의 에러");
          return;
        }
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.end(data);
      });
    } else {
      res.writeHead(404, {"Content-Type": "text/plain; charset=utf-8"});
      res.end("404 code는 페이지를 찾을 수 없음");
    }
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

        const jsonData = {
          제목: writetitle,
          내용: writecontent
        };
        const jsonDataString = JSON.stringify(jsonData, null, 2);
        fs.writeFile(path.join(__dirname, "data.json"), jsonDataString, (err) => {
          if (err) {
            res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
            res.end("서버 자체 에러");
            return;
          }
          res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
          let jsonResponse = JSON.stringify({ message: "데이터가 성공적으로 저장됨"});
          res.end(jsonResponse);
        });
      });
    } else {
      res.writeHead(404, {"Content-Type": "text/plain; charset=utf-8"});
      res.end("404 code는 페이지를 찾을 수 없음");
    }
  } else {
    res.writeHead(404, {"Content-Type": "text/plain; charset=utf-8"});
    res.end("404 code는 페이지를 찾을 수 없음");
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});