import React, { useEffect } from "react";

function UsersTableItem(props) {
  // const kycStatusColor = (status) => {
  //   switch (status) {
  //     case "Completed":
  //       return "bg-emerald-100 text-emerald-600";
  //     case "Canceled":
  //       return "bg-rose-100 text-rose-500";
  //     case "PENDING":
  //       return "bg-slate-200 text-slate-600";
  //     default:
  //       return "bg-slate-100 text-slate-500";
  //   }
  // };

  return (
    <tr
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        props.setUserPanelOpen(true);
      }}
    >
      {/* s/n */}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{props.sn}</div>
      </td>
      {/* Full Name */}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-slate-800">{props.fullName}</div>
      </td>

      {/* Email Address*/}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{props.emailAddress}</div>
      </td>
      {/* Phone Number */}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{props.phoneNumber}</div>
      </td>
      {/* user name */}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{props.userName}</div>
      </td>
      {/* balance */}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-right font-medium">{props.balance}</div>
      </td>
    </tr>
  );
}

export default UsersTableItem;
