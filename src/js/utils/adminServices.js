import { firebase } from './fbConfig';
import { FIREBASE_CONSTANTS, ERRORS, FILETYPES } from './constants';

export const adminServices = {
    getAllSubjects,
    checkCurrentTerm,
    uploadTermFile,
    getTopics,
    newTopic,
    updateTopic,
    deleteTopic,
}

async function getAllSubjects() {

    const db = firebase.firestore();
    const enrollmentRef = db.collection(FIREBASE_CONSTANTS.CURRENT_TERM_COLLECTION);
    let currentUserID = '';
    let enrollments = {};
    let courses = {};
    let users = {};
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
                            users = item.data();
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
            userEnrollments.push(item);
        })

        courses.courses.forEach((item, index) => {
            if (item.daysOfWeek !== "teacher must assign") {
                userCourses.push(item);
            }
        })

        return userCourses;
    }
    catch (error) {
        console.log(error);
        return (ERRORS.FIREBASE_ERROR);
    }
}

async function checkCurrentTerm() {

    const db = firebase.firestore();
    const currentTermRef = db.collection(FIREBASE_CONSTANTS.CURRENT_TERM_COLLECTION);

    try {
        return new Promise((resolve, reject) => {
            currentTermRef.get().then(function (result) {
                if (result.empty) {
                    console.log('rejecting termdata')
                    reject(false)
                }
                else {
                    console.log('resolving termdata')
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

    console.log('adminservices', termData, fileType);
    console.log('adminservices', fileType);
    const db = firebase.firestore();

    switch (fileType) {
        case FILETYPES.USERS_FILE:
            try {
                return uploadUsers();
            } catch (error) {
                return error;
            };
        case FILETYPES.COURSES_FILE:
            try {
                return uploadCourses();
            } catch (error) {
                return error;
            };
        case FILETYPES.ENROLLMENTS_FILE:
            try {
                return uploadEnrollments();
            } catch (error) {
                return error;
            };
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

async function getTopics() {

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

async function newTopic({ topic }) {
    const db = firebase.firestore();
    const topicRef = db.collection(FIREBASE_CONSTANTS.TOPIC_COLLECTION);
    console.log('new topic, ', topic)
    return new Promise((resolve, reject) => {
        try {
            topicRef.doc().set({ topic: topic })
                .catch(function () {
                    console.log('new topic reject')
                    reject('failed to store')
                })
                .then(function () {
                    console.log('new topic resolve')
                    resolve('stored successfully')
                })
        }
        catch (error) {
            console.log(error);
            reject('failed to store')
        }
    })
}

async function updateTopic({ topicRef, topic }) {
    const db = firebase.firestore();
    const dbRef = db.collection(FIREBASE_CONSTANTS.TOPIC_COLLECTION).doc(topicRef);
    console.log('updating ', topicRef, ' with data ', topic.topic)
    return new Promise((resolve, reject) => {
        try {
            dbRef.update({ topic: topic.topic })
                .catch(function () {
                    console.log('update topic reject');
                    reject('failed to update');
                })
                .then(function () {
                    console.log('update topic resolve');
                    resolve('updated successfully');
                })
        }
        catch (error) {
            console.log(error);
            reject('failed to update')
        }
    })
}

async function deleteTopic({ topicRef }) {
    const db = firebase.firestore();
    const dbRef = db.collection(FIREBASE_CONSTANTS.TOPIC_COLLECTION).doc(topicRef);

    return new Promise((resolve, reject) => {
        try {
            dbRef.delete().catch(function (error) {
                console.log(error);
                reject('delete error');
            }).then(function () {
                console.log('deleted');
                resolve('delete success');
            });
        }
        catch (error) {
            console.log(error);
            reject('failed to delete')
        }
    })
}