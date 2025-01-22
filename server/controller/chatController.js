import OpenAI from "openai";
import * as dotenv from "dotenv";
import messageModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const translate = async (req, res) => {
  //   console.log(req.body);
  const text = req.body.userPrompt;
  const userName = req.body.userName;
  const userId = req.body.userId;
  // const userPrompt = `Translate the phrase ${text}, just use emojis`;

  const userPrompt = `Translate the phrase into emojis: ${text}, just use emojis`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      // model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.2,
    });

    console.log(response.choices[0].message.content);

    const emoji = response.choices[0].message.content;

    const newChatMessage = {
      userName: userName,
      userId: userId,
      message: text,
      emoji: emoji,
    };

    const newChat = new messageModel(newChatMessage);
    await newChat.save();
    console.log(newChat._id);

    const user = await userModel
      .findByIdAndUpdate(
        userId,
        {
          $push: { chat: newChat._id },
        },
        { new: true }
      )
      .populate("chat");

    const updatedUser = await user.save();

    // console.log(updatedUser); // 업데이트된 사용자 정보와 채팅 데이터 포함

    res.status(200).json({
      newChat: newChat,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getAllChats = async (req, res) => {
  try {
    const messages = await messageModel.find({});
    res.status(200).json({
      messages: messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Erorr" });
  }
};

export { translate, getAllChats };
