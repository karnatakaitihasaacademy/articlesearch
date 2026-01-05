
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
      <div className="min-h-screen bg-slate-50">
        <header className="glass-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex shrink-0 items-center">
              <NavLink to={'/'}>
                <img
                  alt="Kannada itihasa academy"
                  src={logo}
                  className="h-8 w-auto hover:opacity-80 transition-opacity"
                />
              </NavLink>
            </div>

            <div className="flex-1 max-w-2xl relative group">
              <div className="relative">
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                />
                <input
                  id="search-field"
                  name="search"
                  type="search"
                  value={searchText}
                  onChange={handleSearchTextChange}
                  placeholder="Search articles in Kannada..."
                  className="block w-full bg-slate-100 border-transparent rounded-xl py-2.5 pl-10 pr-4 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all shadow-inner hover:bg-slate-200/50"
                />
              </div>

              {results.length > 0 && (
                <ul className="absolute w-full max-h-96 mt-2 overflow-y-auto z-50 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {results.map((item, index) => (
                    <li
                      key={index}
                      className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <span className="text-sm font-medium text-slate-700">{item.article_name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </header>

        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </AppContext.Provider>
  )
}
