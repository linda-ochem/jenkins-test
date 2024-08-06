import React, { useState, useRef, useEffect } from "react";

import Transition from "../../../utils/Transition";

import { toWholeCurrency } from "../../../helpers";
import { fetchMapRevenues, fetchMapRevenuesElement } from "../../../actions";
import moment from "moment";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ElementRevenueAnalytics(props) {
  const initial = `$${
    props.totals?.totalTransactions
      ? toWholeCurrency(props.totals?.totalTransactions)
      : 0
  }`;

  const options = [
    {
      id: 0,
      period: "All Time",
      value: `${
        props.totals?.totalTransactions
          ? toWholeCurrency(props.totals?.totalTransactions)
          : 0
      }`,
    },
    {
      id: 1,
      period: "Monthly",
      value: `${
        props.monthBalances?.totalTransactions
          ? toWholeCurrency(props.monthBalances?.totalTransactions)
          : 0
      }`,
    },
    {
      id: 2,
      period: "Last Two weeks",
      value: `${
        props.twoWeeksBalances?.totalTransactions
          ? toWholeCurrency(props.twoWeeksBalances?.totalTransactions)
          : 0
      }`,
    },
    {
      id: 3,
      period: "A Week ago",
      value: `${
        props.oneWeekBalances?.totalTransactions
          ? toWholeCurrency(props.oneWeekBalances?.totalTransactions)
          : 0
      }`,
    },
  ];
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    initial; // Set initial selected period after component mount
  }, [initial]);

  const fetchRevenueData = async (selectedPeriod) => {
    const type = "";
    const currency = "USD";
    let periodd = "";

    switch (selectedPeriod?.period) {
      case "All Time":
      case "Last Two weeks":
        periodd = "day";
        break;
      case "Monthly":
        periodd = "month";
        break;
      case "A Week ago":
        periodd = "week";
        break;
      default:
        periodd = "day";
    }

    try {
      const response1 = await fetchMapRevenuesElement(periodd, currency, type);
      // console.log("Revenue Data: ", response1?.data);
      setRevenueData(response1?.data);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchRevenueData(selectedPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  // console.log("selectedPeriod: ", selectedPeriod);

  const revenueDataFormatted = revenueData.map((item) => {
    const formattedDate = moment(item.period).format("DD-MM-YYYY");
    const cardDeposit = parseFloat(item.cardDeposit) / 100;
    const withdrawal = parseFloat(item.withdrawal) / 100;
    const deposit = parseFloat(item.deposit) / 100;
    return { period: formattedDate, cardDeposit, deposit, withdrawal };
  });

  const reverseData = (data) => {
    return [...data].reverse();
  };

  const mainRevenueData = reverseData(revenueDataFormatted);

  // console.log("revenueDataFormatted : ", revenueDataFormatted);

  const DataFormater = (number) => {
    if (number > 1000000000) {
      return (number / 1000000000).toString() + "B";
    } else if (number > 1000000) {
      return (number / 1000000).toString() + "M";
    } else if (number > 1000) {
      return (number / 1000).toString() + "K";
    } else {
      return number.toString();
    }
  };

  return (
    <div className="flex flex-col col-span-full xl:col-span-6 bg-white shadow-lg rounded-lg border border-slate-200 xl:h-[450px]">
      <header className="px-5 py-4 border-slate-100 flex items-center">
        <h2 className="font-bold text-blue-900">Total Transactions</h2>
      </header>
      <div className="px-5 py-1">
        <div className="flex flex-col mb-4 gap-4 justify-start items-start md:gap-0 lg:gap-0 xl:gap-0 md:mb-0 lg:mb-0 xl:mb-0 md:flex-row lg:flex-row xl:flex-row md:justify-between lg:justify-between xl:justify-between md:items-center lg:items-center xl:items-center ">
          <div>Details about transaction growth</div>
          <Dropdown
            options={options}
            selected={selectedPeriod}
            setSelected={setSelectedPeriod}
          />
        </div>
        <div className="flex flex-wrap">
          {/* Details */}
          <div>
            <div className="flex items-center">
              <div className=" mb-4 text-xl xl:text-3xl lg:text-3xl md:text-2xl md:mb-0 lg:mb-0 xl:mb-0 font-bold text-blue-900 mr-2 ">
                {selectedPeriod ? `₦${selectedPeriod.value}` : initial}
              </div>
              {/* <div className="text-sm font-medium text-emerald-600 bg-emerald-100 px-6 py rounded-lg border border-emerald-600 ">
                +10.5%
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* Chart built with Rechart */}
      <div className="grow">
        {/* Change the height attribute to adjust the chart height */}

        <ResponsiveContainer width="100%" aspect={2}>
          <LineChart
            width={800}
            height={200}
            data={mainRevenueData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <YAxis tickFormatter={DataFormater} />
            <XAxis dataKey="period" />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line
              type="monotone"
              dataKey="deposit"
              stroke="#82ca9d"
              strokeWidth={1}
              // yAxisId={0}
            />
            <Line
              type="monotone"
              dataKey="withdrawal"
              stroke="#fa7070"
              strokeWidth={1}
              // yAxisId={1}
            />
            <Line
              type="monotone"
              dataKey="cardDeposit"
              stroke="#1e3a8a"
              strokeWidth={1}
              // yAxisId={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ElementRevenueAnalytics;

function Dropdown({ options, selected, setSelected }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="btn justify-between min-w-44 bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
        aria-label="Select date range"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="flex items-center">
          <span>{selected ? selected.period : "Select period"}</span>
        </span>
        <svg
          className="shrink-0 ml-1 fill-current text-slate-400"
          width="11"
          height="7"
          viewBox="0 0 11 7"
        >
          <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
        </svg>
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className="z-10 absolute top-full left-0 w-full bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        enter="transition ease-out duration-100 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          className="font-medium text-sm text-slate-600"
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          {options.map((option) => (
            <button
              key={option.id}
              tabIndex="0"
              className={`flex items-center w-full hover:bg-slate-50 py-1 px-3 cursor-pointer ${
                selected && option.id === selected.id ? "text-indigo-500" : ""
              }`}
              onClick={() => {
                setSelected(option);
                setDropdownOpen(false);
              }}
            >
              {selected && option.id === selected.id && (
                <svg
                  className="shrink-0 mr-2 fill-current text-indigo-500"
                  width="12"
                  height="9"
                  viewBox="0 0 12 9"
                >
                  <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.696L3.989 9.41l8.423-8.423a1 1 0 00-1.414-1.414z" />
                </svg>
              )}
              <span>{option.period}</span>
            </button>
          ))}
        </div>
      </Transition>
    </div>
  );
}
