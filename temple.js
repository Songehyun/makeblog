const temple = {
  htmlData: function (title, content) {
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
              <h2 onclick="location.href='./index.html'">${title}</h2>
            </div>
          </div>
          <div>
            <div>
              <pre>${content}</pre>
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

    return htmlData;
  },

  indexData: function (newdiv) {
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
          <h1 onclick="location.href='./index.html'">보드게임 패치노트</h2>
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

    return indexData;
  },

  modifyData: function (motitle, mocontent) {
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
            <h2 onclick="location.href='./index.html'">${motitle}</h2>
          </div>
        </div>
        <div>
          <div>
            <pre>${mocontent}</pre>
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

    return modifyData;
  },
};

module.exports = temple;
