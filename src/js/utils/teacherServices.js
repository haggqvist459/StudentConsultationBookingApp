import { firebase } from './fbConfig';
import { FIREBASE_CONSTANTS, ERRORS } from './constants';
import moment from 'moment';

export const teacherServices = {
    teacherSubjects,
    updateSubject,
    updateConsultation,
}

export async function teacherSubjects({ email }) {

    const db = firebase.firestore();
    const enrollmentRef = db.collection(FIREBASE_CONSTANTS.CURRENT_TERM_COLLECTION);
    let currentUserID = '';
    let enrollments = {};
    let courses = {};
    let userEnrollments = [];
    let userCourses = [];

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

        courses.courses.forEach((item, index) => {
            if (userEnrollments.find(course => course === item.courseID)) {
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
                }
                userCourses.push(course);
            }
        })

        return userCourses;
    }
    catch (error) {
        console.log(error);
        return (ERRORS.FIREBASE_ERROR);
    }
}

export async function updateSubject() {

    let subject = JSON.parse(localStorage.getItem('CURRENT UPDATE'));
    if (subject) {
        console.log('services update, ', subject.longName);
        const db = firebase.firestore();
        const subjectRef = db.collection(FIREBASE_CONSTANTS.CURRENT_TERM_COLLECTION).doc(FIREBASE_CONSTANTS.COURSES_DOC);
        let courses = [];

        function weeksBetween(starts, ends) {
            return Math.round((starts - ends) / (7 * 24 * 60 * 60 * 1000));
        }

        try {
            return new Promise((resolve, reject) => {
                subjectRef.get().then(function (snapshot) {
                    if (!snapshot.data().courses) {
                        console.log('rejecting courses')
                        reject('no courses found')
                    }
                    else {
                        snapshot.data().courses.forEach(function (item, index) {
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
                                    allDay: item.allDay,
                                    consultations: item.consultations,
                                }
                                if (item.longName === subject.longName) {
                                    course.daysOfWeek = subject.daysOfWeek;
                                    course.startTime = subject.startTime;
                                    course.endTime = subject.endTime;
                                    course.consultations = [];

                                    for (let i = 0; i < weeksBetween(Date.parse(item.endRecur), Date.parse(item.startRecur)); i++) {
                                        let date = moment(item.startRecur).day(subject.daysOfWeek).add((i * 7), 'days').format('YYYY-MM-DD');
                                        console.log('date ', date);
                                        let consultation = {
                                            date: date,
                                            booked: false,
                                            confirmed: false,
                                            topic: 'none',
                                            studentQuestion: 'none',
                                            student: 'none',
                                        }
                                        course.consultations.push(consultation);
                                    }
                                }

                                console.log('updated course: ', course);
                                courses.push(course);
                            }
                        });
                    }
                }).then(function () {

                    const pureCourseObjList = courses.map((obj) => { return Object.assign({}, obj) });

                    const termCourses = {
                        courses: pureCourseObjList,
                    }

                    subjectRef.set(termCourses)
                        .catch(function () {
                            console.log('courses reject')
                            reject('failed to update')
                        })
                        .then(function () {
                            console.log('courses resolve')
                            resolve('updated course')
                        })
                })
            })
        }
        catch (error) {
            console.log('error', error);
            return (ERRORS.FIREBASE_ERROR);
        }
    }
}

export async function updateConsultation() {

    console.log('updating.. ');
    let booking = JSON.parse(localStorage.getItem('CURRENT SLOT'));

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
                    console.log('booking, ', booking.subject);

                    coursesRes.forEach((item) => {
                        if (item.longName === booking.subject) {
                            console.log('updated consultation status on: ', item);
                            item.consultations.forEach((consul) => {
                                if (consul.date === booking.date) {
                                    consul.booked = booking.booked;
                                    consul.confirmed = booking.confirmed;
                                    consul.subject = booking.subject;
                                    if (consul.booked || consul.confirmed) {
                                        consul.topic = booking.topic;
                                        consul.student = booking.student;
                                    }
                                    else {
                                        consul.topic = "none";
                                        consul.student = "none";
                                    }
                                }
                            })
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
                        reject('failed to update')
                    })
                    .then(function () {
                        console.log('courses resolve')
                        resolve('consultation updated!')
                    })
            })
        })
    }
    catch (error) {
        console.log('error', error);
        return (ERRORS.FIREBASE_ERROR);
    }
}
