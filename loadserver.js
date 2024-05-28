const flieUtils = {
  getFliePath: function(url) {
    let fliePath;
    if(url === "/") {
      fliePath = "./public/index.html";
    } else {
      fliePath = "./public" + url;
    }
    return decodeURI(fliePath);
  },
  getFlieExtension: function(fliePath){
    const path = require('path');
    let ext = path.extname(fliePath);
    return ext.toLowerCase();
  },
  getContentType: function(ext){
    const mimeType = {
      ".html" : "text/html; charset=utf-8",
      ".css" : "text/css",
      ".js" : "application/javascript",
      ".json" : "application/json",
      ".ico" : "image/x-icon"
    };
    
    if (mimeType.hasOwnProperty(ext)){
      return mimeType[ext];
    } else {
      return "text/plain";
    }
  }
};


module.exports = flieUtils;


// if (req.method === "GET"){
//   let url = req.url
//   let filePath = flieUtils.getFliePath(url)
//   let ext = flieUtils.getFlieExtension(filePath)
//   let contype = flieUtils.getContentType(ext)
  
//   if(req.url === url){
//     console.log(req.url);
//     fs.readFile(filePath,(err,data)=>{
//       if(err){
//         res.writeHead(500,{"Content-Type":"text/plain; charset=UTF-8"});
//         res.end("서버 연결 오류");
//         return;
//       } else {
//         res.writeHead(200,{"Content-Type": contype});
//         res.end(data);
//       }
//     })
//   }
// }