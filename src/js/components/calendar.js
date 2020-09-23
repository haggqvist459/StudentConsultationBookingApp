import React, { useState, useEffect, useContext } from 'react';
import Truncate from 'react-truncate';
import FullCalendar, { formatDate, NowIndicatorRoot } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import { AuthContext, ROLE_CONSTANTS } from '../utils';
import moment from 'moment';

function Calendar({ content, studentClick, teacherClick, adminClick }) {

    console.log('calendar props', content);
    const { currentUserRole } = useContext(AuthContext);
    const { currentUser } = useContext(AuthContext);

    function handleEventClick(date) {
        // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        //     clickInfo.event.remove()
        // }

        switch (currentUserRole) {
            case ROLE_CONSTANTS.STUDENT:

                // if free, book, otherwise dont
                let booking = {
                    course: date.event.extendedProps,
                    date: moment(date.event.start).format('YYYY-MM-DD'),
                    student: currentUser.email,
                }
                
                localStorage.setItem('CURRENT SLOT', JSON.stringify(booking));
                studentClick();
                break;

            case ROLE_CONSTANTS.TEACHER:

                break;

            case ROLE_CONSTANTS.ADMIN:

                break;

            default:
                break;
        }

    }


    //useEffect(() => { }, [currentEvent])

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
                    events={content}// alternatively, use the `events` setting to fetch from a feed
                    select={handleDateSelect}
                    eventContent={renderEventContent} // custom render function
                    eventClick={date => handleEventClick(date)}
                    dateClick={handleDateClick}
                    eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                /* you can update a remote database when these fire:
                eventAdd={function(){}}
                eventChange={function(){}}
                eventRemove={function(){}}
                */
                />
            </Grid>

        </Grid>
    )


}

function handleDateClick(clickInfo) {
    console.log('date clicked: ', clickInfo);
}

function renderEventContent(eventInfo) {

    console.log('event render', eventInfo);
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

Calendar.propTypes = {
    bookConsultation: PropTypes.func,
    studentClick: PropTypes.func,
    teacherClick: PropTypes.func,
    adminClick: PropTypes.func,
}

export { Calendar }