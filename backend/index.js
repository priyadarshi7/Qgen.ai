require("dotenv").config
//Imports
const express = require("express");
const cors = require("cors");

//other imports
const {connectDB} = require("./connection/connectDB")
const pdfRouter = require("./routes/pdf.routes"); 
const userRouter = require("./routes/user.routes");
const quizRouter = require("./routes/quiz.routes");

//ConnectDB
connectDB("mongodb://127.0.0.1:27017/qgen", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>console.log("MongoDB connected"));


const app = express();

//middlewares
app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST"],
}))
app.use(express.json());
app.use("/pdf",pdfRouter);
app.use("/user", userRouter);
app.use("/quiz",quizRouter)

//Server Start
const PORT = 8000;
app.listen(PORT, ()=> console.log(`Server started at PORT: ${PORT}`));