import { all, fork, takeEvery, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { 
    LOG_IN_REQUEST,
    LOG_IN_SUCCESS, 
    LOG_IN_FAILURE, 
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
    SIGN_UP_FAILURE,
    LOG_OUT_REQUEST,
    LOG_OUT_SUCCESS,
    LOG_OUT_FAILURE,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAILURE,
} from '../reducers/user';

axios.defaults.baseURL = 'http://localhost:3065/api'; 

//**로그인**
function logInAPI(loginData){
    return axios.post('/user/login', loginData, {
        withCredentials: true,
    });
}

function* logIn(action){
    try {
        const result = yield call(logInAPI, action.data);
        yield put({
            type: LOG_IN_SUCCESS,
            data: result.data,
        });
    } catch(e) {
        console.error(e);
        yield put({
            type: LOG_IN_FAILURE,
            reason: e.response && e.response.data,
        });
    }
}

function* watchLogIn(){
    yield takeEvery(LOG_IN_REQUEST, logIn);
}

//**로그아웃**
function logOutAPI(){ 
    return axios.post('/user/logout', {}, {
        withCredentials: true,
    }); 
}

function* logOut(){
    try {
        yield call(logOutAPI); 
        yield put({
            type: LOG_OUT_SUCCESS,
        });
    } catch(e) { 
        console.error(e);
        yield put({
            type: LOG_OUT_FAILURE, 
        });
    }
}

function* watchLogOut() {
    yield takeEvery(LOG_OUT_REQUEST, logOut);
}

//**사용자 정보 가져오기**
function loadUserAPI(userId){
    return axios.get(userId ? `/user/${userId}` : '/user/',{
        withCredentials: true,
    });
}

function* loadUser(action){
    try {
        const result = yield call(loadUserAPI, action.data);
        yield put({
            type: LOAD_USER_SUCCESS,
            data: result.data,
            me: !action.data,
        });
    } catch(e) { 
        console.error(e);
        yield put({
            type: LOAD_USER_FAILURE, 
            error: e,
        });
    }
}

function* watchLoadUser() {
    yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

//**회원가입**
function signUpAPI(signUpData){
    return axios.post('/user/', signUpData);
}

function* signUp(action){
    try {
        yield call(signUpAPI, action.data);
        yield put({
            type: SIGN_UP_SUCCESS,
        });
    } catch(e) {
        console.error(e);
        yield put({
            type: SIGN_UP_FAILURE,
            reason: e.response && e.response.data,
        });
    }
}

function* watchSignUp() {
    yield takeEvery(SIGN_UP_REQUEST, signUp);
}


export default function* userSaga(){
    yield all([
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchLoadUser),
        fork(watchSignUp),
    ])
}