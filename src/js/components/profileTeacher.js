import React, { useEffect, useState, useContext } from 'react';
import { Grid, Typography, Button, styled, Badge, CircularProgress } from '@material-ui/core';
import { DESIGN, teacherServices, AuthContext } from '../utils';
import { TeacherSubject, ViewSubject } from './teacherSubject';

const BlueButton = styled(Button)({
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
        backgroundColor: DESIGN.HOVER_BLUE,
    }
});

const RedButton = styled(Button)({
    background: DESIGN.BUTTON_RED,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(0, 174, 179, .3)',
    color: 'white',
    height: 48,
    minWidth: '150px',
    padding: '0 30px',
    margin: '10px',
    '&:hover': {
        backgroundColor: DESIGN.HOVER_BLUE,
    }
});

function Profile() {

    const { currentUser } = useContext(AuthContext);

    const [state, setState] = useState({
        uiState: {
            mounted: false,
            activeComponent: null,
            refreshing: false,
            consultationLoading: false,
        },
        serviceResponse: {
            termData: null,
            topics: null,
        },
        data: {
            unfinishedCourses: null,
            finishedCourses: null,
            approved: null,
            requests: null,
        }
    })

    let unfinished = [];
    let finished = [];
    let approved = [];
    let requests = [];

    useEffect(() => {

        async function refreshSubjects() {

            console.log('updating subjects');
            await teacherServices.updateSubject().then(function () {

                console.log('finished updating');
                initTeacher();
            })
        }

        async function initTeacher() {

            let updatedCourseList = await teacherServices.teacherSubjects({ email: currentUser.email });
            updatedCourseList.forEach((item, index) => {
                if (item.startTime === 'teacher must assign') {
                    console.log('unfinished course found')
                    unfinished.push(item);
                }
                else {
                    finished.push(item);
                }

                item.consultations.forEach((consul) => {
                    if (consul.booked) {
                        requests.push(consul)
                    }
                    else if (consul.confirmed) {
                        approved.push(consul)
                    }
                })
            })

            setState({
                ...state,
                uiState: {
                    ...state.uiState,
                    mounted: true,
                    refreshing: false,
                },
                data: {
                    ...state.data,
                    unfinishedCourses: unfinished,
                    finishedCourses: finished,
                    approved: approved,
                    requests: requests,
                }
            })
        }

        if (!state.uiState.mounted) {
            initTeacher();
        }
        else if (state.uiState.refreshing) {
            refreshSubjects();
        }

    }, [state]);

    function handleToolClick(tool) {
        setState({
            ...state,
            uiState: {
                ...state.uiState,
                activeComponent: tool,
            }
        })
    }

    function consulButton({ action, consul }) {

        switch (action) {
            case 'cancel':
                consul.booked = false;
                consul.confirmed = false;
                consul.topic = 'none';
                consul.student = 'none';
                break;
            case 'approve':
                consul.confirmed = true;
                consul.booked = false;
                break;
            default:
                break;
        }

        localStorage.setItem('CURRENT SLOT', JSON.stringify(consul));
        updateConsultation();
    }

    async function updateConsultation() {
        console.log('updating subjects');
        await teacherServices.updateConsultation().then(function () {
            console.log('finished wait');
            setState({
                ...state,
                uiState: {
                    ...state.uiState,
                    refreshing: true,
                }
            })
        })
    }

    function updateSubject() {
        console.log('updating subjects');
        setState({
            ...state,
            uiState: {
                ...state.uiState,
                refreshing: true,
            }
        })
    }

    return (
        <Grid style={{ width: '100vw' }}>
            <Grid container justify={'center'} style={{ marginBottom: '30px' }}>
                <Typography>Teacher Profile</Typography>
            </Grid>

            <Grid container direction={'row'} style={{ marginTop: '20px' }}>

                <Grid container direction={'column'} alignItems={'flex-start'} item xs={12} sm={12} md={2} lg={2} xl={2} style={{ marginTop: '40px' }}>

                    {state.data.unfinishedCourses && state.data.unfinishedCourses.length > 0 ?
                        <BlueButton onClick={() => handleToolClick('update')}
                            endIcon={<Badge badgeContent={state.data.unfinishedCourses.length} color="primary" style={{ marginLeft: '3px' }}></Badge>}>
                            Setup
                        </BlueButton>
                        :
                        <BlueButton disabled>
                            Setup
                        </BlueButton>
                    }

                    {state.data.finishedCourses && state.data.finishedCourses.length > 0 ?
                        <BlueButton
                            onClick={() => handleToolClick('courses')}
                            endIcon={<Badge badgeContent={state.data.finishedCourses.length} color="primary" style={{ marginLeft: '3px' }}></Badge>}>
                            Courses
                        </BlueButton>
                        :
                        <BlueButton disabled>
                            Courses
                        </BlueButton>
                    }

                    {state.data.requests && state.data.requests.length > 0 ?
                        <BlueButton onClick={() => handleToolClick('requests')}
                            endIcon={<Badge badgeContent={state.data.requests.length} color="primary" style={{ marginLeft: '3px' }}></Badge>}>
                            Requests
                        </BlueButton>
                        :
                        <BlueButton disabled>
                            Requests
                        </BlueButton>
                    }

                    {state.data.approved && state.data.approved.length > 0 ?
                        <BlueButton onClick={() => handleToolClick('approved')}
                            endIcon={<Badge badgeContent={state.data.approved.length} color="primary" style={{ marginLeft: '3px' }}></Badge>}>
                            Approved
                        </BlueButton>
                        :
                        <BlueButton disabled>
                            Approved
                        </BlueButton>
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
                        {state.data.unfinishedCourses.map((item, index) => {
                            return (
                                <TeacherSubject subject={item} key={index} updateSubject={updateSubject} />
                            )
                        })}
                    </Grid>
                )
            // edit course consultation day or time ? 
            case 'courses':
                return (
                    <Grid container direction={'row'} justify={'center'} item xs={12} sm={12} md={8} lg={8} xl={8} style={{ marginTop: '40px' }}>
                        {state.data.finishedCourses.map((item, index) => {
                            return (
                                <ViewSubject subject={item} key={index} />
                            )
                        })}
                    </Grid>
                )

            case 'requests':
                return (
                    <Grid container direction={'row'} justify={'center'} item xs={12} sm={12} md={8} lg={8} xl={8} style={{ marginTop: '40px' }}>
                        {state.data.requests.map((item, index) => {
                            return (
                                <Grid key={index} container direction={'row'} justify={'center'} item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Consultation consultation={item} />
                                </Grid>
                            )
                        })}
                    </Grid>
                )

            case 'approved':
                return (
                    <Grid container direction={'row'} justify={'center'} item xs={12} sm={12} md={8} lg={8} xl={8} style={{ marginTop: '40px' }}>
                        {state.data.approved.map((item, index) => {
                            return (
                                <Grid key={index} container direction={'row'} justify={'center'} item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Consultation consultation={item} />
                                </Grid>
                            )
                        })}
                    </Grid>
                )
            default:
                return null;
        }
    }

    function Consultation({ consultation }) {
        console.log('consul: ', consultation);
        return (
            <Grid container direction={'row'} justify={'center'} style={{ marginTop: '30px' }}>
                {state.uiState.consultationLoading && state.uiState.consultationLoading ?
                    <CircularProgress />
                    :
                    <Grid>
                        <Grid container direction={'row'} justify={'center'}>
                            <Typography> Subject: {consultation.subject}</Typography>

                        </Grid>

                        <Grid container direction={'row'} justify={'center'}>
                            <Typography> {consultation.date} at: {consultation.starts}:{consultation.ends}</Typography>
                        </Grid>

                        <Grid container direction={'row'} justify={'center'}>
                            <Typography> with: {consultation.student}</Typography>
                        </Grid>

                        <Grid container direction={'row'} justify={'center'}>
                            <RedButton onClick={() => consulButton({ action: 'cancel', consul: consultation })}>
                                Cancel
                            </RedButton>    
                            {consultation.confirmed ? 
                                null
                            :
                            <BlueButton onClick={() => consulButton({ action: 'approve', consul: consultation })}>
                                Approve
                            </BlueButton>
                            }
                            
                        </Grid>
                    </Grid>
                }
            </Grid>
        )
    }
}

export default Profile;