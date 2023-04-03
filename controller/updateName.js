
import database from "../database/databaseConfig";
import { fetchName, updateName, fetchEmail } from "../database/queries";

export const changeName = async (req, res) => {
  try {
    const newName = req.body.newName;
    const Email = req.body.Email;

    console.log(Email);

    const user = await database.query(fetchEmail, [Email]);
    console.log(user.rows);

    if (user.rows[0].email_id === Email) {
      await database.query(updateName, [newName, Email]);
      const name = await database.query(fetchName, [Email]);
      const updatedName = name.rows[0].name;
      res.send({ name: updatedName });
    } else {
      res.send("user does not exist");
    }
  } catch (err) {
    console.log(err);
  }
};
