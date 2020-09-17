// export const authConstants = {

//     LOGIN_REQUEST: 'LOGIN_REQUEST',
//     LOGIN_SUCCESS: 'LOGIN_SUCCESS',
//     LOGIN_FAILURE: 'LOGIN_FAILURE',

//     LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
//     LOGOUT_FAILURE: 'LOGOUT_FAILURE',
// };

export const ERRORS = {
    FIREBASE_ERROR: 'Connection to firebase failed.',
}

export const DESIGN = {
    PRIMARY_COLOR: '#00AEB3',
    ERROR_RED: '#FF0000',
    BUTTON_RED: '#B14E62',
}

export const ROUTING_CONSTANTS = { 

    PROFILE: '/profile',
    HOME: '/home',
}

export const REQUIRED_FIELDS = { 
    USERS: [
        'user_id',
        'login_id',
        'full_name',
        'email'
    ],
    COURSES: [
        'course_id',
        'long_name',
        'start_date',
        'end_date'
    ],
    ENROLLMENTS: [
        'course_id',
        'user_id',
        'role',
        'role_id'
    ],
}

export const ICON_CONSTANTS = {
    ADD: 'add',
    ACCEPTED: 'accepted',
    ERROR: 'failed',
    LOADING: 'loading',
}

export const UI_TEXT = {
    USERS_UPLOAD: 'Drop users here',
    COURSES_UPLOAD: 'Drop courses here',
    ENROLLMENTS_UPLOAD: 'Drop enrollments here',

    UPLOAD_LOADING: 'Loading... ',
    INCOMPLETE_UPLOAD_ERROR: 'File incomplete, please see upload guide for required fields.',
}


export const FIREBASE_CONSTANTS = {
    HD: 'ait.edu.au',
    CURRENT_TERM_COLLECTION: 'currentTerm',
    USERS_DOC: 'users',
    COURSES_DOC: 'courses',
    ENROLLMENTS_DOC: 'enrollments',

    USERS_UPLOAD_SUCCESS: 'Users were uploaded successfully!',
    USERS_UPLOAD_FAILURE: 'Users failed to upload!',

    COURSES_UPLOAD_SUCCESS: 'Courses were uploaded successfully!',
    COURSES_UPLOAD_FAILURE: 'Courses failed to upload!',

    ENROLLMENTS_UPLOAD_SUCCESS: 'Enrollments were uploaded successfully!',
    ENROLLMENTS_UPLOAD_FAILURE: 'Enrollments failed to upload!',
}

export const FILETYPES = {
    USERS_FILE: 'USERS',
    COURSES_FILE: 'COURSES',
    ENROLLMENTS_FILE: 'ENROLLMENTS',
}

export const ROLE_CONSTANTS = {
    ROLE: "role",
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin',
}

export const ADMIN_CONSTANTS = {
    ADMIN1: 'contactburnthevillage@gmail.com',
}

// export const calendarConstants = {

//     STUDENT_CALENDAR_FIRESTORE_FAILURE: 'CALENDAR_FIRESTORE_FAILURE',
//     GET_SUBJECT_FAILURE: 'GET_SUBJECT_FAILURE',

//     UPDATE_STUDENT_CALENDAR_SUCCESS: 'UPDATE_STUDENT_CALENDAR',
//     UPDATE_STUDENT_CALENDAR_FAILURE: 'UPDATE_FAILURE',
    
//     UPDATE_SUBJECT_CONSULTATIONS_SUCCESS: "UPDATE_SUBJECT_CONSULTATIONS_SUCCESS",
//     UPDATE_SUBJECT_CONSULTATIONS_FAILURE: "UPDATE_SUBJECT_CONSULTATIONS_FAILURE",


// }


