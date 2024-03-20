const fs = require("fs");
const fastcsv = require("fast-csv");

// database connection
const pool = require("./db");

let stream = fs.createReadStream("./data/vgsales.csv");
let csvData = [];

let csvStream = fastcsv
  // read the csv data
  .parse()
  .on("data", function (data) {
    // if year = N/A, set it to 0
    data[3] = data[3] === "N/A" ? 0 : data[3];
    csvData.push(data);
  })
  // all data has been read
  .on("end", function () {
    // remove the first line: header
    csvData.shift();

    const query =
      "INSERT INTO games (rank, name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";

    // connect to the database
    pool.connect((err, client, done) => {
      if (err) throw err;

      // insert data
      try {
        csvData.forEach((row) => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        done();
      }
    });
  });

stream.pipe(csvStream);
