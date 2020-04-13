import produce from 'immer';

export const initialState = {
    isLoggingOut: false,
    isLoggingIn: false,
    loginError: '',
    isSignedUp: false,
    isSigningUp: false,
    signUpError: '',
    me: null,
    userInfo: null,
};

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export default (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case LOG_IN_REQUEST: {
                draft.isLoggingIn = true;
                draft.loginError = '';
                break;
            }

            case LOG_IN_SUCCESS: {
                draft.isLoggingIn = false;
                draft.me = action.data;
                break;
            }

            case LOG_IN_FAILURE: {
                draft.isLoggingIn = false;
                draft.loginError = action.reason;
                draft.me = null;
                break;
            }

            case LOAD_USER_REQUEST: {
                draft.isSignedUp = false;
                draft.loginError = '';
                draft.signUpError = '';
                break;
            }

            case LOAD_USER_SUCCESS: {
                if (action.me) {
                    draft.me = action.data;
                    break;
                }
                draft.userInfo = action.data;
                break;
            }

            case LOAD_USER_FAILURE: {
                break;
            }

            case LOG_OUT_REQUEST: {
                draft.isLoggingOut = true;
                break;
            }

            case LOG_OUT_SUCCESS: {
                draft.isLoggingOut = false;
                draft.isSignedUp = false;
                draft.me = null;
                break;
            }

            case SIGN_UP_REQUEST: {
                draft.isSigningUp = true;
                draft.isSignedUp = false;
                draft.signUpError = '';
                break;
            }

            case SIGN_UP_SUCCESS: {
                draft.isSigningUp = false;
                draft.isSignedUp = true;
                break;
            }

            case SIGN_UP_FAILURE: {
                draft.isSigningUp = false;
                draft.signUpError = action.reason;
                break;
            }

            default: {
                break;
            }
        }
    });
}