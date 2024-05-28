const http = require('http');
const fs = require('fs');
const path = require('path');
const flieUtils = require('./loadserver.js');

let newdiv = '';

const server = http.createServer((req, res) => {
  let url = req.url
  let filePath = flieUtils.getFliePath(url)
  let ext = flieUtils.getFlieExtension(filePath)
  let contype = flieUtils.getContentType(ext)
  if (req.method === "GET"){
    if(req.url === url){
      console.log(req.url);
      fs.readFile(filePath,(err,data)=>{
        if(err){
          res.writeHead(500,{"Content-Type":"text/plain; charset=UTF-8"});
          res.end("서버 연결 오류");
          return;
        } else {
          res.writeHead(200,{"Content-Type": contype});
          res.end(data);
        }
      })
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
        const htmlData = `<!DOCTYPE html>
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

        newdiv += `<div onclick="location.href='./${writetitle}.html'">${writetitle}</div>`

        const indexData = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>indexpage</title>
          <link rel="stylesheet" href="indexstyle.css">
        </head>
        <body>
          <div id="root">
            <div>
              <div id="HomeTitle">
                <h1 onclick="location.href='./index.html'">홈페이지 이름</h2>
              </div>
            </div>
            <div>
              <div id="MakeNote">
                <h2 onclick="location.href='./writenote.html'">글쓰기</h2>
              </div>
            </div>
            <div id="NoteTitle">
              ${newdiv}
            </div>
          </div>
        </body>
        </html>`;

        fs.writeFile(path.join(__dirname, "./public/index.html"), indexData, (err) => {
          if(err){
            console.log("오류")
          }
        });
        fs.writeFile(path.join(__dirname, `./public/${writetitle}.html`), htmlData, (err) => {
          if (err) {
            res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
            res.end("서버 자체 에러");
            return;
          }
          fs.readFile('./public/index.html',(err,data)=>{
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