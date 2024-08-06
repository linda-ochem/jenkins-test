// import React from "react";

// function SingleUserTransactionTableItems(props) {
//   const statusColor = (status) => {
//     switch (status) {
//       case "SUCCESS":
//         return "bg-emerald-100 text-emerald-600";
//       case "FAILED":
//         return "bg-rose-100 text-rose-500";
//       case "FAILURE":
//         return "bg-rose-100 text-rose-500";
//       case "PENDING":
//         return "bg-slate-200 text-slate-600";
//       default:
//         return "bg-slate-100 text-slate-500";
//     }
//   };

//   return (
//     <tr
//       className="cursor-pointer"
//       onClick={(e) => {
//         e.stopPropagation();
//         // props.setUserTransactionPanelOpen(true);
//         props.handleRowClick()
//       }}
//     >
//       {/* s/n */}
//       <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
//         <div className="text-left">{props.sn}</div>
//       </td>
//       {/* transaction type */}
//       <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
//         <div className="flex items-center">
//           <div className="font-medium text-slate-800">
//             {props.transactionType}
//           </div>
//         </div>
//       </td>

//       {/* Currency*/}
//       <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
//         <div className="text-left">{props.currency}</div>
//       </td>
//       {/* Amount */}
//       <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
//         <div className="text-left">{props.amount}</div>
//       </td>
//       {/* Fee */}
//       <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
//         <div className="text-left">{props.fee}</div>
//       </td>
//       {/* date */}
//       <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
//         <div className="text-left font-medium">{props.date}</div>
//       </td>
//       {/* status */}
//       <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
//         <div className="text-left">
//           <div
//             className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${statusColor(
//               props.status
//             )}`}
//           >
//             {props.status}
//           </div>
//         </div>
//       </td>
//       {/* see more */}
//       <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
//         <div className="text-left">
//           <div className=" inline-flex font-medium rounded-full text-center px-2.5 py-1">
//             <svg
//               className="shrink-0 w-6 h-6"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth="1.5"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 // className= "fill-current text-slate-400"
//                 d="M8.25 4.5l7.5 7.5-7.5 7.5"
//               />
//             </svg>
//           </div>
//         </div>
//       </td>
//     </tr>
//   );
// }

// export default SingleUserTransactionTableItems;
