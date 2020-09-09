import { firebase } from './fbConfig';

const db = firebase.firestore();
const subjectRef = db.collection('subjects');

export async function StudentSubjects(studentID) {

    let id = '6709';
    let calendarContent = [];

    try {

        const listCalendarContent = await subjectRef.get()

        const listEnrolled = listCalendarContent.docs.map(async doc => {

            const enrolled = doc.ref.collection('enrolled');

            await enrolled.get()
                .catch(function (error) {
                    console.log('get enrolled error: ' + error);
                    throw new Error(error);
                })
                .then(function (enrolledSnap) {
                    enrolledSnap.forEach(async function (enrolled) {

                        const enrolledStudent = enrolled.id;

                        if (enrolledStudent.localeCompare(id) === 0) {

                            console.log('id: ' + enrolledStudent + ' is enrolled in subject: ' + doc.data().title);
                            const consultations = doc.ref.collection('consultations');
                            let newConsultation = {};

                            let subject = {
                                id: doc.data().subjectCode,
                                title: doc.data().title,
                                daysOfWeek: [doc.data().daysOfWeek],
                                startTime: doc.data().startTime,
                                endTime: doc.data().endTime,
                                startRecur: doc.data().startRecur,
                                endRecur: doc.data().endRecur,
                                consultationDay: [doc.data().consultationDay],
                                consultationStartRecur: doc.data().consultationStartRecur,
                                consultationStartTime: doc.data().consultationStartTime,
                                consultationEndRecur: doc.data().consultationEndRecur,
                                consultationEndTime: doc.data().consultationEndTime,
                                color: 'gray',
                                consultations: [],
                            };

                            consultations.get()
                            .catch(function (error) {
                                console.log('get consultations error: ' + error);
                                throw new Error(error);
                            })
                            .then(function (consultationSnap) {
                                consultationSnap.forEach(function (consultation) {
                                    
                                    if (consultation.data().booked) {
                                        newConsultation = {
                                            subject: doc.data().title,
                                            date: consultation.id,
                                            booked: consultation.data().booked,
                                            confirmed: consultation.data().confirmed,
                                            consultationEndTime: consultation.data().consultationEndTime,
                                            consultationStartTime: consultation.data().consultationStartTime,
                                            studentID: consultation.data().studentID,
                                        };
                                    }
                                    else {
                                        newConsultation = {
                                            subject: doc.data().title,
                                            date: consultation.id,
                                            booked: consultation.data().booked
                                        };
                                    }

                                    subject.consultations.push(newConsultation);
                                })
                            })

                            calendarContent.push(subject);
                        }

                    })
                })
        })


        await Promise.all(listEnrolled);

        console.log('list length: ', calendarContent.length);
        return calendarContent;

    } catch (error) {
        console.log('get calendarContent error: ' + error);
        return error;
    }
}

