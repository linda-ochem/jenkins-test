import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Transition from "../utils/Transition";

import UserAvatar from "../images/avatar.png";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../redux/auth/auth.actions";

function DropdownProfile({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.auth?.user?.data?.data?.fullName);
  const adminRole = useSelector(
    (state) => state.auth?.user?.data?.data?.roleId
  );
  const adminPhoto = useSelector(
    (state) => state.auth?.user?.data?.data?.profilePicture
  );

  // console.log(adminPhoto)

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <img
          className="w-8 h-8 rounded-full"
          src={adminPhoto ? adminPhoto : UserAvatar}
          width="32"
          height="32"
          alt="User"
        />
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium group-hover:text-slate-800">
            {admin}
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200">
            <div className="font-medium text-slate-800">
              Vesti Technologies.
            </div>
            <div className="text-xs text-slate-500 italic">
              {adminRole === "6842563d-73fd-4e55-8137-42bf2af6f5b8"
                ? "Super Admin"
                : adminRole === " c0b80d29-779d-4ed9-b7d9-8dae9d9283b8"
                ? "Finance"
                : "admin"}
            </div>
          </div>
          <ul>
            <li>
              <Link
                className="font-medium text-sm text-red-500 hover:text-red-800 flex items-center py-1 px-3"
                onClick={() => dispatch(Logout())}
              >
                Sign Out
              </Link>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownProfile;
