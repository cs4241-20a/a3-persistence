module.exports = function (cache) {
  // imports
  const { hashElement } = require("folder-hash"),
    fs = require("fs"),
    sass = require("node-sass"),
    mkdirp = require("mkdirp");

  // custom functions
  this.compileSass = function () {
    function compileSass(files) {
      return new Promise((resolve, reject) => {
        hashElement("./sass").then((hash) => {
          cache.put("sass", hash.hash, (err) => {
            if (err) {
              console.log(err);
            }
            const cssPath = "public/css";
            fs.rmdir(cssPath, { recursive: true }, (err) => {
              if (err) {
                console.log(err);
              }
              mkdirp(cssPath, (err) => {
                if (err) {
                  console.log(err);
                }
                files.every((f) => {
                  sass.render({ file: "sass/" + f }, (err, result) => {
                    if (err) {
                      return reject(err);
                    }
                    fs.writeFile(
                      "public/css/" + f.replace(".scss", ".css"),
                      result.css,
                      (err) => {
                        if (err) {
                          return reject(err);
                        }
                        resolve();
                      }
                    );
                  });
                });
              });
            });
          });
        });
      }).catch(console.error);
    }

    cache.keys(function (err, keys) {
      if (err) {
        console.log(err);
      }
      if (!keys.includes("sass")) {
        compileSass(["main.scss"]).then(() => {
          console.log("Generated css!");
        });
      } else {
        cache.get("sass", function (err, sassHash) {
          hashElement("./sass").then((hash) => {
            if (hash.hash != sassHash) {
              compileSass(["main.scss"]).then(() => {
                console.log("Generated css!");
              });
            }
          });
        });
      }
    });
  };
};
