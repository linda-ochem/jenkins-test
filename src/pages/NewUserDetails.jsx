import React, { useRef, useState } from "react";
import UserAvatar from "../images/avatar.png";
import { useParams } from "react-router-dom";
import { getProfile2 } from "../actions";
import { Spin } from "antd";


const NewUserDetails = () => {
  const inputRef = useRef(null);
  const { id } = useParams();
  const userId = id;
  const [user, setUser] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUser = async (userId) => {
    setLoading(true);
    try {
      const response = await getProfile2(userId);
      // console.log("profile: ", response.data);
      setUser(response.data[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(
        "Sorry, Couldn't fetch customer's details. Pls Try again later"
      );
    }
  };

  useEffect(() => {
    userId ? fetchUser(userId) : () => ({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <Spin />
        </div>
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/*  Site header */}
            <Header
              title="User Details"
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            {/* user Card */}
            <div className="flex flex-col md:flex-row items-center p-4 md:p-6 bg-white rounded shadow-md w-full max-w-lg mx-auto">
              {/* <img
                src="https://via.placeholder.com/40"
                alt="User"
                className="w-16 h-16 md:w-12 md:h-12 rounded-full mb-4 md:mb-0"
              /> */}
              <img
                className="w-8 h-8 rounded-full"
                src={
                  user?.profilePictureURL ? user?.profilePictureURL : UserAvatar
                }
                width="32"
                height="32"
                alt="User"
              />
              <div className="flex-1 text-center md:text-left md:ml-4">
                <h2 className="text-lg md:text-xl font-medium">User Name</h2>
                <p className="text-sm md:text-base text-gray-600">
                  Additional information
                </p>
              </div>
              <button className="mt-4 md:mt-0 md:ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Action
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewUserDetails;
