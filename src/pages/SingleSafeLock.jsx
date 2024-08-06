import React, { useEffect, useState } from "react";

import { Spin, Table, Tag, message } from "antd";
import moment from "moment";
import SingleCardTransactionPanel from "../partials/cardTables/SingleCardTransactionPanel";
import {
  getSingleSafelocks,
} from "../actions";
import ModalBlank from "../partials/actions/ModalBlank";
import { formatAmount } from "../utils/Utils";
import { useNavigate } from "react-router-dom";

function SingleSafeLock(props) {
  // console.log(props);
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

  const fetchSavings = async () => {
    try {
      (async () => {
        setLoading(true);
        const response = await getSingleSafelocks(props?.userId, PageNumber);
        // console.log(response);
        // console.log(response.pagination?.total);
        setDataSource(response.data);
        setTotal(response.pagination?.total);
        setLoading(false);
      })();
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavings();
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
      title: "User ID",
      dataIndex: "userId",
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
      width: 150,
    },
    {
      title: "Savings Name",
      dataIndex: "name",
      width: 150,
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
      width: 100,
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
      width: 100,
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
      width: 100,
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
          <div className=" w-full mx-auto">
            {/* Content */}
            <div className="mt-10">
              <div className="relative">
                <div className="border p-5">
                  <header className="">
                    <h2 className="font-semibold text-blue-900">
                      Saving Plans{" "}
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
                      rowKey="id"
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

export default SingleSafeLock;
