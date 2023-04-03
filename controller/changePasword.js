import bcrypt from "bcrypt";
import database from "../database/databaseConfig";
import { fetchEmail, updatePassword } from "../database/queries";

export const changePass = async (req, res) => {
  try {
    const newPassword = req.body.newPassword;
    const Email = req.body.Email;

    console.log(Email);

    const user = await database.query(fetchEmail, [Email]);
    console.log(user.rows);

      if (user.rows[0].email_id === Email) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(
            newPassword,
            salt
        );
        await database.query(updatePassword, [hashedPassword, Email]);
        res.send("new password is set");
      } else {
      res.send("user does not exist");
    }
  } catch (err) {
    res.send(err);
  }
};
