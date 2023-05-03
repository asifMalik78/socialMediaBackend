import { config } from "dotenv";
import express from "express";
import cors from "cors";
import db from "./database/connectDB.js";
import auth from "./routes/auth.js";
import user from "./routes/user.js";
import post from "./routes/post.js";
import comment from "./routes/comment.js";
import errorHandler from "./middlewares/errorHandler.js";
import { APP_PORT, MONGO_URI, ORIGIN } from "./config/index.js";

// basic setup
config();
const app = express();

const corsOptions = {
  origin:"https://fluffy-blancmange-e9fcc0.netlify.app",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/post", post);
app.use("/api/comment", comment);

// error handling
app.use(errorHandler);

// server start
const port = APP_PORT || 5001;
db(MONGO_URI)
  .then(async () => {
    try {
      await app.listen(port);
      console.log(`Server is Running on Port: ${port}`);
    } catch (error) {
      console.log("Error in Connecting to the Server");
    }
  })
  .catch((err) => {
    console.log("Invalid Connection ...");
  });
