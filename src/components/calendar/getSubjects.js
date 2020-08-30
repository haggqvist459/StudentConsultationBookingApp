import firebase from './fbConfig';

const db = firebase.firestore();

export const getSubjects = () => {
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
                color: 'red'
            };
            events.push(subject);
            console.log('found subject: ' + subject.title);
        });
    })
    .then(() => console.log('returning number of events: ' + events.length))
    .finally(() => {return events});
}






