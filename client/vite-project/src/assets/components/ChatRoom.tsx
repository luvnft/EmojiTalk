import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { AnimatePresence, AnimationType, motion } from "motion/react";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa6";

import e from "express";
import { div } from "motion/react-client";

type message = {
  message: string;
  emoji: string;
};

export type NotOKType = {
  error: string;
};

type LoginOkResponse = {
  newUser: User;
};

type MessageOkResponse = {
  newChat: Message;
  user: User;
};

type Message = {
  message: any;
  emoji: string;
  userName: any;
};

type User = {
  userName: any;
  messages: message[];
  _id: string;
};

type errorMessage = {
  error: string;
};

function Intro() {
  let navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null); // 소켓 객체를 useRef로 관리
  const [userCount, setUserCount] = useState<number>(0);
  const [modalSwitch, setModalSwitch] = useState(false);
  const [formattedTime, setFormattedTime] = useState("");
  const [valueInput, setValueInput] = useState<any>("Max.8 words");
  const [messageValue, setMessageValue] = useState<any>("");
  const [newMessage, setNewMessage] = useState<MessageOkResponse | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [turnOn, setTurnOn] = useState(true);
  const [flipped, setFlipped] = useState(false);

  const modalVariants = {
    hidden: { y: -200, rotate: 0, opacity: 0 }, // 초기 위치: 화면 위, 투명
    visible: {
      y: 0,
      rotate: 720, // 두 번 회전 (360 * 2)
      opacity: 1,
      transition: {
        duration: 1.5, // 전체 애니메이션 시간
        ease: "easeInOut", // 부드러운 애니메이션
      },
    },
    exit: {
      y: 200,
      rotate: 1440,
      opacity: 0,
      transition: {
        duration: 1.5, // 전체 애니메이션 시간
        ease: "easeInOut", // 부드러운 애니메이션
      },
    }, // 사라질 때 아래로 이동
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      const hours = String(currentDate.getHours()).padStart(2, "0");
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");
      const seconds = String(currentDate.getSeconds()).padStart(2, "0");

      setFormattedTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTurnOn(true);
  }, [messages]);

  useEffect(() => {
    const checkUser = localStorage.getItem("userId");
    if (checkUser) {
      // localStorage.removeItem
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
    }

    setModalSwitch(true);
  }, []);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3001");
    }

    const socket = socketRef.current;

    const roomName = "globalRoom"; // 방 이름 지정
    socket.emit("joinRoom", roomName);

    // 사용자 수 업데이트 받기
    socket.on("userCount", (count: number) => {
      setUserCount(count);
    });

    socketRef.current.on("showNewMessage", (data) => {
      console.log("뭐라는거야", data);

      setMessages((prevMessages) => {
        return [...prevMessages, data];
      });
    });

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      socket.off("userCount");
      socket.disconnect(); // 소켓 연결 해제
      socketRef.current = null; // 소켓 참조 해제
    };
  }, []);

  const clickModalInput = () => {
    setValueInput("");
  };

  const handleInputValue = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueInput(e.target.value);
  };

  const createNewUser = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("userName", valueInput);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        "http://localhost:3001/api/user/newUser",
        requestOptions
      );

      // 응답 상태 확인
      if (!response.ok) {
        const result = (await response.json()) as NotOKType;
        console.log("something went wrong", result);
      }

      if (response.ok) {
        const result = (await response.json()) as LoginOkResponse;
        setValueInput("");
        console.log(result);
        setModalSwitch(!modalSwitch);

        localStorage.setItem("userName", valueInput);
        localStorage.setItem("userId", result.newUser._id);
      }
    } catch (error) {
      // console.error("Error:", error.message);
      console.log(error);
      const { message } = error as Error;
      console.log(message);
    }
  };

  // console.log(valueInput);
  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageValue(e.target.value);
  };

  const sendMessage = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("userPrompt", messageValue);

    const userName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");
    console.log("userId>>", userName);

    if (userName && userId) {
      urlencoded.append("userName", userName);
      urlencoded.append("userId", userId);
    }

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        "http://localhost:3001/api/chat/newChat",
        requestOptions
      );

      if (!response.ok) {
        const result = (await response.json()) as NotOKType;
        console.log("something went wrong", result);
        setErrorMessage(result.error);
      }

      if (response.ok) {
        const result = (await response.json()) as MessageOkResponse;
        setNewMessage(result);
        console.log(result);
        const roomName = "globalRoom"; // 현재 방 이름

        if (socketRef.current) {
          console.log("쏘켓실행됨");
          const newMessageToSocket = {
            userName: result.newChat.userName,
            message: result.newChat.message,
            emoji: result.newChat.emoji,
            roomName,
          };

          setMessageValue("");

          socketRef.current.emit("sendNewMessage", newMessageToSocket);

          return () => {
            if (socketRef.current) {
              socketRef.current.disconnect();
            }
          };
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showModal = () => {
    const existsUser = localStorage.getItem("userName"); //자료꺼내는법
    console.log(existsUser);
    if (!existsUser) {
      setModalSwitch(!modalSwitch);
    }
  };

  return (
    <>
      <div className="chatRoom">
        <div className="chatTop">
          <div>
            <p>{formattedTime}</p>
          </div>

          <div className="online">{userCount} online</div>

          <div className="show">Emoji Talk</div>

          <div>About</div>
        </div>

        <div className="messageContainer">
          {messages &&
            messages.map((item, index) => (
              <div key={index} className="messages  messagesInChat">
                <motion.div
                  initial={{ y: 200, scale: 0.5 }}
                  animate={{
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.14, // 전체 애니메이션 시간
                      ease: "easeInOut", // 부드러운 애니메이션
                    },
                  }}
                  className="message"
                  style={{ transformOrigin: "left" }} // 애니메이션 중심 변경
                >
                  <motion.p
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{
                      delay: 1, // 1초 후 애니메이션 시작
                      duration: 0.5, // opacity가 0으로 가는 시간
                    }}
                  >
                    {item.message}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 1, // 1초 후 애니메이션 시작
                      duration: 0.5, // opacity가 1로 가는 시간
                    }}
                  >
                    {item.emoji}
                  </motion.p>
                </motion.div>

                <p className="message userName">{item.userName}</p>
              </div>
            ))}
        </div>
        <div className="chatBottom">
          <input
            type="text"
            onClick={showModal}
            onChange={handleChangeMessage}
          />
          <button
            className="sendBtn"
            onClick={() => {
              sendMessage();
            }}
          >
            <FaArrowUp style={{ color: "white" }} />
          </button>
        </div>
        {/* 
        <button
          onClick={() => {
            setFlipped(!flipped);
            console.log("click");
          }}
          style={{
            width: "100px",
            marginTop: "10vh",
            zIndex: "99",
          }}
        >
          ?
        </button> */}

        {/* <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: flipped ? 180 : 0 }} // 상태에 따라 회전
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          style={{
            width: "150px",
            height: "150px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: "20px",
            transformStyle: "preserve-3d", // 3D 회전 유지
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "45px",
              height: "45px",
              backgroundColor: "blue",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
              backfaceVisibility: "hidden", // 뒤집힌 상태에서 숨김
            }}
          >
            Front
          </div>

          <div
            style={{
              position: "absolute",
              width: "45px",
              height: "45px",
              backgroundColor: "red",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
              backfaceVisibility: "hidden", 
              transform: "rotateY(180deg)",
            }}
          >
            Back
          </div>
        </motion.div> */}
      </div>
      {/* <div className="box2">
        <div className="messageContainer">
          {messages &&
            messages.map((item, index) => (
              <div key={index} className="messages prompt messagesInChat">
                <p className="message">{item.message}</p>
                <p className="message userName">{item.userName}</p>{" "}
              </div>
            ))}
        </div>
      </div> */}
      <AnimatePresence>
        {modalSwitch && (
          <div className="modalContainer">
            <motion.div
              className="modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }} // exit 애니메이션 지속 시간 설정
            >
              <div>Enter username</div>
              <div className="modalBottom">
                <input
                  type="text"
                  value={valueInput}
                  onChange={handleInputValue}
                  onClick={clickModalInput}
                />
                <button className="modalBtn" onClick={createNewUser}>
                  OK
                  {/* <FaArrowRightLong style={{ color: "#f2e1e177" }} /> */}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Intro;
