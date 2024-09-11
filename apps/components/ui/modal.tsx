"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { twJoin } from "tailwind-merge";

interface ModalProps {
  open: boolean;
  children: React.ReactNode;
  onTransitionEnd?: () => void;
  onClose: () => void;
}
const Modal = ({ open, children, onTransitionEnd, onClose }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="modal backdrop:backdrop-blur-sm backdrop:bg-base-100/50"
      onTransitionEnd={onTransitionEnd}
    >
      <div className="modal-box bg-white flex flex-col items-center overflow-hidden">
        {children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose} />
      </form>
    </dialog>,
    document.body
  );
};

Modal.Action = function ModalAction(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={twJoin("modal-action", props.className)}>
      {props.children}
    </div>
  );
};

export default Modal;
