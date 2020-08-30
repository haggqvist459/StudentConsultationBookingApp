import { calendarConstants } from '../utils/constants';

const initState = {
    subjects: [],
    error: null,
    studentSubjects: [],
    studentTimeSlots: [],
    subjectConsultations: [],
}

function calendarReducer(state = initState, action) {

    console.log('calendar reducer: ' + action.type);

    switch (action.type) {
        case calendarConstants.UPDATE_STUDENT_CALENDAR_SUCCESS:
            return {
                ...state,
                studentSubjects: [...state.studentSubjects, action.studentSubject],
            }

        case calendarConstants.CONSULTATIONS_UPDATE_SUCCESS:
            return {
                ...state,
                subjectConsultations: [...state.subjectConsultations, action.subjectConsultation],
            }

        case calendarConstants.GET_SUBJECT_FAILURE:
            return {
                error: action.error
            };
        case calendarConstants.UPDATE_STUDENT_CALENDAR_FAILURE:
            return {
                error: action.error
            };
        case calendarConstants.UPDATE_SUBJECT_CONSULTATIONS_FAILURE:
            return {
                error: action.error
            };
        case calendarConstants.STUDENT_CALENDAR_FIRESTORE_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export default calendarReducer;