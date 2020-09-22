import React, { useState, useEffect } from 'react';
import Truncate from 'react-truncate';
import FullCalendar, { formatDate, NowIndicatorRoot } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Grid, Typography, Button } from '@material-ui/core';


function Calendar({ props }) {

    const [eventClick, setEventClick] = useState(false);
    const [currentEvent, setCurrentEvent] = useState({});
    console.log('calendar props', props);

    function handleEventClick(clickInfo) {
        // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        //     clickInfo.event.remove()
        // }
        setEventClick(true);
        console.log('clicked event', clickInfo.event.title);
        setCurrentEvent(
            {
                title: clickInfo.event.title,
                status: 'free',

            }
        );
    }

    useEffect(() => { }, [currentEvent])


    function eventStatus() {

        let role = 'student'

        if (currentEvent.title === 'Advanced Studio 2') {
            return (
                <Typography>status: booked</Typography>
            )
        }
        else {
            if (role === 'student') {
                return (
                    <Grid>
                        {currentEvent.status === 'free' ?
                            <Grid container direction={'column'} alignItems={'center'}>
                                <Typography>status: free</Typography>


                                <Button variant='contained' style={{ marginTop: '20px' }}>book consultation</Button>
                            </Grid>

                            :
                            <Typography>{currentEvent.status}</Typography>
                        }


                    </Grid>
                )
            }
            else {

            }
        }


    }

    return (
        <Grid container direction={"column"} justify="center" alignItems="center">

            <Grid container item direction={'column'} xs={10} >
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: '',
                        center: 'prev,next today',
                        right: ''
                    }}
                    initialView='timeGridWeek'
                    height="auto"
                    allDaySlot={false}
                    slotMinTime="07:00:00"
                    slotMaxTime="19:00:00"
                    // expandRows={true}
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

            <Grid container direction={'row'}>
                {eventClick ?
                    <Grid container direction={'row'} justify={'center'} style={{ marginTop: '20px' }}>

                        <Typography>{currentEvent.title}</Typography>

                        <Grid container direction={'row'} justify={'center'} style={{ marginTop: '20px' }}>
                            {eventStatus()}
                        </Grid>

                    </Grid>
                    :
                    <Grid container direction={'row'} justify={'center'} style={{ marginTop: '20px' }}>
                        <Typography>click on a subject for info</Typography>
                    </Grid>
                }
            </Grid>

        </Grid>
    )


}

function handleDateClick(clickInfo) {
    console.log('date clicked: ', clickInfo);
}


function renderEventContent(eventInfo) {

    var maxLength = 10;
    var result = eventInfo.event.title.substring(0, maxLength) + '...';
    return (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>

            <Truncate lines={1} ellipsis={<span><p>{result}</p></span>}>
                {eventInfo.event.title}
            </Truncate>

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