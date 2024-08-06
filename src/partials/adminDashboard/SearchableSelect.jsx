import React, { useEffect, useState, useRef } from "react";

const SearchableSelect = ({ label, value, options, onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleChevronClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const filteredOptions = options?.filter((option) =>
    option?.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block mb-2 font-semibold text-blue-950">
          {label}
        </label>
      )}
      <div className="flex items-center">
        <input
          type="text"
          className="form-input rounded w-full px-2 py-1 h-9 bg-transparent text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900"
          placeholder="Search or scroll to select"
          value={
            value ? options?.find((option) => option?.value === value)?.label : ""
          }
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        <div
          className="absolute inset-y-0 top-8 right-0 flex items-center pr-3 pointer-cursor"
          onClick={handleChevronClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#303d9b"
            viewBox="0 0 256 256"
          >
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 bg-white border w-full border-blue-300 rounded mt-1 max-h-48 overflow-y-auto">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;

