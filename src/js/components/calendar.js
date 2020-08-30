import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FullCalendar, { formatDate, NowIndicatorRoot } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Grid } from '@material-ui/core';


function Calendar() {

    const { studentSubjects } = useSelector(state => state.calendar);

    return (
        <Grid>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                initialView='dayGridMonth'
                editable={false}
                selectable={true}
                selectMirror={false}
                dayMaxEvents={true}
                weekends={false}
                events={studentSubjects}// alternatively, use the `events` setting to fetch from a feed
                select={handleDateSelect}
                eventContent={renderEventContent} // custom render function
                eventClick={handleEventClick}
                eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
            />
        </Grid>
    )

}

const handleEventClick = (clickInfo) => {
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //     clickInfo.event.remove()
    // }
    console.log('clicked event');
}

function renderEventContent(eventInfo) {
    return (
        <>
            <p>{eventInfo.event.title}</p>
        </>
    )
}


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



export { Calendar }