import React, { useCallback, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_USER_WISH_REQUEST, REMOVE_WISH_REQUEST } from '../reducers/post';
import { LOG_OUT_REQUEST } from '../reducers/user';
import Router from 'next/router';
import { UserOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';

const Mypage = memo(({ id }) => {
    const { myWishs, isLoadingWish, isLoggingOut, isRemovingWish } = useSelector(state => state.post);
    const { me } = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if(!me){
            alert('로그인이 필요합니다.');
            Router.push('/');
            return;
        }
        if(me.id !== id){
            Router.push('/');
        }
    },[me && me.id]);

    const onRemoveWish = useCallback(userId => () => {
        dispatch({
            type: REMOVE_WISH_REQUEST,
            data: userId,
        });
    });

    const onLogout = useCallback(() => {
        dispatch({
            type: LOG_OUT_REQUEST,
        });
        return Router.push('/');
    },[]);

    return(
        <>  
            {isLoadingWish
            ? <div className="loading">로딩중입니다.</div>
            :
            <>
                <section className="visual_mypage"></section>
                <section className="myinfo_cont clear">
                    <span className="img_profile"><UserOutlined /></span>
                    <span className="nickname">{me && me.nickname}</span>
                    <button className="btn_logout" onClick={onLogout}>로그아웃</button>
                </section>
                <section className="wish_list">
                    <h4>위시리스트<span>{myWishs.length}</span></h4>
                    <ul>
                        {myWishs.map(book => (
                            <>
                                <li>
                                    <img src={book.src} alt={book.title}/>
                                    <strong className="title">{book.title.length > 10 ? book.title.slice(0,10) + '...' : book.title.slice(0,10)}</strong>
                                    <span className="author">{book.author}</span>
                                    <button className="btn_wish_delete" onClick={onRemoveWish(book.id)}>{isRemovingWish ? <><LoadingOutlined/>삭제중</> : <><DeleteOutlined />삭제</>}</button>
                                </li>
                            </>
                        ))}
                    </ul>
                </section>
            </>
            }
        </>
    );
});

Mypage.getInitialProps = async (context) => {
    const id = parseInt(context.query.id, 10);
    context.store.dispatch({
        type: LOAD_USER_WISH_REQUEST,
        data: id,
    });
    return { id };
};

export default Mypage;