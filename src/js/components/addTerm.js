import React, { useCallback, useState, useEffect } from 'react'
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';
import DatePicker from "react-datepicker";
import { Grid, Typography, Button, Box, styled, CircularProgress } from '@material-ui/core';
import { CheckCircleOutline, ErrorOutline, AddCircleOutline, HourglassEmpty } from '@material-ui/icons';
import { adminServices, design, fileTypes } from '../utils';
import "react-datepicker/dist/react-datepicker.css";

const ICON_CONSTANTS = {
    ADD: 'add',
    ACCEPTED: 'accepted',
    ERROR: 'failed',
    LOADING: 'loading',
};

const UI_TEXT = {
    USERS_UPLOAD: 'Drop users here',
    COURSES_UPLOAD: 'Drop courses here',
    ENROLLMENTS_UPLOAD: 'Drop enrollments here',

    UPLOAD_LOADING: 'Loading... ',
    INCOMPLETE_UPLOAD_ERROR: 'File incomplete, please see upload guide for required fields.',
};

const ToolButton = styled(Button)({
    background: design.PRIMARY_COLOR,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(0, 174, 179, .3)',
    color: 'white',
    height: 48,
    minWidth: '150px',
    padding: '0 30px',
    margin: '10px',
    '&:hover': {
        backgroundColor: design.PRIMARY_COLOR,
    }
});

function StatusIcon({ status }) {
    switch (status) {
        case ICON_CONSTANTS.LOADING:
            return <HourglassEmpty color={'primary'} />

        case ICON_CONSTANTS.ERROR:
            return <ErrorOutline color={'error'} />

        case ICON_CONSTANTS.ACCEPTED:
            return <CheckCircleOutline color={'primary'} />

        case ICON_CONSTANTS.ADD:
            return <AddCircleOutline color={'primary'} />

        default:
            return null;
    }
}

