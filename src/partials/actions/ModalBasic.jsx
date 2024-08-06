import React, { useRef, useEffect } from "react";
import Transition from "../../utils/Transition";

function ModalBasic({ children, id, title, modalOpen, setModalOpen, click }) {
  const modalContent = useRef(null);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (modalOpen && !modalContent.current.contains(target)) {
        setModalOpen(false);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [modalOpen, setModalOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (modalOpen && keyCode === 27) {
        setModalOpen(false);
      }
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [modalOpen, setModalOpen]);

  return (
    <>
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className="bg-white p-3 rounded shadow-lg overflow-auto max-w-lg w-full max-h-full"
        >
          <div className="px-5 py-3 ">
            <div className="flex justify-between items-center">
              <div className="font-bold text-lg text-blue-900">{title}</div>
              <button
                className="text-blue-900 hover:text-blue-950"
                onClick={() => {
                  setModalOpen(false);
                  click();
                }}
              >
                <div className="sr-only">Close</div>
                <svg className="w-4 h-4 fill-current">
                  <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                </svg>
              </button>
            </div>
          </div>
          {children}
        </div>
      </Transition>
    </>
  );
}

export default ModalBasic;
