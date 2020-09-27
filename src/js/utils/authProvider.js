import React, { useEffect, useState, createContext } from 'react';
import { firebase } from './fbConfig';
import { Grid, CircularProgress } from '@material-ui/core'
import { ROLE_CONSTANTS, ADMIN_CONSTANTS } from './constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();
    const [currentUserRole, setCurrentUserRole] = useState("");
    const [pending, setPending] = useState(true);

    const assignRole = (email) => {
        localStorage.clear();

        if (email.match(/^\d/)) {
            // is the user a student
            if (email === '6709@ait.nsw.edu.au') {
                console.log('max is a teacher')
                setCurrentUserRole(ROLE_CONSTANTS.STUDENT);
            }
            else if (email === '5995@ait.nsw.edu.au'){
                console.log('tim is a teacher')
                setCurrentUserRole(ROLE_CONSTANTS.STUDENT);
            }
            else {
                console.log("User is a student");
                setCurrentUserRole(ROLE_CONSTANTS.STUDENT);
            }
        }
        else if (email === ADMIN_CONSTANTS.ADMIN1) {
            // is the user an admin
            console.log("User is an admin");
            console.log(ADMIN_CONSTANTS.ADMIN1);
            setCurrentUserRole(ROLE_CONSTANTS.ADMIN);
        }
        else {
            // the user is a teacher
            console.log("User is a teacher");
            setCurrentUserRole(ROLE_CONSTANTS.TEACHER);
        }
    }

    useEffect(() => {
        console.log('auth use effect')
        firebase.auth().onAuthStateChanged((user) => {
            setCurrentUser(user)
            if (user) {
                assignRole(user.email)
                console.log("inside useEffect", currentUserRole)
            }
            setPending(false)
        });
    }, [currentUserRole]);

    if (pending) {

        return (
            <Grid container item xs={12} justify="center" align="center" styles={{ margin: "auto", marginTop: "auto" }}>
                <CircularProgress color="primary" />
            </Grid>
        )

    }

    return (
        <AuthContext.Provider value={{ currentUser, currentUserRole }}>
            {children}
        </AuthContext.Provider>
    )
}