export function AddTerm() {

    const [newTermState, setNewTermState] = useState({
        usersFileStatus: {
            verified: false,
            name: UI_TEXT.USERS_UPLOAD,
            icon: ICON_CONSTANTS.ADD,
            error: null,
            loading: false,
            list: [],
        },
        coursesFileStatus: {
            verified: false,
            name: UI_TEXT.COURSES_UPLOAD,
            icon: ICON_CONSTANTS.ADD,
            error: null,
            loading: false,
            list: [],
        },
        enrollmentsFileStatus: {
            verified: false,
            name: UI_TEXT.ENROLLMENTS_UPLOAD,
            icon: ICON_CONSTANTS.ADD,
            error: null,
            loading: false,
            list: [],
        },
        termDates: {
            termStart: null,
            termEnd: null,
            today: new Date(),
        },
        uiState: {
            termConfig: true,
            serviceResponse: {
                usersUpload: null,
                coursesUpload: null,
                enrollmentsUpload: null,
            },
        }
    })

    async function upload() {

        setNewTermState({
            ...newTermState,
            usersFileStatus: {
                ...newTermState.usersFileStatus,
                name: await adminServices.uploadTermFile({ termData: newTermState.usersFileStatus.list, fileType: fileTypes.USERS_FILE }),
            },
            coursesFileStatus: {
                ...newTermState.coursesFileStatus,
                name: await adminServices.uploadTermFile({ termData: newTermState.coursesFileStatus.list, fileType: fileTypes.COURSES_FILE }),
            },
            enrollmentsFileStatus: {
                ...newTermState.enrollmentsFileStatus,
                name: await adminServices.uploadTermFile({ termData: newTermState.enrollmentsFileStatus.list, fileType: fileTypes.ENROLLMENTS_FILE }),
            },
        })
    }

    function handleSave() {

        setNewTermState({
            ...newTermState,
            usersFileStatus: {
                ...newTermState.usersFileStatus,
                icon: ICON_CONSTANTS.LOADING,
                name: UI_TEXT.UPLOAD_LOADING,
            },
            coursesFileStatus: {
                ...newTermState.coursesFileStatus,
                icon: ICON_CONSTANTS.LOADING,
                name: UI_TEXT.UPLOAD_LOADING,
            },
            enrollmentsFileStatus: {
                ...newTermState.enrollmentsFileStatus,
                icon: ICON_CONSTANTS.LOADING,
                name: UI_TEXT.UPLOAD_LOADING,
            },
        })
        upload();
        setNewTermState({
            ...newTermState,
            usersFileStatus: {
                ...newTermState.usersFileStatus,
                icon: ICON_CONSTANTS.ACCEPTED,
            },
            coursesFileStatus: {
                ...newTermState.coursesFileStatus,
                icon: ICON_CONSTANTS.ACCEPTED,
            },
            enrollmentsFileStatus: {
                ...newTermState.enrollmentsFileStatus,
                icon: ICON_CONSTANTS.ACCEPTED,
            },
        })
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
                                    <UsersDropZone />
                                </Grid>

                                <Grid style={{ margin: '10px' }} item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <CoursesDropZone />
                                </Grid>

                                <Grid style={{ margin: '10px' }} item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <EnrollmentsDropZone />
                                </Grid>

                            </Grid>
                            :
                            <Typography>Please start by selecting dates</Typography>
                        }

                    </Grid>

                    <Grid container justify={'center'} style={{ marginTop: '40px' }}>
                        {newTermState.usersFileStatus.verified && newTermState.coursesFileStatus.verified && newTermState.enrollmentsFileStatus.verified
                            ?
                            <ToolButton onClick={handleSave}> save </ToolButton>
                            :
                            null
                        }
                    </Grid>
                </Grid>
                :
                <UploadStatusWindow status={newTermState.uiState.serviceResponse} />
            }

        </Grid>
    )

    function StartDate() {
        return (
            <Grid>
                {newTermState.termDates.termStart ?
                    <DatePicker selected={newTermState.termDates.termStart}
                        onChange={date => setNewTermState({ ...newTermState, termDates: { ...newTermState.termDates, termStart: date } })} />
                    :
                    <DatePicker selected={newTermState.termDates.today}
                        onChange={date => setNewTermState({ ...newTermState, termDates: { ...newTermState.termDates, termStart: date } })} />
                }
            </Grid>
        )
    }

    function EndDate() {
        return (
            <Grid>
                {newTermState.termDates.termEnd ?
                    <DatePicker selected={newTermState.termDates.termEnd}
                        onChange={date => setNewTermState({ ...newTermState, termDates: { ...newTermState.termDates, termEnd: date } })} />
                    :
                    <DatePicker selected={newTermState.termDates.today}
                        onChange={date => setNewTermState({ ...newTermState, termDates: { ...newTermState.termDates, termEnd: date } })} />
                }
            </Grid>
        )
    }

    function UsersDropZone() {

        const droppedUsers = useCallback(acceptedFiles => {

            var file = acceptedFiles[0];

            setNewTermState({
                ...newTermState,
                usersFileStatus: {
                    icon: ICON_CONSTANTS.LOADING,
                    name: file.name,
                }
            })

            Papa.parse(file, {
                complete: function (results) {
                    results.data.shift();

                    let userList = [];
                    let userIDmissing = false;
                    let loginIDmissing = false;
                    let fullNameMissing = false;
                    let emailMissing = false;

                    results.data.forEach(element => {
                        if (element.length < 2) {
                            console.log('empty row detected')
                        }
                        else {
                            if (!element[0] || !element[3] || !element[7] || !element[10]) {
                                if (!element[0]) {
                                    userIDmissing = true;
                                }
                                if (!element[3]) {
                                    loginIDmissing = true;
                                }
                                if (!element[7]) {
                                    fullNameMissing = true;
                                }
                                if (!element[10]) {
                                    emailMissing = true;
                                }
                            }
                            else {
                                let user = {
                                    userID: element[0],
                                    intergrationID: element[1],
                                    authID: element[2],
                                    loginID: element[3],
                                    password: element[4],
                                    firstName: element[5],
                                    lastName: element[6],
                                    fullName: element[7],
                                    sortableName: element[8],
                                    shortName: element[9],
                                    email: element[10],
                                    status: element[11]
                                }
                                userList.push(user);
                            }
                        }
                    });

                    if (!userIDmissing && !loginIDmissing && !fullNameMissing && !emailMissing) {
                        setNewTermState({
                            ...newTermState,
                            usersFileStatus: {
                                icon: ICON_CONSTANTS.ACCEPTED,
                                name: file.name,
                                verified: true,
                                error: null,
                                list: userList,
                            },
                        })
                    }
                    else {
                        setNewTermState({
                            ...newTermState,
                            usersFileStatus: {
                                icon: ICON_CONSTANTS.ERROR,
                                name: file.name,
                                verified: false,
                                error: UI_TEXT.INCOMPLETE_UPLOAD_ERROR,
                            }
                        })
                    }
                }
            });

        }, []);

        return (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box border={1} borderRadius={10} style={{ textAlign: 'center' }}>
                    <Dropzone onDrop={droppedUsers}>
                        {({ getRootProps, getInputProps }) => (
                            <Grid {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Grid container direction={'row'} justify={'space-between'} style={{ alignItems: 'center' }}>
                                    <Typography style={{ marginLeft: '5px' }}>{newTermState.usersFileStatus.name}</Typography>
                                    <StatusIcon status={newTermState.usersFileStatus.icon} />
                                </Grid>
                            </Grid>
                        )}
                    </Dropzone>
                </Box>
                {newTermState.usersFileStatus.error !== null ?
                    <Typography style={{ textAlign: 'center' }}>{newTermState.usersFileStatus.error}</Typography>
                    :
                    null
                }
            </Grid>
        )
    }

    function CoursesDropZone() {

        const droppedCourses = useCallback(acceptedFiles => {

            var file = acceptedFiles[0];

            setNewTermState({
                ...newTermState,
                coursesFileStatus: {
                    icon: ICON_CONSTANTS.LOADING,
                    name: file.name,
                }
            })

            Papa.parse(file, {
                complete: function (results) {
                    results.data.shift();

                    let courseList = [];
                    let idMissing = false;
                    let nameMissing = false;

                    results.data.forEach(element => {
                        if (element.length < 2) {
                            console.log('empty row detected')
                        }
                        else {
                            if (!element[0] || !element[3]) {
                                if (!element[0]) {
                                    idMissing = true;
                                }
                                if (!element[3]) {
                                    nameMissing = true;
                                }
                            }
                            else {
                                let course = {
                                    courseID: element[0],
                                    integrationID: element[1],
                                    shortName: element[2],
                                    longName: element[3],
                                    accountID: element[4],
                                    termID: element[5],
                                    status: element[6],
                                    format: element[9],
                                    blueprintID: element[10]
                                }
                                if (element[7].length > 1) {
                                    course = {
                                        ...course,
                                        starts: element[7],
                                    }
                                }
                                else {
                                    course = {
                                        ...course,
                                        starts: newTermState.termDates.termStart,
                                    }
                                }
                                if (element[8].length > 1) {
                                    course = {
                                        ...course,
                                        ends: element[8],
                                    }
                                }
                                else {
                                    course = {
                                        ...course,
                                        ends: newTermState.termDates.termEnd,
                                    }
                                }
                                courseList.push(course);
                            }
                        }
                    });

                    if (!idMissing && !nameMissing) {
                        setNewTermState({
                            ...newTermState,
                            coursesFileStatus: {
                                icon: ICON_CONSTANTS.ACCEPTED,
                                name: file.name,
                                verified: true,
                                error: null,
                                list: courseList,
                            }
                        })
                    }
                    else {
                        setNewTermState({
                            ...newTermState,
                            coursesFileStatus: {
                                icon: ICON_CONSTANTS.ERROR,
                                name: file.name,
                                verified: false,
                                error: UI_TEXT.INCOMPLETE_UPLOAD_ERROR,
                            }
                        })
                    }
                }
            });

        }, []);

        return (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box border={1} borderRadius={10} style={{ textAlign: 'center' }}>
                    <Dropzone onDrop={droppedCourses}>
                        {({ getRootProps, getInputProps }) => (
                            <Grid {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Grid container direction={'row'} justify={'space-between'} style={{ alignItems: 'center' }}>
                                    <Typography style={{ marginLeft: '5px' }}>{newTermState.coursesFileStatus.name}</Typography>
                                    <StatusIcon status={newTermState.coursesFileStatus.icon} />
                                </Grid>
                            </Grid>
                        )}
                    </Dropzone>
                </Box>
                {newTermState.coursesFileStatus.error !== null ?
                    <Typography style={{ textAlign: 'center' }}>{newTermState.coursesFileStatus.error}</Typography>
                    :
                    null
                }
            </Grid>
        )
    }

    function EnrollmentsDropZone() {

        const droppedEnrollments = useCallback(acceptedFiles => {

            var file = acceptedFiles[0];

            setNewTermState({
                ...newTermState,
                enrollmentsFileStatus: {
                    icon: ICON_CONSTANTS.LOADING,
                    name: file.name,
                }
            })

            Papa.parse(file, {
                complete: function (results) {
                    results.data.shift();

                    let enrollmentList = [];
                    let courseIDmissing = false;
                    let userIDmissing = false;
                    let roleMissing = false;
                    let roleIDmissing = false;

                    results.data.forEach(element => {
                        if (element.length < 2) {
                            console.log('empty row detected')
                        }
                        else {
                            if (!element[0] || !element[1] || !element[2] || !element[3]) {
                                if (!element[0]) {
                                    courseIDmissing = true;
                                }
                                if (!element[1]) {
                                    userIDmissing = true;
                                }
                                if (!element[2]) {
                                    roleMissing = true;
                                }
                                if (!element[3]) {
                                    roleIDmissing = true;
                                }
                            }
                            else {
                                let enrollment = {
                                    courseID: element[0],
                                    userID: element[1],
                                    role: element[2],
                                    roleID: element[3],
                                    sectionID: element[4],
                                    status: element[5],
                                    associatedUserID: element[6],
                                }
                                enrollmentList.push(enrollment);
                            }
                        }
                    });

                    if (!courseIDmissing && !userIDmissing && !roleMissing && !roleIDmissing) {
                        setNewTermState({
                            ...newTermState,
                            enrollmentsFileStatus: {
                                icon: ICON_CONSTANTS.ACCEPTED,
                                name: file.name,
                                verified: true,
                                error: null,
                                list: enrollmentList,
                            }
                        })
                    }
                    else {
                        setNewTermState({
                            ...newTermState,
                            enrollmentsFileStatus: {
                                icon: ICON_CONSTANTS.ERROR,
                                name: file.name,
                                verified: false,
                                error: UI_TEXT.INCOMPLETE_UPLOAD_ERROR,
                            }
                        })
                    }
                }
            });

        }, []);

        return (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box border={1} borderRadius={10} style={{ textAlign: 'center' }}>
                    <Dropzone onDrop={droppedEnrollments}>
                        {({ getRootProps, getInputProps }) => (
                            <Grid {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Grid container direction={'row'} justify={'space-between'} style={{ alignItems: 'center' }}>
                                    <Typography style={{ marginLeft: '5px' }}>{newTermState.enrollmentsFileStatus.name}</Typography>
                                    <StatusIcon status={newTermState.enrollmentsFileStatus.icon} />
                                </Grid>
                            </Grid>
                        )}
                    </Dropzone>
                </Box>
                {newTermState.enrollmentsFileStatus.error !== null ?
                    <Typography style={{ textAlign: 'center' }}>{newTermState.enrollmentsFileStatus.error}</Typography>
                    :
                    null
                }
            </Grid>
        )
    }

    function UploadStatusWindow({ status }) {

        console.log('status', status);

        const [uploadStatus, setUploadStatus] = useState({
            users: null,
            courses: null,
            enrollments: null
        })

        useEffect(() => {
            if (status) {

            }
        }, [uploadStatus, status])

        return (
            <Grid container justify={'center'} item xs={12} sm={12} md={12} lg={12} xl={12}>

                <Grid style={{ margin: '10px' }} item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {uploadStatus.users !== null ?
                        <Typography>{uploadStatus.users}</Typography> : <CircularProgress />
                    }
                </Grid>

                <Grid style={{ margin: '10px' }} item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {uploadStatus.courses !== null ?
                        <Typography>{uploadStatus.courses}</Typography> : <CircularProgress />
                    }
                </Grid>

                <Grid style={{ margin: '10px' }} item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {uploadStatus.enrollments !== null ?
                        <Typography>{uploadStatus.enrollments}</Typography> : <CircularProgress />
                    }
                </Grid>

            </Grid>
        )
    }
}
