import database from "../database/databaseConfig"
import { fetchEmail,fetchPP, upLoadPPQuery } from "../database/queries";



export const uploadPP = async (req, res) => {
     try {
       const Email = req.params.id;
       const filename = req.file.filename;
    //    console.log(Email);
    //    console.log(filename);

       const user = await database.query(fetchEmail, [Email]);

       if (user.rows[0].email_id === Email) {
         await database.query(upLoadPPQuery, [Email, filename]);
         const newPP = await database.query(fetchPP, [Email]);
         res.send({ profilePicture: newPP.rows[0].image_name });
        //    console.log(newPP.rows)
       } else {
         res.send("user does not exist");
       }
     } catch (err) {
       console.log(err);
     }


}