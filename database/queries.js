export const regUserQuery = `insert into users (email_id, name, phone_number, address, password, is_verified) values ($1,$2, $3, $4, $5, $6)`;
export const addToken = `update users set token = $1 where email_id = $2`;
export const fetchUserQuery = `select email_id, password, is_verified from users where email_id = $1`;
export const setVerified = `UPDATE users SET is_verified=true WHERE email_id=$1`;
export const fetchHospitalLocation =
  "select u.name, l.longitude, l.latitude, email_id from  users u inner join hosp_locations l on u.user_id = l.user_id;";
export const fetchName = `select name from users where email_id = $1;`;
export const fetchAddress = `select address from users where email_id = $1;`;
export const fetchNumber = `select phone_number from users where email_id = $1;`;
export const fetchEmail = `select email_id from users where email_id = $1;`;
export const fetchPP =
  "select image_name from profile_pictures where email_id =$1";
export const updateName = "update users set name = $1 where email_id = $2";
export const updateAddress =
  "update users set Address = $1 where email_id = $2";
export const updateNumber =
  "update users set phone_number = $1 where email_id = $2";
export const updatePassword =
  "update users set password = $1 where email_id = $2";
export const updatePP =
  "update profile_pictures set image_name = $1 where email_id = $2";
export const upLoadPPQuery =
  "insert into profile_pictures(email_id, image_name) values ($1, $2)";

export const hospCoordinatesQuery =
  "insert into hosp_locations ( email_id, latitude, longitude) values ( $1, $2, $3)";

export const vUsers = `insert into visited_users (hosp_email, patient_email) values ($1, $2)`;

export const visitedUserDetails = `select name, email_id, phone_number, address, token from users where email_id = $1`;
export const visited_users = `
INSERT INTO visited_users (user_email, hospital_email) values ($1, $2);
SELECT $1 FROM user WHERE user.email = $1;
SELECT $2 FROM hosp_locations WHERE hosp_locations.email = $2;
`;
