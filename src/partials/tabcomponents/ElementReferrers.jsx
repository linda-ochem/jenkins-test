import React, { useEffect, useState } from "react";
import SearchForm from "../actions/SearchForm";
import { Button, Modal, Table, Tag, message } from "antd";
import moment from "moment";
import { PayElementReferers, fetchElementReferers } from "../../actions";
import ModalBlank from "../actions/ModalBlank";
import { ExclamationCircleFilled } from "@ant-design/icons";

function ElementReferrers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [amountCents, setAmountCents] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // const handleRowClick = (user) => {
  //   setModalOpen(true);
  //   setSelectedUser(user);
  // };

  const fetchAllReferrers = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await fetchElementReferers(pageNumber);
      setDataSource(res.data.data);
      setTotal(res.data.paginationMeta.totalObjects);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Unable to fetch Referers, Pls try again");
    }
  };

  useEffect(() => {
    fetchAllReferrers(pageNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const handlePayBonus = (email) => {
    const data = { amountCents, email };
    Modal.confirm({
      title: " Are you sure you want to credit this user?",
      onOk: async () => {
        try {
          console.log(data);
          await PayElementReferers(data);
          message.success("User credited successfully");
          setModalOpen(false);
        } catch (error) {
          message.error("Error", "Could not credit user", "error");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will credit this user",
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
      title: "Referrer Email",
      fixed: "left",
      dataIndex: "refererEmail",
      width: 200,
    },
    {
      title: "Name",
      dataIndex: "fullname",
      render: (text, record) =>
        `${record.referer.firstName} ${record.referer.lastName}`,
      width: 200,
    },
    {
      title: "Referee Email",
      dataIndex: "refereeEmail",
      width: 200,
    },
    {
      title: "Referer Code",
      dataIndex: "referalCode",
      width: 150,
    },
    {
      title: "Referee KYC Status",
      dataIndex: "verifiedKyc",
      render: (text, record) => {
        if (typeof record.referee.verifiedKyc === "boolean") {
          return record.referee.verifiedKyc ? "Approved" : "Default";
        }
        return record.referee.verifiedKyc;
      },
      width: 150,
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
      title: "Bonus Status",
      dataIndex: "hasBeenPaid",
      fixed: "right",
      render: (value) => {
        if (typeof value === "boolean") {
          return value ? "Paid" : "Refree not Verified";
        }
        return value;
      },
      width: 200,
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   fixed:'right',
    //   render: (text, record) => (
    //     <Button onClick={() => handleRowClick(record)}>Approve</Button>
    //   ),
    //   width: 120,
    // },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <div className="mt-10">
            <div className="relative">
              <div className="px-4 sm:px-6 lg:px-2 w-full  mx-auto">
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      Element Referrers
                    </h1>
                  </div>
                </div>

                <div className="border p-5">
                  <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full ">
                    {/* Left: Searchbar */}
                    <div className="mb-4 sm:mb-0 w-full">
                      <div className=" hidden sm:block w-full ">
                        <SearchForm
                          placeholder="Search for referrer"
                          onChange={(e) => setSearchQuery(e.target.value)}
                          value={searchQuery}
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

                  <div className="overflow-x-auto">
                    <header className="px-5 py-4">
                      <h2 className="font-semibold text-blue-900">
                        Referal Activities{" "}
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
                        rowkey={(record) => record.id}
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
          </div>
        </main>
        <ModalBlank
          id="ref-modal"
          modalOpen={open}
          setModalOpen={(arg) => {
            setSelectedUser(null);
            return setModalOpen(arg);
          }}
          title="Approve referal bonus"
        >
          {selectedUser && (
            <>
              <div className="px-5 py-4">
                <form>
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium mb-1 text-blue-900"
                      >
                        Select Amount
                      </label>
                      <select
                        value={amountCents}
                        onChange={(e) => setAmountCents(e.target.value)}
                        className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          amountCents ? "bg-blue-100" : "bg-transparent"
                        }`}
                      >
                        <option value="">Select an amount</option>
                        <option value="30">$20</option>
                        <option value="30">$30</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>

              <div className="px-5 py-4 w-full">
                <div className="flex flex-wrap justify-between w-full">
                  <button
                    className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalOpen(false);
                      setSelectedUser(null);
                    }}
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePayBonus(selectedUser.refererEmail, amountCents);
                    }}
                    disabled={amountCents !== "" ? false : true}
                    className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                      amountCents
                        ? " bg-blue-900 text-white hover:bg-blue-950"
                        : "bg-gray-400 cursor-not-allowed flex flex-col mx-auto my-auto"
                    }`}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </>
          )}
        </ModalBlank>
      </div>
    </div>
  );
}

export default ElementReferrers;
