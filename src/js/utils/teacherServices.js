import { firebase } from './fbConfig';
import { FIREBASE_CONSTANTS, ERRORS } from './constants';

export const teacherServices = {
    teacherSubjects,
    updateSubject,
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

                // startTime = item.consultationTimeOfDay
                // endTime = startTime + 30 mins or 60 if teacher chose
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
    console.log('services update, ', subject.longName);
    const db = firebase.firestore();
    const subjectRef = db.collection(FIREBASE_CONSTANTS.CURRENT_TERM_COLLECTION).doc(FIREBASE_CONSTANTS.COURSES_DOC);
    let courses = [];

    try {
        return new Promise((resolve, reject) => {
            subjectRef.get().then(function (snapshot) {
                if (!snapshot.data().courses) {
                    console.log('rejecting courses')
                    reject('no courses found')
                }
                else {
                    snapshot.data().courses.slice().reverse().forEach(function(item, index, object) {
                        if (item.longName === subject.longName) {
                            courses.splice(object.length - 1 - index, 1);
                            let course = {
                                courseID: subject.courseID,
                                integrationID: subject.integrationID,
                                shortName: subject.shortName,
                                longName: subject.longName,
                                accountID: subject.accountID,
                                termID: subject.termID,
                                status: subject.status,
                                termStart: subject.termStart,
                                termEnd: subject.termEnd,
                                format: subject.format,
                                blueprintID: subject.blueprintID,
                                daysOfWeek: [parseInt(subject.daysOfWeek)],
                                startRecur: subject.startRecur,
                                endRecur: subject.endRecur,
                                startTime: subject.startTime,
                                endTime: subject.endTime,
                            }
                            courses.push(course);
                        }
                        else {
                            courses.push(item);
                        }
                      });


                    // snapshot.data().courses.forEach((item, index) => {
                    //     if (item.longName === subject.longName) {
                    //         console.log('course found ', item.longName, ' at ', index);
                    //         let course = {
                    //             courseID: subject.courseID,
                    //             integrationID: subject.integrationID,
                    //             shortName: subject.shortName,
                    //             longName: subject.longName,
                    //             accountID: subject.accountID,
                    //             termID: subject.termID,
                    //             status: subject.status,
                    //             termStart: subject.termStart,
                    //             termEnd: subject.termEnd,
                    //             format: subject.format,
                    //             blueprintID: subject.blueprintID,
                    //             daysOfWeek: [parseInt(subject.daysOfWeek)],
                    //             startRecur: subject.startRecur,
                    //             endRecur: subject.endRecur,
                    //             startTime: subject.startTime,
                    //             endTime: subject.endTime,
                    //         }
                    //         courses.push(course);
                    //     }
                    //     else {
                           
                    //     }
                        
                    // })
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

