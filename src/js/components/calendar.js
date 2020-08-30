import React from 'react';
import FullCalendar, { formatDate, NowIndicatorRoot } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Grid } from '@material-ui/core';

function Calendar({ props }) {


    console.log(props);

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
                events={props}// alternatively, use the `events` setting to fetch from a feed
                select={handleDateSelect}
                eventContent={renderEventContent} // custom render function
                eventClick={handleEventClick}
                dateClick={handleDateClick}
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

function handleDateClick(clickInfo) {
    console.log('date clicked: ', clickInfo);
}

function handleEventClick(clickInfo) {
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //     clickInfo.event.remove()
    // }
    console.log('clicked event', clickInfo.event);
    console.log('clicked event', clickInfo.event.title);
}

function renderEventContent(eventInfo) {

    //event color logic here

    

    return (
        <Grid style={{backgroundColor: 'red'}} item xs={12} sm={12} md={12} lg={12} xl={12}>

            <p>{eventInfo.event.title}</p>

        </Grid>

    )
}

function handleDateSelect(selectInfo) {
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

function handleEvents(events) {
    // this.setState({
    //     currentEvents: events
    // })
}

export { Calendar }