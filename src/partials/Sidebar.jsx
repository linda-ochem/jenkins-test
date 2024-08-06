import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

import vestilogo from "../images/Vesti logo.svg";
import routes from "../routes";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../redux/auth/auth.actions";
import { Tooltip } from "antd";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { pathname } = location;
  const Role = useSelector(
    (state) => state.auth?.user?.data?.data?.role?.title
  );

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-white p-4 transition-all duration-200 ease-in-out border-r ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to={routes.dashboard} className="block">
            <img src={vestilogo} alt="" />
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span
                className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                •••
              </span>
            </h3>
            <ul className="mt-5">
              {/* Overview */}
              {(Role === "finance-admin" ||
                Role === "super-admin" ||
                Role === "fraud-admin" ||
                Role === "admin") && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    pathname === "/dashboard" && "bg-blue-900"
                  }`}
                >
                  <Tooltip title="Dashboard Overview">
                    <NavLink
                      end
                      to={routes.dashboard}
                      className={`block text-slate-400 truncate transition duration-150 ${
                        pathname === "/dashboard"
                          ? "hover:text-white"
                          : "hover:text-blue-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          className="shrink-0 h-6 w-6"
                          viewBox="0 0 256 256"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect fill="none" height="256" width="256" />
                          <path
                            className={`fill-current ${
                              pathname === "/dashboard"
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M218.8,103.7h0L138.8,31a16,16,0,0,0-21.6,0l-80,72.7A16,16,0,0,0,32,115.5V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V115.5A16,16,0,0,0,218.8,103.7Z"
                          />
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Overview
                        </span>
                      </div>
                    </NavLink>
                  </Tooltip>
                </li>
              )}
              {/* User Updates */}
              {(Role === "finance-admin" ||
                Role === "super-admin" ||
                Role === "fraud-admin" ||
                Role === "admin") && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    pathname.includes("user_updates") && "bg-blue-900"
                  }`}
                >
                  <Tooltip title="User Updates">
                    <NavLink
                      end
                      to={routes.user_updates}
                      className={`block text-slate-400 truncate transition duration-150 ${
                        pathname.includes("user_updates")
                          ? "hover:text-white"
                          : "hover:text-blue-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          className="shrink-0 h-6 w-6"
                          viewBox="0 0 256 256"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect fill="none" height="256" width="256" />
                          <path
                            className={`fill-current ${
                              pathname.includes("user_updates")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M231.9,212a120.7,120.7,0,0,0-67.1-54.2,72,72,0,1,0-73.6,0A120.7,120.7,0,0,0,24.1,212a7.7,7.7,0,0,0,0,8,7.8,7.8,0,0,0,6.9,4H225a7.8,7.8,0,0,0,6.9-4A7.7,7.7,0,0,0,231.9,212Z"
                          />
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          User Updates
                        </span>
                      </div>
                    </NavLink>
                  </Tooltip>
                </li>
              )}
              {/* Cards */}
              {(Role === "finance-admin" ||
                Role === "super-admin" ||
                Role === "fraud-admin" ||
                Role === "admin") && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    pathname.includes("card") && "bg-blue-900"
                  }`}
                >
                  <Tooltip title="Cards">
                    <NavLink
                      end
                      to="/card-tab"
                      className={`block text-slate-400 truncate transition duration-150 ${
                        pathname.includes("card")
                          ? "hover:text-white"
                          : "hover:text-blue-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          className="shrink-0 h-6 w-6"
                          version="1.1"
                          viewBox="0 0 24 24"
                          xmlSpace="preserve"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                          <g id="info" />
                          <g id="icons">
                            <g id="card">
                              <path
                                className={`fill-current ${
                                  pathname.includes("card")
                                    ? "text-white"
                                    : "text-slate-400"
                                }`}
                                d="M20,3H4C1.8,3,0,4.8,0,7v1c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1V7C24,4.8,22.2,3,20,3z"
                              />
                              <path
                                className={`fill-current ${
                                  pathname.includes("card")
                                    ? "text-white"
                                    : "text-slate-400"
                                }`}
                                d="M23,11H1c-0.6,0-1,0.4-1,1v5c0,2.2,1.8,4,4,4h16c2.2,0,4-1.8,4-4v-5C24,11.4,23.6,11,23,11z M11,18H5c-0.6,0-1-0.4-1-1    s0.4-1,1-1h6c0.6,0,1,0.4,1,1S11.6,18,11,18z M19,15h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S19.6,15,19,15z"
                              />
                            </g>
                          </g>
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Cards
                        </span>
                      </div>
                    </NavLink>
                  </Tooltip>
                </li>
              )}
              {/* FBO */}
              {(Role === "finance-admin" ||
                Role === "super-admin" ||
                Role === "fraud-admin" ||
                Role === "admin") && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    pathname.includes("fbo") && "bg-blue-900"
                  }`}
                >
                  <Tooltip title="FBO">
                    <NavLink
                      end
                      to="/fbo_transactions"
                      className={`block text-slate-400 truncate transition duration-150 ${
                        pathname.includes("fbo")
                          ? "hover:text-white"
                          : "hover:text-blue-900"
                      }`}
                    >
                      <div className="flex items-center">
                        {/* <svg
                      className="shrink-0 h-6 w-6"
                      version="1.1"
                      viewBox="0 0 24 24"
                      xmlSpace="preserve"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <g id="info" />
                      <g id="icons">
                        <g id="card">
                          <path
                            className={`fill-current ${
                              pathname.includes("FBO")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M20,3H4C1.8,3,0,4.8,0,7v1c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1V7C24,4.8,22.2,3,20,3z"
                          />
                          <path
                            className={`fill-current ${
                              pathname.includes("FBO")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M23,11H1c-0.6,0-1,0.4-1,1v5c0,2.2,1.8,4,4,4h16c2.2,0,4-1.8,4-4v-5C24,11.4,23.6,11,23,11z M11,18H5c-0.6,0-1-0.4-1-1    s0.4-1,1-1h6c0.6,0,1,0.4,1,1S11.6,18,11,18z M19,15h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S19.6,15,19,15z"
                          />
                        </g>
                      </g>
                    </svg> */}
                        <svg
                          className="shrink-0 h-6 w-6"
                          id="Layer_1"
                          // style="enable-background:new 0 0 30 30;"
                          version="1.1"
                          viewBox="0 0 30 30"
                          xmlSpace="preserve"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                          <path
                            className={`fill-current ${
                              pathname.includes("fbo")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M24,7V6c0-1.105-0.895-2-2-2H3C1.895,4,1,4.895,1,6v1H24z"
                          />
                          <path
                            className={`fill-current ${
                              pathname.includes("fbo")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M1,10v9c0,1.105,0.895,2,2,2h19c1.105,0,2-0.895,2-2v-9H1z"
                          />
                          <path
                            className={`fill-current ${
                              pathname.includes("fbo")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M29,11v-1c0-1.105-0.895-2-2-2h-1v3H29z"
                          />
                          <path
                            className={`fill-current ${
                              pathname.includes("fbo")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M26,14v7c0,1.105-0.895,2-2,2H6v1c0,1.105,0.895,2,2,2h19c1.105,0,2-0.895,2-2V14H26z"
                          />
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          FBO
                        </span>
                      </div>
                    </NavLink>
                  </Tooltip>
                </li>
              )}
              {/* updates */}
              {(Role === "finance-admin" ||
                Role === "super-admin" ||
                Role === "fraud-admin" ||
                Role === "admin") && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    pathname.includes("app_updates") && "bg-blue-900"
                  }`}
                >
                  <Tooltip title="Updates">
                    <NavLink
                      end
                      to={routes.app_updates}
                      className={`block text-slate-400 truncate transition duration-150 ${
                        pathname.includes("app_updates")
                          ? "hover:text-white"
                          : "hover:text-blue-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          className="shrink-0 h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`fill-current ${
                              pathname.includes("app_updates")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                          />
                        </svg>
                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Updates
                        </span>
                      </div>
                    </NavLink>
                  </Tooltip>
                </li>
              )}
              {/* rates */}
              {Role === "super-admin" && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    pathname.includes("limits") && "bg-blue-900"
                  }`}
                >
                  <Tooltip title="Rates and Limits">
                    <NavLink
                      end
                      to={routes.limits}
                      className={`block text-slate-400 truncate transition duration-150 ${
                        pathname.includes("limits")
                          ? "hover:text-white"
                          : "hover:text-blue-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="shrink-0 w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`fill-none ${
                              pathname.includes("limits")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                          />
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Rates and Limits.
                        </span>
                      </div>
                    </NavLink>
                  </Tooltip>
                </li>
              )}
              {/* payments */}
              {(Role === "finance-admin" ||
                Role === "super-admin" ||
                Role === "fraud-admin" ||
                Role === "admin") && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    pathname.includes("payment-histories") && "bg-blue-900"
                  }`}
                >
                  <Tooltip title="Payments Histories">
                    <NavLink
                      end
                      to="/payment-histories"
                      className={`block text-slate-400 truncate transition duration-150 ${
                        pathname.includes("payment-histories")
                          ? "hover:text-white"
                          : "hover:text-blue-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="shrink-0 h-6 w-6"
                        >
                          <path
                            className={`fill-current ${
                              pathname.includes("payment-histories")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                          />
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Payment History
                        </span>
                      </div>
                    </NavLink>
                  </Tooltip>
                </li>
              )}
              {/* withdrawal Requests */}
              {(Role === "finance-admin" ||
                Role === "super-admin" ||
                Role === "fraud-admin" ||
                Role === "admin") && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    pathname.includes("withdrawal-requests") && "bg-blue-900"
                  }`}
                >
                  <Tooltip title="Withdrawal Requests">
                    <NavLink
                      end
                      to="/withdrawal-requests"
                      className={`block text-slate-400 truncate transition duration-150 ${
                        pathname.includes("withdrawal-requests")
                          ? "hover:text-white"
                          : "hover:text-blue-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="shrink-0 h-6 w-6"
                        >
                          <path
                            className={`fill-current ${
                              pathname.includes("withdrawal-requests")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M9.97.97a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06l-1.72-1.72v3.44h-1.5V3.31L8.03 5.03a.75.75 0 01-1.06-1.06l3-3zM9.75 6.75v6a.75.75 0 001.5 0v-6h3a3 3 0 013 3v7.5a3 3 0 01-3 3h-7.5a3 3 0 01-3-3v-7.5a3 3 0 013-3h3z"
                          />
                          <path
                            className={`fill-current ${
                              pathname.includes("withdrawal-requests")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M7.151 21.75a2.999 2.999 0 002.599 1.5h7.5a3 3 0 003-3v-7.5c0-1.11-.603-2.08-1.5-2.599v7.099a4.5 4.5 0 01-4.5 4.5H7.151z"
                          />
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Withdrawal Requests
                        </span>
                      </div>
                    </NavLink>
                  </Tooltip>
                </li>
              )}
              {/* Safelock Requests */}
              {(Role === "finance-admin" ||
                Role === "super-admin" ||
                Role === "fraud-admin" ||
                Role === "admin") && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    pathname.includes("safelock") && "bg-blue-900"
                  }`}
                >
                  <Tooltip title="Safelock">
                    <NavLink
                      end
                      to="/safelock"
                      className={`block text-slate-400 truncate transition duration-150 ${
                        pathname.includes("safelock")
                          ? "hover:text-white"
                          : "hover:text-blue-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="shrink-0 h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={` ${
                              pathname.includes("safelock")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                          />
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Safelock
                        </span>
                      </div>
                    </NavLink>
                  </Tooltip>
                </li>
              )}
              {/* Pathways Requests */}
              {(Role === "finance-admin" ||
                Role === "super-admin" ||
                Role === "fraud-admin" ||
                Role === "legal-officer" ||
                Role === "admin") && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    pathname.includes("pathways") && "bg-blue-900"
                  }`}
                >
                  <Tooltip title="Pathways">
                    <NavLink
                      end
                      to="/pathways"
                      className={`block text-slate-400 truncate transition duration-150 ${
                        pathname.includes("pathways")
                          ? "hover:text-white"
                          : "hover:text-blue-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="shrink-0 h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={` ${
                              pathname.includes("pathways")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
                          />
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Pathways
                        </span>
                      </div>
                    </NavLink>
                  </Tooltip>
                </li>
              )}
              {/* Element Overview */}
              {(Role === "finance-admin" ||
                Role === "super-admin" ||
                Role === "fraud-admin" ||
                Role === "admin") && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    pathname === "/element-overview" && "bg-blue-900"
                  }`}
                >
                  <Tooltip title="Element Overview">
                    <NavLink
                      end
                      to={routes.element_overview}
                      className={`block text-slate-400 truncate transition duration-150 ${
                        pathname === "/element-overview"
                          ? "hover:text-white"
                          : "hover:text-blue-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`fill-current ${
                              pathname === "/element-overview"
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                          />
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Element Overview
                        </span>
                      </div>
                    </NavLink>
                  </Tooltip>
                </li>
              )}
              {/* Element Users Updates */}
              {(Role === "finance-admin" ||
                Role === "super-admin" ||
                Role === "fraud-admin" ||
                Role === "admin") && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    pathname.includes("element_user") && "bg-blue-900"
                  }`}
                >
                  <Tooltip title="Element Users">
                    <NavLink
                      end
                      to={routes.element_users}
                      className={`block text-slate-400 truncate transition duration-150 ${
                        pathname.includes("element_user")
                          ? "hover:text-white"
                          : "hover:text-blue-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="shrink-0 h-6 w-6"
                        >
                          <path
                            className={`fill-current ${
                              pathname.includes("element_user")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z"
                          />
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Element Users
                        </span>
                      </div>
                    </NavLink>
                  </Tooltip>
                </li>
              )}

              {/* Element transactions */}
              {(Role === "finance-admin" ||
                Role === "super-admin" ||
                Role === "fraud-admin" ||
                Role === "admin") && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    pathname.includes("element-transactions") && "bg-blue-900"
                  }`}
                >
                  <Tooltip title="Element transactions">
                    <NavLink
                      end
                      to="/element-transactions"
                      className={`block text-slate-400 truncate transition duration-150 ${
                        pathname.includes("element-transactions")
                          ? "hover:text-white"
                          : "hover:text-blue-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="shrink-0 h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={` ${
                              pathname.includes("element-transactions")
                                ? "text-white"
                                : "text-slate-400"
                            }`}
                            d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Element Transactions
                        </span>
                      </div>
                    </NavLink>
                  </Tooltip>
                </li>
              )}
            </ul>
          </div>
        </div>
        <hr className="w-full h-1 bg-slate-200 my-3" />
        <div className="space-y-8">
          {/* Admin Panel */}
          {Role === "super-admin" && (
            <ul className="mt-5">
              <li
                className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                  pathname.includes("admin_panel") && "bg-blue-900"
                }`}
              >
                <Tooltip title="Admin Panel">
                  <NavLink
                    end
                    to={routes.admin_panel}
                    className={`block text-slate-400 truncate transition duration-150 ${
                      pathname.includes("admin_panel")
                        ? "hover:text-white"
                        : "hover:text-blue-900"
                    }`}
                  >
                    <div className="flex items-center">
                      <svg
                        className="shrink-0 h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          className={`block text-slate-400 truncate transition duration-150 ${
                            pathname.includes("admin_panel")
                              ? "hover:text-white"
                              : "hover:text-blue-900"
                          }`}
                          d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Admin Panel
                      </span>
                    </div>
                  </NavLink>
                </Tooltip>
              </li>
            </ul>
          )}

          {/* Referals Panel */}
          {(Role === "finance-admin" ||
            Role === "super-admin" ||
            Role === "fraud-admin" ||
            Role === "admin") && (
            <ul className="mt-5">
              <li
                className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                  pathname.includes("referrals") && "bg-blue-900"
                }`}
              >
                <Tooltip title="Referrals">
                  <NavLink
                    end
                    to={routes.referrals}
                    className={`block text-slate-400 truncate transition duration-150 ${
                      pathname.includes("referrals")
                        ? "hover:text-white"
                        : "hover:text-blue-900"
                    }`}
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="shrink-0 w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          className={`block text-slate-400 truncate transition duration-150 ${
                            pathname.includes("referrals")
                              ? "hover:text-white"
                              : "hover:text-blue-900"
                          }`}
                          d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
                          clipRule="evenodd"
                        />
                        <path
                          className={`block text-slate-400 truncate transition duration-150 ${
                            pathname.includes("referrals")
                              ? "hover:text-white"
                              : "hover:text-blue-900"
                          }`}
                          d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z"
                        />
                      </svg>

                      <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Referrals
                      </span>
                    </div>
                  </NavLink>
                </Tooltip>
              </li>
            </ul>
          )}
        </div>

        {/* Logout */}

        <div className="space-y-8">
          <ul className="mt-5 ">
            <li
              className=" flex items-center px-3 py-2 rounded-sm mb-0.5 last:mb-0 text-red-500 cursor-pointer"
              onClick={() => dispatch(Logout())}
            >
              <Tooltip title="Log Out">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-red-600"
                  >
                    <path
                      fillRule="evenodd"
                      className="block truncate transition duration-150 text-red-500 hover:text-red-900"
                      d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Logout
                  </span>
                </div>
              </Tooltip>
            </li>
          </ul>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg
                className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
                viewBox="0 0 24 24"
              >
                <path
                  className="text-slate-400"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
