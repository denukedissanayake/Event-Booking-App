import React from 'react'
import './BookingList.css'


const bookingList = props => (
    <ul className="bookings__list">
        {props.bookings.map(booking => {
            return <li key={booking._id}className="booking__items">
                <div className="booking__items-data">
                    {booking.event.title} - {' '}
                    {new Date(booking.createdAt).toLocaleDateString()}
                </div>
                <div className="booking__items-actions">
                    <button className="btn" onClick={props.onDelete.bind(this, booking._id)}>Cancel</button>
                </div>
            </li>
        })}
    </ul>
);

export default bookingList;
