import React, { Component } from 'react';

import AuthContext from '../context/auth-context';

import Spinner from '../components/Spinner/Spinner';

import BookingList from '../components/Bookings/BookingsList';
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart';
import BookingsControl from '../components/Bookings/BookingsControl';

class BookingsPage extends Component {


    state = {
        isLoading : false,
        bookings: [],
        outputType: 'list'
    }

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchBookings();
    }

    fetchBookings = () => {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                query{
                    bookings {
                        _id
                        createdAt
                        updatedAt
                        event {
                            _id
                            title
                            date
                            price
                        }
                    }
                }`
        }
        
        fetch(process.env.REACT_APP_BACKEND_URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    // throw new Error("Faild!")
                }
                return res.json();

            }).then(resData => {
                // console.log(resData)
                const bookings = resData.data.bookings;
                this.setState({ bookings: bookings, isLoading: false });
                
            }).catch(err => {
                console.log(err);
                this.setState({isLoading: false});
        })    
    }

    deleteBookingHandler = bookingId => {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                mutation CancelBooking($id: ID!){
                    cancelBooking(bookingId: $id){
                        _id
                        title
                    }
                }`,
            variables: {
                id: bookingId
            }
        }
        fetch(process.env.REACT_APP_BACKEND_URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    // throw new Error("Faild!")
                }
                return res.json();
 
            }).then(resData => {
                // console.log(resData)
                this.setState(prevState => {
                    const updatedBookings = prevState.bookings.filter(booking => {
                        return booking._id !== bookingId;
                    });
                    return { bookings: updatedBookings, isLoading: false };
                });
                
            }).catch(err => {
                console.log(err);
                this.setState({isLoading: false});
        })    
    }

    changeOutputTypeHandeler = outputType => {
        if (outputType === 'list') {
            this.setState({outputType: 'list'})
        } else {
            this.setState({outputType: 'chart'})
        }
    }

    render() {

        let content = <Spinner />
        if (!this.state.isLoading) {
            content = (
                <React.Fragment>
                    <BookingsControl activeOutputType={this.state.outputType} onChange={this.changeOutputTypeHandeler}/>
                    <div>
                        {this.state.outputType === 'list' ? (
                            <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler}/>
                        ) : (
                                <BookingsChart bookings={this.state.bookings}/>
                        )}
                    </div>
                </React.Fragment>
            );
        }
        return <React.Fragment>
            {content}
        </React.Fragment>
    }
}

export default BookingsPage;