import React from 'react'

const BOOKINGS_BUCKETS = {
    'Cheap': 100,
    'Normal': 200,
    'Expensive' :1000
}

const bookingsChart = props => {

    let output = {};

    for (const bucket in BOOKINGS_BUCKETS) {
        const filteresBookingsCount = props.bookings.reduce((prev, current) => {
            if (current.event.price > BOOKINGS_BUCKETS[bucket]) {
                return prev + 1
            } else {
                return prev
            }
            
        }, 0);

        output[bucket] = filteresBookingsCount

    }
    console.log(output)
    return <p> The Chart</p>
}
 
export default bookingsChart;