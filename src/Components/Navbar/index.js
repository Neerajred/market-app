import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ categories, selectedCategory, handleCategoryClick }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCategorySelect = (category) => {
    handleCategoryClick(category);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-40 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition duration-200"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <nav
        className={`sidebar flex-none w-64 lg:w-72 bg-white border-r border-slate-100 flex flex-col h-full shadow-xl lg:shadow-none z-40 transition-transform duration-300 absolute lg:static top-0 left-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="p-4 flex justify-end lg:hidden bg-slate-50 border-b border-slate-100">
          <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 hover:text-slate-700">
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden p-3">
          <ul className="space-y-1">
            {categories.map((category) => (
              <li
                key={category}
                className={`px-5 py-2.5 cursor-pointer transition-all duration-200 rounded-xl text-sm font-medium flex items-center justify-between group mb-1 ${category === selectedCategory
                  ? 'bg-primary-50 text-primary-700 shadow-sm border border-primary-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                onClick={() => handleCategorySelect(category)}
              >
                <span className="capitalize">{category}</span>
                {category === selectedCategory && (
                  <div className="w-2 h-2 rounded-full bg-primary-600 shadow-sm"></div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
