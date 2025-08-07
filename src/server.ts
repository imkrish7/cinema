import "dotenv/config"
import dotenv from "dotenv"
import express from "express"

import { router as bookingRouter } from "./routes/booking/index.ts";
import { router as theaterRouter } from "./routes/theatre/index.ts";


dotenv.config()

const app = express();

app.use(express.json())

app.use("/cinema", theaterRouter)
app.use("/cinema", bookingRouter)

export {app};

