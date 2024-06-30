import React from 'react'
import profilePng from "../../images/Profile.png";
import Rating from '@mui/material/Rating';

const ReviewCard = ({ review }) => {
    //options for rating
    const options = {
        value: review.rating,
        readOnly: true,
        precision: 0.5,
    };

    return (
        <div className="reviewCard">
            <img src={profilePng} alt="User" />
            <p>{ReviewCard.name}</p>
            <Rating {...options} />
            <span className="reviewCardComment">{review.comment}</span>
        </div>
    )
}

export default ReviewCard