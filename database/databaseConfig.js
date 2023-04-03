import pg from "pg";


const database = new pg.Pool({
  host: "localhost",
  user: "postgres",
  password: "super",
  database: "hospNavigation",
});

// database.on('connect', () => {
//   console.log('Database connected successfully!');
// });
database.on("connect", () => { });

export default database;
