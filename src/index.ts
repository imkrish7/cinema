import { app } from "./server.ts"


const PORT = process.env.PORT;

if (!PORT) {
    throw new Error("Please update port number in your environment variable!")
}

app.listen(PORT, () => {
    console.log("Server is running..........!",PORT)
})