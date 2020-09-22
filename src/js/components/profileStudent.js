import React from 'react';
import { Grid, Typography } from '@material-ui/core';
//import { AuthContext } from '../utils';

const Profile = function ({ history }) {

    //const { currentUser } = useContext(AuthContext);
    
    // const handleClick = () => {
    //     console.log(currentUser)
    // }

    return (
        <Grid container className='content' justify="center" alignItems="center">
            {/* A sign in button here */}
            <Grid container item xs={12} sm={12} md={12} lg={12} justify={"space-around"} alignItems={"center"}>
                <Grid container direction="column" justify={"center"} alignItems={"center"}>
                        <Grid container direction="row" justify={"center"} alignItems={"center"}>
                        <Typography variant="h4">
                           Appointment overview for <br/> Tim Haggqvist Luotomaki
                        </Typography>
                        </Grid>
                        <br/>
                        <Typography variant="h5">Pending appointments: </Typography>
                        <Typography>
                            No pending appointments
                        </Typography>
                        <Typography variant="h5">Upcoming appointments: </Typography>
                        <Typography>
                            No upcoming appointments
                        </Typography>
                        
                </Grid>
            </Grid>
        </Grid>

    )
}

export default Profile;

/*
            <Grid container direction="column">
                <h4>Pending appointments: </h4>
            </Grid>

*/