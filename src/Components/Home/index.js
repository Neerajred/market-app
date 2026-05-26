import React, { useEffect, useRef } from 'react';
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import RatingStar from './RatingStar';

const Home = ({ categories, selectedCategory, products, handleAddClick, handleRemoveClick, cartItems }) => {

  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedCategory]);

  const getCategoryContent = () => {
    const orderedCategories = selectedCategory
      ? [selectedCategory, ...categories.filter((cat) => cat !== selectedCategory)]
      : categories;

    return orderedCategories.map((category) => (
      <div key={category} className='flex flex-col gap-4 mb-8'>
        <h2 className='font-bold text-xl sm:text-2xl text-gray-800 border-b-2 border-green-500 pb-2'>{category}</h2>
        <section className='overflow-x-auto scrollbar-hide'>
          <div className="products flex gap-4 pb-4">
            {products ? (
              products
                .filter((product) => product.category === category)
                .map((product) => {
                  const isInCart = cartItems.some((item) => item.id === product.id);

                  return (
                    <div 
                      key={product.id} 
                      className="min-w-[150px] sm:min-w-[180px] md:min-w-[200px] bg-white flex flex-col gap-3 p-3 sm:p-4 justify-between shadow-lg rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <div className='p-2 w-full h-32 sm:h-40 flex items-center justify-center bg-gray-50 rounded-lg'>
                        <img 
                          className='max-w-full max-h-full object-contain' 
                          src={product.imageUrl} 
                          alt={product.name} 
                        />
                      </div>
                      <div className='flex flex-col gap-2'>
                        <h3 className='font-semibold text-sm sm:text-base text-gray-800 truncate'>{product.name}</h3>
                        <div><RatingStar value={product.rating} /></div>
                        <p className='text-lg sm:text-xl font-bold text-green-600'>${product.price}</p>
                        {isInCart ? (
                          <button 
                            className='flex items-center justify-center gap-2 bg-red-50 text-red-600 border-2 border-red-300 py-2 px-3 rounded-lg hover:bg-red-100 transition duration-200 font-semibold text-sm' 
                            onClick={() => handleRemoveClick(product)}
                          >
                            <AiFillMinusCircle className='text-xl' />
                            Remove
                          </button>
                        ) : (
                          <button 
                            className='flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold text-sm' 
                            onClick={() => handleAddClick(product)}
                          >
                            <AiFillPlusCircle className='text-xl' />
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="flex items-center justify-center w-full py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            )}
          </div>
        </section>
      </div>
    ));

  }
  return (
    <div className="content overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 w-full lg:w-auto lg:flex-1">
      <div ref={topRef}></div>
      {getCategoryContent()}
    </div>
  );
};

export default Home;
