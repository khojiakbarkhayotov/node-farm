const http = require("http");
const url = require("url");
const fs = require("fs"); // import file system
const replaceTemplate = require("./modules/replaceTemplate");

/////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(
  "./templates/template-overview.html",
  "utf-8"
);
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");
const tempProduct = fs.readFileSync(
  "./templates/template-product.html",
  "utf-8"
);
const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer(function (req, res) {
  const { query, pathname } = url.parse(req.url, true);

  // OVERVIEW
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHTML = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/, cardsHTML);

    res.end(output);

    // PRODUCT page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);

    // NOT FOUND
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "bankai",
    });
    res.end("<h1>The page is not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
