import { hamburgerConstants } from '../utils/constants';

const initState = {
    activeLink: hamburgerConstants.HOME,
}

function hamburgerReducer(state = initState, action) {
    switch (action.type) {
        case hamburgerConstants.PROFILE:
            return {
                activeLink: hamburgerConstants.PROFILE
            };
        case hamburgerConstants.HOME:
            return {
                activeLink: hamburgerConstants.HOME
            };
        default:
            return state
    }
}

export default hamburgerReducer;