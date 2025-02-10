import React, { useRef, useEffect } from "react";
import Hammer from "hammerjs";

const DraggableModal = () => {
  const modalRef = useRef(null);

  useEffect(() => {
    const modal = modalRef.current;
    const hammer = new Hammer(modal!);

    let currentX = window.innerWidth / 2 - 150; // 초기 X 위치
    let currentY = window.innerHeight / 2 - 100; // 초기 Y 위치

    hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });

    hammer.on("pan", (event) => {
      const deltaX = event.deltaX;
      const deltaY = event.deltaY;

      const newX = currentX + deltaX;
      const newY = currentY + deltaY;

      // 스타일 직접 변경
      modal.style.transform = `translate(${newX}px, ${newY}px)`;

      // 팬 동작이 끝나면 현재 위치 저장
      hammer.on("panend", () => {
        currentX = newX;
        currentY = newY;
      });
    });

    return () => {
      hammer.destroy();
    };
  }, []);

  return (
    <div
      ref={modalRef}
      className="modal"
      style={{
        position: "absolute",
        transform: `translate(${window.innerWidth / 2 - 150}px, ${
          window.innerHeight / 2 - 100
        }px)`,
      }}
    >
      <div className="modal-header">Draggable Modal</div>
      <div className="modal-body">
        This modal can be dragged using Hammer.js!
      </div>
    </div>
  );
};

export default DraggableModal;
