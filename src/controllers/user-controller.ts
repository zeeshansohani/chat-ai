import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";

// Fetch all users
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      message: "OK",
      users,
    });
  } catch (error) {
    return res.status(400).json({
      message: "ERROR",
      cause: error.message,
    });
  }
};

// User signup
export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        message: "This email is already registered. Try again",
      });
    }

    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Clear old cookie if exists
    res.clearCookie("auth_token", {
      path: "/",
      domain: "chat-ai-qiuu.onrender.com", // Updated to match backend domain
      httpOnly: true,
      secure: true, // Set to true since using HTTPS
      signed: true,
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    // Set new cookie
    res.cookie("auth_token", token, {
      path: "/",
      domain: "chat-ai-qiuu.onrender.com", // Updated to match backend domain
      expires,
      httpOnly: true,
      secure: true, // Set to true since using HTTPS
      signed: true,
    });

    return res.status(201).json({
      message: "Account created successfully",
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return res.status(400).json({
      message: "ERROR",
      cause: error.message,
    });
  }
};

// User login
export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "This email is not registered. Try again.",
      });
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({
        message: "Incorrect Password. Try again.",
      });
    }

    // Clear old cookie if exists
    res.clearCookie("auth_token", {
      path: "/",
      domain: "chat-ai-qiuu.onrender.com", // Updated to match backend domain
      httpOnly: true,
      secure: true, // Set to true since using HTTPS
      signed: true,
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    // Set new cookie
    res.cookie("auth_token", token, {
      path: "/",
      domain: "chat-ai-qiuu.onrender.com", // Updated to match backend domain
      expires,
      httpOnly: true,
      secure: true, // Set to true since using HTTPS
      signed: true,
    });

    return res.status(200).json({
      message: "Logged in successfully.",
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return res.status(400).json({
      message: "ERROR",
      cause: error.message,
    });
  }
};

// Verify user
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send({
        message: "This email is not registered or token malfunctioned",
      });
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({
      message: "OK",
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return res.status(400).json({
      message: "ERROR",
      cause: error.message,
    });
  }
};

// User logout
export const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send({
        message: "This email is not registered or token malfunctioned",
      });
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    // Clear the cookie on logout
    res.clearCookie("auth_token", {
      path: "/",
      domain: "chat-ai-qiuu.onrender.com", // Updated to match backend domain
      httpOnly: true,
      secure: true, // Set to true since using HTTPS
      signed: true,
    });

    return res.status(200).json({
      message: "Logged out successfully.",
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return res.status(400).json({
      message: "ERROR",
      cause: error.message,
    });
  }
};
