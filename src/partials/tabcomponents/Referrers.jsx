import React, { useEffect, useState } from "react";
import SearchForm from "../../partials/actions/SearchForm";
import { Table, Tag, message } from "antd";
import moment from "moment";
// import { blacklistedUsersApi, fetchReferers } from "../../actions";
import { sendGetRequest2 } from "../../requests";

function Referrers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [filterParams, setFilterParams] = useState({
    refererRequestId: "",
    refererId: "",
    refereeId: "",
    currency: "",
    referalCode: "",
    search: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const queryString = Object.keys(filterParams)
        .filter((key) => filterParams[key] !== null && filterParams[key] !== "") // Filter out empty and null values
        .map((key) => `${key}=${filterParams[key]}`)
        .join("&");

      try {
        setLoading(true);
        const response = await sendGetRequest2(
          `/admin/referrals?page=${pageNumber}&page_limit=100 ${
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

    fetchData();
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
      title: "Referrer Email",
      fixed: "left",
      render: (text, record) => record.referer.email,
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
      render: (text, record) => record.referee.email,
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
      title: "Bonus Status",
      dataIndex: "hasBeenPaid",
      render: (value) => {
        if (typeof value === "boolean") {
          return value ? "Paid" : "Refree not Verified";
        }
        return value;
      },
      width: 200,
    },
    {
      title: "Date",
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
                      Referrers
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
      </div>
    </div>
  );
}

export default Referrers;
