import React, { useState, useRef, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

const users = [
  { id: 1, name: "Alice", image: "https://via.placeholder.com/150" },
  { id: 2, name: "Bob", image: "https://via.placeholder.com/150" },
  { id: 3, name: "Charlie", image: "https://via.placeholder.com/150" },
];

const sharedData = {
  urls: [
    { id: 1, url: "https://example.com", description: "Example Website" },
    { id: 2, url: "https://another.com", description: "Another Website" },
  ],
  files: [
    { id: 1, name: "document.pdf", path: "/path/to/document.pdf" },
    { id: 2, name: "report.docx", path: "/path/to/report.docx" },
  ],
  images: [
    { id: 1, name: "image1.jpg", path: "/path/to/image1.jpg" },
    { id: 2, name: "image2.png", path: "/path/to/image2.png" },
  ],
};

const messages = [
  {
    id: 1,
    userId: 1,
    text: "Hello!",
    timestamp: new Date("2024-06-21T10:20:30Z"),
    delivered: true,
  },
  {
    id: 2,
    userId: 2,
    text: "Hi there!",
    timestamp: new Date("2024-06-21T10:22:30Z"),
    delivered: true,
  },
  {
    id: 3,
    userId: 1,
    text: "How are you?",
    timestamp: new Date("2024-06-22T11:25:30Z"),
    delivered: true,
  },
  {
    id: 4,
    userId: 2,
    text: "I am good, thanks!",
    timestamp: new Date("2024-06-22T11:30:30Z"),
    delivered: true,
  },
];

const ChatInterface = () => {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messageInput, setMessageInput] = useState("");
  const [fileInput, setFileInput] = useState(null); // State to hold uploaded file (if needed)
  const [chatMessages, setChatMessages] = useState(
    messages.filter((msg) => msg.userId === users[0].id)
  );
  const messageInputRef = useRef(null); // Ref to message input
  const fileInputRef = useRef(null); // Ref to file input

  // Handle click on attachment button
  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload or display preview if needed
      setFileInput(file);
    }
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      userId: selectedUser.id,
      text: messageInput.trim(),
      timestamp: new Date(),
      delivered: true,
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessageInput("");
  };

  // Handle Enter key press in message input
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent line break on Enter
      handleSendMessage();
    }
  };

  // Format date to "Friday, 10 Jan"
  const formatDate = (date) => {
    const options = { weekday: "long", day: "numeric", month: "short" };
    return date.toLocaleDateString("en-US", options);
  };

  // Format time to "10 May at 09:10"
  const formatTime = (date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    // Focus on message input on initial load
    messageInputRef.current.focus();
  }, []);

  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-2 bg-gray-300 border-r border-gray-400 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Users</h2>
          {users.map((user) => (
            <div
              key={user.id}
              className={`cursor-pointer py-2 px-4 flex items-center hover:bg-gray-400 ${
                selectedUser.id === user.id ? "bg-gray-400" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <img
                src={user.image}
                alt={user.name}
                className="w-10 h-10 rounded-full mr-2"
              />
              {user.name}
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-8 bg-white flex flex-col">
        <div className="p-4 bg-gray-200 border-b border-gray-400 flex items-center sticky top-0 z-10">
          <img
            src={selectedUser.image}
            alt={selectedUser.name}
            className="w-10 h-10 rounded-full mr-2"
          />
          <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {chatMessages.map((message, index) => {
            const isOutgoing = message.userId === selectedUser.id;
            const showDateHeader =
              index === 0 ||
              new Date(chatMessages[index - 1].timestamp).toDateString() !==
                new Date(message.timestamp).toDateString();

            return (
              <div key={message.id}>
                {showDateHeader && (
                  <div className="text-center my-2 text-gray-500">
                    {formatDate(new Date(message.timestamp))}
                  </div>
                )}
                <div
                  className={`my-2 flex ${
                    isOutgoing ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex flex-col ${
                      isOutgoing ? "items-end" : "items-start"
                    } justify-between`}
                  >
                    <div
                      className={`relative inline-block p-2 rounded-lg max-w-xs ${
                        isOutgoing
                          ? "bg-green-500 text-white"
                          : "bg-yellow-300 text-black"
                      }`}
                    >
                      {message.text}
                    </div>
                    {message.delivered && (
                      <div className="flex items-center mt-1 text-xs text-gray-500 gap-2">
                        {formatTime(new Date(message.timestamp))}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="#98a2b3"
                          viewBox="0 0 256 256"
                        >
                          <path d="M149.61,85.71l-89.6,88a8,8,0,0,1-11.22,0L10.39,136a8,8,0,1,1,11.22-11.41L54.4,156.79l84-82.5a8,8,0,1,1,11.22,11.42Zm96.1-11.32a8,8,0,0,0-11.32-.1l-84,82.5-18.83-18.5a8,8,0,0,0-11.21,11.42l24.43,24a8,8,0,0,0,11.22,0l89.6-88A8,8,0,0,0,245.71,74.39Z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center w-full sticky bottom-0">
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className="relative flex-1">
            <button
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 rounded-lg p-2"
              onClick={handleAttachmentClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#000000"
                viewBox="0 0 256 256"
              >
                <path d="M209.66,122.34a8,8,0,0,1,0,11.32l-82.05,82a56,56,0,0,1-79.2-79.21L147.67,35.73a40,40,0,1,1,56.61,56.55L105,193A24,24,0,1,1,71,159L154.3,74.38A8,8,0,1,1,165.7,85.6L82.39,170.31a8,8,0,1,0,11.27,11.36L192.93,81A24,24,0,1,0,159,47L59.76,147.68a40,40,0,1,0,56.53,56.62l82.06-82A8,8,0,0,1,209.66,122.34Z"></path>
              </svg>
            </button>
            <input
              ref={messageInputRef}
              type="text"
              className="w-full mb-[0.025rem] pl-12 border-0 border-gray-300 focus:outline-0 focus:ring-1 focus:border-0"
              placeholder="Write message here..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#5261BC] text-white rounded-lg p-2"
              onClick={handleSendMessage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#ffffff"
                viewBox="0 0 256 256"
              >
                <path d="M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,.05-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.83Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-2 bg-gray-300 border-l border-gray-400 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-2">Shared Items</h2>
        <Disclosure>
          {({ open }) => (
            <>
              <DisclosureButton className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>Shared URLs</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path
                    className={`${
                      open ? "transform rotate-180" : ""
                    } w-5 h-5 text-blue-500`}
                    d="M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z"
                  ></path>
                </svg>
              </DisclosureButton>
              <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <ul>
                  {sharedData.urls.map((item) => (
                    <li key={item.id} className="mb-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {item.description}
                      </a>
                    </li>
                  ))}
                </ul>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <>
              <DisclosureButton className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>Shared Files</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path
                    className={`${
                      open ? "transform rotate-180" : ""
                    } w-5 h-5 text-blue-500`}
                    d="M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z"
                  ></path>
                </svg>
              </DisclosureButton>
              <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <ul>
                  {sharedData.files.map((file) => (
                    <li key={file.id} className="mb-2">
                      <a
                        href={file.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {file.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <>
              <DisclosureButton className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>Shared Images</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path
                    className={`${
                      open ? "transform rotate-180" : ""
                    } w-5 h-5 text-blue-500`}
                    d="M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z"
                  ></path>
                </svg>
              </DisclosureButton>
              <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <ul>
                  {sharedData.images.map((image) => (
                    <li key={image.id} className="mb-2">
                      <a
                        href={image.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {image.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};

export default ChatInterface;