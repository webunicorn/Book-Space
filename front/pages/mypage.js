import React, { useCallback, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_USER_WISH_REQUEST, REMOVE_WISH_REQUEST } from '../reducers/post';
import { LOG_OUT_REQUEST } from '../reducers/user';
import Router from 'next/router';
import { UserOutlined } from '@ant-design/icons';
import WishList from '../components/WishList';

const Mypage = memo(({ id }) => {
    const { myWishs, isLoadingWish, isLoggingOut, isRemovingWish, isLoadingUserWish } = useSelector(state => state.post);
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

    const onLogout = useCallback(() => {
        dispatch({
            type: LOG_OUT_REQUEST,
        });
        return Router.push('/');
    },[]);

    const onRemoveWish = useCallback(userId => () => {
        dispatch({
            type: REMOVE_WISH_REQUEST,
            data: userId,
        });
    });

    return(
        <>  
            {isLoadingUserWish
            ? <div className="loading">로딩중입니다.</div>
            :
            <>
            
                <section className="visual_mypage"></section>
                <section className="myinfo_cont clear">
                    <span className="img_profile"><UserOutlined /></span>
                    <span className="nickname">{me && me.nickname}</span>
                    <button className="btn_logout" onClick={onLogout}>로그아웃</button>
                </section>
                {isRemovingWish
                ? <div className="loading">로딩중입니다.</div>
                :
                    <WishList 
                        myWishs={myWishs}
                        onClickDelete={onRemoveWish}
                    />
                }
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