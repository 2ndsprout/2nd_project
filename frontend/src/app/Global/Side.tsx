"use client";
import React, { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  outlineClassName?: string;
  className: string;
  escClose: boolean;
  outlineClose: boolean;
  right?: boolean;
}

const Side = ({ open, onClose, children, outlineClassName, className, escClose, outlineClose }: ModalProps) => {
  useEffect(() => {
    const onWindowKeydown = (e: any) => {
      if (e.key == 'Escape')
        onClose();
    };
    if (escClose) {
      window.addEventListener('keydown', onWindowKeydown);
      return () => window.removeEventListener('keydown', onWindowKeydown);
    }
  }, [escClose]);
  if (!open) return null;
  const portal = ReactDOM.createPortal(
    <>
      <div className={outlineClassName + ' fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30'} onClick={() => { if (outlineClose) onClose(); }} />
      <div className={className + ' fixed p-0 top-0 bg-white z-[5]'}>
        {children}
      </div>
    </>,
    document.getElementById("global-modal") as HTMLElement
  );
  return portal;
};

// <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
//      모달내용
// </Modal>

// const Modal = ({ open, onClose, children }: ModalProps) => {
//   if (!open) return null;
//   return ReactDOM.createPortal(
//     <>
//       <div className={styles.overlayStyle} />
//       <div className={styles.modalStyle}>
//         <button onClick={onClose}>닫기</button>
//         {children}
//       </div>
//     </>,
//     document.getElementById("global-modal") as HTMLElement
//   );
// };

export default Side;