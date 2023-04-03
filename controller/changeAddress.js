import database from "../database/databaseConfig";
import {fetchAddress, fetchEmail, updateAddress,  } from "../database/queries";

export const changeAdd = async (req, res) => {
  try {
    const newAdddress = req.body.newAdddress;
    const Email = req.body.Email;

    console.log(Email);

    const user = await database.query(fetchEmail, [Email]);
    console.log(user.rows);

    if (user.rows[0].email_id === Email) {
      await database.query(updateAddress, [newAdddress, Email]);
      const name = await database.query(fetchAddress, [Email]);
      const updatedAddress = name.rows[0].address;
      res.send({ address: updatedAddress });
    } else {
      res.send("user does not exist");
    }
  } catch (err) {
    console.log(err);
  }
};
