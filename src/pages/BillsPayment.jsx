import React, { useEffect, useState } from "react";

import SearchForm from "../partials/actions/SearchForm";
import { connect } from "react-redux";
import { toWholeCurrency } from "../helpers";
import moment from "moment";
import SingleCardTransactionPanel from "../partials/cardTables/SingleCardTransactionPanel";
import { DatePicker, Table, Tag } from "antd";
import { sendGetRequest2 } from "../requests";
import { useNavigate } from "react-router-dom";
// import TransactionsDropdown from "../partials/actions/TransactionsDropdown";

function BillsPayment(props) {
  const navigate = useNavigate();
  const [filterParams, setFilterParams] = useState({
    trxStatus: "",
    currency: "",
    category: "",
    trxRef: "",
    startDate: "",
    endDate: "",
    search: "",
  });
  const [selectedItems, setSelectedItems] = useState(null);
  const [cardTransactionPanelOpen, setCardTransactionPanelOpen] =
    useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataSource, setDataSource] = useState(null);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  // console.log(props);

  // console.log("dataSource : ", dataSource);

  const handleDateRangeChange = (date, dateString) => {
    setFilterParams({
      ...filterParams,
      startDate: dateString[0],
      endDate: dateString[1],
    });
    // console.log(date);
    // console.log(dateString)
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


  const handleIdClick = (record) => {
    // Redirect to UserDetails component with the record data
    navigate(`/${record.userId}`, {
      state: { user: record },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const queryString = Object.keys(filterParams)
        .filter((key) => filterParams[key] !== null && filterParams[key] !== "") // Filter out empty and null values
        .map((key) => `${key}=${filterParams[key]}`)
        .join("&");

      try {
        setLoading(true);
        const response = await sendGetRequest2(
          `/admin/bill-payments?page=${pageNumber}&limit=50${
            queryString ? `&${queryString}` : ""
          }`
        );
        if (response.data) {
          setLoading(false);
          // console.log(response);
          setDataSource(response.data?.data);
          setTotal(response.data?.pagination?.total);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParams, pageNumber]);

  const columns = [
    {
      title: "S/N",
      dataIndex: "serial",
      fixed: "left",
      render: (text, record, rowIndex) => rowIndex + 1,
      width: 80,
    },
    {
      title: "User Name",
      dataIndex: "userId",
      render: (text, record) => {
        return (
          <div
            style={{ cursor: "pointer", color: "#080675" }}
            onClick={() => handleIdClick(record)}
          >
            {record?.user?.firstName} {record?.user?.lastName}
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
      title: "Charges",
      dataIndex: "charges",
      render: (charges) => {
        return toWholeCurrency(charges);
      },
      width: 100,
    },
    {
      title: "Current Balance",
      dataIndex: "currentBalance",
      render: (currentBalance) => {
        return toWholeCurrency(Number(currentBalance));
      },
      width: 120,
    },
    {
      title: "Transaction Type",
      dataIndex: "billerType",
      width: 150,
    },
    {
      title: "Billing Number",
      dataIndex: "billingNumber",
      width: 150,
    },
    {
      title: "Transaction Ref",
      dataIndex: "trxRef",
      width: 150,
    },
    {
      title: "Balance",
      dataIndex: "currentBalance",
      render: (balance) => {
        return toWholeCurrency(Number(balance));
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
      dataIndex: "trxStatus",
      width: 120,
      render: (tag, record) => {
        let color;
        let text = "N/A"; // Default text for null status

        if (tag) {
          if (tag.includes("pending")) {
            color = "#f39c0a";
            text = tag;
          } else if (tag.includes("success")) {
            color = "#117439";
            text = tag;
          } else {
            color = "#921616";
            text = tag;
          }
        }

        return (
          <Tag
            style={{ cursor: "pointer" }}
            color={color}
            key={tag}
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(record);
            }}
          >
            {text}
          </Tag>
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
              <div className="px-4 sm:px-6 lg:px-2 w-full mx-auto">
              {/* <div className="px-4 sm:px-6 lg:px-2 w-full max-w-9xl mx-auto"> */}
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      Bills Payment
                    </h1>
                  </div>
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
                    <div className="w-[15%]">
                      <label htmlFor="Transaction Status" className="sr-only">
                        Select Type
                      </label>
                      <select
                        name="trxStatus"
                        value={filterParams.trxStatus}
                        onChange={handleFilterChange}
                        className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          filterParams.trxStatus
                            ? "bg-blue-100"
                            : "bg-transparent"
                        }`}
                      >
                        <option value="">
                          {filterParams.trxStatus
                            ? filterParams.trxStatus
                            : "Status"}
                        </option>
                        <option value="success">Successful</option>
                        <option value="failed">Failed</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    {/* Filter by Currency */}
                    <div className="w-[15%]">
                      <label htmlFor="Currency" className="sr-only">
                        Select Type
                      </label>
                      <select
                        name="currency"
                        value={filterParams.currency}
                        onChange={handleFilterChange}
                        className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          filterParams.currency
                            ? "bg-blue-100"
                            : "bg-transparent"
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
                    <div className="w-[15%]">
                      <label htmlFor="type" className="sr-only">
                        Select Type
                      </label>
                      <select
                        name="category"
                        value={filterParams.category}
                        onChange={handleFilterChange}
                        className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          filterParams.category
                            ? "bg-blue-100"
                            : "bg-transparent"
                        }`}
                      >
                        <option value="">
                          {filterParams.category
                            ? filterParams.category
                            : "Transaction Type"}
                        </option>
                        <option value={"airtime"}>Airtime</option>
                        <option value="internet">Internet</option>
                        <option value="cable">Cable</option>
                        <option value="electricity">Electricity</option>
                      </select>
                    </div>

                    {/* Filter by Date */}
                    <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                      {/* <DatePicker.RangePicker
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
                      /> */}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <header className="px-5 py-4">
                      <h2 className="font-semibold text-blue-900">
                        Transactions{" "}
                        <span className="text-slate-400 font-medium">
                          {total?.toLocaleString()}
                        </span>
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
  getAllBillsPaymentTransactions: (page, type, searchQuery) => {
    dispatch(getAllBillsPaymentTransactions(page, type, searchQuery));
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  customers: state.customers,
  admin: state.admin,
});

export default connect(mapStateToProps, mapDispatchToProps)(BillsPayment);
