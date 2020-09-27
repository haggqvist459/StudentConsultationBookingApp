import emailjs from 'emailjs-com';
import apiKeys from './apikeys';
import { FIREBASE_CONSTANTS } from './constants';
import { firebase } from './fbConfig';

export const emailNotifications = {
    studentRequestNotification,
}

async function findTeacherInfo({ courseID }) {

    const db = firebase.firestore();
    const currentTermRef = db.collection(FIREBASE_CONSTANTS.CURRENT_TERM_COLLECTION);
    let users = [];
    let courses = [];
    let teacherID = '';
    let teacher = {};
    console.log('teacher info courseID ', courseID);

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

async function studentRequestNotification({ courseID, studentName }) {

    let teacherInfo = await findTeacherInfo({courseID: courseID});
    let emailInfo = {};
    if(teacherInfo) {
        emailInfo = {
            teacherName: teacherInfo.firstName,
            studentName: studentName,
            //teacherEmail: teacherInfo.email,
            teacherEmail: '5995@ait.nsw.edu.au'
        }
    }
    else {
        console.log('no teacher found');
    }

    return emailjs.send('default_service', apiKeys.REQUEST_TEMPLATE_ID, emailInfo, apiKeys.USER_ID)
        .then(function (response) {
            console.log('EMAIL NOTIFICATION SUCCESS!', response.status, response.text);
            return 'success';
        }, function (error) {
            console.log('FAILED...', error);
            return 'failed';
        });
}