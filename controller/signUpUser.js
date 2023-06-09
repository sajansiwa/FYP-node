import database from "../database/databaseConfig";
import {
  addToken,
  fetchEmail,
  fetchUserQuery,
  hospCoordinatesQuery,
  regUserQuery,
  setVerified,
  updatePassword,
} from "../database/queries";
import { mailer, passwordMailer } from "./mailer";
import { sms } from "./sms";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import axios from "axios";

export const API_KEY = "AIzaSyAQalfFPMsCthe7ace-TGjME0mguUiLfNI";

export const SignUpUser = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Request body is empty");
    }
    const { isHospital } = req.body;
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
      false,
      isHospital,
    ];

    const smsNumber = req.body.phoneNumber.startsWith("977")
      ? req.body.phoneNumber
      : "977" + req.body.phoneNumber;

    console.log(smsNumber);

    sms(smsNumber);

    const registeration = await database.query(regUserQuery, newUser);

    const isVerified = (await database.query(fetchUserQuery, [email])).rows[0]
      .is_verified;

    if (isHospital) {
      const location = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.name}&key=${API_KEY}`
      );
      if (location.data == []) {
        res.status(402).send({
          isRegistered: false,
          message: "Failed to get Location Information",
        });
      } else {
        const loc = location.data.results[0].geometry.location;
        await database.query(hospCoordinatesQuery, [email, loc.lat, loc.lng]);
      }
    }

    console.log(`user verification status ${isVerified}`);
    if (
      (isHospital && isVerified == undefined) ||
      isVerified == null ||
      isVerified == false
    ) {
      const token = jwt.sign({ email: { email } }, process.env.SECRET_KEY, {
        expiresIn: 50 * 60,
      });
      const url = `https://localhost:3000/verify?${token}`;

      mailer(req.body.email, req.body.name, url);
    } else {
      mailer(req.body.email, req.body.name);
    }

    // add fcm token
    await database.query(addToken, [fcmtoken, email]);

    res.status(201).send({
      isRegistered: true,
      message: isHospital
        ? "Confirmation Email has been sent"
        : "Account Created!",
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

      const respo = await database.query(setVerified, [email.email]);
      console.log(respo.rows);
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
    console.log(`http://localhost:3000/password-reset?${token}`);
    passwordMailer(email, `http://localhost:3000/password-reset?${token}`);

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
      console.log(`jwt response is ${response}`);
      const { email } = response;
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      await database.query(updatePassword, [hashedPassword, email.email]);
      res.status(200).send({
        message: "Passowrd has been reset, Please login",
      });
    } else {
      res.status(501).send({
        message: "Invalid Token, Please try again",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({
      message: error,
    });
  }
};
