import React, { useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchForm from "../partials/actions/SearchForm";
import TransactionsTable from "../partials/finance/TransactionsTable";
import TransactionPanel from "../partials/finance/TransactionPanel";
import PaginationNumeric2 from "../components/PaginationDisplay";
import DropdownTransaction from "../components/DropdownTransaction";

function TransactionDetails() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [transactionPanelOpen, setTransactionPanelOpen] = useState(true);

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-white">
        {/*  Site header */}
        <Header title= "Cards" sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="relative">
            {/* Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full  mx-auto">
              {/* Page header */}
              <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                {/* Left: Title */}
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                    Card Transactions
                  </h1>
                </div>

                {/* Right: Actions */}
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  {/* Search form */}
                  {/* <div className="hidden sm:block">
                    <SearchForm />
                  </div> */}

                  {/* See all transactions button */}
                  <button className=" hover:text-blue-900 text-blue-800">
                    See all Transactions
                  </button>
                </div>
              </div>

              {/* Filters */}
              {/* <div className="mb-5">
                <ul className="flex flex-wrap -m-1">
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5  px-3 py-1 text-blue-900 duration-150 ease-in-out">
                      Card Transactions
                    </button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out">
                      Globalgeng Physical Naira Card Waitlist
                    </button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out">
                      Founders Card Waitlist
                    </button>
                  </li>
                </ul>
              </div> */}

              <div className="border p-5">
                <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2 w-full">
                  <div className="hidden sm:block w-full">
                    <SearchForm 
                      placeholder='Search for user/transaction'
                    />
                  </div>
                  <div className="">
                    <DropdownTransaction />
                  </div>
                </div>
                {/* Table */}
                <TransactionsTable
                  selectedItems={handleSelectedItems}
                  setTransactionPanelOpen={setTransactionPanelOpen}
                />
              </div>

              {/* Pagination */}
              <div className="mt-8">
                <PaginationNumeric2 />
              </div>
            </div>

            <TransactionPanel
              transactionPanelOpen={transactionPanelOpen}
              setTransactionPanelOpen={setTransactionPanelOpen}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default TransactionDetails;
