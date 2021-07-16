const { connectToDB } = require("./dbConnector");

const handleGetTest = async (req, res) => {
  const con = await connectToDB();

  con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM customers", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
};

const handlePostTest = async (req, res) => {
  const con = await connectToDB();

  // con.connect(function(err) {
  //     if (err) throw err;
  //     console.log("Connected!");
  // });
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql =
      "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
};

const  getTeachers = async (req, res) => {
  const con = await connectToDB();

  con.connect((err) => {
    if (err) throw err;
    con.query("SELECT * FROM teachers INNER JOIN users ON teachers.userId=users.userId", (err, result, fields) => {
      if (err) throw err;

      // console.log('RRRRRRRRRRResult', result[3]);
      res.status(200).json(result);
    });
  });
};

const getOneTeacher = async (req, res) => {
  console.log("fake get one teacher");
};

const updateTeacher = async (req, res) => {
  console.log("fake update teacher");
};

const deleteTeacher = async (req, res) => {
  console.log("fake delete teacher");
};

const addTeacher = async (req, res) => {
  console.log("fake add teacher");
};

module.exports = {
  handleGetTest,
  handlePostTest,
  getTeachers,
  getOneTeacher,
  updateTeacher,
  deleteTeacher,
  addTeacher,
};
