import React from 'react';

import './EventItem.css'

const eventItem = props => {

    return (
        <li key={props.eventId} className="events__list-item">
            <div>
                <h1>{props.title}</h1>
                <h4>${props.price} - {new Date (props.date).toLocaleDateString()}</h4>
            </div>
            <div>
                {props.userId === props.creatorId ? <h4>You Created the Event</h4> :
                    <button className='btn' onClick={props.onDetail.bind(this, props.eventId)}>View Details</button>}
            </div>
        </li>
    )
}

export default eventItem; 