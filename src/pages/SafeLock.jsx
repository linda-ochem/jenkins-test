import React, { useEffect, useState } from "react";

import SearchForm from "../partials/actions/SearchForm";
import { Spin, Table, Tag, message, DatePicker } from "antd";
import moment from "moment";
import SingleCardTransactionPanel from "../partials/cardTables/SingleCardTransactionPanel";
import { CreatePlan, createPlanCategory, getSavingsPlans } from "../actions";
import ModalBlank from "../partials/actions/ModalBlank";
import { formatAmount } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import { toWholeCurrency } from "../helpers";
import { sendGetRequest2 } from "../requests";
import { Link } from "react-router-dom";

function SafeLock(props) {
  const navigate = useNavigate();
  const [planTitle, setPlanTitle] = useState("");
  const [categoryTitle, setCategoryTitle] = useState("");
  const [rate, setRate] = useState("");
  const [options, setOptions] = useState([]);
  const [safeLockPlanId, setSafeLockPlanId] = useState("");
  const [selectedItems, setSelectedItems] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [cardTransactionPanelOpen, setCardTransactionPanelOpen] =
    useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [PageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [ModalOpen, setModalOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [filterParams, setFilterParams] = useState({
    status: "",
    currency: "",
    safeLockId: "",
    userId: "",
    muturityStatus: "",
    search: "",
  });
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFilterParams, setExportFilterParams] = useState({
    currency: "",
    safeLockId: "",
    userId: "",
    status: "",
    paymentChannel: "",
    endDate: "",
    startDate: "",
  });

  const handleExportFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setExportFilterParams({
      ...exportFilterParams,
      [name]: newValue,
    });
  };

  const handleExportDateRangeChange = (date, dateString) => {
    setExportFilterParams({
      ...exportFilterParams,
      startDate: dateString[0],
      endDate: dateString[1],
    });
    // console.log(date);
    // console.log(dateString)
  };

  const handleNameClick = (record) => {
    // Redirect to UserDetails component with the record data
    navigate(`/safelock/${record.userId}`);

    // console.log(record.userId);
  };

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setFilterParams({
      ...filterParams,
      [name]: newValue,
    });
  };

  const handleDateRangeChange = (date, dateString) => {
    setFilterParams({
      ...filterParams,
      startDate: dateString[0],
      endDate: dateString[1],
    });
    // console.log(date);
    // console.log(dateString)
  };

  // const fetchSavingsReport = async () => {
  //   const queryString = Object.keys(exportFilterParams)
  //     .filter(
  //       (key) =>
  //         exportFilterParams[key] !== null && exportFilterParams[key] !== ""
  //     ) // Filter out empty and null values
  //     .map((key) => `${key}=${exportFilterParams[key]}`)
  //     .join("&");

  //   // const endpoint = `https://api.wevesti.com/api/v1/admin/safe-locks-export?page=${PageNumber}&limit=50${
  //   //   queryString ? `&${queryString}` : ""
  //   // }`;
  //   // window.location.href = endpoint;

  //   try {
  //     setLoading(true);
  //     const response = await sendGetRequest2(
  //       `/admin/safe-locks-export?page=${PageNumber}&limit=50${
  //         queryString ? `&${queryString}` : ""
  //       }`
  //     );
  //     console.log(response);
  //     if (response.data) {
  //       // const blob = await response.data.blob();
  //       // const url = window.URL.createObjectURL(blob);

  //       // const newTab = window.open(url, "_blank");

  //       // setTimeout(() => {
  //       //   newTab.close();
  //       //   window.focus();
  //       // }, 5000);
  //       setLoading(false);
  //       console.log(response);
  //     } else {
  //       setLoading(false);
  //       console.error("Error fetching data from the API");
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     console.error("Network error:", error);
  //   }
  // };

  const fetchSavingsReport = async () => {
    const queryString = Object.keys(exportFilterParams)
      .filter(
        (key) =>
          exportFilterParams[key] !== null && exportFilterParams[key] !== ""
      ) // Filter out empty and null values
      .map((key) => `${key}=${exportFilterParams[key]}`)
      .join("&");
    setLoading(true);
    await sendGetRequest2(
      `/admin/safe-locks-export?page=${PageNumber}&limit=50${
        queryString ? `&${queryString}` : ""
      }`,
      {
        responseType: "blob", // Important to specify the response type as 'blob'
      }
    )
      .then(function (response) {
        setLoading(false);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        // Extract filename from Content-Disposition header or use a default
        const contentDisposition = response.headers["content-disposition"];
        let filename = "download.csv";
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?(.+)"?/);
          if (match.length === 2) filename = match[1];
        }

        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(function (error) {
        setLoading(false);
        if (error?.response) {
          setError(error?.response?.data ?? error?.message);
          return;
        }
        setError(error.message);
      })
      .finally(function () {});
  };

  useEffect(() => {
    const fetchSavings = async () => {
      const queryString = Object.keys(filterParams)
        .filter((key) => filterParams[key] !== null && filterParams[key] !== "") // Filter out empty and null values
        .map((key) => `${key}=${filterParams[key]}`)
        .join("&");

      try {
        setLoading(true);
        const response = await sendGetRequest2(
          `/admin/safe-locks?page=${PageNumber}&limit=20${
            queryString ? `&${queryString}` : ""
          }`
        );
        // console.log(response);
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

    fetchSavings();
  }, [filterParams, PageNumber]);

  const fetchSavingsPlan = async () => {
    try {
      (async () => {
        setLoading(true);
        const response1 = await getSavingsPlans();
        // console.log(response1);
        setOptions(response1.data?.data);
        // setTotal(response1.data?.pagination?.total);
        setLoading(false);
      })();
    } catch (error) {
      setLoading(false);
    }
  };

  const createCategory = async () => {
    const data = {
      safeLockPlanId,
      title: categoryTitle,
      rate,
    };

    setIsLoading(true);

    try {
      const res = await createPlanCategory(data);
      // console.log(res);
      message.success(res?.data?.message);
      setModalOpen(false);
      setRate("");
      setCategoryTitle("");
      setSafeLockPlanId("");
      window.location.reload();
    } catch (error) {
      // console.error("Error sending admin invite:", error);
      message.error("Unable to add category, Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const createNewPlan = async () => {
    setIsLoading(true);
    const data = {
      title: planTitle,
    };
    try {
      const res = await CreatePlan(data);
      // console.log(res);
      message.success(res?.data?.message);
      setOpen(false);
      setPlanTitle("");
      window.location.reload();
    } catch (error) {
      // message.error(error.data?.response?.message);
      message.error("Unable to add plan, Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavingsPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: "S/N",
      dataIndex: "serial",
      fixed: "left",
      render: (text, record, rowIndex) => rowIndex + 1,
      width: 60,
    },
    {
      title: "User",
      dataIndex: "user",
      render: (text, record) => {
        return (
          <div
            style={{ cursor: "pointer", color: "#080675" }}
            onClick={() => handleNameClick(record)}
          >
            {record?.user?.firstName} {record?.user?.lastName}
          </div>
        );
      },
      width: 120,
    },
    {
      title: "Savings Name",
      dataIndex: "name",
      width: 120,
      // onCell: (record) => {
      //   return {
      //     style: { cursor: "pointer", color: "#080675" },
      //     onClick: () => {
      //       handleNameClick(record);
      //     },
      //   };
      // },
    },
    {
      title: "Plan",
      dataIndex: "plan ",
      render: (text, record) => {
        return record.plan?.title;
      },
      width: 80,
    },
    {
      title: "Plan Category",
      dataIndex: "planCategory ",
      render: (text, record) => {
        return record.planCategory?.title;
      },
      width: 100,
    },
    {
      title: "Interest",
      render: (text, record) => `${record.interest}%`,
      width: 90,
    },

    {
      title: "Frequency",
      dataIndex: "frequency",
      width: 110,
    },
    {
      title: "Payment Channel",
      dataIndex: "paymentChannel",
      width: 100,
    },
    {
      title: "Currency",
      dataIndex: "currency ",
      render: (text, record) => {
        return record.currency;
      },
      width: 95,
    },
    {
      title: "Savings Balance",
      dataIndex: "lockedAmount",
      render: (lockedAmount) => {
        return formatAmount(lockedAmount / 100, 2);
      },
      width: 100,
    },
    {
      title: "Target",
      dataIndex: "targetAmount",
      render: (targetAmount) => {
        return formatAmount(targetAmount / 100, 2);
      },
      width: 100,
    },
    {
      title: "Expected Yield",
      render: (text, record) => `${toWholeCurrency(record.totalExpectedYield)}`,
      width: 100,
    },
    {
      title: "Start Date",
      index: "startDate",
      render: (text, record) => {
        return moment(record.startDate, "YYYY-MM-DD").format("lll");
      },
      width: 120,
    },
    {
      title: "End Date",
      index: "endDate",
      render: (text, record) => {
        return moment(record.endDate, "YYYY-MM-DD").format("lll");
      },
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (tag) => {
        const color = tag.includes("active")
          ? "#117439"
          : tag.includes("completed")
          ? "#921616"
          : tag.includes("pending")
          ? "#f39c0a"
          : tag.includes("terminated")
          ? "#921616"
          : tag.includes("cancelled")
          ? "#921616"
          : "";
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
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          {/* Content */}
          <div className="mt-10">
            <div className="relative">
              <div className=" w-full mx-auto">
                {/* <div className=" w-full max-w-9xl mx-auto"> */}
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2 w-full">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      Safelock
                    </h1>
                  </div>
                  <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                    {props.Role !== "admin" && (
                      <div className="grid grid-flow-col sm:auto-cols-max justify-between sm:justify-end gap-2">
                        <button
                          className="bg-blue-900 rounded flex justify-between items-center gap-4 text-[16px] h-12 px-5  w-full"
                          onClick={() => setOpen(true)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-white"
                              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>

                          <span className="text-white">Create Plan</span>
                        </button>
                        <button
                          className="bg-blue-900 rounded flex justify-between items-center gap-4 text-[16px] h-12 px-5  w-full"
                          onClick={() => setModalOpen(true)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="shrink-0 w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-white"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>

                          <span className="text-white">Create Category</span>
                        </button>
                        {props.Role === "super-admin" && (
                          <button
                            className="bg-blue-900 rounded flex justify-between items-center gap-4 text-[16px] h-12 px-5  w-full"
                            onClick={() => setExportModalOpen(true)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 text-white"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                              />
                            </svg>

                            <span className="text-white">Export</span>
                          </button>
                        )}
                      </div>
                    )}
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

                  {/* Table */}
                  <div className="table-auto w-full">
                    <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full">
                      <header className="px-5 py-4">
                        <h2 className="font-semibold text-blue-900">
                          Safelocks{" "}
                          <span className="text-slate-400 font-medium">
                            {total?.toLocaleString()}
                          </span>
                        </h2>
                      </header>
                      <div className="sm:flex sm:gap-3 sm:items-center mb-4 pb-4 md:mb-2 w-full justify-end ">
                        {/* Filter by Transaction Status */}
                        <div className="w-[15%]">
                          <label htmlFor="Transaction Type" className="sr-only">
                            Select Status
                          </label>
                          <select
                            name="status"
                            value={filterParams.status}
                            onChange={handleFilterChange}
                            className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                              filterParams.trxType
                                ? "bg-blue-100"
                                : "bg-transparent"
                            }`}
                          >
                            <option value="">
                              {filterParams.status
                                ? filterParams.status
                                : "Status"}
                            </option>
                            <option value="">All</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="terminated">terminated</option>
                          </select>
                        </div>

                        {/* Filter by Currency */}
                        {/* <div className="w-[15%]">
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
                        </div> */}
                      </div>
                    </div>
                    <div className="w-full">
                      <Table
                        loading={loading}
                        columns={columns}
                        dataSource={dataSource}
                        rowKey={(record) => record.id}
                        pagination={{
                          current: PageNumber,
                          total: total,
                          pageSize: 20,
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
            </div>
          </div>
        </main>
        {/* create Plan */}
        <ModalBlank
          id="report-modal"
          modalOpen={open}
          setModalOpen={setOpen}
          click={() => {
            setOpen(false);
            setPlanTitle("");
          }}
          title="Create Savings Plan"
        >
          {/* Modal content */}
          <div className="px-5 py-4">
            <form>
              <div className="space-y-3">
                <div>
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="title"
                  >
                    Plan Title
                  </label>

                  <input
                    type="text"
                    className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
            </form>
          </div>
          {/* Modal footer */}
          <div className="px-5 py-4 w-full">
            <div className="flex flex-wrap justify-between w-full">
              {isLoading ? (
                <div className="flex items-center justify-center mx-auto">
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  <button
                    className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(false);
                      setPlanTitle("");
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    onClick={() => {
                      createNewPlan();
                    }}
                    disabled={planTitle !== "" ? false : true}
                    className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                      planTitle
                        ? " bg-blue-900 text-white hover:bg-blue-950"
                        : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
                    }`}
                  >
                    {isLoading
                      ? "Creating Savings Plan..."
                      : "Create Savings Plan"}
                  </button>
                </>
              )}
            </div>
          </div>
        </ModalBlank>

        {/* add category */}
        <ModalBlank
          id="report-modal"
          modalOpen={ModalOpen}
          setModalOpen={setModalOpen}
          click={() => {
            setModalOpen(false);
            setCategoryTitle("");
            setSafeLockPlanId("");
          }}
          title="Create Plan Category"
        >
          {/* Modal content */}
          <div className="px-5 py-4">
            <form>
              <div className="space-y-3">
                <div>
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="title"
                  >
                    Category Title
                  </label>

                  <input
                    type="text"
                    className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                    value={categoryTitle}
                    onChange={(e) => setCategoryTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="rate"
                  >
                    Category Rate
                  </label>

                  <input
                    type="text"
                    className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="currency"
                  >
                    Safelock Plan Id
                  </label>

                  <select
                    value={safeLockPlanId}
                    onChange={(e) => setSafeLockPlanId(e.target.value)}
                    className="form-select h-12 w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-900 text-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                  >
                    <option value="">---Select Plan---</option>
                    {/* {console.log(options)} */}
                    {options?.map((option, index) => (
                      <option key={index} value={option.id}>
                        {option.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>
          {/* Modal footer */}
          <div className="px-5 py-4 w-full">
            <div className="flex flex-wrap justify-between w-full">
              {isLoading ? (
                <div className="flex items-center justify-center mx-auto">
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  <button
                    className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalOpen(false);
                      setCategoryTitle("");
                      setSafeLockPlanId("");
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    onClick={() => {
                      createCategory();
                    }}
                    disabled={
                      categoryTitle !== "" && safeLockPlanId !== ""
                        ? false
                        : true
                    }
                    className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                      categoryTitle && safeLockPlanId
                        ? " bg-blue-900 text-white hover:bg-blue-950"
                        : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
                    }`}
                  >
                    {isLoading ? "Creating Plan..." : "Create Plan"}
                  </button>
                </>
              )}
            </div>
          </div>
        </ModalBlank>

        {/* export filter */}
        <ModalBlank
          id="report-modal"
          modalOpen={exportModalOpen}
          setModalOpen={setExportModalOpen}
          click={() => {
            setExportModalOpen(false);
            setExportFilterParams({
              status: "",
              paymentChannel: "",
              currency: "",
              safeLockId: "",
              userId: "",
              endDate: "",
              startDate: "",
            });
          }}
          title="Export Filter"
        >
          {/* Modal content */}
          <div className="px-5 py-4">
            <form>
              <div className="space-y-3">
                <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full gap-4 ">
                  {/* Left: Searchbar */}
                  <div className="mb-4 sm:mb-0 w-full">
                    <div className=" hidden sm:block w-full ">
                      <label htmlFor="Currency" className="sr-only">
                        Select Type
                      </label>
                      <select
                        name="currency"
                        value={exportFilterParams.currency}
                        onChange={handleExportFilterChange}
                        className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          exportFilterParams.currency
                            ? "bg-blue-100"
                            : "bg-transparent"
                        }`}
                      >
                        <option value="">
                          {exportFilterParams.currency
                            ? exportFilterParams.currency
                            : "Currency"}
                        </option>
                        <option value="NGN">Naira (₦)</option>
                        <option value="USD">Dollar ($)</option>
                        <option value="GBP">Pounds (£)</option>
                        <option value="GHS">Cedis (¢)</option>
                        <option value="ZMW">Kwacha (zmw)</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4 sm:mb-0 w-full">
                    <div className=" hidden sm:block w-full ">
                      <label htmlFor="status" className="sr-only">
                        Select Type
                      </label>
                      <select
                        name="status"
                        value={exportFilterParams.status}
                        onChange={handleExportFilterChange}
                        className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          exportFilterParams.status
                            ? "bg-blue-100"
                            : "bg-transparent"
                        }`}
                      >
                        <option value="">
                          {exportFilterParams.status
                            ? exportFilterParams.status
                            : "Status"}
                        </option>
                        <option value="active">Active </option>
                        <option value="completed">Completed </option>
                        <option value="pending">Pending </option>
                        <option value="terminated">Terminated </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-between gap-4 items-center">
                  <div className="w-1/2">
                    <label
                      className="block text-sm font-medium mb-1 text-blue-900"
                      htmlFor="rate"
                    >
                      User ID
                    </label>

                    <input
                      type="text"
                      className="form-textarea w-full px-2 py-1 h-9 border border-blue-950  text-blue-900"
                      value={exportFilterParams.userId}
                      onChange={handleExportFilterChange}
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block text-sm font-medium mb-1 text-blue-900"
                      htmlFor="rate"
                    >
                      Safelock ID
                    </label>

                    <input
                      type="text"
                      className="form-textarea w-full px-2 py-1 h-9 border border-blue-950  text-blue-900"
                      value={exportFilterParams.safeLockId}
                      onChange={handleExportFilterChange}
                    />
                  </div>
                </div>
                <div className="sm:flex sm:justify-between sm:items-center mt-4 pt-4 md:mb-2 w-full gap-4">
                  <div className="w-1/2">
                    <DatePicker.RangePicker
                      style={{
                        borderRadius: "18px",
                        padding: "7px 11px 7px",
                        borderColor: "#3b82f680",
                        width: "100%",
                      }}
                      value={[
                        exportFilterParams.startDate
                          ? moment(exportFilterParams.startDate)
                          : "",
                        exportFilterParams.endDate
                          ? moment(exportFilterParams.endDate)
                          : "",
                      ]}
                      onChange={handleExportDateRangeChange}
                    />
                  </div>
                  <div className="w-1/2">
                    <div className=" hidden sm:block w-full ">
                      <label htmlFor="paymentChannel" className="sr-only">
                        Select Type
                      </label>
                      <select
                        name="paymentChannel"
                        value={exportFilterParams.paymentChannel}
                        onChange={handleExportFilterChange}
                        className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          exportFilterParams.paymentChannel
                            ? "bg-blue-100"
                            : "bg-transparent"
                        }`}
                      >
                        <option value="">Payment Channel</option>
                        <option value="wallet">Wallet </option>
                        <option value="card">Card </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          {/* Modal footer */}
          <div className="px-5 py-4 w-full">
            <div className="flex flex-wrap justify-between w-full">
              {loading ? (
                <div className="flex items-center justify-center mx-auto">
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  <button
                    className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExportModalOpen(false);
                      setExportFilterParams({
                        status: "",
                        currency: "",
                        safeLockId: "",
                        userId: "",
                        paymentChannel: "",
                        endDate: "",
                        startDate: "",
                      });
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    onClick={() => {
                      fetchSavingsReport();
                    }}
                    disabled={loading}
                    className="btn-sm border-blue-600 h-16 w-1/2 flex flex-col bg-blue-900 text-white hover:bg-blue-950"
                  >
                    {isLoading ? "Exporting Data..." : "Export Data"}
                  </button>
                  {/* <a
                    href={endpoint}
                    target="_blank"
                    disabled={loading}
                    className="btn-sm border-blue-600 h-16 w-1/2 flex flex-col bg-blue-900 text-white hover:bg-blue-950"
                  >
                    {isLoading ? "Exporting Data..." : "Export Data"}
                  </a> */}
                </>
              )}
            </div>
          </div>
        </ModalBlank>
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

export default SafeLock;
