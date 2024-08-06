import React, { useEffect, useState } from "react";
import SearchForm from "../../partials/actions/SearchForm";
import { Table, Tag, message } from "antd";
import moment from "moment";
import { blacklistedUsersApi } from "../../actions";

function BlacklistedUsers(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchBlacklisted = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await blacklistedUsersApi(pageNumber);
      // console.log(res);
      setDataSource(res.data.data);
      setTotal(res.data?.pagination.total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Unable to fetch blacklisted users, Pls try again");
    }
  };

  useEffect(() => {
    fetchBlacklisted(pageNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const columns = [
    {
      title: "S/N",
      dataIndex: "serial",
      fixed: "left",
      render: (text, record, rowIndex) => rowIndex + 1,
      width: 30,
    },
    {
      title: "Name",
      dataIndex: "fullname",
      render: (text, record) => `${record.firstName} ${record.lastName}`,
      width: 120,
    },
    {
      title: "Reason for Blacklist",
      dataIndex: "action ",
      render: (text, record) =>
        `${record.lockActivities[0]?.activity?.split(",")[1]?.split(":")[1]}`,
      width: 80,
    },
    {
      title: "Blacklisted By",
      dataIndex: "action ",
      render: (text, record) => `${record.lockActivities[0]?.admin?.fullName}`,
      width: 80,
    },
    {
      title: "Time",
      index: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt, "YYYY-MM-DD HH:mm:ss").format("lll");
      },
      width: 120,
    },
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
                      Black Listed Users
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
                        Blacklisted Users{" "}
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

export default BlacklistedUsers;
