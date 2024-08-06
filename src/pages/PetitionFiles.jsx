import {
  getFileCategories,
  getProfile2,
  getUserVisaFiles,
  updateVisaFile,
} from "../actions";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { Spin, message, Table, Modal } from "antd";
import { useParams } from "react-router-dom";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchForm from "../partials/actions/SearchForm";
import UserAvatar from "../images/avatar.png";
import success from "../images/successicon.svg";
import ModalBlank from "../partials/actions/ModalBlank";
import SearchableSelect from "../partials/adminDashboard/SearchableSelect";
import { replaceUnderscoreWithSpace } from "../utils/Utils";
import { saveAs } from "file-saver";
import { downloadFilesAsZip } from "../components/downloadFilesAsZip";

export const PetitionFiles = (props) => {
  const inputRef = useRef(null);
  const { id } = useParams();
  const userId = id;
  const [user, setUser] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [existingDataSource, setExistingDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [category, setCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [fileName, setFileName] = useState("");
  const [formId, setFormId] = useState("");
  const [base64File, setBase64File] = useState(null);

  //   const handleChange = (value) => {
  //     setSelectedValue(value);
  //   };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const droppedFile = event.dataTransfer.files[0]; // Get only the first file
    setNewFile(droppedFile);
  };

  const handleDelete = () => {
    setNewFile(null);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFileName(selectedFile.name);
    setNewFile(selectedFile);
    const reader = new FileReader();

    reader.onload = () => {
      const base64File = reader.result;
      setBase64File(base64File);
    };

    reader.readAsDataURL(selectedFile);
  };

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

  const fetchUserFiles = async (userId) => {
    setIsLoading(true);
    try {
      const response = await getUserVisaFiles(userId);
      console.log("Files: ", response);
      setIsLoading(false);
      setFormId(response?.data[0]?.id);
      setExistingDataSource(response?.data);
    } catch (error) {
      setIsLoading(false);
      message.error(
        "Sorry, Couldn't fetch customer's files. Pls Try again later"
      );
    }
  };

  //   console.log("dataSource: ", existingDataSource);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getFileCategories();
      //   console.log("Categories: ", response.data);
      setCategory(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(
        "Sorry, Couldn't fetch file categories. Pls Try again later"
      );
    }
  };

  const fileNameOptions = category?.fileNames?.map((item) => {
    return {
      label: item,
      value: item,
    };
  });

  const categoryOptions = category?.fileCategory?.map((item) => {
    return {
      label: replaceUnderscoreWithSpace(item),
      value: item,
    };
  });

  useEffect(() => {
    userId ? fetchUser(userId) : () => ({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    userId ? fetchUserFiles(userId) : () => ({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleUpload = async () => {
    const formData = new FormData();
    // formData.append(selectedValue, selectedValue);
    formData.append(selectedOption, newFile);
    formData.append("id", formId);
    formData.append("userId", userId);
    // console.log(data);
    setIsLoading(true);
    try {
      const res = await updateVisaFile(formData);
      console.log(res);
      setOpen(false);
      showModal();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const dataSource = [];

  existingDataSource?.forEach((user) => {
    const { files, visaType } = user;

    let isFirstRow = true; // Flag to skip the first row for each category

    Object.entries(files).forEach(([category, categoryFiles]) => {
      if (!isFirstRow) {
        dataSource.push({
          key: `${user.id}_${category}`, // Unique key for the category row
          category: replaceUnderscoreWithSpace(category), // Include the category for each row representing a category
          file: null, // This row represents a category, so set file to null
          fileLink: null, // This row represents a category, so set fileLink to null
          visaType: null, // Set visaType to null for category rows
        });
      } else {
        isFirstRow = false; // Set the flag to false after pushing the first row
      }

      Object.entries(categoryFiles).forEach(([fileKey, fileValue]) => {
        // Only push rows with file links
        if (fileValue !== null) {
          dataSource.push({
            key: `${user.id}_${category}_${fileKey}`, // Unique key for each file row
            category: replaceUnderscoreWithSpace(category), // Include the category for each file row
            file: fileKey,
            fileLink: fileValue,
            visaType: visaType, // Include the visaType for each file row
          });
        }
      });
    });
  });

  const filteredDataSource = dataSource.filter(
    (row) => row.file !== null || row.fileLink !== null
  );

  // const handleDownload = async (record) => {
  //   console.log(record.fileLink);
  //   try {
  //     const response = await fetch(record.fileLink);
  //     if (!response.ok) {
  //       throw new Error(`Failed to download PDF: ${response.statusText}`);
  //     }

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", "downloaded_pdf.pdf");
  //     document.body.appendChild(link);
  //     link.click();
  //     link.parentNode.removeChild(link);
  //   } catch (error) {
  //     console.error("Error downloading PDF:", error);
  //     message.error("Failed to download PDF. Please try again later."); // Display error message to user
  //   }
  // };

  // Extract all URLs that are not null

  const fileUrls = Object.values(filteredDataSource).flatMap((category) =>
    Object.values(category).filter((url) => url !== null)
  );

  console.log(fileUrls);

  const handleDownload = (record) => {
    fetch(record?.fileLink)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        saveAs(blob, fileName);
      })
      .catch((error) => console.error("Download error:", error));
  };

  // const handleDownloadAll = () => {
  //   fileUrls.forEach((url) => {
  //     const fileName = url.split("/").pop();
  //     handleDownload(url, fileName);
  //   });
  // };

   const handleDownloadAll = () => {
     downloadFilesAsZip(fileUrls, 'folderName');
   };

  // const handleDownloadFile = (record) => {
  //   console.log(record.fileLink);
  //   fetch(record.fileLink)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.setAttribute("download", "download.pdf"); // Set your desired filename
  //       document.body.appendChild(link);
  //       link.click();
  //       link.parentNode.removeChild(link);
  //     })
  //     .catch((error) => {
  //       console.error("Error downloading PDF:", error);
  //     });
  // };

  const handleViewFile = (record) => {
    if (record && record.fileLink) {
      window.open(record.fileLink, "_blank");
    } else {
      console.error("File link is missing or invalid");
    }
  };

  const columns = [
    {
      title: "S/N",
      dataIndex: "serial",
      fixed: "left",
      render: (text, record, rowIndex) => rowIndex + 1,
      width: 60,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 150,
    },
    {
      title: "Visa Type",
      dataIndex: "visaType",
      key: "visaType",
      width: 70,
    },
    {
      title: "File",
      dataIndex: "file",
      key: "file",
    },
    {
      title: "File Link",
      dataIndex: "fileLink",
      key: "fileLink",
    },

    (props.Role === "legal-officer" ||
      props.Role === "super-admin" ||
      (props.Role === "admin" &&
        (props.auth?.user?.data?.data?.email === "fisolawevesti.com" ||
          props.auth?.user?.data?.data?.email === "austin@wevesti.com"))) && {
      title: "Actions",
      width: 90,
      fixed: "right",
      key: "actions",
      render: (text, record) => {
        return (
          <div className="flex justify-between items-center w-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#16216b"
              viewBox="0 0 256 256"
              onClick={() => handleViewFile(record)}
              style={{ cursor: "pointer" }}
            >
              <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#16216b"
              viewBox="0 0 256 256"
              onClick={() => handleDownload(record)}
              // onClick={() => handleDownload(record)}
              style={{ marginRight: "8px", cursor: "pointer" }}
            >
              <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-42.34-61.66a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L120,164.69V120a8,8,0,0,1,16,0v44.69l10.34-10.35A8,8,0,0,1,157.66,154.34Z"></path>
            </svg>
          </div>
        );
      },
    },
  ].filter(Boolean);

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <Spin />
        </div>
      ) : (
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Content area */}
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/*  Site header */}
            <Header
              title="Go Back"
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />

            <main>
              <div className="px-4 sm:px-6 lg:px-8 py-4 w-full mx-auto">
                {/* Content */}
                <div className="">
                  <div className="relative">
                    {/* <div className="px-4 sm:px-6 lg:px-2 py-4 w-full max-w-9xl mx-auto"> */}
                    {/* Page header */}
                    <div className="sm:flex sm:justify-between sm:items-baseline mb-4 md:mb-2">
                      {/* Left: Title */}
                      <div className="mb-4 sm:mb-0">
                        <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                          File Uploads
                        </h1>
                      </div>
                      <div className="grid grid-flow-col w-[80%] sm:auto-cols-max justify-start sm:justify-end gap-2">
                        <div className="grid grid-flow-col sm:auto-cols-max justify-between sm:justify-end gap-2">
                          <button
                            className="bg-transparent rounded-lg border border-blue-950 bg-[#F7F8FA] flex justify-between items-center gap-4 text-[16px] h-10 px-5 "
                            onClick={() => window.location.reload()}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#16216b"
                              viewBox="0 0 256 256"
                              className="text-blue-950"
                            >
                              <path d="M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h28.69L182.06,73.37a79.56,79.56,0,0,0-56.13-23.43h-.45A79.52,79.52,0,0,0,69.59,72.71,8,8,0,0,1,58.41,61.27a96,96,0,0,1,135,.79L208,76.69V48a8,8,0,0,1,16,0ZM186.41,183.29a80,80,0,0,1-112.47-.66L59.31,168H88a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V179.31l14.63,14.63A95.43,95.43,0,0,0,130,222.06h.53a95.36,95.36,0,0,0,67.07-27.33,8,8,0,0,0-11.18-11.44Z"></path>
                            </svg>
                            <span className="text-blue-950">Refresh</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full ">
                      <div className="mb-4 sm:mb-0 w-full">
                        <div className=" hidden sm:block w-full ">
                          <div className="inline-flex justify-center items-center group">
                            <img
                              className="w-8 h-8 rounded-full"
                              src={
                                user?.profilePictureURL
                                  ? user?.profilePictureURL
                                  : UserAvatar
                              }
                              width="32"
                              height="32"
                              alt="User"
                            />
                            <div className="flex flex-col items-start truncate ">
                              <span className="truncate ml-2 text-sm font-medium group-hover:text-slate-800">
                                {user?.firstName} {user?.lastName}
                              </span>
                              <span className="truncate ml-2 text-sm font-medium text-slate-400">
                                {user?.email}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border p-5">
                      <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full ">
                        <div className="mb-4 sm:mb-0 w-full">
                          <div className=" hidden sm:block w-full ">
                            <SearchForm
                              placeholder="Search for file"
                              onChange={(e) => setSearch(e.target.value)}
                              value={search}
                            />
                          </div>
                        </div>
                        <div className="grid grid-flow-col w-[80%] sm:auto-cols-max justify-start sm:justify-end gap-2">
                          <div className="grid grid-flow-col sm:auto-cols-max justify-between sm:justify-end gap-2">
                            <button
                              className="bg-blue-900 rounded-lg flex justify-between items-center gap-4 text-[16px] h-12 px-5  w-full"
                              onClick={() => setOpen(true)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="shrink-0 w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-white"
                                  d="M12 4.5v15m7.5-7.5h-15"
                                />
                              </svg>

                              <span className="text-white">Upload File</span>
                            </button>
                            <button
                              className="bg-transparent border border-blue-950 text-blue-950 rounded-lg flex justify-between items-center gap-4 text-[16px] h-12 px-5  w-full"
                              // onClick={() =>
                              //   alert("This feature is comming soon")
                              // }
                              onClick={handleDownloadAll}
                              // onClick={() => setModalOpen(true)}
                            >
                              <span className="text-blue-950">
                                Download all
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Table */}
                      <div className="table-auto w-full">
                        <Table
                          loading={loading}
                          columns={columns}
                          dataSource={filteredDataSource}
                          rowKey="id"
                          pagination={{
                            current: pageNumber,
                            //   total: total,
                            pageSize: 50,
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
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </main>

            {/* Upload Image modal */}
            <ModalBlank
              id="uploadimage-modal"
              modalOpen={open}
              setModalOpen={setOpen}
              click={() => {
                setOpen(false);
                setSelectedValue("");
                setSelectedOption("");
                setNewFile(null);
              }}
              title="Upload File"
            >
              {/* Modal content */}
              <div className="px-5 py-4">
                <div className="space-y-3">
                  <div className="flex flex-col justify-between gap-4 ">
                    <div className="relative">
                      <SearchableSelect
                        label="Select File Category"
                        options={categoryOptions}
                        value={selectedValue}
                        onChange={(value) => setSelectedValue(value)}
                      />
                    </div>
                    <div className="relative">
                      <SearchableSelect
                        label="Select File Name"
                        options={fileNameOptions}
                        value={selectedOption}
                        onChange={(value) => setSelectedOption(value)}
                      />
                    </div>
                    <label className="text-blue-950 text-sm font-semibold -mb-3">
                      Select File
                    </label>
                    <div
                      className={`w-full px-4 py-8 border border-blue-800 border-dashed rounded-md ${
                        dragActive ? "bg-gray-100" : "bg-white"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {newFile === null ? (
                        <div
                          className="flex flex-col items-center space-y-4 cursor-pointer"
                          onClick={handleClick}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="#303d9b"
                            viewBox="0 0 256 256"
                          >
                            <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-42.34-61.66a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L120,164.69V120a8,8,0,0,1,16,0v44.69l10.34-10.35A8,8,0,0,1,157.66,154.34Z"></path>
                          </svg>
                          <h3 className="text-center text-sm text-blue-800">
                            Click to upload or drag and drop
                          </h3>
                          <h4 className="text-center text-sm text-blue-800">
                            Upload PDF files only (Max. File size: 10 MB)
                          </h4>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">{fileName}</p>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                            onClick={handleDelete}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                      <input
                        ref={inputRef}
                        name="newFile"
                        type="file"
                        accept="application/pdf"
                        hidden
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Modal footer */}
              <div className="px-5 py-4 w-full">
                <div className="flex justify-between gap-4 w-full">
                  {!isLoading && (
                    <button
                      className="btn-sm rounded-lg border-blue-600 hover:border-blue-900 text-blue-900 h-12 w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(false);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleUpload();
                    }}
                    disabled={newFile === null || isLoading}
                    className={`btn-sm border-blue-600 h-12 w-full flex flex-col ${
                      newFile
                        ? " bg-blue-950 text-white hover:bg-blue-900"
                        : "bg-gray-400 cursor-not-allowed flex flex-col  my-auto"
                    }`}
                  >
                    {isLoading ? "Uploading" : "Upload to database"}
                  </button>
                </div>
              </div>
            </ModalBlank>

            {/* success modal */}
            <Modal
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              footer=""
              closable={false}
              maskClosable={false}
            >
              <div className="flex flex-col justify-center items-center w-full">
                <img src={success} alt="success icon" />
                <p className="text-blue-950 text-sm font-semibold mb-1">
                  Successfully Uploaded!
                </p>
                <p className="text-blue-950 text-sm font-normal mb-1">
                  You have successfully uploaded a document for{" "}
                  {user?.firstName + " " + user?.lastName}
                </p>
                <div className="w-full flex justify-center items-center mt-4">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      fetchUserFiles(userId);
                    }}
                    className="btn-sm border-blue-600 h-12 w-1/2 flex flex-col  bg-blue-950 text-white hover:bg-blue-900"
                  >
                    Okay, Thank you.
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};
