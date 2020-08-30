import { firebase, authConstants } from '../utils';
const provider = new firebase.auth.GoogleAuthProvider();

export const authActions = {
    googleLogin,
    logout,
}

function googleLogin() {

    return (dispatch) => {
        try {
            firebase.auth().signInWithPopup(provider)
            .then((user) => {
                dispatch(success(JSON.stringify(user)));
            })
            .catch((error) => {
                dispatch(failure(error));
            })
        } catch (error) {
            dispatch(failure(error));
        }
    }

    function success(user) { return { type: authConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: authConstants.LOGIN_FAILURE, error } }
}

function logout() {

    return (dispatch) => {
        try {
            firebase.auth().signOut()
            .then(() => {
                dispatch(success());
            })
            .catch((error) => {
                dispatch(failure(error));
            })
        } catch (error) {
            dispatch(failure(error));
        }
    }
 
    function success(user) { return { type: authConstants.LOGOUT_SUCCESS, user } }
    function failure(error) { return { type: authConstants.LOGOUT_FAILURE, error } }
}