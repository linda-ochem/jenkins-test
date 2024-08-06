import React, { useEffect, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchForm from "../partials/actions/SearchForm";
import { connect, useDispatch } from "react-redux";
import { Table } from "antd";
import { searchUser } from "../redux/customers/customers.action";
import { getConnectedAllAccounts } from "../redux/admin/admin.actions";
// import moment from "moment";
import { useNavigate } from "react-router-dom";
import GGDropdown from "../partials/actions/GGDropdown";
import moment from "moment";

function ConnectedAccounts(props) {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [transactionStatus, setTransactionStatus] = useState("");

  const dataSource = props.admin?.conctAccts?.data?.accounts?.data;
  const totalItems = dataSource?.length;
  // const totalItems = props.admin?.globalgeng?.pagination?.total;
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchUser(searchQuery, page));
  };

  const options = [
    {
      id: 0,
      transactionStatus: "PENDING",
    },
    {
      id: 1,
      transactionStatus: "PROCESSING",
    },
    {
      id: 2,
      transactionStatus: "READY",
    },
    {
      id: 3,
      transactionStatus: "DELIVERED",
    },
    {
      id: 4,
      transactionStatus: "DISAPPROVED",
    },
  ];

  console.log(dataSource);

  //makes the call to fetch all connected accounts
  useEffect(() => {
    dispatch(getConnectedAllAccounts(pageNumber));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const goBack = () => {
    navigate(-1);
  };

  const handleNameClick = (record) => {
    // Redirect to UserDetails component with the record data
    navigate(`/${record.userId}`, {
      state: { user: record },
    });
  };

  const columns = [
    {
      title: "S/N",
      dataIndex: "serial",
      fixed: "left",
      render: (text, record, rowIndex) => rowIndex + 1,
      width: 80,
    },
    {
      title: "Email Address",
      dataIndex: "email",
      render: (text, record) => {
        return record?.email;
      },
      width: 250,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (text, record) => {
        return record?.individual?.phone;
      },
      width: 200,
    },
    {
      title: "Account",
      dataIndex: "id",
      render: (text, record) => {
        return record?.id;
      },
      width: 200,
    },
    {
      title: "Details Due",
      dataIndex: "currently due",
      render: (text, records) => {
        return (
          <ul>
            {records?.future_requirements?.past_due?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      },
      width: 500,
    },
    {
      title: "Due Date",
      dataIndex: "deadline",
      render: (text, record) => {
        return moment
          .unix(record.requirements?.current_deadline, "YYYY-MM-DD, HH:mm:ss a")
          .format("lll");
      },
      width: 200,
    },
    // {
    //   title: "Status",
    //   // fixed: "right",
    //   dataIndex: "status",
    //   width: 120,
    //   render: (tag, record) => {
    //     const color = tag.includes("DELIVERED")
    //       ? "#117439"
    //       : tag.includes("DISAPPROVED")
    //       ? "#921616"
    //       : "#f39c0a";
    //     return (
    //       <Tag color={color} key={tag}>
    //         {tag}
    //       </Tag>
    //     );
    //   },
    // },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header
          title="Element Users"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-10 w-full mx-auto">
          {/* <div className="px-4 sm:px-6 lg:px-8 py-10 w-full max-w-9xl mx-auto"> */}
            <div className="relative">
              <div className="sm:flex sm:justify-between sm:items-baseline mb-4 md:mb-2">
                {/* Left: Title */}
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                    Connected Accounts
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
                <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full ">
                  {/* Left: Searchbar */}
                  <div className="mb-4 sm:mb-0 w-full">
                    <div className=" hidden sm:block w-full ">
                      <SearchForm
                        placeholder="Search for user request"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        onSubmit={handleSearch}
                      />
                    </div>
                  </div>
                  {/* Right: filter Actions */}
                  <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                    <GGDropdown
                      options={options}
                      selected={options.findIndex(
                        (option) =>
                          option.transactionStatus === transactionStatus
                      )}
                      setSelected={setTransactionStatus}
                      align="right"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <header className="px-5 py-4">
                    <h2 className="font-semibold text-blue-900">
                      Total Accounts{" "}
                      <span className="text-slate-400 font-medium">
                        {totalItems?.toLocaleString()}
                      </span>
                    </h2>
                  </header>
                  <Table
                    loading={props.admin?.loading}
                    columns={columns}
                    dataSource={dataSource}
                    rowkey="id"
                    pagination={{
                      current: pageNumber,
                      total: totalItems,
                      pageSize: 50,
                      onChange: (page) => {
                        setPageNumber(page);
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
  customers: state.customers,
  admin: state.admin,
});

export default connect(mapStateToProps)(ConnectedAccounts);
