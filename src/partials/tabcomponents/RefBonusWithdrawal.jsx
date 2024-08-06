import React, { useEffect, useState } from "react";
import SearchForm from "../../partials/actions/SearchForm";
import { Dropdown, Table, Tag, message } from "antd";
import moment from "moment";
import {
  AdminApproveReferralBonus,
  AdminRetrieveReferralBonusRequests,
} from "../../actions";
import { toWholeCurrency } from "../../helpers";

function RefBonusWithdrawal(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchBonusRequests = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await AdminRetrieveReferralBonusRequests(pageNumber);
      // console.log(res);
      setDataSource(res.data.data);
      setTotal(res.data.pagination.total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Unable to fetch Bonus requests, Pls try again");
    }
  };

  // const BonusRequests = async (requestId, status) => {
  //   try {
  //     setLoading(true);
  //     const res = await AdminApproveReferralBonus(requestId, status);
  //     // console.log(res);
  //     setDataSource(res.data.data);
  //     setTotal(res.data.pagination.total);
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     message.error("Unable to fetch Bonus requests, Pls try again");
  //   }
  // };

  const handleApprove = async () => {
    Modal.confirm({
      title: " Are you sure you want to approve this request?",
      onOk: async () => {
        console.log("Type : ", cardActionType);
        try {
          const res = await AdminApproveReferralBonus(requestId, "Approve");
          // console.log(res);
          message.success(res.data?.message);
        } catch (error) {
          message.error(`${error.response?.data?.message}`);
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      okButtonProps: {
        style: {
          backgroundColor: "#1E3A8A",
        },
      },
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will approve this request",
    });
  };

  const handleDecline = async () => {
    Modal.confirm({
      title: " Are you sure you want to decline this request?",
      onOk: async () => {
        console.log("Type : ", cardActionType);
        try {
          const res = await AdminApproveReferralBonus(requestId, "Approve");
          // console.log(res);
          message.success(res.data?.message);
        } catch (error) {
          message.error(`${error.response?.data?.message}`);
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      okButtonProps: {
        style: {
          backgroundColor: "#1E3A8A",
        },
      },
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will decline this request",
    });
  };

  useEffect(() => {
    fetchBonusRequests(pageNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const items = [
    {
      label: "Approve Request",
      key: "approve",
      onClick: () => {
        handleApprove(requestId, "Approve");
        // alert("i WANT TO APPROVE");
      },
    },
    {
      label: "Decline Request",
      key: "decline",
      onClick: () => {
        handleDecline(requestId, "Decline");
        // alert("i WANT TO DECLINE");
      },
    },
  ];

  const columns = [
    {
      title: "S/N",
      dataIndex: "serial",
      fixed: "left",
      render: (text, record, rowIndex) => rowIndex + 1,
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) =>
        `${record.user?.firstName} ${record.user?.lastName}`,
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => `${record.user?.email}`,
      width: 200,
    },
    {
      title: "No of Referals",
      dataIndex: "totalRefferedInNumber",
      render: (text, record) => `${record.user?.totalRefferedInNumber}`,
      width: 80,
    },
    {
      title: "Total Earned",
      dataIndex: "totalRefferralBonus",
      render: (text, record) =>
        `${toWholeCurrency(record.user?.totalRefferralBonus)}`,
      width: 100,
    },
    {
      title: "Time",
      index: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt, "YYYY-MM-DD HH:mm:ss").format("lll");
      },
      width: 120,
    },
    {
      title: "Status",
      fixed: "right",
      dataIndex: "status",
      width: 120,
      render: (tag, record) => {
        const color = tag.includes("PENDING")
          ? "#117439"
          : tag.includes("COMPLETED")
          ? "#921616"
          : "#f39c0a";
        return (
          <Tag color={color} key={tag}>
            {tag}
          </Tag>
        );
      },
    },
    (props.Role === "finance-admin" || props.Role === "super-admin") && {
      title: "Actions",
      width: 80,
      fixed: "right",
      key: "actions",
      render: (text, record) => (
        <Dropdown
          menu={{
            items,
          }}
          trigger={["hover"]}
          placement="bottom"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#000000"
            viewBox="0 0 256 256"
            style={{ cursor: "pointer" }}
          >
            <path d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144ZM48,96a32,32,0,1,0,32,32A32,32,0,0,0,48,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,48,144ZM208,96a32,32,0,1,0,32,32A32,32,0,0,0,208,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,208,144Z"></path>
          </svg>
        </Dropdown>
      ),
    },
  ].filter(Boolean);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <div className="mt-10">
            <div className="relative">
              <div className=" sm:px-6 lg:px-2 w-full  mx-auto">
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      Referral Bonus Withdrawal Request
                    </h1>
                  </div>
                </div>

                <div className="border p-5">
                  <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full ">
                    {/* Left: Searchbar */}
                    <div className="mb-4 sm:mb-0 w-full">
                      <div className=" hidden sm:block w-full ">
                        <SearchForm
                          placeholder="Search for blacklisted User"
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
                        Withdrawal Requests{" "}
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
      </div>
    </div>
  );
}

export default RefBonusWithdrawal;
