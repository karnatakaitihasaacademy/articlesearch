/* eslint-disable react/prop-types */
// import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
// import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { supabase } from "../../../utils/supabase";
import { useContext, useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { AppContext } from "../../components/SidebarLayout";

export function SearchComponent({
  selectedColumns,
  setSelectedColumns,
  searchText,
  setSearchText,
  setApplyfilter,
  // total,
  language,
  setLanguage
}) {
  // Handle click on an autocomplete suggestion
  const handleClear = () =>{
    setSearchText('');
    setSelectedColumns({});
    setApplyfilter(prev=>!prev)
  };
  const [options, setOptions] = useState({
    year: [],
    district: [],
    volume: [],
    authorname_in_english: [],
    dynasty: [],
    author_in_kannada: [],
    dynasty_in_kannada: [],
  });
  const searchby = [
    {
      name: "Year",
      column: "year",
    },
    {
      name: "Volume",
      column: "volume",
    },
    {
      name: "English Author",
      column: "authorname_in_english",
    },
    {
      name: "English Dynasty",
      column: "dynasty",
    },
    {
      name: "Author Name",
      column: "author_in_kannada",
    },
    {
      name: "Dynasty",
      column: "dynasty_in_kannada",
    },
    {
      name: "District",
      column: "district",
    },
  ]
  
  useEffect(() => {
    console.log("working");
    const fetchOptions = async () => {
      try {
        const promises = searchby.map(({column}) =>
          supabase.from("karnataka_itihasa_records").select(column)
        );
        // setOptions(newOptions);
        const results = await Promise.all(promises);
        const newOptions = {};
        searchby.forEach(({column}, index) => {
          newOptions[column] = [
            ...new Set(
              results[index].data
                .map((item) => item[column])
                .sort()
                .filter(Boolean)
            ),
          ];
        });
        setOptions(newOptions);
      } catch (error) {
        console.error("Error fetching options from Supabase:", error);
      }
    };
    fetchOptions();
  }, []);
  const handleSearchTextChange = (e, column) => {
    const { value } = e.target;
    setSelectedColumns((prev) => ({
      ...prev,
      [column]: { ...prev[column], searchText: value },
    }));
    if(value !==''){
      setApplyfilter(prev=>!prev)
    }
  
    
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchby.map((searchindex) => (
              <div key={searchindex.column} className="flex flex-col">
                <label
                  className="mb-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  htmlFor={searchindex.column}
                >
                  {searchindex.name}
                </label>
                <select
                  className="interactive-select"
                  id={searchindex.column}
                  value={selectedColumns[searchindex.column]?.searchText || ''}
                  onChange={(e) => handleSearchTextChange(e, searchindex.column)}
                >
                  <option value="">All {searchindex.name}s</option>
                  {options[searchindex.column]?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          
          {(searchText || Object.keys(selectedColumns)?.length > 0) && (
            <div className="flex justify-start border-t border-slate-100 pt-6">
              <button
                onClick={handleClear}
                className="btn-outline text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



export default function Home() {
  const {records, setRecords, searchText, setSearchText} = useContext(AppContext)
  const [page, setPage] = useState(1);
  const [pageSize] = useState(30); // Set default page size
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [applyfilter, setApplyfilter] = useState(false);
  const [language, setLanguage] = useState("english");
  const buildQuery = async () => {
    const numericColumns = ["year", "volume"];
    let query = supabase
      .from("karnataka_itihasa_records")
      .select("*", { count: "exact" })
      .range((page - 1) * pageSize, page * pageSize - 1);
    if (Object.keys(selectedColumns)?.length > 0) {
       Object.entries(selectedColumns).map(
        ([column, value]) => {
          if (numericColumns.includes(column) && !isNaN(value.searchText)) {
            query = query.eq(column, Number(value.searchText));
          } else {
            const escapedText =value.searchText.replace(/\s*\(.*?\)\s*/g, '%').trim();
            console.log(escapedText)
            query = query.ilike(column, `%${escapedText}%`);
          }
        }
      );
      // const orCondition = conditions.join(",");
      
    } else if (searchText) {
      query = query.textSearch("article_name", searchText, {
        type: "websearch",
      });
    }
    return query;
  };
  console.log(selectedColumns);
  const getrecords = async () => {
    const { data: records, count } = await buildQuery();
    setRecords(records);
    setTotal(count);
    setTotalPages(Math.ceil(count / pageSize));
    return records;
  };
  useEffect(() => {
    setPage(1);
    getrecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ searchText, applyfilter]);

  useEffect(() => { 
    getrecords(); 
  }, [page]);

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <div className="xl:px-20 xl:py-10 lg:px-16 lg:py-8 md:px-10 md:py-6 px-4 py-2 ">
      <SearchComponent
        records={records}
        setSelectedColumns={setSelectedColumns}
        selectedColumns={selectedColumns}
        searchText={searchText}
        setSearchText={setSearchText}
        setApplyfilter={setApplyfilter}
        total={total}
        language={language}
        setLanguage={setLanguage}
      />
      {records ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records?.map((record) => (
            <div
              key={record.id}
              className="premium-card flex flex-col h-full"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 leading-snug mb-4 line-clamp-2 min-h-[3.5rem] font-display">
                  {record.article_name}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1 bg-indigo-50 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-indigo-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Author</p>
                      <p className="text-sm font-medium text-slate-700">{record.author_in_kannada}</p>
                      <p className="text-xs text-slate-500 italic">{record.authorname_in_english}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1 bg-amber-50 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-amber-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Dynasty</p>
                      <p className="text-sm font-medium text-slate-700">{record.dynasty_in_kannada || 'N/A'}</p>
                      <p className="text-xs text-slate-500 italic">{record.dynasty || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1 bg-emerald-50 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-emerald-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Location</p>
                      <p className="text-sm font-medium text-slate-700">{record.district_in_kannada}</p>
                      <p className="text-xs text-slate-500 italic">{record.district}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase tracking-wide">Vol. {record.volume}</span>
                  <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase tracking-wide">{record.year}</span>
                </div>
                <a
                  href={record.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-4 py-2 text-xs"
                >
                  View Full Article
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Loading />
      )}
      <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-8">
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Previous
        </button>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-4 py-1.5 rounded-full">
          Page <span className="text-slate-900">{page}</span> of <span className="text-slate-900">{totalPages}</span>
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
