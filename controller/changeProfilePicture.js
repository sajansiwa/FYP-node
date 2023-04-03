import database from "../database/databaseConfig";
import { fetchEmail, updatePP, fetchPP } from "../database/queries";

export const changePP = async (req, res) => {
  try {
    const Email = req.params.id;
    const filename = req.file.filename;
    console.log(Email);
    console.log(filename);

    const user = await database.query(fetchEmail, [Email]);

    if (user.rows[0].email_id === Email) {
      await database.query(updatePP, [filename, Email]);
      const newPP = await database.query(fetchPP, [Email]);
      res.send({ profilePicture: newPP.rows[0].image_name });
    } else {
      res.send("user does not exist");
      // await database.query(deleteProfilePictureQuery, [req.params.id])
      // await database.query(updateProfilePictureQuery, [req.params.id, req.files[0].path])
      // res.json({"path":`${req.files[0].path}`})
    }
  } catch (err) {
    console.log(err);
  }
};
