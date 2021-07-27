import {
  isValid,
  isAllValid,
  addOneAndSend,
  genPK,
  ValidateAddAndSend,
} from "../utils";
//➕📄
//users -------------------------------------------------------------------------
export const addUser = async (req, res) => {
  const { username } = req.params;
  const { firstname, lastname, password, email } = req.body;
  const data = { username, firstname, lastname, password, email };
  const dataPatternArray = [
    ["username", "string"],
    ["firstname", "alpha"],
    ["lastname", "alpha"],
    ["password", "string"],
    ["email", "email"],
  ];
  await ValidateAddAndSend({
    req,
    res,
    entity: "user",
    PKprefix: "usr",
    data,
    dataPatternArray,
  });
};

// export const addUser = async (req, res) => {
//   const { username } = req.params;
//   const { firstname, lastname, password, email } = req.body;

//   const isVaild = isAllValid([
//     { data: username, dataType: "string" },
//     { data: firstname, dataType: "alpha" },
//     { data: lastname, dataType: "alpha" },
//     { data: password, dataType: "string" },
//     { data: email, dataType: "email" },
//   ]);

//   if (!isVaild) {
//     res
//       .status(400)
//       .json({ status: 400, message: "Please provide all required data." });
//     return;
//   }
//   const userId = genPK("usr");
//   const sql = `INSERT INTO users  (userId, username, firstname, lastname, email, password) VALUES ('${userId}', '${username}', '${firstname}' , '${lastname}' , '${email}', '${password}')`;
//   await addOneAndSend({ req, res, sql });
// };

//teachers -------------------------------------------------------------------------
export const addTeacher = async (req, res) => {
  const { username } = req.params;
  const { bio } = req.body;

  const isVaild = isAllValid([]);
  if (!isVaild) {
    res
      .status(400)
      .json({ status: 400, message: "Please provide all required data." });
    return;
  }

  const teacherId = genPK("tch");
  const sql = `INSERT INTO teachers (teacherId, userId) SELECT '${teacherId}', users.userId FROM users WHERE users.username = '${username}'`;
  await addOneAndSend({ req, res, sql });
};

//payers -------------------------------------------------------------------------
export const addPayer = async (req, res) => {
  const { username } = req.params;
  const {} = req.body;

  const isVaild = isAllValid([]);
  if (!isVaild) {
    res
      .status(400)
      .json({ status: 400, message: "Please provide all required data." });
    return;
  }

  const payerId = genPK("pyr");
  const sql = `INSERT INTO payers (payerId, userId, credit) SELECT '${payerId}', users.userId, 0 FROM users WHERE users.username = '${username}'`;
  await addOneAndSend({ req, res, sql });
};

//admins -------------------------------------------------------------------------
export const addAdmin = async (req, res) => {
  const { username } = req.params;
  const {} = req.body;

  const isVaild = isAllValid([]);
  if (!isVaild) {
    res
      .status(400)
      .json({ status: 400, message: "Please provide all required data." });
    return;
  }

  const adminId = genPK("adm");
  const sql = `INSERT INTO admins (adminId, userId, credit) SELECT '${adminId}', users.userId, 0 FROM users WHERE users.username = '${username}'`;
  await addOneAndSend({ req, res, sql });
};
//students -------------------------------------------------------------------------
//?

//topics -------------------------------------------------------------------------
export const addTopic = async (req, res) => {
  const { name, description } = req.body;
  const data = { name, description };
  const dataPatternArray = [
    ["name", "alphanumeric"],
    ["description", "string"],
  ];
  await ValidateAddAndSend({
    req,
    res,
    entity: "topic",
    PKprefix: "tpc",
    data,
    dataPatternArray,
  });
};

//expertises -------------------------------------------------------------------------
export const addExpertise = async (req, res) => {
  const { teacherId, topicId, name, description } = req.body;
  const data = { teacherId, topicId, name, description };
  const dataPatternArray = [
    ["teacherId", "string"],
    ["topicId", "string"],
    ["name", "alphanumeric"],
    ["description", "string"],
  ];
  await ValidateAddAndSend({
    req,
    res,
    entity: "expertise",
    PKprefix: "exp",
    data,
    dataPatternArray,
  });
};

//products -------------------------------------------------------------------------
export const addProduct = async (req, res) => {
  const {
    expertiseId,
    pricePerParticipant,
    startDate,
    endData,
    description,
    extraFamilyMemberCharge,
    isGroupClass,
    maxNumberOfStudents,
    introductionFee,
    sessionDuration,
    numberOfSessions,
  } = req.body;
  const data = {
    expertiseId,
    pricePerParticipant,
    startDate,
    endData,
    description,
    extraFamilyMemberCharge,
    isGroupClass,
    maxNumberOfStudents,
    introductionFee,
    sessionDuration,
    numberOfSessions,
  };
  const dataPatternArray = [
    ["expertiseId", "string"],
    ["pricePerParticipant", "decimal"],
    ["startDate", "data"],
    ["endDate", "data"],
    [description, "string"],
    ["extraFamilyMemberCharge", "int"],
    ["isGroupClass", "boolean"],
    ["maxNumberOfStudents", "int"],
    [introductionFee, "decimal"],
    ["sessionDuration", "int"],
    ["numberOfSessions", "int"],
  ];
};
//classes -------------------------------------------------------------------------

//paerticipations -------------------------------------------------------------------------

//sessions -------------------------------------------------------------------------

//feedbacks -------------------------------------------------------------------------

//payementsByPayers -------------------------------------------------------------------------

//PayementsToTeachers -------------------------------------------------------------------------

//withdraws -------------------------------------------------------------------------
