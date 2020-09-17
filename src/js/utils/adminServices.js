import { firebase } from './fbConfig';
import { FIREBASE_CONSTANTS, ERRORS, FILETYPES } from './constants';

export const adminServices = {
    checkCurrentTerm,
    uploadTermFile,
}

async function checkCurrentTerm() {

    const db = firebase.firestore();
    const currentTermRef = db.collection(FIREBASE_CONSTANTS.CURRENT_TERM_COLLECTION);

    try {
        return new Promise((resolve, reject) => {
            currentTermRef.get().then(function (result) {
                if (result.empty) {
                    reject(false)
                }
                else {
                    resolve(true)
                }
            });
        }).catch(function () {
            return false;
        })
    }
    catch (error) {
        console.log(error);
        return (ERRORS.FIREBASE_ERROR);
    }
}

async function uploadTermFile({ termData, fileType }) {

    console.log(termData);
    const db = firebase.firestore();

    switch (fileType) {
        case FILETYPES.USERS_FILE:
            try {
                return uploadUsers();
            } catch (error) {
                return error;
            }
        case FILETYPES.COURSES_FILE:
            try {
                return uploadCourses();
            } catch (error) {
                return error;
            }
        case FILETYPES.ENROLLMENTS_FILE:
            try {
                return uploadEnrollments();
            } catch (error) {
                return error;
            }
        default:
            break;
    }

    async function uploadUsers() {
        const userRef = db.collection(FIREBASE_CONSTANTS.CURRENT_TERM_COLLECTION).doc(FIREBASE_CONSTANTS.USERS_DOC);

        return new Promise((resolve, reject) => {

            const pureUserObjList = termData.map((obj) => { return Object.assign({}, obj) });

            const termUsers = {
                users: pureUserObjList,
            }

            userRef.set(termUsers)
                .catch(function () {
                    console.log('users reject')
                    reject(FIREBASE_CONSTANTS.USERS_UPLOAD_FAILURE)
                })
                .then(function () {
                    console.log('users resolve')
                    resolve(FIREBASE_CONSTANTS.USERS_UPLOAD_SUCCESS)
                })
        })
    }

    async function uploadCourses() {
        const coursesRef = db.collection(FIREBASE_CONSTANTS.CURRENT_TERM_COLLECTION).doc(FIREBASE_CONSTANTS.COURSES_DOC);

        return new Promise((resolve, reject) => {

            const pureCourseObjList = termData.map((obj) => { return Object.assign({}, obj) });

            const termCourses = {
                courses: pureCourseObjList,
            }

            coursesRef.set(termCourses)
                .catch(function () {
                    console.log('courses reject')
                    reject(FIREBASE_CONSTANTS.COURSES_UPLOAD_FAILURE)
                })
                .then(function () {
                    console.log('courses resolve')
                    resolve(FIREBASE_CONSTANTS.COURSES_UPLOAD_SUCCESS)
                })
        })
    }

    async function uploadEnrollments() {
        const enrollmentsRef = db.collection(FIREBASE_CONSTANTS.CURRENT_TERM_COLLECTION).doc(FIREBASE_CONSTANTS.ENROLLMENTS_DOC);

        return new Promise((resolve, reject) => {

            const pureEnrollmentsObjList = termData.map((obj) => { return Object.assign({}, obj) });

            const termEnrollments = {
                enrollments: pureEnrollmentsObjList,
            }

            enrollmentsRef.set(termEnrollments)
                .catch(function () {
                    console.log('enrollments reject')
                    reject(FIREBASE_CONSTANTS.ENROLLMENTS_UPLOAD_FAILURE)
                })
                .then(function () {
                    console.log('enrollments resolve')
                    resolve(FIREBASE_CONSTANTS.ENROLLMENTS_UPLOAD_SUCCESS)
                })
        })
    }
}
