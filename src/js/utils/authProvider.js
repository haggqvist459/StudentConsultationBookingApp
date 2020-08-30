import React, { useEffect, useState, createContext } from 'react';
import firebase from './fbConfig';
import { Grid, CircularProgress } from '@material-ui/core'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [pending, setPending] = useState(true);

    useEffect(() => {       
        firebase.auth().onAuthStateChanged((user) => {
            setCurrentUser(user)
            setPending(false)
        }); 
    }, []);

    if (pending) {

        return (
            <Grid container item xs={12} justify="center" align="center" styles={{margin: "auto", marginTop: "auto"}}>
                <CircularProgress color="primary" />
            </Grid>
        )

    }

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    )
}
