import { usePlausible } from "next-plausible";
import React, { useState, useCallback, useEffect } from "react";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

export default function SearchInput() {
  const plausible = usePlausible();
  const [searchValue, setSearchValue] = useState("");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // Check if a session ID already exists in cookies
    let id = Cookies.get("sessionId");
    if (!id) {
      // Generate a new session ID if it doesn't exist
      id = uuidv4();
      // Set cookie to expire to 0 days. This means the cookie will be deleted when the browser is closed.
      // See https://stackoverflow.com/questions/2537060/can-a-cookie-expire-when-either-some-time-passes-or-browser-is-closed
      Cookies.set("sessionId", id, { expires: 0 }); 
    }
    setSessionId(id);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      plausible("searchValue", {
        props: {
          value: searchValue || "",
          sessionId: sessionId,
        },
      });
    },
    [searchValue, sessionId]
  );

  return (
    <form className="max-w-md" onSubmit={handleSubmit}>
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search for anything"
          required
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Search
        </button>
      </div>
    </form>
  );
}