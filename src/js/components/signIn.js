import React, { useCallback, useContext } from 'react';
import { withRouter } from 'react-router';
import { ROUTING_CONSTANTS, firebase, AuthContext } from '../utils';
import { Redirect } from 'react-router';
import { Grid, Typography, Button } from '@material-ui/core';
import { RouterHeader } from '../components';
import '../../sass/components/signIn.scss';


const provider = new firebase.auth.GoogleAuthProvider();

const SignIn = function ({ history }) {


    const handleLogin = useCallback(
        async event => {
            event.preventDefault();
            try {
                provider.setCustomParameters({
                    // hd: firebaseConstants.HD
                });
                firebase.auth().signInWithPopup(provider)
                    .then((user) => {
                        history.push(ROUTING_CONSTANTS.HOME);
                    })
            } catch (error) {
                console.log(error);
            }
        },
        [history]
    );

    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
        return <Redirect to={ROUTING_CONSTANTS.HOME} />; // whatever the home page path is
    }

    return (
        <Grid>
            <Grid>
                <RouterHeader />
            </Grid>
            <Grid container className='content' justify="center" alignItems="center">
                {/* A sign in button here */}
                <Grid container item xs={12} sm={12} md={12} lg={12} justify={"space-around"} alignItems={"center"}>
                    <Grid container direction="column" justify={"center"} alignItems={"center"}>
                        <Typography variant="h3" style={{textAlign: "center"}}> Student Consultation </Typography>
                        <br />
                        <Typography style={{textAlign: "center"}}> Sign in to access the calendar and request an appointment with a teacher.</Typography>
                        <br />
                        <Button variant="outlined" onClick={handleLogin}>Sign In</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}


export const SignInWithRouter = withRouter(SignIn);
