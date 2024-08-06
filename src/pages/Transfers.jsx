import React, { useEffect, useState } from "react";

import SearchForm from "../partials/actions/SearchForm";
import { connect } from "react-redux";
import { toWholeCurrency } from "../helpers";
import { getAllTransactions } from "../redux/admin/admin.actions";
import moment from "moment";
import SingleCardTransactionPanel from "../partials/cardTables/SingleCardTransactionPanel";
import { Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";

function Transfers(props) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState(null);
  const [cardTransactionPanelOpen, setCardTransactionPanelOpen] =
    useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const dataSource = props.admin?.transactions?.data;
  const total = props.admin?.transactions?.pagination?.total;

  const handleRowClick = (transaction) => {
    setCardTransactionPanelOpen(true);
    setSelectedItems(transaction);
  };

  const handleNameClick = (record) => {
    // Redirect to UserDetails component with the record data
    navigate(`/${record.userId}`, {
      state: { user: record },
    });
  };

  useEffect(() => {
    const type = "TRANSFER";
    props.getAllTransactions(pageNumber, type, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, searchQuery]);

  const columns = [
    {
      title: "S/N",
      dataIndex: "serial",
      fixed: "left",
      render: (text, record, rowIndex) => rowIndex + 1,
      width: 80,
    },
    {
      title: "Sender",
      dataIndex: "senderName",
      render: (text, record) => {
        return (
          <div
            onClick={() => handleNameClick(record)}
            style={{ cursor: "pointer", color: "#080675" }}
          >
            {record?.senderName}
          </div>
        );
      },
      width: 200,
    },
    {
      title: "Sender Email",
      dataIndex: "senderEmail",
      width: 200,
    },
    {
      title: "Currency",
      dataIndex: "currency ",
      render: (text, record) => {
        return record.currency?.split("_")[0];
      },
      width: 120,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) => {
        return toWholeCurrency(amount);
      },
      width: 100,
    },
    {
      title: "Receiver",
      dataIndex: "receiverName",
      width: 200,
    },
    {
      title: "Receiver Email",
      dataIndex: "receiverEmail",
      width: 200,
    },
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
          : tag.includes("SUCCESS")
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
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          {/* Content */}
          <div className="mt-10">
            <div className="relative">
              <div className="px-4 sm:px-6 lg:px-2 w-full  mx-auto">
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      Transfers
                    </h1>
                  </div>
                </div>

                <div className="border p-5">
                  <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full ">
                    {/* Left: Searchbar */}
                    <div className="mb-4 sm:mb-0 w-full">
                      <div className=" hidden sm:block w-full ">
                        <SearchForm
                          placeholder="Search for user transaction"
                          onChange={(e) => setSearchQuery(e.target.value)}
                          value={searchQuery}
                        />
                      </div>
                    </div>

                    {/* Right: filter Actions */}
                    {/* <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                        <DropdownFull
                          // options={options}
                          align="right"
                        />
                      </div> */}
                  </div>

                  <div>
                    <div>
                      {/* Table */}
                      <div className="overflow-x-auto">
                        <header className="px-5 py-4">
                          <h2 className="font-semibold text-blue-900">
                            Total Transfers{" "}
                            <span className="text-slate-400 font-medium">
                              {total?.toLocaleString()}
                            </span>
                          </h2>
                        </header>
                        <div className="table-auto w-full">
                          <Table
                            loading={props.admin?.loading}
                            columns={columns}
                            dataSource={dataSource}
                            rowKey={(record) => record.id}
                            pagination={{
                              current: pageNumber,
                              total: total,
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {selectedItems && (
        <SingleCardTransactionPanel
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          cardTransactionPanelOpen={cardTransactionPanelOpen}
          setCardTransactionPanelOpen={setCardTransactionPanelOpen}
        />
      )}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  getAllTransactions: (page, type, searchQuery) => {
    dispatch(getAllTransactions(page, type, searchQuery));
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  customers: state.customers,
  admin: state.admin,
});

export default connect(mapStateToProps, mapDispatchToProps)(Transfers);
