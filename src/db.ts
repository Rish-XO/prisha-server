import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  password: "rishal@1999",
  host: "localhost",
  port: 5432,
  database: "prisha",
});

export default pool;
