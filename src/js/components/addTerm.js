import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import { Grid, Typography, Button, styled, CircularProgress } from '@material-ui/core';
import { adminServices, DESIGN, FILETYPES } from '../utils';
import "react-datepicker/dist/react-datepicker.css";
import { FileDrop } from './dropZone';
import moment from 'moment';

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

export function AddTerm() {

    const [newTermState, setNewTermState] = useState({
        usersFileStatus: {
            verified: false,
            error: null,
        },
        coursesFileStatus: {
            verified: false,
            error: null,
        },
        enrollmentsFileStatus: {
            verified: false,
            error: null,
        },
        termDates: {
            termStart: null,
            termEnd: null,
            today: new Date(),
        },
        serviceResponse: {
            usersUpload: null,
            coursesUpload: null,
            enrollmentsUpload: null,
        },
        uiState: {
            termConfig: true,
            firebaseLoading: false,
            uploadComplete: false,
        }
    })

    async function upload() {

        let users = await adminServices.uploadTermFile({ termData: JSON.parse(localStorage.getItem('USERS')), fileType: FILETYPES.USERS_FILE });
        let courses = await adminServices.uploadTermFile({ termData: JSON.parse(localStorage.getItem('COURSES')), fileType: FILETYPES.COURSES_FILE });
        let enrollments = await adminServices.uploadTermFile({ termData: JSON.parse(localStorage.getItem('ENROLLMENTS')), fileType: FILETYPES.ENROLLMENTS_FILE });


        setNewTermState({
            ...newTermState,
            serviceResponse: {
                usersUpload: users,
                coursesUpload: courses,
                enrollmentsUpload: enrollments
            },
            uiState: {
                ...newTermState.uiState,
                firebaseLoading: false,
                uploadComplete: true,
            }
        })
    }

    function handleSave() {
        setNewTermState({
            ...newTermState,
            uiState: {
                ...newTermState.uiState,
                firebaseLoading: true,
            }
        })
        upload();
    }

    function readComplete({ fileType }) {

        switch (fileType) {
            case FILETYPES.USERS_FILE:
                console.log('users read complete: ', fileType)
                setNewTermState({
                    ...newTermState,
                    usersFileStatus: {
                        verified: true,
                    }
                })
                break;
            case FILETYPES.COURSES_FILE:
                console.log('courses read complete: ', fileType)
                setNewTermState({
                    ...newTermState,
                    coursesFileStatus: {
                        verified: true,
                    }
                })
                break;
            case FILETYPES.ENROLLMENTS_FILE:
                console.log('enrollments read complete: ', fileType)
                setNewTermState({
                    ...newTermState,
                    enrollmentsFileStatus: {
                        verified: true,
                    }
                })
                break;
            default:
                break;
        }
    }

    function readError({ fileType }) {
        console.log('file read error on file: ', fileType)
    }

    return (
        <Grid container direction={'row'} justify={'center'} item xs={12} sm={12} md={12} lg={12} xl={12}>

            {newTermState.uiState.termConfig ?
                <Grid>
                    <Grid container direction={'row'} justify={'center'}>
                        <Typography>new term</Typography>
                    </Grid>

                    <Grid style={{ margin: '20px' }} container direction={'row'} justify={'space-around'} item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction={'row'} justify={'center'} item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <Typography>Start date</Typography>
                            <StartDate />
                        </Grid>
                        <Grid container direction={'row'} justify={'center'} item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <Typography>End date</Typography>
                            <EndDate />
                        </Grid>
                    </Grid>

                    <Grid container justify={'center'}>

                        {newTermState.termDates.termStart && newTermState.termDates.termEnd ?
                            <Grid container justify={'center'} item xs={12} sm={12} md={12} lg={12} xl={12}>

                                <Grid style={{ margin: '10px' }} item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    {newTermState.uiState.firebaseLoading ?
                                        <CircularProgress />
                                        :
                                        <Grid>
                                            {newTermState.uiState.uploadComplete ?
                                                <Typography>{newTermState.serviceResponse.usersUpload}</Typography>
                                                :
                                                <FileDrop
                                                    fileName={FILETYPES.USERS_FILE}
                                                    readError={() => readError({ fileType: FILETYPES.USERS_FILE })}
                                                    readComplete={() => readComplete({ fileType: FILETYPES.USERS_FILE })} />
                                            }

                                        </Grid>
                                    }
                                </Grid>

                                <Grid style={{ margin: '10px' }} item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    {newTermState.uiState.firebaseLoading ?
                                        <CircularProgress />
                                        :
                                        <Grid>
                                            {newTermState.uiState.uploadComplete ?
                                                <Typography>{newTermState.serviceResponse.coursesUpload}</Typography>
                                                :
                                                <FileDrop
                                                    fileName={FILETYPES.COURSES_FILE}
                                                    readError={() => readError({ fileType: FILETYPES.COURSES_FILE })}
                                                    readComplete={() => readComplete({ fileType: FILETYPES.COURSES_FILE })} />
                                            }

                                        </Grid>
                                    }
                                </Grid>

                                <Grid style={{ margin: '10px' }} item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    {newTermState.uiState.firebaseLoading ?
                                        <CircularProgress />
                                        :
                                        <Grid>
                                            {newTermState.uiState.uploadComplete ?
                                                <Typography>{newTermState.serviceResponse.enrollmentsUpload}</Typography>
                                                :
                                                <FileDrop
                                                    fileName={FILETYPES.ENROLLMENTS_FILE}
                                                    readError={() => readError({ fileType: FILETYPES.ENROLLMENTS_FILE })}
                                                    readComplete={() => readComplete({ fileType: FILETYPES.ENROLLMENTS_FILE })} />
                                            }
                                        </Grid>
                                    }
                                </Grid>

                            </Grid>
                            :
                            <Typography>Please start by selecting dates</Typography>
                        }

                    </Grid>

                    <Grid container justify={'center'} style={{ marginTop: '40px' }}>
                        {newTermState.usersFileStatus.verified && newTermState.coursesFileStatus.verified && newTermState.enrollmentsFileStatus.verified
                            ?
                            <Grid>
                                {newTermState.uiState.firebaseLoading ?
                                    <ToolButton disabled> saving..  </ToolButton>
                                    :
                                    <Grid>
                                        {newTermState.uiState.uploadComplete ? 
                                            <ToolButton disabled> saved! </ToolButton>
                                        :
                                            <ToolButton onClick={handleSave}> save </ToolButton>
                                        }
                                    </Grid>
                                }
                            </Grid>
                            :
                            <ToolButton disabled> save </ToolButton>
                        }
                    </Grid>
                </Grid>
                :
                null
            }

        </Grid>
    )

    function StartDate() {
        return (
            <Grid>
                {newTermState.termDates.termStart ?
                    <DatePicker selected={newTermState.termDates.termStart}
                        onChange={date => localStorage.setItem('STARTS', moment(date).format('MM/DD/YYYY'),
                        setNewTermState({ ...newTermState, termDates: { ...newTermState.termDates, termStart: date } }))} 
                        />
                    :
                    <DatePicker selected={newTermState.termDates.today}
                        onChange={date => localStorage.setItem('STARTS', moment(date).format('MM/DD/YYYY'),
                        setNewTermState({ ...newTermState, termDates: { ...newTermState.termDates, termStart: date } }))} 
                        />
                }
            </Grid>
        )
    }

    function EndDate() {
        return (
            <Grid>
                {newTermState.termDates.termEnd ?
                    <DatePicker selected={newTermState.termDates.termEnd}
                        onChange={date => localStorage.setItem('ENDS', moment(date).format('MM/DD/YYYY'),
                        setNewTermState({ ...newTermState, termDates: { ...newTermState.termDates, termEnd: date } }))} 
                        />
                    :
                    <DatePicker selected={newTermState.termDates.today}
                        onChange={date => localStorage.setItem('ENDS', moment(date).format('MM/DD/YYYY'),
                        setNewTermState({ ...newTermState, termDates: { ...newTermState.termDates, termEnd: date } }))} 
                        />
                }
            </Grid>
        )
    }
}