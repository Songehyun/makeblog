const http = require("http");
const fs = require("fs");
const path = require("path");
const flieUtils = require("./loadserver.js");
const temple = require("./temple.js");

// newdiv = index.html의 내용을 업데이트 하기 위한 변수, decode 두개 = 수정시 필요한 referer데이터를 받기 위한 변수
let newdiv = "";
let decoderefer = "";
let decodeword = "";

// indexupdate.json 의 내용을 newdiv에 저장
fs.readFile(path.join(__dirname, "./public/indexupdate.json"), (err, data) => {
  if (err) {
    console.log("에러");
  } else {
    const parse = JSON.parse(data);
    for (let i = 0; i < parse.length; i++) {
      newdiv += `<div onclick="location.href='./${parse[i]}.html'">${parse[i]}</div>`;
    }
  }
});

// loadserver.js 모듈을 사용해서 서버를 불러오기 어떤 파일이든 Get에서 요청하는것을 보여줌
const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    let url = req.url;
    let filePath = flieUtils.getFliePath(url);
    let ext = flieUtils.getFlieExtension(filePath);
    let contype = flieUtils.getContentType(ext);

    if (req.url === url) {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain; charset=UTF-8" });
          res.end("서버 연결 오류");
          return;
        } else {
          res.writeHead(200, { "Content-Type": contype });
          res.end(data);
        }
      });
    }
    // 메서드가 POST일 경우
  } else if (req.method === "POST") {
    //submit 버튼은 writenote.html의 글쓰기 버튼에 있음
    if (req.url === "/submit") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const parsedData = new URLSearchParams(body);
        // wirtenote의 제목과 내용을 읽어서 사용하기 위해 변수에 담아준다
        const writetitle = parsedData.get("writetitle");
        const writecontent = parsedData.get("writecontent");
        // 템플릿 모듈을 사용해서 htmlData에 들어갈 부분을 만듬
        const htmlData = temple.htmlData(writetitle, writecontent);
        // newdiv에 담긴 내용으로 index.html의 NoteTitle의 자식 요소를 바꿔줌
        newdiv += `<div onclick="location.href='./${writetitle}.html'">${writetitle}</div>`;
        const indexData = temple.indexData(newdiv);
        fs.readFile(
          path.join(__dirname, "./public/indexupdate.json"),
          (err, data) => {
            if (err) {
              console.log("오류");
            } else {
              const parse = JSON.parse(data);
              //제목을 저장해서 stringify해줌
              parse.push(writetitle);
              const jparse = JSON.stringify(parse);
              // 저장된 제목들을 indexupdate.json에 담아준다.
              fs.writeFile(
                path.join(__dirname, "./public/indexupdate.json"),
                jparse,
                (err) => {
                  if (err) {
                    console.log("오류");
                  }
                }
              );
            }
          }
        );
        // 저장된 indexData로 index.html 업데이트
        fs.writeFile(
          path.join(__dirname, "./public/index.html"),
          indexData,
          (err) => {
            if (err) {
              console.log("오류");
            }
          }
        );
        // submit에서 받아온 제목으로 제목.html 파일을 만듦
        fs.writeFile(
          path.join(__dirname, `./public/${writetitle}.html`),
          htmlData,
          (err) => {
            if (err) {
              res.writeHead(500, {
                "Content-Type": "text/plain; charset=utf-8",
              });
              res.end("서버 자체 에러");
              return;
            }
            res.writeHead(302, { Location: "/" });
            res.end();
          }
        );
      });
    } else if (req.url === "/modifywrite") {
      let allrefer = req.headers.referer;
      let sprefer = allrefer.split("/")[3];
      let wordrefer = sprefer.split(".")[0];
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
        const modifyData = temple.modifyData(modifytitle, modifycontent);
        const modifypath = path.join(__dirname, "public");
        fs.readdir(path.join(__dirname, "public"), (err, data) => {
          for (let i = 0; i < data.length; i++) {
            if (data[i] === decoderefer) {
              fs.unlink(`${modifypath}/${decoderefer}`, (err) => {
                if (err) {
                  console.log("삭제못함");
                }
              });
              fs.writeFile(
                `${modifypath}/${modifytitle}.html`,
                modifyData,
                (err) => {
                  if (err) {
                    console.log("생성못함");
                  }
                }
              );
            }
          }
        });
        fs.readFile(
          path.join(__dirname, "./public/indexupdate.json"),
          (err, data) => {
            if (err) {
              console.log("에러떳음");
            } else {
              const parse = JSON.parse(data);
              for (let y = 0; y < parse.length; y++) {
                if (parse[y] === decodeword) {
                  parse.splice(y, 1, modifytitle);
                  newparse = JSON.stringify(parse);
                  fs.writeFile(
                    "./public/indexupdate.json",
                    `${newparse}`,
                    (err) => {
                      if (err) {
                        console.error(err);
                      } else {
                        newdiv = "";
                        fs.readFile(
                          path.join(__dirname, "./public/indexupdate.json"),
                          (err, data) => {
                            const parse = JSON.parse(data);
                            for (let i = 0; i < parse.length; i++) {
                              newdiv += `<div onclick="location.href='./${parse[i]}.html'">${parse[i]}</div>`;
                            }
                            const indexData = temple.indexData(newdiv);

                            fs.writeFile(
                              path.join(__dirname, "./public/index.html"),
                              indexData,
                              (err) => {
                                if (err) {
                                  console.log("오류");
                                }
                              }
                            );
                          }
                        );
                      }
                    }
                  );
                }
              }
            }
          }
        );
      });
      res.writeHead(302, { Location: "/" });
      res.end();
    } else if (req.url === "/delete") {
      const deletepath = path.join(__dirname, "./public");
      let allrefer = req.headers.referer;
      let sprefer = allrefer.split("/")[3];
      let wordrefer = sprefer.split(".")[0];
      let decoderefer = decodeURI(sprefer);
      let decodeword = decodeURI(wordrefer);
      fs.readdir(path.join(__dirname, "./public"), (err, data) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i] === decoderefer) {
            fs.unlink(`${deletepath}/${decoderefer}`, (err) => {
              if (err) {
                console.log("삭제못함");
              }
            });
          }
        }
        fs.readFile(
          path.join(__dirname, "./public/indexupdate.json"),
          (err, data) => {
            if (err) {
              console.log("에러떳음");
            } else {
              const parse = JSON.parse(data);
              for (let y = 0; y < parse.length; y++) {
                if (parse[y] === decodeword) {
                  parse.splice(y, 1);
                  newparse = JSON.stringify(parse);
                  fs.writeFile(
                    "./public/indexupdate.json",
                    `${newparse}`,
                    (err) => {
                      if (err) {
                        console.error(err);
                      } else {
                        newdiv = "";
                        fs.readFile(
                          path.join(__dirname, "./public/indexupdate.json"),
                          (err, data) => {
                            const parse = JSON.parse(data);
                            for (let i = 0; i < parse.length; i++) {
                              newdiv += `<div onclick="location.href='./${parse[i]}.html'">${parse[i]}</div>`;
                            }
                            const indexData = temple.indexData(newdiv);
                            fs.writeFile(
                              path.join(__dirname, "./public/index.html"),
                              indexData,
                              (err) => {
                                if (err) {
                                  console.log("오류");
                                }
                              }
                            );
                          }
                        );
                      }
                    }
                  );
                }
              }
            }
          }
        );
      });
      res.writeHead(302, { Location: "/" });
      res.end();
    } else {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 code는 페이지를 찾을 수 없음");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 code는 페이지를 찾을 수 없음");
  }
});
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
