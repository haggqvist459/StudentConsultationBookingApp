import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';
import { Grid, Typography, Box } from '@material-ui/core';
import { CheckCircleOutline, ErrorOutline, AddCircleOutline, HourglassEmpty } from '@material-ui/icons';
import { ICON_CONSTANTS, UI_TEXT, FILETYPES, REQUIRED_FIELDS } from '../utils';
import moment from 'moment';

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

function FileDrop({ fileName, readComplete, readError }) {

    const [fileStatus, setFileStatus] = useState({
        text: fileName,
        icon: ICON_CONSTANTS.ADD,
    })

    var verifiedList = [];

    var errors = {
        formatErrors: [],
        dataErrors: [],
    };

    const parseFile = useCallback(async fileDropped => {

        var file = fileDropped[0];

        function verifyFileFormat({ fields }) {

            switch (fileName) {
                case FILETYPES.USERS_FILE:

                    var filteredUserFields = fields.filter(function (value) {
                        return value = REQUIRED_FIELDS.USERS.find(field => field === value)
                    });

                    var missingUserFields = REQUIRED_FIELDS.USERS.filter(function (value) {
                        return value = !filteredUserFields.find(field => field === value)
                    })

                    if (missingUserFields.length > 0) {
                        missingUserFields.forEach((item) => {
                            let error = {
                                type: 'formatError',
                                missing: item,
                                message: item + ' is missing from users file',
                            }
                            errors.formatErrors.push(error);
                        })
                    }
                    break;
                case FILETYPES.COURSES_FILE:

                    var filteredCourseFields = fields.filter(function (value) {
                        return value = REQUIRED_FIELDS.COURSES.find(field => field === value)
                    });

                    var missingCourseFields = REQUIRED_FIELDS.COURSES.filter(function (value) {
                        return value = !filteredCourseFields.find(field => field === value)
                    })

                    if (missingCourseFields.length > 0) {
                        missingCourseFields.forEach((item) => {
                            let error = {
                                type: 'formatError',
                                missing: item,
                                message: item + ' is missing from courses file',
                            }
                            errors.formatErrors.push(error);
                        })
                    }
                    break;
                case FILETYPES.ENROLLMENTS_FILE:

                    var filteredEnrollmentFields = fields.filter(function (value) {
                        return value = REQUIRED_FIELDS.ENROLLMENTS.find(field => field === value)
                    });

                    var missingEnrollmentFields = REQUIRED_FIELDS.ENROLLMENTS.filter(function (value) {
                        return value = !filteredEnrollmentFields.find(field => field === value)
                    })

                    if (missingEnrollmentFields.length > 0) {
                        missingEnrollmentFields.forEach((item) => {
                            let error = {
                                type: 'formatError',
                                missing: item,
                                message: item + ' is missing from enrollments file',
                            }
                            errors.formatErrors.push(error);
                        })
                    }
                    break;
                default:
                    break;
            }

            if (errors.formatErrors.length > 0) {
                return false;
            }
            else {
                return true;
            }
        }

        function verifyFileData({ file, fields }) {
        
            switch (fileName) {
                case FILETYPES.USERS_FILE: 
                    file.slice(1).forEach((item, index) => {
                        item.forEach((itemData, dataIndex) => {
                            if (!itemData) {
                                if (item.length < 2) {
                                    console.log('empty row')
                                }
                                else {
                                    if (REQUIRED_FIELDS.USERS.find(field => field === fields[dataIndex])) {
                                    
                                        let error = {
                                            type: 'dataError',
                                            missing: fields[dataIndex],
                                            message: fields[dataIndex] + ' data is missing from users file',
                                            listNum: index,
                                            fieldNum: dataIndex,
                                        }
                                        errors.dataErrors.push(error);
                                    } 
                                }
                            }
                        })
                        let user = {
                            userID: item[0],
                            intergrationID: item[1],
                            authID: item[2],
                            loginID: item[3],
                            password: item[4],
                            firstName: item[5],
                            lastName: item[6],
                            fullName: item[7],
                            sortableName: item[8],
                            shortName: item[9],
                            email: item[10],
                            status: item[11]
                        }
                        verifiedList.push(user);
                    })
                    break;
                case FILETYPES.COURSES_FILE:
                    file.slice(1).forEach((item, index) => {
                        item.forEach((itemData, dataIndex) => {
                            if (!itemData) {
                                if (item.length < 2) {
                                    console.log('empty row')
                                }
                                else {
                                    if (REQUIRED_FIELDS.COURSES.find(field => field === fields[dataIndex])) {
                                        // skip missing dates
                                        if (fields[dataIndex] === 'start_date' || fields[dataIndex] === 'end_date') {
                                            console.log('skipping missing dates error');
                                        }
                                        else {
                                            let error = {
                                                type: 'dataError',
                                                missing: fields[dataIndex],
                                                message: fields[dataIndex] + ' data is missing from courses file',
                                                listNum: index,
                                                fieldNum: dataIndex,
                                            }
                                            errors.dataErrors.push(error);
                                        }
                                    } 
                                }
                            }
                        })
                        let startDate = moment(localStorage.getItem('STARTS')).add('days', 21).format('YYYY-MM-DD');
                        let endDate = moment(localStorage.getItem('ENDS')).format('YYYY-MM-DD');
                        let course = {
                            courseID: item[0],
                            integrationID: item[1],
                            shortName: item[2],
                            longName: item[3],
                            accountID: item[4],
                            termID: item[5],
                            status: item[6],
                            termStart: localStorage.getItem('STARTS'),
                            termEnd: localStorage.getItem('ENDS'),
                            format: item[9],
                            blueprintID: item[10],
                            daysOfWeek: 'teacher must assign',
                            startRecur: startDate,
                            endRecur: endDate,
                            startTime: 'teacher must assign',
                            endTime: 'teacher must assign',
                            allDay: true,
                            consultations: []
                        }
                        verifiedList.push(course);
                    })
                    break;
                case FILETYPES.ENROLLMENTS_FILE:
                    file.slice(1).forEach((item, index) => {
                        item.forEach((itemData, dataIndex) => {
                            if (!itemData) {
                                if (item.length < 2) {
                                    console.log('empty row')
                                }
                                else {
                                    if (REQUIRED_FIELDS.ENROLLMENTS.find(field => field === fields[dataIndex])) {
                                        let error = {
                                            type: 'dataError',
                                            missing: fields[dataIndex],
                                            message: fields[dataIndex] + ' data is missing from enrollments file',
                                            listNum: index,
                                            fieldNum: dataIndex,
                                        }
                                        errors.dataErrors.push(error);
                                    } 
                                }
                            }
                        })
                        let enrollment = {
                            courseID: item[0],
                            userID: item[1],
                            role: item[2],
                            roleID: item[3],
                            sectionID: item[4],
                            status: item[5],
                            associatedUserID: item[6],
                        }
                        verifiedList.push(enrollment);
                    })
                    break;
                default:
                    break;
            }

            if (errors.dataErrors.length > 0) {
                return false;
            }
            else {
                return true;
            }
        }

        return new Promise((resolve, reject) => {

            try {
                Papa.parse(file, {
                    complete: function (results) {

                        if (!verifyFileFormat({ fields: results.data[0] })) {
                            console.log('format errors');
                            reject(errors.formatErrors)
                        }
                        else if (!verifyFileData({ file: results.data, fields: results.data[0] })) {
                            console.log('data errors');
                            reject(errors.dataErrors)
                        }
                        else {
                            console.log('format and data verified')
                            resolve(verifiedList)
                        }
                    }
                });
            } catch (error) {
                console.log('Papa failed: ', error);
                reject('Papa failed: ', error);
            }
        })

    }, [fileName, verifiedList, errors.formatErrors, errors.dataErrors]);

    async function handleFileDrop(fileDropped) {

        setFileStatus({
            text: UI_TEXT.UPLOAD_LOADING,
            icon: ICON_CONSTANTS.LOADING,
        })

        try {
            await parseFile(fileDropped)
                .catch(function (error) {
                    console.log(error);

                    switch (fileName) {
                        case FILETYPES.USERS_FILE:
                            localStorage.removeItem('USERS FORMAT ERROR');
                            localStorage.removeItem('USERS DATA ERROR');
                            localStorage.removeItem('USERS');

                            if (errors.formatErrors.length > 0) {
                                console.log('there were format errors');
                                setFileStatus({
                                    text: 'check file format',
                                    icon: ICON_CONSTANTS.ERROR,
                                })
                                localStorage.setItem('USERS FORMAT ERROR', JSON.stringify(errors.formatErrors));
                            }
                            else if (errors.dataErrors.length > 0) {
                                console.log('there were data errors');
                                if (errors.formatErrors.length > 0) {
                                    let errorText = fileStatus.text + ' and missing user data';
                                    setFileStatus({
                                        text: errorText,
                                        icon: ICON_CONSTANTS.ERROR,
                                    })
                                }
                                else {
                                    setFileStatus({
                                        text: 'required user data missing from file',
                                        icon: ICON_CONSTANTS.ERROR,
                                    })
                                }
                                localStorage.setItem('USERS DATA ERROR', JSON.stringify(errors.dataErrors));
                            }
                            readError();
                            break;
                        case FILETYPES.COURSES_FILE:
                            localStorage.removeItem('COURSES FORMAT ERROR');
                            localStorage.removeItem('COURSES DATA ERROR');
                            localStorage.removeItem('COURSES');

                            if (errors.formatErrors.length > 0) {
                                console.log('there were format errors');
                                setFileStatus({
                                    text: 'check file format',
                                    icon: ICON_CONSTANTS.ERROR,
                                })
                                localStorage.setItem('COURSES FORMAT ERROR', JSON.stringify(errors.formatErrors));
                            }
                            else if (errors.dataErrors.length > 0) {
                                console.log('there were data errors');
                                if (errors.formatErrors.length > 0) {
                                    let errorText = fileStatus.text + ' and missing course data';
                                    setFileStatus({
                                        text: errorText,
                                        icon: ICON_CONSTANTS.ERROR,
                                    })
                                }
                                else {
                                    setFileStatus({
                                        text: 'required course data missing from file',
                                        icon: ICON_CONSTANTS.ERROR,
                                    })
                                }
                                localStorage.setItem('COURSES DATA ERROR', JSON.stringify(errors.dataErrors));
                            }
                            readError();
                            break;
                        case FILETYPES.ENROLLMENTS_FILE:
                            localStorage.removeItem('ENROLLMENTS FORMAT ERROR');
                            localStorage.removeItem('ENROLLMENTS DATA ERROR');
                            localStorage.removeItem('ENROLLMENTS');

                            if (errors.formatErrors.length > 0) {
                                console.log('there were format errors');
                                setFileStatus({
                                    text: 'check file format',
                                    icon: ICON_CONSTANTS.ERROR,
                                })
                                localStorage.setItem('ENROLLMENTS FORMAT ERROR', JSON.stringify(errors.formatErrors));
                            }
                            else if (errors.dataErrors.length > 0) {
                                console.log('there were data errors');
                                if (errors.formatErrors.length > 0) {
                                    let errorText = fileStatus.text + ' and missing enrollment data';
                                    setFileStatus({
                                        text: errorText,
                                        icon: ICON_CONSTANTS.ERROR,
                                    })
                                }
                                else {
                                    setFileStatus({
                                        text: 'required enrollment data missing from file',
                                        icon: ICON_CONSTANTS.ERROR,
                                    })
                                }
                                localStorage.setItem('ENROLLMENTS DATA ERROR', JSON.stringify(errors.dataErrors));
                            }
                            readError();
                            break;
                        default:
                            break;
                    }

                    throw new Error('parse error');
                })
                .then(function (verifiedList) {

                    switch (fileName) {
                        case FILETYPES.USERS_FILE:
                            setFileStatus({
                                text: 'users verified',
                                icon: ICON_CONSTANTS.ACCEPTED,
                            })
                            localStorage.removeItem('USERS FORMAT ERROR');
                            localStorage.removeItem('USERS DATA ERROR');
                            localStorage.removeItem('USERS');
                            localStorage.setItem('USERS', JSON.stringify(verifiedList));
                            break;
                        case FILETYPES.COURSES_FILE:
                            setFileStatus({
                                text: 'courses verified',
                                icon: ICON_CONSTANTS.ACCEPTED,
                            })
                            localStorage.removeItem('COURSES FORMAT ERROR');
                            localStorage.removeItem('COURSES DATA ERROR');
                            localStorage.removeItem('COURSES');
                            localStorage.setItem('COURSES', JSON.stringify(verifiedList));
                            break;
                        case FILETYPES.ENROLLMENTS_FILE:
                            setFileStatus({
                                text: 'enrollments verified',
                                icon: ICON_CONSTANTS.ACCEPTED,
                            })
                            localStorage.removeItem('ENROLLMENTS FORMAT ERROR');
                            localStorage.removeItem('ENROLLMENTS DATA ERROR');
                            localStorage.removeItem('ENROLLMENTS');
                            localStorage.setItem('ENROLLMENTS', JSON.stringify(verifiedList));
                            break;
                        default:
                            break;
                    }

                    readComplete();
                })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box border={1} borderRadius={10} style={{ textAlign: 'center', minWidth: '100%' }}>
                <Dropzone onDrop={handleFileDrop}>
                    {({ getRootProps, getInputProps }) => (
                        <Grid {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Grid container direction={'row'} justify={'space-between'} style={{ alignItems: 'center' }}>
                                <Typography style={{ marginLeft: '5px' }}>{fileStatus.text}</Typography>
                                <StatusIcon status={fileStatus.icon} />
                            </Grid>
                        </Grid>
                    )}
                </Dropzone>
            </Box>
        </Grid>
    )
}

FileDrop.propTypes = {
    fileName: PropTypes.string.isRequired,
    readComplete: PropTypes.func.isRequired,
    readError: PropTypes.func.isRequired,
}

export { FileDrop }