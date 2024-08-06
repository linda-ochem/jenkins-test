import React, { useEffect, useState } from "react";

import SearchForm from "../../../partials/actions/SearchForm";
// import SingleUserTransactionsTable from "./SingleUserTransactionTable";
import { connect } from "react-redux";
import {
  // getSingleUserTransaction,
  getSingleUserTransactions,
} from "../../../redux/customers/customers.action";
import SingleUserTransactionPanel from "./SingleUserTransactionPanel";
import { Table, Tag } from "antd";
import moment from "moment";
import { toWholeCurrency } from "../../../helpers";

function SingleUserTransactions(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [userTransactionPanelOpen, setUserTransactionPanelOpen] =
    useState(false);
  const [selectedItems, setSelectedItems] = useState("");

  const dataSource = props.customers?.singleusertransactions?.data;
  const totalItems = props.customers?.singleusertransactions?.pagination?.total;

  useEffect(() => {
    const userId = props.user?.id ? props.user?.id : props.userId;

    props.getSingleUserTransactions(
      userId,
      pageNumber,
      searchQuery
      // email: props.user.email,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user?.id, pageNumber, searchQuery]);

  const handleRowClick = (record) => {
    setSelectedItems(record);
    setUserTransactionPanelOpen(true);
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
      title: "Transaction Type",
      dataIndex: "type",
      fixed: "left",
      width: 200,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      render: (text, record) => record.currency?.split("_")[0],
      width: 100,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) => {
        return toWholeCurrency(amount);
      },
      width: 100,
    },
    // {
    //   title: "Fee",
    //   dataIndex: "fee",
    //   width: 100,
    // },
    {
      title: "Date",
      index: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt, "YYYY-MM-DD HH:mm:ss").format("lll");
      },
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (tag) => {
        const color = tag.includes("PENDING")
          ? "#f39c0a"
          : tag.includes("COMPLETED") || tag.includes("SUCCESS")
          ? "#117439"
          : "#921616";
        return (
          <Tag color={color} key={tag}>
            {tag}
          </Tag>
        );
      },
    },
    {
      fixed: "right",
      width: 50,
      render: (record) => {
        return (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-0.5 h-0.5  "
              style={{
                width: "16px",
                height: "16px",
                cursor: "pointer",
                color: "green",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(record);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </>
        );
      },
    },
  ];

  return (
    <main>
      <div className="relative">
        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full  mx-auto">
          {/* Page header */}
          <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
            {/* Left: Title */}
            <div className="mb-4 sm:mb-0">
              <h1 className="text-xl md:text-3xl text-blue-950 font-bold">
                {props.user?.firstName}'s Transactions
              </h1>
            </div>
          </div>

          <div className="border p-5">
            <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2 w-full pb-5">
              <div className="hidden sm:block w-full">
                <SearchForm
                  placeholder="Search transactions"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                  // onSubmit={handleSearch}
                />
              </div>
            </div>

            {/* Table */}
            <Table
              loading={props.customers?.loading}
              columns={columns}
              dataSource={dataSource}
              rowkey={(record) => record.id}
              pagination={{
                current: pageNumber,
                total: totalItems,
                pageSize: 50,
                onChange: (pageNumber) => {
                  setPageNumber(pageNumber);
                },
              }}
              scroll={{
                x: 1000,
                y: 500,
              }}
            ></Table>
            {selectedItems && (
              <SingleUserTransactionPanel
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                userTransactionPanelOpen={userTransactionPanelOpen}
                setUserTransactionPanelOpen={setUserTransactionPanelOpen}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

const mapDispatchToProps = (dispatch) => ({
  getSingleUserTransactions: (userId, pageNumber, searchQuery) => {
    dispatch(getSingleUserTransactions(userId, pageNumber, searchQuery));
  },
  getAllTotals: () => {
    dispatch(getAllTotals());
  },
});

const mapStatesToProp = (state) => ({
  auth: state.auth,
  customers: state.customers,
});

export default connect(
  mapStatesToProp,
  mapDispatchToProps
)(SingleUserTransactions);
