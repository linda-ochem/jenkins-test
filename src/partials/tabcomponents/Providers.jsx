import React, { useEffect, useState } from "react";

import SearchForm from "../actions/SearchForm";
import { Popconfirm, Table, Tag, message } from "antd";
import {
  approveProvider,
  disApproveProvider,
  getAllProviders,
} from "../../actions";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
// import DropdownFull from "../partials/actions/DropdownFull";

function Providers(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [PageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const response = await getAllProviders(PageNumber);
      setDataSource(response.data);
      setTotal(response.pagination?.total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Unable to fetch providers, Pls try again");
    }
  };

  useEffect(() => {
    fetchProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PageNumber]);

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "#117439"; // Green color for Approved status
      case "DISAPPROVED":
        return "#921616"; // Red color for Declined status
      default:
        return "#f39c0a"; // Orange color for other statuses (e.g., Pending)
    }
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
      title: "Company Name",
      dataIndex: "companyName",
      width: 200,
    },
    {
      title: "Category",
      dataIndex: "serviceCategory",
      width: 200,
    },
    {
      title: "Website",
      dataIndex: "companyWebsite",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "serviceDescription",
      width: 200,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => (
        <Tag className={getStatusColor(status)}>{status}</Tag>
      ),
    },
    (props.Role === "super-admin" ||
      props.Role === "fraud-admin" ||
      props.Role === "admin") && {
      title: "Actions",
      fixed: "right",
      key: "actions",
      width: 100,
      render: (_, record) =>
        record.status === "PENDING" ? (
          <>
            <Popconfirm
              title="Are you sure to approve?"
              onConfirm={() => handleProvider(record.email, true)}
              okText="Yes"
              cancelText="No"
            >
              <CheckCircleOutlined
                style={{ color: "green", fontSize: "18px", marginRight: "8px" }}
              />
            </Popconfirm>
            <Popconfirm
              title="Are you sure to decline?"
              onConfirm={() => handleProvider(record.email, false)}
              okText="Yes"
              cancelText="No"
            >
              <CloseCircleOutlined style={{ color: "red", fontSize: "18px" }} />
            </Popconfirm>
          </>
        ) : null,
    },
  ].filter(Boolean);

  const handleProvider = (email, approval) => async (e) => {
    try {
      approval ? await approveProvider(email) : disApproveProvider(email);
      message.success("action completed successfully");
    } catch (error) {
      message.error("Could not complete request");
    }

    // Modal.confirm({
    //   title: "Are you sure you want to update withdrawal Limit for this user?",
    //   onOk: async () => {
    //   },
    //   onCancel: () => {
    //     console.log("cancelled");
    //   },
    //   okText: "Yes",
    //   cancelText: "No",
    //   icon: <ExclamationCircleFilled />,
    //   content: "If you continue this action will be completed",
    // });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <div className="px-4 sm:px-6 lg:px-6 w-full mx-auto">
            {/* Content */}
            <div className="mt-10">
              <div className="relative">
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0 py-4">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      Providers
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
                        Providers{" "}
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
      </div>
    </div>
  );
}

export default Providers;
