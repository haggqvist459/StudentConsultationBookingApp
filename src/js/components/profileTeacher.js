import React, { useEffect, useState, useContext } from 'react';
import { Grid, Typography, Button, styled, Badge } from '@material-ui/core';
import { useLocation } from "react-router-dom";
import { DESIGN, teacherServices, AuthContext } from '../utils';
import { TeacherSubject } from './teacherSubject';

const ToolButton = styled(Button)({
    background: DESIGN.PRIMARY_COLOR,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(0, 174, 179, .3)',
    color: 'white',
    height: 48,
    minWidth: '150px',
    padding: '0 30px',
    margin: '10px',
    '&:hover': {
        backgroundColor: DESIGN.PRIMARY_COLOR,
    }
});

function Profile() {

    const location = useLocation();
    const { currentUser } = useContext(AuthContext);

    const [state, setState] = useState({
        uiState: {
            mounted: false,
            activeComponent: null,
            refreshing: false,
        },
        serviceResponse: {
            termData: null,
            topics: null,
        },
        unfinishedCourses: null,
        finishedCourses: null,
    })

    let unfinished = [];
    let finished = [];

    useEffect(() => {
        if (!state.refreshing) {
            if (!state.mounted) {
                setState({
                    ...state,
                    uiState: {
                        mounted: true,
                    }
                })
                if (location.state.courses) {
                    location.state.courses.forEach((item, index) => {
                        if (item.startTime === 'teacher must assign') {
                            console.log('unfinished course found')
                            unfinished.push(item);
                        }
                        else {
                            finished.push(item);
                        }
                    })
                    setState({
                        ...state,
                        unfinishedCourses: unfinished,
                        finishedCourses: finished,
                    })
                }
            }
        }

    }, []);

    function handleToolClick(tool) {
        setState({
            ...state,
            uiState: {
                ...state.uiState,
                activeComponent: tool,
            }
        })
    }

    async function updateSubject() {
        console.log('updating item');
        await teacherServices.updateSubject();
        console.log('finished wait');
        let updatedCourseList = await teacherServices.teacherSubjects({ email: currentUser.email });
        unfinished = [];
        finished = [];
        updatedCourseList.forEach((item, index) => {
            if (item.startTime === 'teacher must assign') {
                console.log('unfinished course found')
                unfinished.push(item);
            }
            else {
                finished.push(item);
            }
        })
        setState({
            ...state,
            uiState: {
                ...state.uiState,
                refreshing: true,
            },
            unfinishedCourses: unfinished,
            finishedCourses: finished,
        })
    }

    function ActiveComponent() {
        switch (state.uiState.activeComponent) {
            // view term not implemented !
            case 'update':
                return (
                    <Grid container direction={'row'} justify={'center'} item xs={12} sm={12} md={8} lg={8} xl={8} style={{ marginTop: '40px' }}>
                        <Grid style={{ marginBottom: '40px', textAlign: 'center' }}>
                            <Grid container justify={'center'} item xs={12} sm={12} md={12} lg={12} xl={12}><Typography>These courses need to be assigned a day for consultations</Typography></Grid>
                            <Grid container justify={'center'} item xs={12} sm={12} md={12} lg={12} xl={12}><Typography>Students will not be able to make bookings until a day and time is set</Typography></Grid>
                        </Grid>
                        {state.unfinishedCourses.map((item, index) => {
                            return (
                                <TeacherSubject subject={item} key={index} updateSubject={updateSubject} />
                            )
                        })}
                    </Grid>
                )
            // edit course consultation day or time ? 
            case 'courses':
                return (
                    <Grid container direction={'row'} justify={'center'} item xs={12} sm={12} md={6} lg={6} xl={6} style={{ marginTop: '40px' }}>
                        <Typography>courses</Typography>
                    </Grid>
                )
            default:
                return null;
        }
    }

    return (
        <Grid style={{ width: '100vw' }}>
            <Grid container justify={'center'} style={{ marginBottom: '30px' }}>
                <Typography>Teacher Profile</Typography>
            </Grid>

            <Grid container direction={'row'} style={{ marginTop: '20px' }}>

                <Grid container direction={'column'} alignItems={'flex-start'} item xs={12} sm={12} md={2} lg={2} xl={2} style={{ marginTop: '40px' }}>

                    {state.unfinishedCourses && state.unfinishedCourses ?
                        <ToolButton onClick={() => handleToolClick('update')}>
                            Update
                        <Badge badgeContent={state.unfinishedCourses.length} color="primary" style={{ marginLeft: '15px' }}>
                            </Badge>
                        </ToolButton>
                        :
                        null
                    }

                    {state.finishedCourses && state.finishedCourses.length > 0 ?
                        <ToolButton onClick={() => handleToolClick('courses')}>
                            Courses
                        <Badge badgeContent={state.finishedCourses.length} color="primary" style={{ marginLeft: '15px' }}>

                            </Badge>
                        </ToolButton>
                        :
                        <ToolButton disabled>
                            Courses
                    </ToolButton>
                    }

                </Grid>

                <ActiveComponent />

            </Grid>

            {/* Pending appointments */}
            <Grid>

            </Grid>
            {/* Approved appointments */}
            <Grid>

            </Grid>
        </Grid>
    )
}

export default Profile;