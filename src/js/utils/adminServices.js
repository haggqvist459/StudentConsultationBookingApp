import { firebase } from './fbConfig';
import { firebaseConstants, errors, fileTypes } from './constants';

export const adminServices = {
    checkCurrentTerm,
    uploadTermFile
}

async function checkCurrentTerm() {

    const db = firebase.firestore();
    const currentTermRef = db.collection(firebaseConstants.CURRENT_TERM_COLLECTION);

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
        return (errors.FIREBASE_ERROR);
    }
}

async function uploadTermFile({ termData, fileType }) {

    console.log(termData);
    const db = firebase.firestore();

    switch (fileType) {
        case fileTypes.USERS_FILE:
            try {
                return uploadUsers();
            } catch (error) {
                return error;
            }
        case fileTypes.COURSES_FILE:
            try {
                return uploadCourses();
            } catch (error) {
                return error;
            }
        case fileTypes.ENROLLMENTS_FILE:
            try {
                return uploadEnrollments();
            } catch (error) {
                return error;
            }
        default:
            break;
    }

    async function uploadUsers() {
        const userRef = db.collection(firebaseConstants.CURRENT_TERM_COLLECTION).doc(firebaseConstants.USERS_DOC);

        return new Promise((resolve, reject) => {

            const pureUserObjList = termData.map((obj) => { return Object.assign({}, obj) });

            const termUsers = {
                users: pureUserObjList,
            }

            userRef.set(termUsers)
                .catch(function () {
                    console.log('users reject')
                    reject(firebaseConstants.USERS_UPLOAD_FAILURE)
                })
                .then(function () {
                    console.log('users resolve')
                    resolve(firebaseConstants.USERS_UPLOAD_SUCCESS)
                })
        })
    }

    async function uploadCourses() {
        const coursesRef = db.collection(firebaseConstants.CURRENT_TERM_COLLECTION).doc(firebaseConstants.COURSES_DOC);

        return new Promise((resolve, reject) => {

            const pureCourseObjList = termData.map((obj) => { return Object.assign({}, obj) });

            const termCourses = {
                courses: pureCourseObjList,
            }

            coursesRef.set(termCourses)
                .catch(function () {
                    console.log('courses reject')
                    reject(firebaseConstants.COURSES_UPLOAD_FAILURE)
                })
                .then(function () {
                    console.log('courses resolve')
                    resolve(firebaseConstants.COURSES_UPLOAD_SUCCESS)
                })
        })
    }

    async function uploadEnrollments() {
        const enrollmentsRef = db.collection(firebaseConstants.CURRENT_TERM_COLLECTION).doc(firebaseConstants.ENROLLMENTS_DOC);

        return new Promise((resolve, reject) => {

            const pureEnrollmentsObjList = termData.map((obj) => { return Object.assign({}, obj) });

            const termEnrollments = {
                enrollments: pureEnrollmentsObjList,
            }

            enrollmentsRef.set(termEnrollments)
                .catch(function () {
                    console.log('enrollments reject')
                    reject(firebaseConstants.ENROLLMENTS_UPLOAD_FAILURE)
                })
                .then(function () {
                    console.log('enrollments resolve')
                    resolve(firebaseConstants.ENROLLMENTS_UPLOAD_SUCCESS)
                })
        })
    }
}