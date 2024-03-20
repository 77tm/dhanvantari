const fs = require("fs");
const fastcsv = require("fast-csv");

// database connection
const pool = require("./db");

let stream = fs.createReadStream("./data/reviews.csv");
let csvData = [];
let rowCount = 0;

// skip reviews with unclosed quotes
const transform = (row) => {
  const hasUnclosedQuotes = /(^"[^"]*$)|(^'[^']*'$)/.test(row);
  if (hasUnclosedQuotes) {
    return null; // Skip this row
  }
  return row;
};

let csvStream = fastcsv
  // read the csv data
  .parse({ transform })
  .on("data", function (data) {
    // Check for missing values
    if (
      data[0] === "" || // app_id
      data[1] === "" || // app_name
      data[2] === "" || // review_text
      data[2] === null ||
      data[3] === "" || // review_score
      data[3] === null ||
      data[4] === "" || // review_votes
      data[4] === null
    ) {
      return; // Skip this row if any value is missing
    } else {
      csvData.push(data);
    }

    rowCount++;

    // Import about n rows
    if (rowCount >= 200000) {
      stream.unpipe(this);
      this.end();
    } else {
      this.resume();
    }
  })
  .on("error", function (error) {
    console.log("Error: ", error);
    return;
  })
  .on("end", function () {
    // remove the first line: header
    csvData.shift();

    const query =
      "INSERT INTO reviews (app_id, app_name, review_text, review_score, review_votes) VALUES ($1, $2, $3, $4, $5)";

    pool.connect((err, client, done) => {
      if (err) throw err;

      try {
        csvData.forEach((row) => {
          console.log(row);
          client.query(query, row, (err, res) => {
            if (err) {
              console.log("Failed row: ", row);
              console.log(err.stack);
            } else {
              console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        stream.close();
        done();
      }
    });
  });

stream.pipe(csvStream);
