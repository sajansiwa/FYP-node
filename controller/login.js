import jwt from "jsonwebtoken";
import database from "../database/databaseConfig";
import {
  fetchAddress,
  fetchName,
  fetchNumber,
  fetchPP,
  fetchUserQuery,
} from "../database/queries";
const dotenv = require("dotenv");
import bcrypt from "bcrypt";

dotenv.config();

export const loginUser = async (req, res) => {
  const { email_id, password } = req.body;

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
        res.status(401).send("incorrect password");
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
        // const PP = await database.query(fetchPP, [email_id])

        res.status(200).send({
          loggedIn: true,
          name: name.rows[0].name,
          address: address.rows[0].address,
          number: number.rows[0].phone_number,
          // image_name: PP.rows[0].image_name
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
