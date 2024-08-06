import React, { useState } from "react";
import PaginationDisplay from "../../../components/PaginationDisplay";
import { Empty, Spin } from "antd";
import { toWholeCurrency } from "../../../helpers";
import moment from "moment";
import SingleUserTransactionPanel from "./SingleUserTransactionPanel";

function SingleUserTransactionsTable({
  TransactionList,
  goToPage,
  paginationMeta,
  loading,
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [userTransactionPanelOpen, setUserTransactionPanelOpen] =
    useState(false);

  const handleRowClick = (transaction) => {
    setSelectedItems(transaction);
    setUserTransactionPanelOpen(true);
  };

  const statusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-emerald-100 text-emerald-600";
      case "FAILED":
        return "bg-rose-100 text-rose-500";
      case "FAILURE":
        return "bg-rose-100 text-rose-500";
      case "PENDING":
        return "bg-slate-200 text-slate-600";
      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <div className="bg-white">
      {loading && (
        <div className=" flex items-center justify-center bg-transparent">
          <div className="m-auto">
            <Spin />
          </div>
        </div>
      )}
      {TransactionList?.length > 0 && (
        <div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              {/* Table header */}
              <thead className="text-xs font-semibold uppercase text-slate-500 border-t border-b border-slate-200">
                <tr>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">S/N</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">
                      Transaction Type
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Currency</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Amount</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Fee</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Date</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Status</div>
                  </th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-slate-200 border-b border-slate-200">
                {TransactionList?.map((transaction, index) => {
                  return (
                    <tr
                      key={index}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(transaction);
                      }}
                    >
                      {/* s/n */}
                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="text-left">{index + 1}</div>
                      </td>
                      {/* transaction type */}
                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="font-medium text-slate-800">
                            {transaction.type}
                          </div>
                        </div>
                      </td>

                      {/* Currency*/}
                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="text-left">
                          {transaction.currency.split("_")[0]}
                        </div>
                      </td>
                      {/* Amount */}
                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="text-left">
                          {toWholeCurrency(transaction.amount)}
                        </div>
                      </td>
                      {/* Fee */}
                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="text-left">
                          {transaction.fee ? transaction.fee : 0}
                        </div>
                      </td>
                      {/* date */}
                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="text-left font-medium">
                          {transaction.date
                            ? transaction.date
                            : moment(transaction.createdAt).format(
                                "MMMM Do YYYY, h:mm:ss a"
                              )}
                        </div>
                      </td>
                      {/* status */}
                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="text-left">
                          <div
                            className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${statusColor(
                              transaction.status
                            )}`}
                          >
                            {transaction.status}
                          </div>
                        </div>
                      </td>
                      {/* see more */}
                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="text-left">
                          <div className=" inline-flex font-medium rounded-full text-center px-2.5 py-1">
                            <svg
                              className="shrink-0 w-6 h-6"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                // className= "fill-current text-slate-400"
                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                              />
                            </svg>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-8 px-4">
              <PaginationDisplay
                goToPage={goToPage}
                paginationMeta={paginationMeta}
              />
            </div>
          </div>
        </div>
      )}
      {TransactionList?.length === 0 && (
        <div className=" flex items-center justify-center bg-transparent">
          <div className="m-auto">
            <Empty />
            <p>No pevious transaction history for user </p>
          </div>
        </div>
      )}
      {/* {selectedItems && ( */}
      <SingleUserTransactionPanel
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        userTransactionPanelOpen={userTransactionPanelOpen}
        setUserTransactionPanelOpen={setUserTransactionPanelOpen}
      />
      {/* // )} */}
    </div>
  );
}

export default SingleUserTransactionsTable;
