import database from "../database/databaseConfig";
import {  fetchEmail, updateNumber, fetchNumber } from "../database/queries";

export const changeNum = async (req, res) => {
  try {
    const newNumber = req.body.newNumber;
    const Email = req.body.Email;

    console.log(Email);

    const user = await database.query(fetchEmail, [Email]);
    console.log(user.rows);

    if (user.rows[0].email_id === Email) {
      await database.query(updateNumber, [newNumber, Email]);
      const name = await database.query(fetchNumber, [Email]);
      const updatedNumber = name.rows[0].phone_number;
      res.send({ number: updatedNumber });
    } else {
      res.send("user does not exist");
    }
  } catch (err) {
    console.log(err);
  }
};
