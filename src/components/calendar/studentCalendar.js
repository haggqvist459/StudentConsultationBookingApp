import React, { Component } from 'react'
import FullCalendar, { formatDate, NowIndicatorRoot } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './studentEvents'
import { handleDateSelect, handleEvents } from './studentActions';
import { getSubjects } from './getSubjects';
import '../../../sass/components/index.scss';

import firebase from '../../firebase/fbConfig';

const db = firebase.firestore();


export class StudentCalendar extends Component {

    state = {
        currentEvents: [],
        events: getSubjects(),
    }

    componentDidMount() {

        let events = [];

        db.collection("subjects")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let subject = {
                    id: doc.data().subjectCode,
                    title: doc.data().title,
                    daysOfWeek: [ doc.data().daysOfWeek ], // these recurrent events move separately
                    startTime: doc.data().startTime,
                    endTime: doc.data().endTime,
                    startRecur: doc.data().startRecur,
                    endRecur: doc.data().endRecur,
                };
                events.push(subject);
                console.log('found subject: ' + subject.title);
            });
        })
        .then(() => console.log('returning number of events: ' + events.length))
        .finally(() => {
            this.setState({events: events})
        });


        console.log('events in calendar: ' + this.state.events);
    }

    render() {

        return (
            <div className="calendar">
                <div className='demo-app-main'>
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
                        events={this.state.events}// alternatively, use the `events` setting to fetch from a feed
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
                </div>
            </div>
        )
    }
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