import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

import '../index.css';
import './Events.css';

class EventsPage extends Component{

    state = {
        creating : false
    }

    startCreateEventHandler = () => {
        this.setState({creating:true})
    }

    modalConfirmHandler = () => {
        this.setState({creating:false})
    }

    modalCencelHandler = () => {
        this.setState({creating:false})
    }

    render() {
        return (
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {this.state.creating &&  <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCencelHandler} onConfirm={this.modalConfirmHandler}>
                    <p>Modal</p>
                </Modal>}
                <div className="events-control">
                    <h3>Let's Share your Own Event!</h3>
                    <button className="btn" onClick={this.startCreateEventHandler}>
                        Create Event
                    </button>
                </div>
            </React.Fragment>
        );
    }
}

export default EventsPage;