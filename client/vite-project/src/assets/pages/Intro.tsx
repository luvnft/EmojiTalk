import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import InfoText from "../components/InfoText";
import ChatRoom from "../components/ChatRoom";
import { Socket, io } from "socket.io-client";
import DraggableModal from "../components/DraggableModal";

function Intro() {
  let navigate = useNavigate();

  // const [userCount, setUserCount] = useState<number>(0);

  const [message, setMessage] = useState("");

  console.log("2");

  return (
    <>
      {/* <DraggableModal /> */}
      <div className="container">
        <ChatRoom />
      </div>
    </>
  );
}

export default Intro;
