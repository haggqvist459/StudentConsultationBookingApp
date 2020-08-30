import React, { useCallback } from 'react';
import { withRouter } from 'react-router';
import { Grid, Typography } from '@material-ui/core';
import { Header, Calendar } from '../components';


const Home = function ({ history }) {

    //click to profile page
    const handleClick = useCallback(async event => {
        event.preventDefault();

        try {
            history.push('/profile'); // switch /profile to the constant
        } catch (error) {
            alert(error);
        }

    }, [history]);


    return (
        <Grid>
            <Grid className='header'> <Header /> </Grid>

            <Grid className='content'>

                <Grid>
                    <Typography> log in to access the calendar</Typography>
                </Grid>

            </Grid>
            
        </Grid>
    )
}


export const HomeWithRouter = withRouter(Home);
