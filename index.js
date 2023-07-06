const http = require("http");

http
  .createServer(function (request, response) {
    console.log(request);

    response.setHeader("Content-Type", "text/html; charset=utf-8;");
    response.statusCode = 200;
    response.end();
  })
  .listen(3000);
