import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import AuthRoute from './routes/AuthRoute.js'
import FriendRoute from './routes/FriendRoute.js'
import ChatRoute from './routes/ChatRoute.js'
import { Strategy as LocalStrategy } from "passport-local";

//dotenv config
dotenv.config();

//Connect To Database
ConnectDB();

//Express
const app = express();
const port = process.env.PORT;

//Cors
import cors from "cors";
import multer from "multer";
app.use(cors());

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  next();
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

//routes
//endpoint for authentication
app.use('/api/v1/auth', AuthRoute);
app.use('/api/v1/friend', FriendRoute);
app.use('/api/v1/chat',ChatRoute)
//Listen to app
app.listen(port, () => {
  console.log(`Server Listening on PORT ${port}`.bgBlue.white);
});
