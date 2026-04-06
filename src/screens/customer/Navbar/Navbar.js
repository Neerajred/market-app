import React from 'react';
import { Link } from 'react-router-dom';
import {
  Apple, Leaf, Milk, Croissant, Beef, Wheat, Coffee,
  Menu, ChevronLeft, ShoppingCart
} from 'lucide-react';
import { APP_NAME } from '../../../utils/constants';

const CATEGORY_ICONS = {
  'Fruits': Apple,
  'Vegetables': Leaf,
  'Dairy': Milk,
  'Bakery': Croissant,
  'Meat': Beef,
  'Grains': Wheat,
  'Breakfast': Coffee,
};

const Navbar = ({ categories, selectedCategory, handleCategoryClick, sidebarOpen, setSidebarOpen }) => {
  return (
    <aside
      className={`
        relative flex-shrink-0 h-screen flex flex-col bg-white border-r border-gray-100 shadow-sm
        transition-[width] duration-300 ease-in-out overflow-hidden z-30
        ${sidebarOpen ? 'w-56' : 'w-[60px]'}
      `}
    >
      {/* ── Brand / Logo Row ── */}
      <div className={`flex items-center h-16 border-b border-gray-100 flex-shrink-0 ${sidebarOpen ? 'px-4 gap-3' : 'justify-center'}`}>
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <ShoppingCart size={16} className="text-white" />
          </div>
          {/* Brand name fades in/out */}
          <span
            className={`font-black text-green-700 text-base tracking-tight whitespace-nowrap transition-all duration-300 overflow-hidden ${sidebarOpen ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0'
              }`}
          >
            {APP_NAME}
          </span>
        </Link>
      </div>

      {/* ── Category Label with Toggle Row ── */}
      <div className={`px-3 pt-4 pb-2 h-12 flex items-center justify-between overflow-hidden transition-all duration-300`}>
        {sidebarOpen ? (
          <>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-2">
              Categories
            </p>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-green-600 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-green-600 transition-colors mx-auto"
          >
            <Menu size={18} />
          </button>
        )}
      </div>

      {/* ── Category List ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-1 px-2 custom-scrollbar">
        <ul className="space-y-0.5">
          {categories.map((category) => {
            const isActive = category === selectedCategory;
            const Icon = CATEGORY_ICONS[category] || ShoppingCart;
            return (
              <li key={category}>
                <button
                  onClick={() => handleCategoryClick(category)}
                  title={!sidebarOpen ? category : undefined}
                  className={`
                    w-full flex items-center rounded-xl cursor-pointer transition-all duration-150
                    ${sidebarOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-2.5'}
                    ${isActive
                      ? 'bg-green-600 text-white shadow-md shadow-green-200'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}
                  `}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span
                    className={`text-sm font-semibold whitespace-nowrap transition-all duration-300 overflow-hidden ${sidebarOpen ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0'
                      }`}
                  >
                    {category}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Bottom Section (Empty now) ── */}
      <div className="flex-shrink-0 h-4" />
    </aside>
  );
};

export default Navbar;
