import { firebase } from './fbConfig';
import { FIREBASE_CONSTANTS, ERRORS } from './constants';

//const db = firebase.firestore();

export const studentServices = {
    studentSubjects,
    bookConsultation,
    studentTopics,
}

export async function studentSubjects({ email }) {

    const db = firebase.firestore();
    const enrollmentRef = db.collection(FIREBASE_CONSTANTS.CURRENT_TERM_COLLECTION);
    let currentUserID = '';
    let enrollments = {};
    let courses = {};
    let userEnrollments = [];
    let userCourses = [];
    let consultations = [];

    try {

        await enrollmentRef.get().then(function (snapshot) {
            if (snapshot.empty) {
                console.log('rejecting topics')
            }
            else {
                snapshot.forEach((item, index) => {
                    switch (item.id) {
                        case FIREBASE_CONSTANTS.USERS_DOC:
                            item.data().users.forEach((userItem, userIndex) => {
                                if (userItem.email === email) {
                                    currentUserID = userItem.userID;
                                }
                            })
                            break;
                        case FIREBASE_CONSTANTS.ENROLLMENTS_DOC:
                            enrollments = item.data();
                            break;
                        case FIREBASE_CONSTANTS.COURSES_DOC:
                            courses = item.data();
                            break;
                        default:
                            break;
                    }
                })
            }
        });

        enrollments.enrollments.forEach((item, index) => {
            if (item.userID === currentUserID) {
                userEnrollments.push(item.courseID);
            }
        })

        courses.courses.forEach((item) => {
            if (userEnrollments.find(course => course === item.courseID)) {

                if (item.consultationTimeStarts === 'teacher must assign') {
                    console.log('teacher must assign consultation day')
                }
                else {
                    console.log('course find', item.longName)
                    let course = {
                        courseID: item.courseID,
                        integrationID: item.integrationID,
                        shortName: item.shortName,
                        longName: item.longName,
                        accountID: item.accountID,
                        termID: item.termID,
                        status: item.status,
                        termStart: item.termStart,
                        termEnd: item.termEnd,
                        format: item.format,
                        blueprintID: item.blueprintID,
                        daysOfWeek: [item.daysOfWeek],
                        startRecur: item.startRecur,
                        endRecur: item.endRecur,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        title: item.title,
                        consultations: item.consultations,
                        color: 'green',
                    }
                    userCourses.push(course);
                }
            }
        })

        userCourses.forEach((course) => {
            if (course.consultations.length > 0) {
                course.consultations.forEach((consul) => {
                    if (consul.booked || consul.confirmed) {
                        console.log('student consultation found');
                        let studentConsultation = {
                            booked: consul.booked,
                            confirmed: consul.confirmed,
                            subject: course.longName,
                            starting: course.startTime,
                            ending: course.endTime,
                            date: consul.date,
                            student: consul.student,
                            topic: consul.topic,
                        }
                        consultations.push(studentConsultation);
                    }
                })
            }
        })
        if (consultations.length > 0) {
            localStorage.setItem('CONSULTATIONS', JSON.stringify(consultations));
        }
        return userCourses;
    }
    catch (error) {
        console.log(error);
        return (ERRORS.FIREBASE_ERROR);
    }
}

export async function bookConsultation() {
    console.log('booking.. ');
    let topic = JSON.parse(localStorage.getItem('CURRENT TOPIC'));
    let booking = JSON.parse(localStorage.getItem('CURRENT SLOT'));

    console.log('topic: ', topic, ' on slot: ', booking);

    const db = firebase.firestore();
    const subjectRef = db.collection(FIREBASE_CONSTANTS.CURRENT_TERM_COLLECTION).doc(FIREBASE_CONSTANTS.COURSES_DOC);
    let coursesRes = [];
    try {
        return new Promise((resolve, reject) => {
            subjectRef.get().then(function (snapshot) {
                if (!snapshot.data().courses) {
                    console.log('rejecting courses')
                    reject('no courses found')
                }
                else {
                    coursesRes = snapshot.data().courses;
                    console.log('booking, ', booking.course.longName);

                    coursesRes.forEach((item) => {
                        if (item.longName) {
                            let course = {
                                courseID: item.courseID,
                                integrationID: item.integrationID,
                                shortName: item.shortName,
                                longName: item.longName,
                                accountID: item.accountID,
                                termID: item.termID,
                                status: item.status,
                                termStart: item.termStart,
                                termEnd: item.termEnd,
                                format: item.format,
                                blueprintID: item.blueprintID,
                                daysOfWeek: item.daysOfWeek,
                                startRecur: item.startRecur,
                                endRecur: item.endRecur,
                                startTime: item.startTime,
                                endTime: item.endTime,
                                title: item.longName,
                                consultations: item.consultations,
                                allDay: item.allDay,
                            }

                            if (course.longName === booking.course.longName) {
                                console.log('updated consultation status on: ', course);
                                course.consultations.forEach((consul) => {
                                    if (consul.date === booking.date) {
                                        console.log('date found')
                                        consul.booked = true;
                                        consul.topic = topic;
                                        consul.student = booking.student;
                                        consul.email = booking.email;
                                        consul.subject = booking.course.longName;
                                        consul.starts = booking.startTime;
                                        consul.ends = booking.endTime;
                                    }
                                })
                            }

                        }
                    });
                }
            }).then(function () {

                const pureCourseObjList = coursesRes.map((obj) => { return Object.assign({}, obj) });

                const termCourses = {
                    courses: pureCourseObjList,
                }

                subjectRef.set(termCourses)
                    .catch(function () {
                        console.log('courses reject')
                        reject('failed to book')
                    })
                    .then(function () {
                        console.log('courses resolve')
                        resolve('consultation booked!')
                    })
            })
        })
    }
    catch (error) {
        console.log('error', error);
        return (ERRORS.FIREBASE_ERROR);
    }
}

export async function studentTopics() {

    const db = firebase.firestore();
    const topicRef = db.collection(FIREBASE_CONSTANTS.TOPIC_COLLECTION);
    let topics = [];

    try {
        return new Promise((resolve, reject) => {
            topicRef.get().then(function (snapshot) {
                if (snapshot.empty) {
                    console.log('rejecting topics')
                    reject('no topics found')
                }
                else {
                    snapshot.forEach((item, index) => {
                        let topic = {
                            id: item.id,
                            topic: item.data().topic,
                        }
                        topics.push(topic)
                    })
                    console.log('resolving topics')
                    resolve(topics)
                }
            });
        }).catch(function (error) {
            console.log(error);
            return (false)
        })
    }
    catch (error) {
        console.log(error);
        return (ERRORS.FIREBASE_ERROR);
    }
}

