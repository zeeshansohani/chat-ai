import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { resolve } from "path";
export const createToken = (id: string, email: string, expiresIn: string) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.signedCookies["auth_token"] ||
    req.headers["authorization"]?.split(" ")[1];
  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token Expired or Invalid" });
    }
    res.locals.jwtData = decoded;
    next();
  });
};
