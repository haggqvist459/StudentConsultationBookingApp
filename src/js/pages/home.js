import React, { useEffect, useState, useContext } from 'react';
import { withRouter } from 'react-router';
import { Grid, Typography } from '@material-ui/core';
import { RouterHeader, Calendar } from '../components';
import { studentServices, AuthContext, ROLE_CONSTANTS, teacherServices } from '../utils'

const Home = function ({ history }) {

    const [calendarContent, setCalendarContent] = useState([]);
    const [load, setLoad] = useState();
    const { currentUserRole } = useContext(AuthContext);
    const { currentUser } = useContext(AuthContext);
    let courseList = [];

    //click to profile page
    function handleClick() {
        try {
            switch (currentUserRole) {
                case ROLE_CONSTANTS.STUDENT:
                    history.push({
                        pathname: '/profile'
                    })
                    break;
                case ROLE_CONSTANTS.TEACHER:
                    history.push({
                        pathname: '/profile',
                        state: { courses: courseList }
                    })
                    break;
                case ROLE_CONSTANTS.ADMIN:

                    break;

                default:
                    break;
            }
            //history.push('/profile'); // switch /profile to the constant
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {

        setLoad(true);
        let subjects = {}
        // check if student or not here
        async function fetchCalendarContent() {
            switch (currentUserRole) {
                case ROLE_CONSTANTS.STUDENT:
                    subjects = await studentServices.studentSubjects({ email: currentUser.email });
                    setCalendarContent(subjects);
                    console.log('student subjects')
                    break;
                case ROLE_CONSTANTS.TEACHER:
                    subjects = await teacherServices.teacherSubjects({ email: currentUser.email });
                    subjects.forEach((item, index) => {
                        courseList.push(item);
                    })
                    setCalendarContent(subjects);
                    break;
                case ROLE_CONSTANTS.ADMIN:
                    console.log('admin: ');
                    break;

                default:
                    break;
            }

        }

        fetchCalendarContent().then(function () {
            console.log('finished wait')
            setLoad(false);
        })

    }, [])

    return (
        <Grid>
            <Grid className='RouterHeader'> <RouterHeader onClick={handleClick} link={'Profile'} /> </Grid>

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
