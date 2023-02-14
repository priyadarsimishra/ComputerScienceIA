import jwt from "jsonwebtoken";
import "dotenv";

export const createAccessToken = (id: string, type: string) => {
  return jwt.sign(
    { userID: id, type: type },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "30m",
    }
  );
};

export const createRefreshToken = (id: string, type: string) => {
  return jwt.sign(
    { userID: id, type: type },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
};
