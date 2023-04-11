import database from "../database/databaseConfig";
import {
  addToken,
  fetchEmail,
  fetchUserQuery,
  regUserQuery,
  setVerified,
  updatePassword,
} from "../database/queries";
import { mailer, passwordMailer } from "./mailer";
import { sms } from "./sms";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

    const isVerified = (await database.query(fetchUserQuery, [email])).rows[0]
      .is_verified;

    console.log(`user verification status ${isVerified}`);
    if (isVerified == undefined || isVerified == null || isVerified == false) {
      const token = jwt.sign({ email: { email } }, process.env.SECRET_KEY, {
        expiresIn: 50 * 60,
      });
      mailer(
        req.body.email,
        req.body.name,
        `https://localhost:3000/verify?${token}`
      );
    } else {
      mailer(req.body.email, req.body.name);
    }

    // add fcm token
    await database.query(addToken, [fcmtoken, email]);

    res.status(201).send({
      isRegistered: true,
      message: "Confirmation Email has been sent",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { token } = req.body;
    if (token != null || token != undefined || token !== "") {
      const response = jwt.verify(token, process.env.SECRET_KEY);
      const { email } = response;

      const respo = await database.query(setVerified, [email]);
      res.status(200).send({
        message: "User verified",
      });
    }
  } catch (error) {
    res.status(501).send({
      message: error,
    });
  }
};

export const sendConfirmPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const token = jwt.sign({ email: { email } }, process.env.SECRET_KEY, {
      expiresIn: 50 * 60,
    });
    passwordMailer(email, `https://localhost:3000/password-reset?${token}`);
    console.log(`https://localhost:3000/password-reset?${token}`);
    res.status(200).send({
      message: `Password Reset Email has been sent at ${email}`,
    });
  } catch (error) {
    res.status(501).send({
      message: error,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (token != null || token != undefined || token !== "") {
      const response = jwt.verify(token, process.env.SECRET_KEY);
      const { email } = response;
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      await database.query(updatePassword, [hashedPassword, email]);
      res.status(200).send({
        message: "Passowrd has been reset, Please login",
      });
    } else {
      res.status(501).send({
        message: "Invalid Token, Please try again",
      });
    }
  } catch (error) {
    res.status(501).send({
      message: error,
    });
  }
};
