import React, { useEffect, useState } from "react";
import { AppUpdateCard } from "../adminDashboard/adminAnalytics/DashboardCard";
import ModalBasic from "../actions/ModalBasic";
import { setCountryTopics, setNewCountry } from "../../actions";
import { message } from "antd";
import { connect } from "react-redux";
import { getAllCountries } from "../../redux/admin/admin.actions";

const AppUpdates = (props) => {
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [countryName, setCountryName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState();
  const [imageName, setImageName] = useState();
  const [topicDescription, setTopicDescription] = useState("");
  const [topicImage, setTopicImage] = useState();
  const [topicImageName, setTopicImageName] = useState();
  const [countryNames, setCountryNames] = useState("");
  const [countryId, setcountryId] = useState("");
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);

  const countries = props.admin?.allcountries?.data;

  useEffect(() => {
    props.getAllCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCountryModal = (e) => {
    3;
    e.stopPropagation();
    setCountryModalOpen(true);
  };

  const openTopicModal = (e) => {
    e.stopPropagation();
    setTopicModalOpen(true);
  };

  function handleCountryImage(e) {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 1024 * 1024; // 1MB

    if (file && allowedTypes.includes(file.type) && file.size <= maxSize) {
      setImage(file);
      setImageName(file.name);
    } else {
      setImage(null);
      message.error("Please check file size and format");
    }
  }

  function handleTopicImage(e) {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 1024 * 1024; // 1MB

    if (file && allowedTypes.includes(file.type) && file.size <= maxSize) {
      setTopicImage(file);
      setTopicImageName(file.name);
    } else {
      setTopicImage(null);
      message.error("Please check file size and format");
    }
  }

  const handleSubmitCountry = async (e) => {
    e.preventDefault();
    const data = { countryName, description, image };
    // console.log(data);
    message.success("New Country Created Successfully!");
    setCountryModalOpen(false);
    try {
      const res = await setNewCountry(countryName, description, image);
      message.success("New Country Created Successfully");
    } catch (error) {
      message.error("New Country Creation Unsuccessful");
    }
  };

  const handleSubmitTopic = async (e) => {
    e.preventDefault();
    const data = { countryNames, topicDescription, topicImage, countryId };
    // console.log(data);
    message.success("New Topic Created Successfully!");
    setTopicModalOpen(false);
    try {
      const res = await setCountryTopics(
        countryNames,
        topicDescription,
        topicImage,
        countryId
      );
      message.success("New Topic Created Successfully!");
    } catch (error) {
      message.error("New Topic Creation Unsuccessful!");
    }
  };

  return (
    <div>
      <main>
        {/* Cards */}
        <div className="grid grid-cols-12 gap-6 py-8">
          <AppUpdateCard
            title="Create New Country"
            linkName="Create New Country"
            handleClick={openCountryModal}
          />
          <AppUpdateCard
            title="Post Country Topic"
            linkName="post topic"
            handleClick={openTopicModal}
          />
        </div>
      </main>
      {/* create country modal */}
      <ModalBasic
        id="country-modal"
        modalOpen={countryModalOpen}
        setModalOpen={setCountryModalOpen}
        title="Create New Country"
      >
        {/* Modal content */}
        <form onSubmit={handleSubmitCountry}>
          <div className="px-5 py-4">
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="country"
                >
                  Country Name
                </label>
                <input
                  name="countryName"
                  value={countryName}
                  onChange={(e) => setCountryName(e.target.value)}
                  className="form-input w-full px-2 py-1 h-12 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900"
                  type="text"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="description"
                >
                  Description
                </label>

                <textarea
                  name="description"
                  className="form-textarea w-full px-2 py-1 bg-blue-100 border-0  text-blue-900"
                  rows="10"
                  placeholder="Enter Comment"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="flex flex-col">
                <p className="block text-sm font-medium text-blue-900">
                  Country Image
                </p>
                <div className="flex border-2 border-dashed border-blue-900 rounded px-6 py-12 items-end justify-between ">
                  <label className=" text-sm font-medium text-white cursor-pointer flex bg-blue-900 p-3 items-center rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Attach Document
                    <input
                      type="file"
                      name="image"
                      accept="image/jpeg,image/png"
                      className="sr-only"
                      onChange={handleCountryImage}
                    />
                  </label>
                  <p className="text-blue-900 font-bold">
                    Jpegs, PNG - not more than 1MB
                  </p>
                </div>
                {imageName && (
                  <p className="text-blue-900 font-semibold">{imageName}</p>
                )}
              </div>
            </div>
          </div>
          {/* Modal footer */}
          <div className="px-5 py-4 w-full">
            <div className="flex flex-wrap justify-between w-full">
              <button
                className="btn-sm rounded font-semibold border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
                onClick={() => {
                  e.stopPropagation(e);
                  setCountryModalOpen(false);
                }}
              >
                Go Back
              </button>
              <button
                type="submit"
                onClick={handleSubmitCountry}
                disabled={
                  countryName !== "" && description !== "" && image !== ""
                    ? false
                    : true
                }
                className={`btn-sm rounded font-semibold text-white h-16 w-1/2 ${
                  image && description && countryName
                    ? " bg-blue-950 hover:bg-blue-900"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Create New Country
              </button>
            </div>
          </div>
        </form>
      </ModalBasic>

      {/* topic update Modal */}
      <ModalBasic
        id="topic-modal"
        modalOpen={topicModalOpen}
        setModalOpen={setTopicModalOpen}
        title="Post Country Topic"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form onSubmit={handleSubmitTopic}>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-blue-900">
                  Country
                </label>
                <select
                  className="w-full rounded text-blue-900 border border-blue-900 hover:border-blue-900"
                  onChange={(e) => {
                    setCountryNames(e.target.value),
                      setcountryId(e.target.value);
                  }}
                  value={countryNames}
                >
                  <option value="default">Select a country</option>
                  {countries?.map((singlecountry) => (
                    <option key={singlecountry.id} value={singlecountry.id}>
                      {singlecountry.country}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="description"
                >
                  Description
                </label>

                <textarea
                  id="topic"
                  className="form-textarea w-full px-2 py-1 bg-blue-100 border-0  text-blue-900"
                  rows="10"
                  placeholder="Enter Topic Description"
                  value={topicDescription}
                  onChange={(e) => setTopicDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div>
                <p className="block text-sm font-medium text-blue-900">
                  Topic Image
                </p>
                <div className="flex border-2 border-dashed border-blue-900 rounded px-6 py-12 items-end justify-between ">
                  <label className=" text-sm font-medium text-white cursor-pointer flex bg-blue-900 p-3 items-center rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Attach Document
                    <input
                      type="file"
                      name="image"
                      accept="image/jpeg,image/png"
                      className="sr-only"
                      onChange={handleTopicImage}
                    />
                  </label>
                  <p className="text-blue-900 font-bold">
                    Jpeg, PNG - not more than 1MB
                  </p>
                </div>
                {topicImageName && (
                  <p className="text-blue-900 font-semibold">
                    {topicImageName}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
        {/* Modal footer */}
        <div className="px-5 py-4 w-full">
          <div className="flex flex-wrap justify-between w-full">
            <button
              className="btn-sm font-semibold border-blue-600 rounded hover:border-blue-900 text-blue-900 h-16 w-5/12"
              onClick={(e) => {
                e.stopPropagation();
                setTopicModalOpen(false);
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={handleSubmitTopic}
              disabled={
                countryNames !== "" &&
                topicDescription !== "" &&
                topicImage !== ""
                  ? false
                  : true
              }
              className={`btn-sm rounded font-semibold text-white h-16 w-1/2 ${
                topicImage && topicDescription && countryNames
                  ? " bg-blue-950 hover:bg-blue-900"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Post Country Topic
            </button>
          </div>
        </div>
      </ModalBasic>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  getAllCountries: () => dispatch(getAllCountries()),
});
const mapStatesToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
});

export default connect(mapStatesToProps, mapDispatchToProps)(AppUpdates);
