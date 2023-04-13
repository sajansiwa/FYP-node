import database from "../database/databaseConfig";
import { visitedUserDetails, vUsers } from "../database/queries";
import { sendPushNotification } from "../helpers/firebase_helper";
const https = require("https");

export const visitedUsers = async (req, res) => {
  try {
    const hosp_email = req.body.hosp_email;
    const patient_email = req.body.patient_email;

    await database.query(vUsers, [hosp_email, patient_email]);
    // const res = await database.query(visitedUserDetails);

    const user = await database.query(visitedUserDetails, [patient_email]);
    const hospital = await database.query(visitedUserDetails, [hosp_email]);
    console.log(hospital);
    await sendPushNotification({
      username: user.rows[0].name,
      token: hospital.rows[0].token,
    });

    res.status(200).send({
      user: hospital,
      success: true,
    });
  } catch (err) {
    res.send(err);
  }
};
