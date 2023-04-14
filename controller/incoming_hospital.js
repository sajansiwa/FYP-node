import database from "../database/databaseConfig";
import {
  incomingQuery,
  markAsCompletedQuery,
  vUsers,
} from "../database/queries";

export const incomingHospital = async (req, res) => {
  const { hospital_email, user_email } = req.body;
  try {
    const response = await database.query(vUsers, [hospital_email, user_email]);
    res.status(200).send({
      message: "Incoming Patient",
    });
  } catch (error) {
    res.status(400).send({
      message: "unknow error",
    });
  }
};

export const incoming = async (req, res) => {
  try {
    const { email } = req.query;
    console.log(req.query);
    const response = await database.query(incomingQuery, [email]);
    res.send(response.rows);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
export const markAsCompleted = async (req, res) => {
  try {
    const { id } = req.body;
    await database.query(markAsCompletedQuery, [id]);
    res.send({
      message: "Updated",
    });
  } catch (error) {
    res.send(error);
  }
};
