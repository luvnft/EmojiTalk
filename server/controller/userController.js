import OpenAI from "openai";
import * as dotenv from "dotenv";
import userModel from "../models/userModel.js";
import chatModel from "../models/chatModel.js";
import messageModel from "../models/chatModel.js";

const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json({
      number: users.length,
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Erorr" });
  }
};

const createNewUser = async (req, res) => {
  console.log(req.body);

  if (!req.body.userName) {
    res.status(400).json({ error: "Credentials missing" });
    return;
  }
  try {
    const exsistingUser = await userModel.findOne({
      userName: req.body.userName,
    });

    if (exsistingUser) {
      res.status(500).json({ error: "userName already registered" });
      return;
    } else {
      const newUser = new userModel(req.body);
      await newUser.save();
      res.status(200).json({ newUser: newUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Erorr" });
  }
};

export { getAllUser, createNewUser };
