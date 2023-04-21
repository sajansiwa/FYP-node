import jwt from "jsonwebtoken";
import database from "../database/databaseConfig";
import {
  addToken,
  fetchAddress,
  fetchName,
  fetchNumber,
  fetchPP,
  fetchUserQuery,
  updateAddress,
  updateName,
  updateNumber,
  updatePassword,
  updateProfileQuery,
  userInfo,
  userPassword,
} from "../database/queries";
const dotenv = require("dotenv");
import bcrypt from "bcrypt";
const cloudinary = require("cloudinary").v2;

dotenv.config();

cloudinary.config({
  cloud_name: "dxpp5arsp",
  api_key: "942432824667949",
  api_secret: "6ezdDZwefz9SXyXYh-vacYpuTSE",
});

export const loginUser = async (req, res) => {
  const { email_id, password, fcmtoken } = req.body;

  try {
    //checking if the user exists in the database
    const users = await database.query(fetchUserQuery, [email_id]);

    if (users.rows[0].email_id === !email_id || email_id === "") {
      res.status(401);
    } else {
      const hashedPassword = users.rows[0].password;

      const passwordVerification = await comparePassword(
        password,
        hashedPassword
      );

      if (!passwordVerification) {
        res.status(401).send({
          message: "Invalid Password",
        });
      } else {
        const token = jwt.sign(
          { email_id: { email_id } },
          process.env.SECRET_KEY,
          {
            expiresIn: "86400s",
          }
        );

        res.cookie("accessToken", token, {
          httpOnly: true,
          secure: true,
          maxAge: 86400000,
        });
        const name = await database.query(fetchName, [email_id]);
        const address = await database.query(fetchAddress, [email_id]);
        const number = await database.query(fetchNumber, [email_id]);
        const user = (await database.query(userInfo, [email_id])).rows[0];
        // const PP = await database.query(fetchPP, [email_id])
        const isUserVerified = (
          await database.query(fetchUserQuery, [email_id])
        ).rows[0].is_verified;

        // add fcm token
        await database.query(addToken, [fcmtoken, email_id]);

        res.status(200).send({
          loggedIn: true,
          name: name.rows[0].name,
          address: address.rows[0].address,
          number: number.rows[0].phone_number,
          image: user.image,
          email_id,
          user,

          // image_name: PP.rows[0].image_name
          isUserVerified,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const comparePassword = async (plaintextPassword, hash) => {
  return await bcrypt.compare(plaintextPassword, hash);
};

export const userProfile = async (req, res) => {
  const { email } = req.query;
  try {
    const response = await database.query(userInfo, [email]);
    res.status(200).send(response.rows[0]);
  } catch (error) {
    res.status(401).send({
      error: error,
    });
  }
};
export const updateUserProfile = async (req, res) => {
  const { name, address, phoneNumber, email } = req.body;
  // const { image } = req.file;
  try {
    console.log(name);
    await database.query(updateName, [name, email]);
    await database.query(updateAddress, [address, email]);
    await database.query(updateNumber, [phoneNumber, email]);
    const response = await database.query(userInfo, [email]);
    res.status(200).send(response.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(401).send({
      error: error,
    });
  }
};

export const updateUserPassword = async (req, res) => {
  const { currentPassword, password, email } = req.body;
  try {
    // compare password
    // if verified then
    // hash password
    const userPass = (await database.query(userPassword, [email])).rows[0]
      .password;

    const isPasswordCorrect = await comparePassword(currentPassword, userPass);
    if (isPasswordCorrect) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const currentHashedPassword = await bcrypt.hash(password, salt);
      await database.query(updatePassword, [currentHashedPassword, email]);
      res.status(200).send({
        message: "Password Updated",
      });
    } else {
      res.status(404).send({
        message: "Incorrect Current Passowrd",
      });
    }
    console.log(password);
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "Failed to Update Password",
      error,
    });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const file = req.file;
    const { email } = req.body;
    const response = await cloudinary.uploader.upload(file.path);
    console.log(response);
    await database.query(updateProfileQuery, [response.url, email]);
    res.status(200).send({
      message: "Image Uploaded",
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "Image Failed to Uploaded",
      error,
    });
  }
};
