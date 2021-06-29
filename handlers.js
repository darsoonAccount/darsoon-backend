const {connectToDB} = require('./dbConnector')

const handleGetTest = async (req, res) => {

    const con = await connectToDB();
 
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM customers", function (err, result, fields) {
          if (err) throw err;
          console.log(result);
        });
      });
}

const handlePostTest = async (req, res) => {

    const con = await connectToDB();

    // con.connect(function(err) {
    //     if (err) throw err;
    //     console.log("Connected!");
    // });
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });
}

module.exports = {handleGetTest,
handlePostTest }