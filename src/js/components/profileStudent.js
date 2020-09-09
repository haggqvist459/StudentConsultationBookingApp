import React from 'react'
import { Grid, Typography } from '@material-ui/core'


const Profile = (props) => {


    return (
        <Grid container direction="row">
            <Typography>Student Profile</Typography>
            {/* Pending appointments */}
            <Grid container direction="column">
                <h4>Pending appointments: </h4>

            </Grid>
            {/* Approved appointments */}
            <Grid container direction="column">
                <h4>Pending appointments: </h4>

            </Grid>
        </Grid>
    )
}

export default Profile;