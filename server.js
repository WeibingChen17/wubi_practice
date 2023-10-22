const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  // Serving index.html, script.js, and styles.css
  const filePath = req.url === "/" ? "/index.html" : req.url;
  const fileExtension = path.extname(filePath).substr(1);
  const contentType =
    {
      html: "text/html",
      css: "text/css",
      js: "application/javascript",
    }[fileExtension] || "text/plain";

  const fullPath = path.join(__dirname, filePath);

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
