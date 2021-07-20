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

const getTeachers = async (req, res) => {
  const con = await connectToDB();

  con.connect((err) => {
    if (err) throw err;
    con.query(
      "SELECT * FROM teachers INNER JOIN users ON teachers.userId=users.userId",
      (err, result, fields) => {
        if (err) throw err;

        res.status(200).json({ data: result });
      }
    );
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
  console.log("HEREEEE?");

  //validate data
  const { firstname, lastname, password, email } = req.body;
  if (!firstname || !lastname || !password || !email) {
    res
      .status(400)
      .json({ status: 400, message: "Please provide all required data." });
  }

  const userId = genPK('user');
  const teacherId = "teacherId-" + Math.floor(Math.random() * 1000000000);

  //insert data
  const con = await connectToDB();
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    let sql1 = `INSERT INTO users (userId, firstName, lastName, email, password, role) VALUES ('${userId}', '${firstname}' , '${lastname}' , '${email}', '${password}' , 'teacher')`;
    con.query(sql1, function (err, result) {
      if (err) {
        throw err; //should be changed to sending error discription
        res
          .status(500)
          .json({ status: 500, message: "something went wrong. try again." });
      }
    });
    let sql2 = `INSERT INTO teachers (teacherId, userId) VALUES ('${teacherId}', '${userId}')`;
    con.query(sql2, function (err, result) {
      if (err) {
        res
          .status(500)
          .json({ status: 500, message: "something went wrong. try again." });
        throw err; //should be changed to sending error discription
      }
      res
        .status(200)
        .json({ status: 201, message: "teacher added", data: req.body });
    });
  });

  //send result
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
