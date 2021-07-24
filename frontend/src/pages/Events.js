import React, { Component } from 'react';


import '../index.css'
import './Events.css'

class EventsPage extends Component{
    render() {
        return <div className="events-control">
            <h3>Let's Share your Own Event!</h3>
            <button className="btn">
              Create Event
            </button>
        </div>
    }
}

export default EventsPage;