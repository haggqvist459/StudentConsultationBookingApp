import { calendarConstants, firebase } from '../utils';

export const calendarActions = {
    updateCalendar,
    updateStudentCalendar,
}

function updateCalendar() {

    let subjects = [];
    const db = firebase.firestore();

    return (dispatch) => {

        try {
            db.collection("subjects")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        let subject = {
                            id: doc.data().subjectCode,
                            title: doc.data().title,
                            daysOfWeek: [doc.data().daysOfWeek], // these recurrent events move separately
                            startTime: doc.data().startTime,
                            endTime: doc.data().endTime,
                            startRecur: doc.data().startRecur,
                            endRecur: doc.data().endRecur,
                            color: 'red'
                        };
                        subjects.push(subject);
                        console.log('found subject: ' + subject.title);
                    });
                })
                .then(() => console.log('returning number of events: ' + subjects.length))
                .finally(() => {
                    dispatch(success(subjects))
                });
        } catch (error) {
            dispatch(failure(error));
        }
    }

    function success(subjects) { return { type: calendarConstants.UPDATE, subjects } }
    function failure(error) { return { type: calendarConstants.UPDATE_FAILURE, error } }
}

function updateStudentCalendar(studentID) {

    const db = firebase.firestore();
    console.log('update student calendar with id: ' + studentID);
    const subjectRef = db.collection('subjects');

    return (dispatch) => {

        try {

            subjectRef
                .get()
                .catch(function (error) {
                    dispatch(subjectFailure(error));
                })
                .then(function (subjectSnap) {
                    subjectSnap.forEach((doc) => {

                        let studentSubject = {};
                        const enrolledRef = doc.ref.collection('enrolled');

                        enrolledRef.get()
                            .catch(function (error) {
                                dispatch(updateStudentCalendarFailure(error));
                            })
                            .then(function (enrolledSnap) {
                                enrolledSnap.forEach(function (enrolled) {
                                    const enrolledStudent = enrolled.id;

                                    if (enrolledStudent.localeCompare(studentID) === 0) {

                                        studentSubject = {
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
                                        };

                                        const consultationRef = doc.ref.collection('consultations');
                                        consultationRef.get()
                                            .catch(function (error) {
                                                dispatch(updateStudentCalendarFailure(error));
                                            })
                                            .then(function (consultationSnap) {
                                                consultationSnap.forEach(function (consultation) {    
                                                    if (consultation.data().booked === true) {
                                                        studentSubject.color = 'red'
                                                    }
                                                    else {
                                                        studentSubject.color = 'green'
                                                    }
                                                })

                                                dispatch(updateStudentCalendarSuccess(studentSubject))
                                            })
                                    }
                                })
                            })
                    })
                })

        } catch (error) {
            dispatch(firestoreFailure(error));
        }
    }



    function firestoreFailure(error) { return { type: calendarConstants.STUDENT_CALENDAR_FIRESTORE_FAILURE, error } };
    function subjectFailure(error) { return { type: calendarConstants.CONSULTATIONS_UPDATE_FAILURE, error } };

    function updateStudentCalendarSuccess(studentSubject) { return { type: calendarConstants.UPDATE_STUDENT_CALENDAR_SUCCESS, studentSubject: studentSubject } };
    function updateStudentCalendarFailure(error) { return { type: calendarConstants.UPDATE_STUDENT_CALENDAR_FAILURE, error } };

    function updateSubjectConsultationsFailure(error) { return { type: calendarConstants.UPDATE_SUBJECT_CONSULTATIONS_FAILURE, error } };
    function updateSubjectConsultationsSuccess(consultation) { return { type: calendarConstants.UPDATE_SUBJECT_CONSULTATIONS_SUCCESS, consultation: consultation } };
}