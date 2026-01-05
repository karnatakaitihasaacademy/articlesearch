
'use client'

import { createContext, useEffect, useState } from 'react'

import {  MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import  logo from "../assets/KIA-logo.png";
import { NavLink, Outlet } from 'react-router-dom';



// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();


export default function SidebarLayout() {
  const [searchText, setSearchText] = useState('');
  const [records, setRecords] = useState(null);
  const [results, setResults] = useState([]);
  const [queryType, setQueryType] = useState("search");

  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    if (queryType === "search" && searchText.length > 0) {
      setResults(records);
    } else {
      setResults([]);
    }
  }, [records]);

  const handleSuggestionClick = (suggestion) => {
    // setQuery(suggestion.article_name);
    setSearchText(suggestion.article_name);
    setResults([]);
    setQueryType("suggestion");
  };

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
    setQueryType("search");
  };
  
  return (
    <AppContext.Provider value={{ searchText, setSearchText, records, setRecords}} >
     
      <div>

        <div className="">
          <div className="sticky top-0 z-40 sm:flex sm:h-16 shrink-0 items-center gap-x-2 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-4 sm:px-4 lg:px-8">
            {/* <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button> */}
            <div className="flex sm:h-16 h-12 shrink-0 items-center">
              <NavLink
               to={'/'}
              >
              <img
                alt="Kannada itihasa academy"
                src={logo}
                className="lg:h-8 w-auto h-6 "
              />
              </NavLink>
            </div>
            {/* Separator */}

            {/* <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" /> */}

            <div className="flex flex-1 h-14 sm:h-auto relative mb-2 sm:mb-0 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative  flex flex-1">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute pl-2 inset-y-0 left-0 h-full w-5 text-gray-400"
                />
                <input
                  id="search-field"
                  name="search"
                  type="search"
                  value={searchText}
                  onChange={handleSearchTextChange}
                  placeholder="Search in Kannada"
                  className="block w-full border-0 py-0 sm:my-2 pl-8 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                />
                
              </div>
              {results.length > 0 && (
              <ul className="absolute w-full max-h-96 mt-14 overflow-y-auto z-10 bg-white border border-gray-300 rounded-md shadow-lg">
                {results.map((item, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-indigo-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    {/* Highlight matched text */}
                    <span>{item.article_name}</span>
                  </li>
                ))}
              </ul>
            )}
            </div>
          </div>

          <main className="py-2">
            <div className="px-4 sm:px-6 lg:px-8"><Outlet /></div>
          </main>
        </div>
      </div>
    </AppContext.Provider>
  )
}
