import { deleteOneAndSend } from "../utils";

//🚮
//users -------------------------------------------------------------------------
export const deleteUser = async (req, res) => {
  const { username } = req.params;
  const sql = `DELETE FROM users WHERE users.username = '${username}'`;
  await deleteOneAndSend({ req, res, sql });
};

//teachers -------------------------------------------------------------------------
export const deleteTeacher = async (req, res) => {
  const { username } = req.params;
  const sql = `DELETE teachers.* FROM teachers INNER JOIN users ON teachers.userId = users.userId WHERE users.username = '${username}'`;
  await deleteOneAndSend({ req, res, sql });
};
//payers -------------------------------------------------------------------------
export const deletePayer = async (req, res) => {
  const { username } = req.params;
  const sql = `DELETE payers.* FROM payers INNER JOIN users ON payers.userId = users.userId WHERE users.username = '${username}'`;
  await deleteOneAndSend({ req, res, sql });
};

//admins -------------------------------------------------------------------------
export const deleteAdmin = async (req, res) => {
  const { username } = req.params;
  const sql = `DELETE admins.* FROM admins INNER JOIN users ON admins.userId = users.userId WHERE users.username = '${username}'`;
  await deleteOneAndSend({ req, res, sql });
};

//students -------------------------------------------------------------------------
//??

//topics -------------------------------------------------------------------------
export const deleteTopic = async (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM topics WHERE topicId = '${id}'`;
  await deleteOneAndSend({ req, res, sql });
};

//expertises -------------------------------------------------------------------------
export const deleteExpertise = async (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM expertises WHERE expertisesId = '${id}'`;
  await deleteOneAndSend({ req, res, sql });
};
//products -------------------------------------------------------------------------
export const deleteProducts = async (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM products WHERE productId = '${id}'`;
  await deleteOneAndSend({ req, res, sql });
};
//classes -------------------------------------------------------------------------
export const deleteClasses = async (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM classes WHERE classId = '${id}'`;
  await deleteOneAndSend({ req, res, sql });
};
//paerticipations -------------------------------------------------------------------------
export const deleteParticipation = async (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM participation WHERE participationId = '${id}'`;
  await deleteOneAndSend({ req, res, sql });
};

//sessions -------------------------------------------------------------------------
export const deleteSession = async (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM sessions WHERE sessionId = '${id}'`;
  await deleteOneAndSend({ req, res, sql });
};
//feedbacks -------------------------------------------------------------------------
export const deleteFeedback = async (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM feedbacks WHERE feedbackId = '${id}'`;
  await deleteOneAndSend({ req, res, sql });
};
//payementsByPayers -------------------------------------------------------------------------

//PayementsToTeachers -------------------------------------------------------------------------

//withdraws -------------------------------------------------------------------------
