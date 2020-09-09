import React, { useEffect, useState, createContext } from 'react';
import { firebase } from './fbConfig';
import { Grid, CircularProgress } from '@material-ui/core'
import { roleConstants, adminConstants } from './constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();
    const [currentUserRole, setCurrentUserRole] = useState("");
    const [pending, setPending] = useState(true);

    const assignRole = (email) => {
        localStorage.clear();

        if (email.match(/^\d/)) {
            // is the user a student
            console.log("User is a student");
            setCurrentUserRole(roleConstants.STUDENT);

        }
        else if (email === adminConstants.ADMIN1) {
            // is the user an admin
            console.log("User is an admin");
            console.log(adminConstants.ADMIN1);
            setCurrentUserRole(roleConstants.ADMIN);
        }
        else {
            // the user is a teacher
            console.log("User is a teacher");
            setCurrentUserRole(roleConstants.TEACHER);
        }
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            setCurrentUser(user)
            if (user) {
                assignRole(user.email)
                console.log("inside useEffect", currentUserRole)
                setPending(false)
            }

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
