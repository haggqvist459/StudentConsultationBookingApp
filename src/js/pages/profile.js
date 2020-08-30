import React, { useCallback } from 'react';
import { withRouter } from 'react-router';
import { Grid, Typography } from '@material-ui/core';
import { Header } from '../components';


const Profile = function ({ history }) {

    //click back to home page
    const handleClick = useCallback(async event => {
        event.preventDefault();
    
        try {
          history.push('/home'); // switch /home to the constant
        } catch (error) {
          alert(error);
        }
    
      }, [history]);

    return (
        <Grid>
            <Grid className='header'><Header /></Grid>

            <Grid className='content'>

                <Typography>profile page</Typography>
                    

            </Grid>

        </Grid>
    )

}




export const ProfileWithRouter = withRouter(Profile);