import React from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import "./RatingStar.css" // Assuming you're using React Icons for stars

const RatingStar = ({ value }) => {
  // Calculate filled and unfilled stars
  const filledStars = Math.floor(value);
  const hasHalfStar = value - filledStars >= 0.5;
  const totalStars = 5;
  
  // Create an array to render stars
  const stars = [];
  for (let i = 0; i < totalStars; i++) {
    if (i < filledStars) {
      stars.push(<AiFillStar key={i} className="star-filled" />);
    } else if (i === filledStars && hasHalfStar) {
      stars.push(<AiFillStar key={i} className="star-half-filled" />);
    } else {
      stars.push(<AiOutlineStar key={i} className="star-unfilled" />);
    }
  }

  return (
    <div className="rating-stars">
      {stars.map((star, index) => (
        <span key={index}>{star}</span>
      ))}
    </div>
  );
};

export default RatingStar;
