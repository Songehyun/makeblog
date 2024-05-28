function loadserver(url, fliepath, req , res){

  const fs = require('fs');
  const path = require('path');

    if (req.url === url){
      fs.readFile(path.join(__dirname, fliepath), (err, data) =>{
        if (err) {
          res.writeHead(500, {"Content-Type": "text/plain"});
          res.end("500 code는 서버 자체의 에러");
          return;
        }
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.end(data);
      });
    } 
};

module.exports = loadserver;


// 예제 코드 : if (req.method === "GET"){loadserver("/", "index.html", req, res);}