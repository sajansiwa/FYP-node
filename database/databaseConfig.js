import pg from "pg";


const database = new pg.Pool({
  host: "localhost",
  user: "postgres",
  password: "aayush",
  database: "hospital",
});

// database.on('connect', () => {
//   console.log('Database connected successfully!');
// });
database.on("connect", () => { });

export default database;
