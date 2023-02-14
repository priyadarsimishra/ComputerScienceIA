import { ApolloServer } from "apollo-server-express";
import { Student } from "./models/Student";
import { Teacher } from "./models/Teacher";
import { createAccessToken, createRefreshToken } from "./utils";
import cors from "cors";
import mongoose from "mongoose";
import typeDefs from "./graphql/typeDefs";
import express from "express";
import resolvers from "./graphql/resolvers/index";
import Auth from "./middleware/Auth";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }: any) => ({ req, res }),
  });

  await createConnectionToMongoDB();

  const app = express();
  app.use(express.json({ limit: "100mb" }));
  //  TODO: remove when testing backend
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(Auth);

  app.get("/", (req, res) => {
    res.send("Welcome to MasterIt API!");
  });

  app.post("/refresh_token", async (req, res) => {
    // console.log(req.body);
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.send({ success: false, accessToken: "" });
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
    } catch (err) {
      console.log(err);
      return res.send({ success: false, accessToken: "" });
    }

    // console.log(payload);

    // token should be valid if there is a payload
    let user;
    if (payload.type === "student") {
      user = await Student.findById(payload.userID);
    } else if (payload.type === "teacher") {
      user = await Teacher.findById(payload.userID);
    }

    if (!user) {
      return res.send({ success: false, accessToken: "" });
    }

    // res.cookie("jid", createRefreshToken(payload.userID, payload.type), {
    //   httpOnly: true,
    //   path: "/refresh_token",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });
    let newRefreshToken = createRefreshToken(payload.userID, payload.type);

    return res.send({
      success: true,
      refreshToken: newRefreshToken,
      accessToken: createAccessToken(payload.userID, payload.type),
    });
  });

  await server.start();

  server.applyMiddleware({
    // middleware needed to have JWT in header
    app,
    cors: false, // TODO: remove when testing backend
  });

  app.listen({ port: 5001 }, () => {
    console.log(`Server ready at http://localhost:5001${server.graphqlPath}`);
  });
};

const createConnectionToMongoDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  console.log("Connected to MongoDB");
};

startServer();
