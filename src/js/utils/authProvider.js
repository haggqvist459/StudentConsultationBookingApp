import React, { useEffect, useState, createContext } from 'react';
import { useSelector } from 'react-redux';
import { Grid, CircularProgress } from '@material-ui/core'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const { auth, user } = useSelector(state => state.auth);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        if (auth) {
            setCurrentUser(user);
            setPending(false);
        }
        else {
            setPending(false);
        }
    }, [auth, user]);

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
