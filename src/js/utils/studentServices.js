import { firebase } from './fbConfig';
import { FIREBASE_CONSTANTS, ERRORS } from './constants';

//const db = firebase.firestore();

export const studentServices = {
    studentSubjects,
}

export async function studentSubjects({ email }) {

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
        
                if (item.consultationTimeStarts === 'teacher must assign') {
                    console.log('teacher must assign consultation day')
                }
                else {
                    console.log('course find', item.longName)
                    
                    let subject = {
                        id: item.courseID,
                        title: item.longName,
                        daysOfWeek: item.daysOfWeek,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        startRecur: item.startRecur,
                        endRecur: item.endRecur,
                        color: 'gray',
                        consultations: [],
                    };
                    userCourses.push(subject);
                }
            }
        })

        return userCourses;
    }
    catch (error) {
        console.log(error);
        return (ERRORS.FIREBASE_ERROR);
    }


    // try {

    //     const listCalendarContent = await subjectRef.get()

    //     const listEnrolled = listCalendarContent.docs.map(async doc => {

    //         const enrolled = doc.ref.collection('enrolled');

    //         await enrolled.get()
    //             .catch(function (error) {
    //                 console.log('get enrolled error: ' + error);
    //                 throw new Error(error);
    //             })
    //             .then(function (enrolledSnap) {
    //                 enrolledSnap.forEach(async function (enrolled) {

    //                     const enrolledStudent = enrolled.id;

    //                     if (enrolledStudent.localeCompare(id) === 0) {

    //                         console.log('id: ' + enrolledStudent + ' is enrolled in subject: ' + doc.data().title);
    //                         const consultations = doc.ref.collection('consultations');
    //                         let newConsultation = {};

    //                         let subject = {
    //                             id: doc.data().subjectCode,
    //                             title: doc.data().title,
    //                             daysOfWeek: [doc.data().consultationDayOfWeek],
    //                             startTime: doc.data().consultationTimeStarts,
    //                             endTime: doc.data().consultationTimeEnds,
    //                             startRecur: doc.data().termStart,
    //                             endRecur: doc.data().termEnd,
    //                             consultationDay: [doc.data().consultationDay],
    //                             consultationStartRecur: doc.data().consultationStartRecur,
    //                             consultationStartTime: doc.data().consultationStartTime,
    //                             consultationEndRecur: doc.data().consultationEndRecur,
    //                             consultationEndTime: doc.data().consultationEndTime,
    //                             color: 'gray',
    //                             consultations: [],
    //                         };

    //                         consultations.get()
    //                         .catch(function (error) {
    //                             console.log('get consultations error: ' + error);
    //                             throw new Error(error);
    //                         })
    //                         .then(function (consultationSnap) {
    //                             consultationSnap.forEach(function (consultation) {
                                    
    //                                 if (consultation.data().booked) {
    //                                     newConsultation = {
    //                                         subject: doc.data().title,
    //                                         date: consultation.id,
    //                                         booked: consultation.data().booked,
    //                                         confirmed: consultation.data().confirmed,
    //                                         consultationEndTime: consultation.data().consultationEndTime,
    //                                         consultationStartTime: consultation.data().consultationStartTime,
    //                                         studentID: consultation.data().studentID,
    //                                     };
    //                                 }
    //                                 else {
    //                                     newConsultation = {
    //                                         subject: doc.data().title,
    //                                         date: consultation.id,
    //                                         booked: consultation.data().booked
    //                                     };
    //                                 }

    //                                 subject.consultations.push(newConsultation);
    //                             })
    //                         })

    //                         calendarContent.push(subject);
    //                     }

    //                 })
    //             })
    //     })


    //     await Promise.all(listEnrolled);

    //     console.log('list length: ', calendarContent.length);
    //     return calendarContent;

    // } catch (error) {
    //     console.log('get calendarContent error: ' + error);
    //     return error;
    // }
}

