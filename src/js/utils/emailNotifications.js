import emailjs from 'emailjs-com';
import apiKeys from './apikeys';
import { FIREBASE_CONSTANTS } from './constants';
import { firebase } from './fbConfig';

export const emailNotifications = {
    studentRequestNotification,
    studentCancelNotification,
    teacherAcceptNotification,
    teacherCancelNotification,
}

async function findTeacherInfo({ courseID }) {

    const db = firebase.firestore();
    const currentTermRef = db.collection(FIREBASE_CONSTANTS.CURRENT_TERM_COLLECTION);
    let users = [];
    let courses = [];
    let teacherID = '';
    let teacher = {};

    try {
        await currentTermRef.get().then(function (snapshot) {
            if (snapshot.empty) {
                console.log('rejecting topics')
            }
            else {
                snapshot.forEach((item, index) => {
                    switch (item.id) {
                        case FIREBASE_CONSTANTS.USERS_DOC:
                            users = item.data();
                            break;
                        case FIREBASE_CONSTANTS.ENROLLMENTS_DOC:
                            item.data().enrollments.forEach(function (enrollment, enrollmentIndex) {
                                if (enrollment.courseID === courseID && enrollment.role === 'teacher') {
                                    teacherID = enrollment.userID;
                                }
                            })
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

        users.users.forEach(function (user, userIndex) {
            if (user.userID === teacherID) {
                teacher = user;
            }
        })

        console.log('extracted teacher from users collection ', teacher);
        return teacher;

    } catch (error) {
        console.log('firebase error, ', error);
    }




}

async function studentRequestNotification() {

    let currentSlot = JSON.parse(localStorage.getItem('CURRENT SLOT'));
    let currentTopic = JSON.parse(localStorage.getItem('CURRENT TOPIC'));
    let teacherInfo = await findTeacherInfo({ courseID: currentSlot.courseID });
    let emailInfo = {};
    let emailText = 'You have received a new consultation request from student ' + currentSlot.student + ' in subject ' + currentSlot.course.longName;

    if (teacherInfo) {
        emailInfo = {
            teacherName: teacherInfo.firstName,
            studentName: currentSlot.student,
            //teacherEmail: teacherInfo.email,
            teacherEmail: '5995@ait.nsw.edu.au',
            emailText: emailText,
            studentQuestion: 'Student question: ' + currentTopic.studentQuestion
        }
    }
    else {
        console.log('no teacher found');
    }

    return emailjs.send('default_service', apiKeys.STUDENT_TO_TEACHER_ID, emailInfo, apiKeys.USER_ID)
        .then(function (response) {
            console.log('EMAIL NOTIFICATION SUCCESS!', response.status, response.text);
            return 'success';
        }, function (error) {
            console.log('FAILED...', error);
            return 'failed';
        });
}

async function studentCancelNotification() {

    let currentSlot = JSON.parse(localStorage.getItem('CURRENT SLOT'));
    let teacherInfo = await findTeacherInfo({ courseID: currentSlot.courseID });
    let emailInfo = {};
    let emailText = 'Student ' + currentSlot.student + ' has cancelled their consultation appointment in subject ' + currentSlot.subject + ' with you.';

    if (teacherInfo) {
        emailInfo = {
            teacherName: teacherInfo.firstName,
            studentName: currentSlot.student,
            //teacherEmail: teacherInfo.email,
            teacherEmail: '5995@ait.nsw.edu.au',
            emailText: emailText,
            studentQuestion: ''
        }
    }
    else {
        console.log('no teacher found');
    }

    return emailjs.send('default_service', apiKeys.STUDENT_TO_TEACHER_ID, emailInfo, apiKeys.USER_ID)
        .then(function (response) {
            console.log('EMAIL NOTIFICATION SUCCESS!', response.status, response.text);
            return 'success';
        }, function (error) {
            console.log('FAILED...', error);
            return 'failed';
        });
}

async function teacherAcceptNotification() {

    let currentSlot = JSON.parse(localStorage.getItem('CURRENT SLOT'));
    let teacherInfo = findTeacherInfo({ courseID: currentSlot.courseID })
    let emailInfo = {};
    let emailText = {};

    emailText = 'Your consultation in subject ' + currentSlot.subject + ' has been approved! ' + 
    ' Don\'t forget to show up at ' + currentSlot.starts + ' on the ' + currentSlot.date;
    
    if (teacherInfo) {
        emailInfo = {
            studentName: currentSlot.student,
            studentEmail: currentSlot.email,
            emailText: emailText,
        }
    }
    else {
        console.log('no teacher found');
    }

    return emailjs.send('default_service', apiKeys.TEACHER_ACCEPT_ID, emailInfo, apiKeys.USER_ID)
        .then(function (response) {
            console.log('EMAIL NOTIFICATION SUCCESS!', response.status, response.text);
            return 'success';
        }, function (error) {
            console.log('FAILED...', error);
            return 'failed';
        });
}

async function teacherCancelNotification() {


    let currentSlot = JSON.parse(localStorage.getItem('CURRENT SLOT'));
    let teacherInfo = findTeacherInfo({ courseID: currentSlot.courseID })
    let emailInfo = {};
    let emailText = {};

    if (currentSlot.booked) {
        emailText = 'Your appointment request on ' + currentSlot.date +  ' for subject ' + currentSlot.subject + ' has been denied!';
    }
    else if (currentSlot.confirmed) {
        emailText = 'Your appointment request on ' + currentSlot.date +  ' for subject ' + currentSlot.subject + ' has been confirmed!';
    }

    if (teacherInfo) {
        emailInfo = {
            studentName: currentSlot.student,
            studentEmail: currentSlot.email,
            emailText: emailText,
        }
    }
    else {
        console.log('no teacher found');
    }

    return emailjs.send('default_service', apiKeys.TEACHER_ACCEPT_ID, emailInfo, apiKeys.USER_ID)
        .then(function (response) {
            console.log('EMAIL NOTIFICATION SUCCESS!', response.status, response.text);
            return 'success';
        }, function (error) {
            console.log('FAILED...', error);
            return 'failed';
        });
}

