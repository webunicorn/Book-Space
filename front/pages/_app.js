import React, { useEffect, useCallback } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import axios from 'axios';

import AppLayout from '../components/AppLayout';
import reducer from '../reducers';
import rootSaga from '../sagas';
import { LOAD_USER_REQUEST } from '../reducers/user';
import '../styles/reset.css';
import '../styles/index.css';


const BookSpace = ({ Component, store, pageProps }) => {

    const onScroll = useCallback(() => {
        const nav = document.querySelector('header nav');
        if(window.scrollY > 400){
            nav.classList.add('active');
        }else {
            nav.classList.remove('active');
        }
    });

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
    });

    return (
        <>
            <Provider store={store}>
                <Head>
                    <title>BookSpace</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1" key="viewport"/>
                    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="description" content="책 속의 우주, Book Space" />
                    <meta property="og:title" content="Book Space"/>
                    <meta property="og:image" content="/favicon.ico" />
                    <link rel="shortcut icon" href="/favicon.ico"/>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.18.1/antd.css" />
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/3.18.1/antd.js"></script>
                </Head>
                <AppLayout>
                    <Component {...pageProps} />
                </AppLayout>
            </Provider>
        </>
    );
};

BookSpace.propTypes = {
    Component : PropTypes.elementType.isRequired,
    store: PropTypes.object.isRequired,
    pageProps: PropTypes.object.isRequired,
};

BookSpace.getInitialProps = async (context) => {
    const { ctx, Component } = context;
    let pageProps = {};
    const state = ctx.store.getState();
    const cookie = ctx.isServer ? ctx.req.headers.cookie : '';
    if(ctx.isServer && cookie){
        axios.defaults.headers.Cookie = cookie;
    }
    if(!state.user.me){
        ctx.store.dispatch({
            type: LOAD_USER_REQUEST,
        });
    }
    if(Component.getInitialProps){
        pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
};


const configureStore = (initialState, options) => {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware];
    const enhancer = process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares))
      : compose(
        applyMiddleware(...middlewares),
        !options.isServer && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
      );
    const store = createStore(reducer, initialState, enhancer);
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
  };
  
  export default withRedux(configureStore)(withReduxSaga(BookSpace));


