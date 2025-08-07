import "dotenv/config"
import dotenv from "dotenv"
import express from "express"

dotenv.config()

const app = express();


const PORT = process.env.PORT;

if (!PORT) {
    throw new Error("Please update port number in your environment variable!")
}


app.listen(PORT, () => {
    console.log("Server is running..........!",PORT)
})