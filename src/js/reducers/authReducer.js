import { authConstants } from '../utils/constants';

const initState = {
    auth: null,
    error: null,
    user: {
        email: null,
        displayName: null,
        role: null,
        studentID: null,
    }
}


function authReducer(state = initState, action) {
    switch (action.type) {
        case authConstants.LOGIN_SUCCESS:
            const { user } = JSON.parse(action.user);
            const studentID = parseInt(user.email.substr(0, 4));
            console.log("email iso: " + user.email);

            if (user.email === 'contactburnthevillage@gmail.com') {
                console.log('admin logged in');
                return {
                    auth: true,
                    user: {
                        email: user.email,
                        displayName: user.displayName,
                        role: 'admin',
                    }
                }
            }
            else {
                if (studentID) {
                    console.log('student id: ' + studentID);
                    return {
                        auth: true,
                        user: {
                            email: user.email,
                            displayName: user.displayName,
                            role: 'student',
                            studentID: studentID,
                        }
                    }
                }
                else {
                    console.log('teacher logged in');
                    return {
                        auth: true,
                        user: {
                            email: user.email,
                            displayName: user.displayName,
                            role: 'teacher',
                        }
                    }
                }
            }
        case authConstants.LOGIN_FAILURE:
            return {
                error: action.error,
            };
        case authConstants.LOGOUT_SUCCESS:
            return {
                auth: false,
                user: {
                    email: null,
                    displayName: null,
                    role: null,
                }
            };
        case authConstants.LOGOUT_FAILURE:
            return {
                error: action.error,
            };
        default:
            return state
    }
}

export default authReducer;