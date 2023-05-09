import app from "./app.js";
import dotenv from "dotenv";
import connectDatabase from "./config/database.js";

// Handling uncought Exception

process.on("uncaughtException", (err) => {
    console.log(`Uncaught Exception: ${err.message}`);
    console.log(`Shout down the server due to unhandle uncought Exception`);
process.exit(1)
})
// Config
dotenv.config({path:"backend/config/config.env"});

// Connecting to database
connectDatabase();
const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is Running on http://localhost:${process.env.PORT}`);
} )

//unhandle promise Rejection

process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shout down the server due to unhandle Promise Rejection`);
server.close(()=>{
    process.exit(1)
})
})