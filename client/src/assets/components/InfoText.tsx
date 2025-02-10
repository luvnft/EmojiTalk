import { motion } from "motion/react";
// import { tr } from "motion/react-client";
// import { auto } from "openai/_shims/registry.mjs";

import { useEffect, useRef, useState } from "react";

function InfoText() {
  const [hide, setHide] = useState<string>("");
  const [showContent, setshowContent] = useState<boolean>(false);
  const [leftEyePosition, setLeftEyePosition] = useState({ x: 0, y: 0 });
  const [rightEyeRotation, setRightEyeRotation] = useState({
    rightX: 0,
    rightY: 0,
  });
  const divRef = useRef<HTMLDivElement | null>(null); // 타입 명시
  const delaySec = 0.7;

  const handleScroll = () => {
    const element = divRef.current;
    if (element) {
      const scrollTop = element.scrollTop; // 스크롤된 위치

      const maxScroll = element.scrollHeight - element.clientHeight; // 최대 스크롤
      // 스크롤 값을 각도로 변환 (0~360도)
      const angle = (scrollTop / maxScroll) * 360;

      // 원형 경로 계산 (반지름 r = 100)
      const radius = 5; // 원하는 원의 반지름
      const radians = (angle * Math.PI) / 180; // 각도를 라디안으로 변환
      const x = radius * Math.cos(radians); // X 좌표
      const y = radius * Math.sin(radians); // Y 좌표

      const RightRadius = 7;
      const rightX = RightRadius * Math.cos(radians);
      const rightY = RightRadius * Math.sin(radians);

      setLeftEyePosition({ x, y }); // 상태 업데이트
      setRightEyeRotation({ rightX, rightY });

      // console.log("보여지는 높이:", clientHeight);
      // console.log("전체 높이:", scrollHeight);
    }
  };

  const hideLoading = () => {
    setTimeout(() => {
      setHide("hide");
      setshowContent(true);
    }, 1900);
  };

  useEffect(() => {
    hideLoading();
  }, []);

  return (
    <div
      ref={divRef}
      onScroll={handleScroll}
      style={{
        overflowY: "auto",
        maxHeight: "100vh",
      }}>
      <div className="info-text info-chat">
        {/* <div className={`loading-container `}> */}
        <div className={`loading-container ${hide}`}>
          <div className="chat-bubble">
            <div className="loading">
              <div className="dot one"></div>
              <div className="dot two"></div>
              <div className="dot three"></div>
            </div>
          </div>
          <div className="tail"></div>
        </div>

        {showContent && (
          <>
            <motion.div
              initial={{ transform: "translateY(40px)" }}
              animate={{ transform: "translateY(0px)" }}
              transition={{ type: "bounce" }}>
              <div
                className="yours messages"
                id="large">
                <div className="message last ">Emoji Talk</div>
              </div>
            </motion.div>

            <motion.div
              style={{
                willChange: "transform", // transform만 변경할 것을 명시
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              // whileHover={{ scale: 1.1 }}
              transition={{
                duration: 0.4, // 애니메이션 지속 시간 (1초)
                ease: "easeOut", // 애니메이션 가속도
                delay: delaySec,
              }}>
              <div className="mine messages">
                <div className="message ">
                  Today, communication extends beyond spoken and written
                  language to include visual and symbolic tools like emojis,
                  which play an increasingly central role in how we connect and
                  express ourselves.
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{
                willChange: "transform", // transform만 변경할 것을 명시
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              // whileHover={{ scale: 1.1 }}
              transition={{
                duration: 0.4, // 애니메이션 지속 시간 (1초)
                ease: "easeOut", // 애니메이션 가속도
                delay: delaySec * 2,
              }}>
              <div className="mine messages">
                <div className="message ">
                  Emojis allow us to send a digital hug{" "}
                  <span className="filter-orange"></span>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{
                willChange: "transform", // transform만 변경할 것을 명시
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              // whileHover={{ scale: 1.1 }}
              transition={{
                duration: 0.4, // 애니메이션 지속 시간 (1초)
                ease: "easeOut", // 애니메이션 가속도
                delay: delaySec * 3,
              }}>
              <div className="mine messages">
                <div className="message ">
                  show support <span className="filter-orange"></span>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{
                willChange: "transform", // transform만 변경할 것을 명시
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              // whileHover={{ scale: 1.1 }}
              transition={{
                duration: 0.4, // 애니메이션 지속 시간 (1초)
                ease: "easeOut", // 애니메이션 가속도
                delay: delaySec * 4,
              }}>
              <div className="mine messages">
                <div className="message last">
                  or convey emotions in a way that is immediate and accessible.{" "}
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{
                willChange: "transform", // transform만 변경할 것을 명시
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              // whileHover={{ scale: 1.1 }}
              transition={{
                duration: 0.4, // 애니메이션 지속 시간 (1초)
                ease: "easeOut", // 애니메이션 가속도
                delay: delaySec * 5,
              }}>
              <div className="mine messages">
                <span id="face-emoji">
                  <span id="face"></span>
                  <span
                    id="left-eye"
                    style={{
                      transform: `translate(${leftEyePosition.x}px, ${leftEyePosition.y}px)`, // 위치 이동
                    }}></span>
                  <span
                    id="right-eye"
                    style={{
                      transform: `translate(${rightEyeRotation.rightY}px, ${rightEyeRotation.rightX}px)`, // 위치 이동
                    }}></span>
                </span>
              </div>
            </motion.div>

            <motion.div
              style={{
                willChange: "transform", // transform만 변경할 것을 명시
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              // whileHover={{ scale: 1.1 }}
              transition={{
                duration: 0.4, // 애니메이션 지속 시간 (1초)
                ease: "easeOut", // 애니메이션 가속도
                delay: delaySec * 6, // 각 메시지마다 0.5초씩 지연
              }}>
              <div className="yours messages">
                <div className="message last">
                  Who decides which emojis are added?
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{
                willChange: "transform", // transform만 변경할 것을 명시
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              // whileHover={{ scale: 1.1 }}
              transition={{
                duration: 0.4, // 애니메이션 지속 시간 (1초)
                ease: "easeOut", // 애니메이션 가속도
                delay: delaySec * 7, // 각 메시지마다 0.5초씩 지연
              }}>
              <div className="mine messages">
                <div className="message ">
                  Each year, no more than about 60 new emojis are added to our
                  keyboards, chosen by a group of 20 people from the Unicode
                  Consortium, mostly white, mostly male, and mostly American
                  engineers in their 50s and 60s.{" "}
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{
                willChange: "transform", // transform만 변경할 것을 명시
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              // whileHover={{ scale: 1.1 }}
              transition={{
                duration: 0.4, // 애니메이션 지속 시간 (1초)
                ease: "easeOut", // 애니메이션 가속도
                delay: delaySec * 8, // 각 메시지마다 0.5초씩 지연
              }}>
              <div className="mine messages">
                <div className="message ">
                  Can emojis transcend cultural and generational barriers to
                  become a truly universal language?
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{
                willChange: "transform", // transform만 변경할 것을 명시
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              // whileHover={{ scale: 1.1 }}
              transition={{
                duration: 0.4, // 애니메이션 지속 시간 (1초)
                ease: "easeOut", // 애니메이션 가속도
                delay: delaySec * 9, // 각 메시지마다 0.5초씩 지연
              }}>
              <div className="mine messages">
                <div className="message ">
                  This project will investigate the governance and broader
                  implications of emojis as a linguistic medium, focusing on
                  three key areas:
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{
                willChange: "transform", // transform만 변경할 것을 명시
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              // whileHover={{ scale: 1.1 }}
              transition={{
                duration: 0.4, // 애니메이션 지속 시간 (1초)
                ease: "easeOut", // 애니메이션 가속도
                delay: delaySec * 10, // 각 메시지마다 0.5초씩 지연
              }}>
              <div className="mine messages">
                <div className="message last">
                  1. Decision-Making and Authority. Who holds the authority to
                  create and approve emojis? How transparent and inclusive are
                  the current institutional and corporate processes? What
                  challenges arise in ensuring fair representation in these
                  decisions?
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{
                willChange: "transform", // transform만 변경할 것을 명시
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              // whileHover={{ scale: 1.1 }}
              transition={{
                duration: 0.4, // 애니메이션 지속 시간 (1초)
                ease: "easeOut", // 애니메이션 가속도
                delay: delaySec * 11, // 각 메시지마다 0.5초씩 지연
              }}>
              <div className="yours messages">
                <div className="message last">
                  1. Decision-Making and Authority. Who holds the authority to
                  create and approve emojis? How transparent and inclusive are
                  the current institutional and corporate processes? What
                  challenges arise in ensuring fair representation in these
                  decisions?
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default InfoText;
