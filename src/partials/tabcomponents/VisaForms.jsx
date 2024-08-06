import React, { useEffect, useState } from "react";

import SearchForm from "../../partials/actions/SearchForm";
import { Spin, Table } from "antd";
import moment from "moment";
import SingleCardTransactionPanel from "../../partials/cardTables/SingleCardTransactionPanel";
import ModalBlank from "../../partials/actions/ModalBlank";
import { getVisaForms } from "../../actions";
import { useNavigate } from "react-router-dom";
// import DropdownFull from "../partials/actions/DropdownFull";

function VisaForms(props) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleNameClick = (record) => {
    // Redirect to UserDetails component with the record data
    navigate(`/${record.userId}`, {
      state: { user: record },
    });
  };

  const fetchTransactions = async () => {
    try {
      (async () => {
        setLoading(true);
        const response = await getVisaForms(PageNumber);
        console.log(response);
        setDataSource(response.data);
        setTotal(response.data?.length);
        // setTotal(response.pagination.total);
        setLoading(false);
      })();
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PageNumber]);

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
      width: 250,
      onCell: (record) => {
        return {
          style: { cursor: "pointer", color: "#080675" },
          onClick: () => {
            handleNameClick(record);
          },
        };
      },
    },
    {
      title: "Visa Type",
      dataIndex: "visaType",
      width: 100,
    },
    {
      title: "Date",
      index: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt, "YYYY-MM-DD").format("lll");
      },
      width: 120,
    },
    {
      title: "Payment Date",
      index: "paymentDate",
      render: (text, record) => {
        return moment(record.paymentDate, "YYYY-MM-DD").format("lll");
      },
      width: 120,
    },
    {
      title: "Resume",
      key: "download",
      render: (_, record) => (
        <a href={record.resumeCredentialscv} download>
          Download
        </a>
      ),
    },
    {
      title: "Review Status",
      dataIndex: "reviewStatus",
      width: 200,
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   width: 120,
    //   render: (tag) => {
    //     const color = tag.includes("active")
    //       ? "#117439"
    //       : tag.includes("completed")
    //       ? "#921616"
    //       : tag.includes("pending")
    //       ? "#f39c0a"
    //       : tag.includes("cancelled")
    //       ? "#921616"
    //       : tag.includes("terminated")
    //       ? "#921616"
    //       : "";
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
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <div className="px-4 sm:px-6 lg:px-6 w-full  mx-auto">
            {/* Content */}
            <div className="mt-10">
              <div className="relative">
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0 py-4">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      Visa Forms
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
                          onChange={(e) => setSearchTerm(e.target.value)}
                          value={searchTerm}
                          // onSubmit={handleSearch}
                        />
                      </div>
                    </div>

                    {/* Right: filter Actions */}
                    <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                      {/* <DropdownFull
                          options={options}
                          align="right"
                        /> */}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="table-auto w-full">
                    <header className="px-5 py-4">
                      <h2 className="font-semibold text-blue-900">
                        Visa Requests{" "}
                        <span className="text-slate-400 font-medium">
                          {total?.toLocaleString()}
                        </span>
                      </h2>
                    </header>
                    <Table
                      loading={loading}
                      columns={columns}
                      dataSource={dataSource}
                      rowkey="id"
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
            setOpen(false);
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
                      setOpen(false);
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

export default VisaForms;
