import React from "react";
import { Link } from "react-router-dom";

export const PetitionCard = (props) => {
  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-lg border border-slate-200">
      <div className="px-5 pt-5">
        <h2 className=" font-semibold text-blue-600 mb-2">{props.title}</h2>
        <div className="flex items-start">
          <div className="text-xl font-bold text-blue-900 mr-2">
            {props.amount}
          </div>
        </div>
        <Link
          className="font-medium text-sm text-blue-600 flex py-1 pt-5 pb-3"
          to={props.to}
        >
          {props.linkName}
          {props.linkName ? (
            <svg
              className="shrink-0 h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                className="block text-blue-600 truncate transition duration-150"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          ) : (
            ""
          )}
        </Link>
      </div>
    </div>
  );
};
