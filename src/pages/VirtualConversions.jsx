import React, { useEffect, useState } from "react";

import SearchForm from "../partials/actions/SearchForm";
import { connect } from "react-redux";
import { toWholeCurrency } from "../helpers";
import { Table, Tag, message } from "antd";
import moment from "moment";
import SingleCardTransactionPanel from "../partials/cardTables/SingleCardTransactionPanel";
import {
  getCustomerCards,
  getVirtualCardConversion2,
  getVirtualCardTransactionForUser2,
} from "../actions";
// import VirtualCardTransactionsDropdown from "../partials/actions/VirtualCardTransactionsDropdown";
// import VirtualCardUserTransactionsDropdown from "../partials/actions/VirtualCardUserTransactionsDropdown";
import { AdminModal } from "../partials/actions/ModalBlank";
import CBCardFunding from "./CBCardFunding";

function VirtualCardConversions(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState(null);
  const [cardTransactionPanelOpen, setCardTransactionPanelOpen] =
    useState(false);
  const [open, setOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [PageNumber, setPageNumber] = useState(1);
  const [PageNumber2, setPageNumber2] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleRowClick = (transaction) => {
    setCardTransactionPanelOpen(true);
    setSelectedItems(transaction);
  };

  const fetchTransaction = async () => {
    try {
      (async () => {
        setLoading(true);
        const response = await getVirtualCardConversion2(
          PageNumber,
          searchQuery
        );
        // console.log(response)
        setDataSource(response.data);
        setTotal(response.pagination.total);
        setLoading(false);
      })();
    } catch (error) {
      setLoading(false);
      message.error(
        "Unable to fetch transaction at this time. Please try again later"
      );
    }
  };

  useEffect(() => {
    fetchTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PageNumber, searchQuery]);

  const handleEmailClick = async (record) => {
    setLoading(true);
    const userId = record.userId;
    try {
      const response = await getCustomerCards(userId);
      // console.log(response);
      setCardData(response.data?.data);
      // setCardData(response.data?.data.cardDetails.rawItemsCards);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching card details");
      setLoading(false);
    }
  };

  const handleUserIdClick = async (PageNumber2, record) => {
    try {
      const response = await getVirtualCardTransactionForUser2(
        PageNumber2,
        record.userId
      );
      // console.log(response);
      setModalData(response.data);
      setSelectedUser(record);
      setTotalItems(response.pagination?.total);
    } catch (error) {
      message.error("Error fetching card details");
      console.error(error);
    }
  };

  const handleBackClick = () => {
    setSelectedUser(null);
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
      title: "Email",
      dataIndex: "email",
      render: (text, record) => (
        <div
          style={{ cursor: "pointer", color: "#1E3A8A" }}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
            handleEmailClick(record);
          }}
        >
          {record.user?.email}
        </div>
      ),
      width: 200,
    },
    {
      title: "Card ID",
      dataIndex: "cardId",
      width: 200,
    },
    {
      title: "User Id",
      dataIndex: "userId",
      width: 200,
      render: (text, record) => (
        <div
          style={{ cursor: "pointer", color: "#1E3A8A" }}
          onClick={() =>
            // e.stopPropagation();
            // setOpen(true);
            handleUserIdClick(PageNumber2, record)
          }
        >
          {record.userId}
        </div>
      ),
    },
    {
      title: "Currency",
      dataIndex: "cardCurrency",
      render: (text, record) => {
        return record.cardCurrency?.split("_")[0];
      },
      width: 100,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (customerBalance) => {
        return toWholeCurrency(customerBalance);
      },
      width: 100,
    },
    {
      title: "Date",
      index: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt, "YYYY-MM-DD HH:mm:ss").format("lll");
      },
      width: 120,
    },
    (props.Role === "super-admin" ||
      (props.Role === "finance-admin" &&
        props.user?.data?.data?.email === "martins@vesti.com")) && {
      title: "Action",
      dataIndex: "action",
      // fixed:'right',
      width: 200,
      render: (text, record) => {
        return <CBCardFunding cardId={record.cardId} />;
      },
    },
  ].filter(Boolean);

  const nestedColumns = [
    {
      title: "S/N",
      dataIndex: "serial",
      fixed: "left",
      render: (text, record, rowIndex) => rowIndex + 1,
      width: 60,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => {
        return record.user?.email;
      },
      width: 200,
    },
    {
      title: "Card ID",
      dataIndex: "cardId",
      width: 200,
    },
    {
      title: "Currency",
      dataIndex: "currency ",
      render: (text, record) => {
        return record.currency;
      },
      width: 80,
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
      title: "Balance",
      dataIndex: "balance",
      render: (balance) => {
        return toWholeCurrency(balance);
      },
      width: 100,
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
        let color;
        let text = "N/A"; // Default text for null status

        if (tag) {
          if (tag.includes("PENDING")) {
            color = "#f39c0a";
            text = tag;
          } else if (tag.includes("SUCCESS")) {
            color = "#117439";
            text = tag;
          } else {
            color = "#921616";
            text = tag;
          }
        }

        return (
          <Tag color={color} key={tag}>
            {text}
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

  const cardColumns = [
    {
      title: "S/N",
      dataIndex: "serial",
      fixed: "left",
      render: (text, record, rowIndex) => rowIndex + 1,
      width: 60,
    },
    {
      title: "Card Name",
      dataIndex: "cardName",
      width: 200,
    },
    {
      title: "Card ID",
      dataIndex: "cardId",
      width: 200,
    },
    {
      title: "Currency",
      dataIndex: "currency ",
      render: (text, record) => {
        return record.cardCurrency?.split("_")[0];
      },
      width: 80,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (balance) => {
        return toWholeCurrency(balance);
      },
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "cardStatus",
      width: 120,
      render: (tag) => {
        let color;
        let text = "N/A"; // Default text for null status

        if (tag) {
          if (
            tag.includes("Card - Inactive") ||
            tag.includes("Card - inactive")
          ) {
            color = "red";
            text = tag;
          } else if (tag.includes("Card - Active") || tag.includes("active")) {
            color = "green";
            text = tag;
          } else {
            color = "#921616";
            text = tag;
          }
        }

        return (
          <Tag color={color} key={tag}>
            {text}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {selectedUser ? (
          <main>
            {/* Content */}
            <div className="mt-10">
              <div className="relative">
                <div className="px-4 sm:px-6 lg:px-2 w-full  mx-auto">
                  <div className="flex justify-between">
                    <h2 className="text-xl leading-snug text-blue-950 font-bold mb-1">
                      User's Virtual Card Transactions
                    </h2>
                    <h3
                      className="font-semibold text-blue-950 cursor-pointer flex"
                      onClick={handleBackClick}
                    >
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
                          className="text-blue-950 font-bold"
                          d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
                        />
                      </svg>
                      Back
                    </h3>
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
                      <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                        {/* <VirtualCardUserTransactionsDropdown
                          // options={userOptions}
                          align="right"
                        /> */}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <header className="px-5 py-4">
                        <h2 className="font-semibold text-blue-900">
                          <span className="text-slate-400 font-medium">
                            {totalItems?.toLocaleString()}
                          </span>{" "}
                          Transactions{" "}
                        </h2>
                      </header>

                      {/* Table */}
                      <div className="table-auto w-full">
                        <Table
                          loading={loading}
                          columns={nestedColumns}
                          dataSource={modalData}
                          rowkey="id"
                          pagination={{
                            current: PageNumber2,
                            total: totalItems,
                            pageSize: 50,
                            onChange: (pageNumber) => {
                              setPageNumber2(pageNumber);
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
          </main>
        ) : (
          <main>
            {/* Content */}
            <div className="mt-10">
              <div className="relative">
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0 py-4">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      Virtual Card List
                    </h1>
                  </div>

                  {/* Right: Actions */}
                  <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                    {/* <CBCardFunding /> */}
                  </div>
                </div>
                <div className="sm:flex justify-end"></div>
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
                  </div>

                  <div className="overflow-x-auto">
                    <header className="px-5 py-4">
                      <h2 className="font-semibold text-blue-900">
                        Virtual Transactions{" "}
                        <span className="text-slate-400 font-medium">
                          {total?.toLocaleString()}
                        </span>
                      </h2>
                    </header>

                    {/* Table */}
                    <div className="table-auto w-full">
                      <Table
                        loading={loading}
                        columns={columns}
                        dataSource={dataSource}
                        rowkey={(record) => record.id}
                        pagination={{
                          current: PageNumber,
                          total: total,
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
          </main>
        )}
      </div>
      {selectedItems && (
        <SingleCardTransactionPanel
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          cardTransactionPanelOpen={cardTransactionPanelOpen}
          setCardTransactionPanelOpen={setCardTransactionPanelOpen}
        />
      )}

      {/* customer cards modal */}
      <AdminModal
        id="card-modal"
        modalOpen={open}
        setModalOpen={setOpen}
        title="All Customer's Cards"
        click={() => setOpen(false)}
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div className="table-auto w-full">
                <Table
                  loading={loading}
                  columns={cardColumns}
                  dataSource={cardData}
                  rowKey={(record) => record.id}
                  pagination={{
                    current: 1,
                    total: 1,
                  }}
                  scroll={{
                    x: 1000,
                    y: 500,
                  }}
                ></Table>
              </div>
            </div>
          </form>
        </div>
      </AdminModal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  customers: state.customers,
  admin: state.admin,
});

export default connect(mapStateToProps)(VirtualCardConversions);
