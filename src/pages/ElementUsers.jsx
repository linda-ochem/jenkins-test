import React, { useEffect, useRef, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchForm from "../partials/actions/SearchForm";
import { connect, useDispatch } from "react-redux";
import { toWholeCurrency } from "../helpers";
import routes from "../routes";
import { Table } from "antd";
import { fetchAllElementUsers } from "../redux/customers/customers.action";
import {
  getAllPendingAcctRequest,
  getAllTotalsElement,
} from "../redux/admin/admin.actions";
import {
  NoLinkCard,
  UserUpdateCards,
} from "../partials/adminDashboard/adminAnalytics/DashboardCard";
import { useNavigate } from "react-router-dom";
import ElementUserAnalytics from "../partials/adminDashboard/adminAnalytics/ElementUserAnalytics";

function ElementUsers(props) {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [pageNumber, setpageNumber] = useState(1);
  const [allPending, setAllPending] = useState([]);

  const navigate = useNavigate();
  const userDetailsRef = useRef(null);

  const dataSource = props.customers?.customers?.transformedData;
  const totalItems = props.customers?.customers?.pagination?.total;
  // const totalAcctReq = props.admin?.pendingacctreq?.data?.data?.length;
  const totals = props.admin?.totals;

  // console.log("Totals: ", props.admin?.totals);
  // console.log("Totals: ", totals);

  // console.log(dataSource);

  // handles the scroll up for userdetails pageNumber
  useEffect(() => {
    if (userDetailsRef.current) {
      userDetailsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUser]);

  useEffect(() => {
    dispatch(getAllPendingAcctRequest(pageNumber));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  //makes the call to fetch all users
  useEffect(() => {
    props.fetchAllElementUsers(pageNumber, searchQuery, userId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, searchQuery, userId]);

  //makes the call to fetch all totals
  useEffect(() => {
    props.getAllTotalsElement("USD");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRowClick = (record) => {
    // Redirect to UserDetails component with the record data
    navigate(`/elementuserdetails/${record.id}`, {
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
      title: "Full Name",
      dataIndex: "fullName",
      render: (text, record) => (
        <div
          style={{ cursor: "Pointer", color: "#1E3A8A" }}
          onClick={() => handleRowClick(record)}
        >
          {`${record.fullName} `}
          {/* {`${record.firstName} ${record.lastName}`} */}
        </div>
      ),
      fixed: "left",
      width: 200,
    },
    {
      title: "Email Address",
      dataIndex: "email",
      width: 250,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text, record) => {
        if (text === "false" && record.phoneNumberNew) {
          const { code, local } = record.phoneNumberNew;
          return `${code} ${local}`;
        } else {
          return text;
        }
      },
      width: 150,
    },
    {
      title: "KYC Level",
      dataIndex: "kycLevel",
      width: 100,
    },
    {
      title: "Virtual Acct Number",
      dataIndex: "stripeVirtualAccountNumber",
      render: (stripeVirtualAccountNumber) => {
        return stripeVirtualAccountNumber ? stripeVirtualAccountNumber : "N/A";
      },
      width: 150,
    },
    {
      title: "USD Balance",
      dataIndex: "foundersFinancialBalance",
      render: (foundersFinancialBalance) => {
        return toWholeCurrency(foundersFinancialBalance);
      },
      width: 100,
    },
    {
      title: "Verification Type",
      dataIndex: "verificationType",
      render: (verificationType) => {
        return verificationType ? verificationType : "null";
      },
      width: 150,
    },
    {
      title: "Routing Number",
      dataIndex: "stripeVirtualAccountRoutingNumber",
      fixed: "right",
      render: (stripeVirtualAccountRoutingNumber) => {
        return stripeVirtualAccountRoutingNumber
          ? stripeVirtualAccountRoutingNumber
          : "N/A";
      },
      width: 150,
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
          title="Element Users"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {/*  (Metrics card) */}
              <UserUpdateCards
                title="Total Number of Element Users"
                amount={totals?.users ? totals?.users?.toLocaleString() : 0}
                // rate="10.5"
                // balance="96,000"
                linkName="See All Users"
              />
              <UserUpdateCards
                title="Pending KYC"
                amount={
                  totals?.usersWithCompletedKYC
                    ? totals?.usersWithCompletedKYC?.toLocaleString()
                    : 0
                }
                linkName="Approve KYC"
                to={routes.element_pending_kyc}
              />

              <UserUpdateCards
                title="Connected Accounts"
                amount={allPending ? allPending : 0}
                linkName="See more"
                to={routes.connected_accounts}
              />
              {/* <UserUpdateCards */}
              <NoLinkCard
                title="Users with Account Number"
                amount={
                  totals?.usersWithAccountNumber
                    ? totals?.usersWithAccountNumber
                    : 0
                }
                // linkName="Assign Account Numbers"
                // to={routes.usersWithAccountNumber}
              />
            </div>
            {/* Line chart (User Analytics) */}
            <div className="py-4">
              <ElementUserAnalytics totals={totals} />
            </div>
            {/* Content */}
            <div className="mt-10">
              <div className="relative">
                {/* pageNumber header */}
                <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-xl md:text-3xl text-blue-900 font-bold">
                      Element Users List
                    </h1>
                  </div>

                  {/* Right: Actions */}
                  <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                    {/* See all users button */}
                    {/* <button className=" hover:text-blue-900 text-blue-800">
                          See all Users
                        </button> */}
                  </div>
                </div>

                <div className="border p-5">
                  <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full">
                    <div className="hidden sm:block w-full">
                      <SearchForm
                        placeholder="Search for user by name or email"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                      />
                    </div>
                  </div>
                  <div className="">
                    <Table
                      loading={props.customers?.loading}
                      columns={columns}
                      dataSource={dataSource}
                      rowkey={(record) => record.id}
                      pagination={{
                        current: pageNumber,
                        total: totalItems,
                        pageSize: 50,
                        onChange: (page) => {
                          setpageNumber(page);
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
          </div>
        </main>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  fetchAllElementUsers: (pageNumber, searchQuery, userId) => {
    dispatch(fetchAllElementUsers(pageNumber, searchQuery, userId));
  },
  getAllTotalsElement: () => {
    dispatch(getAllTotalsElement("USD"));
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  customers: state.customers,
  admin: state.admin,
});

export default connect(mapStateToProps, mapDispatchToProps)(ElementUsers);
