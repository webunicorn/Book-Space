import { all, fork, takeLatest, put, delay, throttle, call } from 'redux-saga/effects';
import axios from 'axios';
import {
    ADD_WISH_REQUEST,
    ADD_WISH_SUCCESS,
    ADD_WISH_FAILURE,
    LOAD_USER_WISH_REQUEST,
    LOAD_USER_WISH_SUCCESS,
    LOAD_USER_WISH_FAILURE,
    REMOVE_WISH_REQUEST,
    REMOVE_WISH_SUCCESS,
    REMOVE_WISH_FAILURE,
    LOAD_WISH_INFO_REQUEST,
    LOAD_WISH_INFO_SUCCESS,
    LOAD_WISH_INFO_FAILURE,
} from '../reducers/post';
import { backUrl } from '../config/config';

axios.defaults.baseURL = `${backUrl}/api`; 

// *** 위시 추가
function addWishAPI(wishData){
    return axios.post('/post/wish', wishData,{
        withCredentials: true,
    });
}

function* addWish(action) {
  try {
    const result = yield call(addWishAPI, action.data);
    yield put({
      type: ADD_WISH_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: ADD_WISH_FAILURE,
      error: e,
    });
  }
}

function* watchAddWish() {
    yield takeLatest(ADD_WISH_REQUEST, addWish);
}

//** 위시 리스트 불러오기
function LoadUserWishsAPI(id) {
  return axios.get(`/post/mypage/${id}`);
}
  
function* LoadUserWishs(action) {
  try {
      const result = yield call(LoadUserWishsAPI, action.data);
      yield put({
        type: LOAD_USER_WISH_SUCCESS,
        data: result.data,
      });
  } catch (e) {
      yield put({
        type: LOAD_USER_WISH_FAILURE,
        error: e,
      });
  }
}

function* watchLoadUserWishs() {
  yield takeLatest(LOAD_USER_WISH_REQUEST, LoadUserWishs);
}

//*** 위시 삭제
function removeWishAPI(wishId) {
  return axios.delete(`/post/${wishId}`, { //삭제 delete
    withCredentials: true,
  });
}

function* removeWish(action) {
  try {
    const result = yield call(removeWishAPI, action.data);
    yield put({
      type: REMOVE_WISH_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: REMOVE_WISH_FAILURE,
      error: e,
    });
  }
}

function* watchRemoveWish() {
  yield takeLatest(REMOVE_WISH_REQUEST, removeWish);
}

//** 위시 정보 불러오기
function LoadWishInfoAPI(data) {
  return axios.get(`/post/detail/${data.id}/${data.isbn}`);
}
  
function* LoadWishInfo(action) {
  try {
      const result = yield call(LoadWishInfoAPI, action.data);
      yield put({
        type: LOAD_WISH_INFO_SUCCESS,
        data: result.data,
      });
  } catch (e) {
      yield put({
        type: LOAD_WISH_INFO_FAILURE,
        error: e,
      });
  }
}

function* watchLoadWishInfo() {
  yield takeLatest(LOAD_WISH_INFO_REQUEST, LoadWishInfo);
}


export default function* postSaga() {
    yield all([
        fork(watchAddWish),
        fork(watchLoadUserWishs),
        fork(watchRemoveWish),
        fork(watchLoadWishInfo),
    ]);
}