import React, { useEffect, useState } from "react";
import SearchForm from "../partials/actions/SearchForm";
import { connect, useDispatch } from "react-redux";
import { toWholeCurrency } from "../helpers";
import { DatePicker, Spin, Table, Tag } from "antd";
import {
  getAllFoundersCardUsers,
  getAllTotals,
  getAllTransactions,
  // getTotalVirtualCardTransactions,
} from "../redux/admin/admin.actions";
import moment from "moment";
import SingleCardTransactionPanel from "../partials/cardTables/SingleCardTransactionPanel";
import { sendGetRequest2 } from "../requests";
import { useNavigate } from "react-router-dom";

function PhysicalCardTransactions(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterParams, setFilterParams] = useState({
    status: "",
    cardId: "",
    userId: "",
    interswitchTransactionReference: true,
  });
  const [selectedItems, setSelectedItems] = useState(null);
  const [cardTransactionPanelOpen, setCardTransactionPanelOpen] =
    useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataSource, setDataSource] = useState(null);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDateRangeChange = (date, dateString) => {
    setFilterParams({
      ...filterParams,
      startDate: dateString[0],
      endDate: dateString[1],
    });
    // console.log(date);
  };

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setFilterParams({
      ...filterParams,
      [name]: newValue,
    });
  };

  const handleRowClick = (transaction) => {
    setCardTransactionPanelOpen(true);
    setSelectedItems(transaction);
  };

  //makes the call to fetch all Card transactions
  useEffect(() => {
    const fetchData = async () => {
      const queryString = Object.keys(filterParams)
        .filter((key) => filterParams[key] !== null && filterParams[key] !== "") // Filter out empty and null values
        .map((key) => `${key}=${filterParams[key]}`)
        .join("&");

      try {
        setLoading(true);
        const response = await sendGetRequest2(
          `/admin/transactions?page=${pageNumber}&limit=50${
            queryString ? `&${queryString}` : ""
          }`
        );
        if (response.data) {
          setLoading(false);
          // console.log(response);
          setDataSource(response.data?.data);
          setTotal(response.data?.data?.pagination?.total);
        } else {
          setLoading(false);
          console.error("Error fetching data from the API");
        }
      } catch (error) {
        setLoading(false);
        console.error("Network error:", error);
      }
    };

    fetchData();
  }, [filterParams, pageNumber]);

  useEffect(() => {
    dispatch(getAllFoundersCardUsers(pageNumber));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  useEffect(() => {
    dispatch(getAllTotals());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      width: 60,
    },
    {
      title: "User Name",
      dataIndex: "fullName",
      render: (text, record) => {
        return (
          <div
            onClick={() => handleNameClick(record)}
            style={{ cursor: "pointer", color: "#080675" }}
          >
            {record.user?.firstName + " " + record.user?.lastName}
          </div>
        );
      },
      width: 200,
    },
    {
      title: "Currency",
      dataIndex: "currency ",
      render: (text, record) => {
        return record.currency?.split("_")[0];
      },
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
    {
      title: "Balance",
      dataIndex: "currentBalance",
      render: (currentBalance) => {
        return toWholeCurrency(Number(currentBalance));
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

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <div className="mt-10">
            <div className="relative">
              <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                {/* Left: Title */}
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                    Physical Card Transactions
                  </h1>
                </div>

                {/* Right: Actions */}
                {/* any buttons or actions here */}
              </div>

              <div className="border p-5">
                <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full ">
                  {/* Left: Searchbar */}
                  <div className="mb-4 sm:mb-0 w-full">
                    <div className=" hidden sm:block w-full ">
                      <SearchForm
                        name="search"
                        placeholder="Search for user transaction"
                        onChange={handleFilterChange}
                        value={filterParams.search}
                      />
                    </div>
                  </div>

                  {/* Right: filter Actions */}
                  <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                    <DatePicker.RangePicker
                      // className="rounded-full "
                      style={{
                        borderRadius: "18px",
                        padding: "7px 11px 7px",
                        borderColor: "#3b82f680",
                      }}
                      value={[
                        filterParams.startDate
                          ? moment(filterParams.startDate)
                          : "",
                        filterParams.endDate
                          ? moment(filterParams.endDate)
                          : "",
                      ]}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                </div>
                <div className="sm:flex sm:gap-3 sm:items-center mb-4 pb-4 md:mb-2 w-full ">
                  {/* Filter by Transaction Status */}
                  <div className="w-full mb-2">
                    <label htmlFor="Transaction Type" className="sr-only">
                      Select Type
                    </label>
                    <select
                      name="status"
                      value={filterParams.status}
                      onChange={handleFilterChange}
                      className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                        filterParams.trxType ? "bg-blue-100" : "bg-transparent"
                      }`}
                    >
                      <option value="">
                        {filterParams.status ? filterParams.status : "Status"}
                      </option>
                      <option value="SUCCESS">Successful</option>
                      <option value="FAILURE">Failed</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </div>

                  {/* Filter by Currency */}
                  <div className="w-full mb-2 ">
                    <label htmlFor="Currency" className="sr-only">
                      Select Type
                    </label>
                    <select
                      name="currency"
                      value={filterParams.currency}
                      onChange={handleFilterChange}
                      className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                        filterParams.currency ? "bg-blue-100" : "bg-transparent"
                      }`}
                    >
                      <option value="">
                        {filterParams.currency
                          ? filterParams.currency
                          : "Currency"}
                      </option>
                      <option value="NGN">Naira (₦)</option>
                      <option value="USD">Dollar ($)</option>
                      <option value="GBP">Pounds (£)</option>
                      <option value="GHS">Cedis (¢)</option>
                      <option value="ZMW">Kwacha (zmw)</option>
                    </select>
                  </div>

                  {/* Filter by Transaction Type */}
                  <div className="w-full mb-2">
                    <label htmlFor="type" className="sr-only">
                      Select Type
                    </label>
                    <select
                      name="type"
                      value={filterParams.type}
                      onChange={handleFilterChange}
                      className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                        filterParams.type ? "bg-blue-100" : "bg-transparent"
                      }`}
                    >
                      <option value="">
                        {filterParams.type
                          ? filterParams.type
                          : "Transaction Type"}
                      </option>
                      <option value=" ">Select transaction type</option>
                      <option value="CARD_CREATION">Card Creation</option>
                      <option value="VIRTUAL_CARD_CREATION">
                        Virtual Card Creation
                      </option>
                      <option value="NEW_CARD_CREATION">
                        New Card Creation
                      </option>
                      <option value="DEPOSIT_TO_CARD">Deposit To Card</option>
                      <option value="CARD_LIQUIDATION">Card Liquidation</option>
                      <option value="DEBIT_FROM_CARD">
                        Withdrawal From Card
                      </option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center -m-3 w-full">
                    
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <header className="px-5 py-4">
                    <h2 className="font-semibold text-blue-900">
                      <span className="text-slate-400 font-medium">
                        {total?.toLocaleString()}
                      </span>
                      Transactions{" "}
                    </h2>
                  </header>
                  <div className="table-auto w-full">
                    <Table
                      loading={loading}
                      columns={columns}
                      dataSource={dataSource}
                      rowKey={(record) => record.id}
                      pagination={{
                        current: pageNumber,
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

        {selectedItems && (
          <SingleCardTransactionPanel
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            cardTransactionPanelOpen={cardTransactionPanelOpen}
            setCardTransactionPanelOpen={setCardTransactionPanelOpen}
          />
        )}
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  getAllTransactions: (page, type, searchQuery, startDate, endDate) => {
    dispatch(getAllTransactions(page, type, searchQuery, startDate, endDate));
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  customers: state.customers,
  admin: state.admin,
});

export default connect(mapStateToProps, mapDispatchToProps)(PhysicalCardTransactions);
