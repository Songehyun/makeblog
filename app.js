const http = require('http');
const fs = require('fs');
const path = require('path');
const flieUtils = require('./loadserver.js');

let newdiv = '';
let decoderefer = '';
let decodeword = '';

    fs.readFile(path.join(__dirname, "./public/indexupdate.json"), (err, data) => {
      if(err){
        console.log("에러")
      } else {
        const parse = JSON.parse(data);
        for(let i = 0; i < parse.length; i++){
        newdiv += `<div onclick="location.href='./${parse[i]}.html'">${parse[i]}</div>`;
        }
      }
    });
    
    const server = http.createServer((req, res) => {
    if (req.method === "GET"){
    let url = req.url
    let filePath = flieUtils.getFliePath(url)
    let ext = flieUtils.getFlieExtension(filePath)
    let contype = flieUtils.getContentType(ext)

    if(req.url === url){
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
              <div>
                <form action="/delete" method="post">
                <button type="submit" id="delete">삭제</button>
                </form>
                <form action="/modifywrite" method="post">
                <button type="submit" id="modifywrite">수정</button>
                </form>
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

        // 파일 제목을 저장해서 불러오도록 도와주는 txt
        fs.readFile(path.join(__dirname, "./public/indexupdate.json"), (err, data) => {
          if(err){
            console.log("오류");
          }else{
          const parse = JSON.parse(data);
          parse.push(writetitle);
          const jparse = JSON.stringify(parse)
          fs.writeFile (path.join(__dirname, "./public/indexupdate.json"), jparse,(err) => {
            if(err){
              console.log("오류");
            }
          });
          }
        });

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
          res.writeHead(302, { Location: "/" });
          res.end();
        });
      });
    } else if (req.url === "/modifywrite") {
      let allrefer = req.headers.referer
      let sprefer = allrefer.split('/')[3];
      let wordrefer = sprefer.split('.')[0];
      decoderefer = decodeURI(sprefer);
      decodeword = decodeURI(wordrefer);
      res.writeHead(302, { Location: "/modifywrite.html" });
      res.end();
    } else if (req.url === "/modify") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
      const modifydata = new URLSearchParams(body);
      const modifytitle = modifydata.get("modifytitle");
      const modifycontent = modifydata.get("modifycontent");

      const modifyData = `<!DOCTYPE html>
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
                <h2 onclick="location.href='./index.html'">${modifytitle}</h2>
              </div>
            </div>
            <div>
              <div>
                <pre>${modifycontent}</pre>
              </div>
            </div>
            <div>
              <form action="/delete" method="post">
              <button type="submit" id="delete">삭제</button>
              </form>
              <form action="/modifywrite" method="post">
              <button type="submit" id="modifywrite">수정</button>
              </form>
            </div>
          </div>
        </body>
      </html>`;

      const modifypath = path.join(__dirname, "public")
    
      fs.readdir(path.join(__dirname, "public"), (err,data)=>{
        for(let i = 0; i < data.length; i++){
        if(data[i] === decoderefer){
          fs.unlink(`${modifypath}/${decoderefer}`, (err) => {
            if(err) {console.log("삭제못함");}
          });
          fs.writeFile(`${modifypath}/${modifytitle}.html`, modifyData, (err) => {
            if(err) {console.log("생성못함");}
          });
        }
      }
    });
      fs.readFile(path.join(__dirname, "./public/indexupdate.json"), (err, data) => {
        if(err) {
          console.log("에러떳음")
        } else {
          const parse = JSON.parse(data);
          for(let y = 0; y < parse.length; y++){
            if(parse[y] === decodeword){
              parse.splice(y, 1, modifytitle);
              newparse = JSON.stringify(parse);
              fs.writeFile("./public/indexupdate.json",`${newparse}`,(err) => {
                if(err){
                  console.error(err);
                } else {
                  newdiv = '';
                  fs.readFile(path.join(__dirname, "./public/indexupdate.json"), (err, data) => {
                    const parse = JSON.parse(data);
                    for(let i = 0; i < parse.length; i++){
                    newdiv += `<div onclick="location.href='./${parse[i]}.html'">${parse[i]}</div>`;
                    }
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
                  });
                }
              });
            }
          }
        }
      })
    });
      res.writeHead(302, { Location: "/" });
      res.end();
    } else if (req.url === "/delete") {
      const deletepath = path.join(__dirname, "./public")
      let allrefer = req.headers.referer
      let sprefer = allrefer.split('/')[3];
      let wordrefer = sprefer.split('.')[0];
      let decoderefer = decodeURI(sprefer);
      let decodeword = decodeURI(wordrefer);
      fs.readdir(path.join(__dirname, "./public"), (err,data)=>{
        for(let i = 0; i < data.length; i++){
        if(data[i] === decoderefer){
          fs.unlink(`${deletepath}/${decoderefer}`, (err) => {
            if(err) {console.log("삭제못함");}
          });
        }
      }
      fs.readFile(path.join(__dirname, "./public/indexupdate.json"), (err, data) => {
        if(err) {
          console.log("에러떳음")
        } else {
          const parse = JSON.parse(data);
          for(let y = 0; y < parse.length; y++){
            if(parse[y] === decodeword){
              parse.splice(y, 1);
              newparse = JSON.stringify(parse);
              fs.writeFile("./public/indexupdate.json",`${newparse}`,(err) => {
                if(err){
                  console.error(err);
                } else {
                  newdiv = '';
                  fs.readFile(path.join(__dirname, "./public/indexupdate.json"), (err, data) => {
                    const parse = JSON.parse(data);
                    for(let i = 0; i < parse.length; i++){
                    newdiv += `<div onclick="location.href='./${parse[i]}.html'">${parse[i]}</div>`;
                    }
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
                  });
                }
              });
            }
          }
        }
      })
      });
      res.writeHead(302, { Location: "/" });
      res.end();
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