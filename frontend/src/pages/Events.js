import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Bookings/Backdrop/Backdrop';
import EventList from '../components/Events/EventList';
import Spinner from '../components/Spinner/Spinner';

import AuthContext from '../context/auth-context';

import '../index.css';
import './Events.css';

class EventsPage extends Component{

    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent : null
    }

    isActive = true;

    static contextType = AuthContext; 

    constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    componentDidMount() {
        this.fetchEvents();
    }

    startCreateEventHandler = () => {
        this.setState({creating:true})
    }

    modalConfirmHandler = () => {
        this.setState({ creating: false })

        const title = this.titleElRef.current.value;
        const price = parseFloat(this.priceElRef.current.value);
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if (title.trim().length === 0 || price<= 0 || date.trim().length === 0 || description.trim().length === 0) {
            return
        }

        const event = { title, price, date, description };

        const requestBody = {
                query: `
                mutation{
                    createEvent(eventInput: {title: "${title}" , description: "${description}", price: ${price}, date: "${date}"}) {
                        _id
                        title
                        description
                        price
                        date
                    }
                }`
        }
        
        const token = this.context.token

        fetch(process.env.REACT_APP_BACKEND_URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    // throw new Error("Faild!")
                }
                return res.json();

            }).then(resData => {
                console.log(resData)
                this.setState(prevState => {
                    const updatedEvents = [...prevState.events];
                    updatedEvents.push({
                        _id: resData.data.createEvent._id,
                        title: resData.data.createEvent.title,
                        description: resData.data.createEvent.description,
                        price: resData.data.createEvent.price,
                        date: resData.data.createEvent.data,
                        creator:  {
                        _id: this.context.userId
                        }
                    });
                return { event: updatedEvents };
                });
            }).catch(err => {
                console.log(err);
        })    
    }

    modalCencelHandler = () => {
        this.setState({creating:false, selectedEvent:null})
    }

    fetchEvents() {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                query{
                    events {
                        _id
                        title
                        description
                        price
                        date
                        creator {
                            _id
                            email
                        }
                    }
                }`
        }
        

        fetch(process.env.REACT_APP_BACKEND_URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    // throw new Error("Faild!")
                }
                return res.json();

            }).then(resData => {
                // console.log(resData)
                const events = resData.data.events;

                if (this.isActive) {
                    this.setState({ events: events, isLoading: false });
                }
                
            }).catch(err => {
                console.log(err);
                if (this.isActive) {
                    this.setState({isLoading: false});
                }
                
        })    
    }

    showDetailsHandler = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return { selectedEvent: selectedEvent };
        });
    }

    bookEventHandler = () => {

        if (!this.context.token) {
            this.setState({ selectedEvent: null })
            return
        }

        // this.setState({ isLoading: true });
        const requestBody = {
            query: `
            mutation{
                bookEvent(eventId: "${this.state.selectedEvent._id}") {
                    _id
                    createdAt
                    updatedAt
                }
            }`
        }

        const token = this.context.token

        fetch(process.env.REACT_APP_BACKEND_URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    // throw new Error("Faild!")
                }
                return res.json();

            }).then(resData => {
                console.log(resData)
                this.setState({ selectedEvent: null })
                
            }).catch(err => {
                console.log(err);
                // this.setState({isLoading: false});
        }) 
    }

    componentWillUnmount() {
        this.isActive = false;
    }

    render() {

        return (
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {this.state.creating &&  <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCencelHandler} onConfirm={this.modalConfirmHandler} confirmText={"Confirm"}>
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={this.titleElRef}></input>
                        </div>

                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={this.priceElRef}></input>
                        </div>

                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" ref={this.dateElRef}></input>
                        </div>

                        <div className="form-control">
                            <label htmlFor="description">Desciption</label>
                            <textarea id="description" rows="4" ref={this.descriptionElRef}></textarea>
                        </div>
                    </form>
                </Modal>}
                {this.context.token && <div className="events-control">
                    <h3>Let's Share your Own Event!</h3>
                    <button className="btn" onClick={this.startCreateEventHandler}>
                        Create Event
                    </button>
                </div>}

                {this.state.selectedEvent && <Backdrop />}
                {this.state.selectedEvent && <Modal
                    title={this.state.selectedEvent.title}
                    canCancel
                    canConfirm
                    onCancel={this.modalCencelHandler}
                    onConfirm={this.bookEventHandler}
                    confirmText={this.context.token ? "Book" : "Confirm"}
                >
                    
                    <h1>{this.state.selectedEvent.title}</h1>
                    <h2>${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()} </h2>
                    <p>{this.state.selectedEvent.description} </p>

                </Modal>}

                {this.state.isLoading ? <Spinner/> : <EventList events={this.state.events} userId={this.context.userId} onViewDetails={this.showDetailsHandler} />} 
                
            </React.Fragment>
        );
    }
}

export default EventsPage;