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

    const user = database.query(visitedUserDetails, patient_email);
    const hospital = database.query(visitedUserDetails, hosp_email);

    await sendPushNotification({
      username: user.name,
      token: hospital.token,
    });

    res.send({
      data: {
        user: user,
      },
    });
  } catch (err) {
    res.send(err);
  }
};
