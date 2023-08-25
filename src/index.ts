const express = require("express")
const app = express()
const cors = require('cors')


// base middlewares
app.use(cors());
app.use(express.json());
