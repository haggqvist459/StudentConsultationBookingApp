import React, { useState, useEffect, useContext } from 'react';
import Truncate from 'react-truncate';
import FullCalendar, { formatDate, NowIndicatorRoot } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { AuthContext, ROLE_CONSTANTS, DESIGN } from '../utils';
import moment from 'moment';



function Calendar({ content, studentClick, teacherClick, adminClick }) {

    console.log('calendar props', content);
    const { currentUserRole } = useContext(AuthContext);
    const { currentUser } = useContext(AuthContext);
    const [weekend, setWeekend] = useState(false);

    function handleEventClick(date) {
        // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        //     clickInfo.event.remove()
        // }
        let booked = false;
        let startDate = moment(date.event.start).format('YYYY-MM-DD');
        const tomorrow = moment().add(1, 'day').startOf('day').format('YYYY-MM-DD');
        if (currentUserRole === ROLE_CONSTANTS.STUDENT) {
            if (startDate !== tomorrow && !moment().isAfter(startDate)) {

                date.event.extendedProps.consultations.forEach((consul, index) => {
                    var n = consul.date.localeCompare(startDate);
                    if (n === 0) {
                        if (consul.booked || consul.confirmed) {
                            booked = true;
                        }
                    }
                })
    
                if (!booked) {
                    switch (currentUserRole) {
                        case ROLE_CONSTANTS.STUDENT:
    
                            // if free, book, otherwise dont
                            let booking = {
                                course: date.event.extendedProps,
                                courseID: date.event.extendedProps.courseID,
                                date: moment(date.event.start).format('YYYY-MM-DD'),
                                student: currentUser.displayName,
                                email: currentUser.email,
                                endTime: moment(date.event.end).format('HH:mm'),
                                startTime: moment(date.event.start).format('HH:mm')
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
            }
        }
       
    }

    function renderEventContent(eventInfo) {

        let eventStarting = moment(eventInfo.event.start).format('YYYY-MM-DD');
    
        eventInfo.event.extendedProps.consultations.forEach((consul, index) => {
            var n = consul.date.localeCompare(eventStarting);
            const tomorrow = moment().add(1, 'day').startOf('day').format('YYYY-MM-DD');
    
            if (moment().isAfter(eventStarting) || eventStarting === tomorrow && currentUserRole === ROLE_CONSTANTS.STUDENT) {
                eventInfo.backgroundColor = 'gray';
                eventInfo.borderColor = DESIGN.HOVER_BLUE;
            }
            else {
                if (n === 0) {
                    if (consul.booked) {
                        eventInfo.backgroundColor = DESIGN.YELLOW;
                        eventInfo.borderColor = DESIGN.HOVER_BLUE;
                    }
                    else if (consul.confirmed) {
                        eventInfo.backgroundColor = DESIGN.BUTTON_RED;
                        eventInfo.borderColor = DESIGN.HOVER_BLUE;
                    }
                    else {
                        eventInfo.backgroundColor = DESIGN.PRIMARY_COLOR;
                        eventInfo.borderColor = DESIGN.HOVER_BLUE;
                    }
                }
            }
        })
    
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

    useEffect(() => {
        let checkWeekend = moment().isoWeekday();
        console.log(' DAY NUMBER ', moment().isoWeekday())
        if (checkWeekend === 6 || checkWeekend === 7) {
            console.log('its weekend, ' )
            setWeekend(true)
        }
    }, [weekend])

    return (
        <Grid container direction={"column"} justify="center" alignItems="center">

            {weekend === true ? 
            <Typography>The calendar is closed on weekends.</Typography>
            :
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
            }
           

        </Grid>
    )


}

function handleDateClick(clickInfo) {
    console.log('date clicked: ', clickInfo);
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