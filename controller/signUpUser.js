// import bcrypt from "bcrypt";
import bcrypt from "bcrypt";
import database from "../database/databaseConfig";
import { addToken, regUserQuery } from "../database/queries";
import { mailer } from "./mailer";
import { sms } from "./sms";

export const SignUpUser = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Request body is empty");
    }
    const { fcmtoken, email } = req.body;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = [
      req.body.email,
      req.body.name,
      req.body.phoneNumber,
      req.body.address,
      hashedPassword,
    ];

    const smsNumber = req.body.phoneNumber.startsWith("977")
      ? req.body.phoneNumber
      : "977" + req.body.phoneNumber;

    console.log(smsNumber);

    const registeration = await database.query(regUserQuery, newUser);

    mailer(req.body.email, req.body.name);
    sms(smsNumber);

    // add fcm token
    await database.query(addToken, [fcmtoken, email]);

    res.status(201).send({ isRegistered: true });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
