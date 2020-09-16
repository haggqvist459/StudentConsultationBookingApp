import React, { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { Grid, Typography, Button } from '@material-ui/core';
import { Header, Calendar } from '../components';
import { StudentSubjects } from '../utils'

const Home = function ({ history }) {

    const [calendarContent, setCalendarContent] = useState([]);
    const [load, setLoad] = useState();

    //click to profile page
    const handleClick = useCallback(async event => {
        event.preventDefault();

        try {
            history.push('/profile'); // switch /profile to the constant
        } catch (error) {
            alert(error);
        }

    }, [history]);

    useEffect(() => {

        setLoad(true);
        // check if student or not here
        async function fetchCalendarContent() {
            const subjects = await StudentSubjects();
            setCalendarContent(subjects);
            console.log('finished fetching')
        }

        fetchCalendarContent().then(function () {
            console.log('finished wait')
            setLoad(false);
        })

    }, [])

    return (
        <Grid>
            <Grid className='header'> <Header /> </Grid>

            <Grid className='content'>

                <Grid>
                    {load ?
                        <Typography>loading calendar... </Typography>
                        :
                        <Calendar props={calendarContent} />
                    }

                </Grid>

            </Grid>
        </Grid>
    )
}


export const HomeWithRouter = withRouter(Home);
