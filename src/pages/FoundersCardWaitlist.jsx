import React, { useEffect, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchForm from "../partials/actions/SearchForm";
// import Pagination from "../components/PaginationDisplay";
import { connect, useDispatch } from "react-redux";
import { Table, Tag } from "antd";
import { setPaginationMeta } from "../redux/pagination/paginations.actions";
import { searchUser } from "../redux/customers/customers.action";
import {
  // getFoundersCardWhitelist,
  getVirtualCardWaitlist,
} from "../redux/admin/admin.actions";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { CreateFoundersCard } from "./CreateCard";

function FoundersCardWaitlist(props) {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const dataSource = props.admin?.virtualwaitlist?.data?.data;
  const totalItems =
    props.admin?.virtualwaitlist?.data?.paginationMeta?.totalObjects;

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchUser(searchTerm, page));
  };

  //make the call to fetch all virtualCard transactions
  useEffect(() => {
    dispatch(getVirtualCardWaitlist());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, setPaginationMeta]);

  const columns = [
    {
      title: "S/N",
      dataIndex: "serial",
      fixed: "left",
      render: (text, record, rowIndex) => rowIndex + 1,
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "firstName",
      fixed: "left",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      fixed: "left",
      width: 200,
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      width: 200,
    },
    {
      title: "Address",
      dataIndex: "currentAddress",
      width: 150,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      width: 150,
    },
    {
      title: "Date requested",
      dataIndex: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt, "YYYY-MM-DD, HH:mm:ss a").format("lll");
      },
      width: 120,
    },
    {
      title: "Status",
      fixed: "right",
      dataIndex: "status",
      width: 120,
      render: (tag, record) => {
        const color = tag.includes("DELIVERED")
          ? "#117439"
          : tag.includes("DISAPPROVED")
          ? "#921616"
          : "#f39c0a";
        return (
          <Tag color={color} key={tag}>
            {tag}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header
          title="Cards"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main>
          <div className="mt-10">
            <div className="relative">
              <div className="px-4 sm:px-6 lg:px-2 py-4 w-full mx-auto">
                {/* <div className="px-4 sm:px-6 lg:px-2 py-4 w-full max-w-9xl mx-auto"> */}
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-baseline mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      Founders' Card Whitelist
                    </h1>
                  </div>

                  {/* Right: Actions */}
                  {/* See all card Transactions */}
                  <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                    {/* See all card Transactions */}
                    <button
                      onClick={goBack}
                      className=" hover:text-blue-900 text-blue-900 flex gap-2 text-lg font-bold"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                        className="shrink-0 w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-900 font-bold"
                          d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                        />
                      </svg>
                      Back
                    </button>
                  </div>
                </div>

                <div className="border p-5">
                  <div className="sm:flex sm:justify-between sm:items-baseline mb-4 pb-4 md:mb-2 w-full ">
                    {/* Left: Searchbar */}
                    <div className="mb-4 sm:mb-0 w-full">
                      <div className=" hidden sm:block w-full ">
                        <SearchForm
                          placeholder="Search for user transaction"
                          onChange={(e) => setSearchTerm(e.target.value)}
                          value={searchTerm}
                          onSubmit={handleSearch}
                        />
                      </div>
                      <header className="px-5 py-4">
                        <h2 className="font-semibold text-blue-900 gap-4">
                          Customers{" "}
                          <span className="text-slate-400 font-medium">
                            {totalItems}
                          </span>
                        </h2>
                      </header>
                    </div>
                    <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                      <CreateFoundersCard />
                    </div>
                  </div>

                  {/* Table */}
                  <Table
                    loading={props.admin?.loading}
                    columns={columns}
                    dataSource={dataSource}
                    rowKey={(record) => record.id}
                    pagination={{
                      current: pageNumber,
                      total: totalItems,
                      onChange: (pageNumber) => {
                        setPageNumber(pageNumber);
                      },
                    }}
                    scroll={{
                      x: 1000,
                      y: 500,
                    }}
                  ></Table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
});

export default connect(mapStateToProps)(FoundersCardWaitlist);
