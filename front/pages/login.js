import React, { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { LOG_IN_REQUEST } from '../reducers/user';

const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const { me, loginError, isLoggingIn } = useSelector(state => state.user);
    const dispatch = useDispatch();
 
    useEffect(() => {
        if(me) {
            Router.push('/');
        }
    },[me && me.id]);

    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        dispatch({
            type: LOG_IN_REQUEST,
            data: {
                userId: id,
                password,
            }
        });
        
    },[id,password]);

    const onChangeId = (e) => {
        setId(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    if(me){
        return null;
    }

    return (
        <>
            {isLoggingIn
            ? <div className="loading">로딩중입니다.</div>
            :
            <>
                <section className="sub_tit">로그인</section>
                <section className="login_cont">
                    <form onSubmit={onSubmitForm}>
                        <div className="input_box">
                            <input type="text" name="user_id" value={id} onChange={onChangeId} placeholder="아이디" required/>
                        </div>
                        <div className="input_box">
                            <input type="password" name="user_password" value={password} onChange={onChangePassword} placeholder="비밀번호" required/>
                        </div>
                        <p className="validation_message">{loginError}</p>
                        <button className="btn_login">로그인</button>
                        <span className="btn_link_join"><Link href="/signup"><a>회원가입</a></Link></span>
                    </form> 
                </section>
            </>
            }
        </>
    );
};

export default Login;