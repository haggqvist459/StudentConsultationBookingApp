import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { Grid, Typography } from '@material-ui/core';
import { Header, Footer, Calendar } from '../components';
import { calendarActions } from '../actions';

const Home = function ({ history }) {

    const { auth, error, user } = useSelector(state => state.auth);
    
    const dispatch = useDispatch();


    useEffect(() => {

        console.log('home useEffect ' + auth);
        dispatch(calendarActions.updateStudentCalendar(user.studentID));
        
    }, [auth, error, user, dispatch])


    return (
        <Grid>
            <Grid className='header'> <Header /> </Grid>

            <Grid className='content'>

                {auth ?
                    <Grid>
                        <Calendar />
                    </Grid>
                    :
                    <Grid>
                        <Typography> log in to access the calendar</Typography>
                    </Grid>
                }

            </Grid>

            <Grid className='footer'> <Footer /> </Grid>
        </Grid>
    )
}


export const HomeWithRouter = withRouter(Home);
