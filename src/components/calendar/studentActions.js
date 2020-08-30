import React from 'react';
//import { formatDate } from '@fullcalendar/react'

export const handleWeekendsToggle = () => {
    this.setState({
        weekendsVisible: !this.state.weekendsVisible
    })
}

export const handleDateSelect = (selectInfo) => {
    // let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar
    console.log(selectInfo)
    calendarApi.unselect() // clear date selection

    // if (title) {
    //     calendarApi.addEvent({
    //         id: createEventId(),
    //         title,
    //         start: selectInfo.startStr,
    //         end: selectInfo.endStr,
    //         allDay: selectInfo.allDay
    //     })
    // }
}


export const handleEvents = (events) => {
    // this.setState({
    //     currentEvents: events
    // })
}

// function renderSidebarEvent(event) {
//     return (
//         <li key={event.id}>
//             <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
//             <i>{event.title}</i>
//         </li>
//     )
// }

export function RenderSidebar() {
    return (
        <div className='demo-app-sidebar'>
            <div className='demo-app-sidebar-section'>
                <h2>Instructions</h2>
                <ul>
                    <li>Select dates and you will be prompted to create a new event</li>
                    <li>Drag, drop, and resize events</li>
                    <li>Click an event to delete it</li>
                </ul>
            </div>
            {/* <div className='demo-app-sidebar-section'>
                <label>
                    <input
                        type='checkbox'
                        checked={this.state.weekendsVisible}
                        onChange={this.handleWeekendsToggle}
                    ></input>
            toggle weekends
          </label>
            </div> */}
            {/* <div className='demo-app-sidebar-section'>
                <h2>All Events ({this.state.currentEvents.length})</h2>
                <ul>
                    {this.state.currentEvents.map(renderSidebarEvent)}
                </ul>
            </div> */}
        </div>
    )
}