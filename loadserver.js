const flieUtils = {
  getFliePath: function(url) {
    let fliePath;
    if(url === "/") {
      fliePath = "./public/index.html";
    } else {
      fliePath = "./public" + url;
    }
    return fliePath;
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


// let fliePath = flieUtils.getFliePath(req.url)
// let ext = flieUtils.getFlieExtension(fliePath)
// let contype = flieUtils.getContentType(ext)