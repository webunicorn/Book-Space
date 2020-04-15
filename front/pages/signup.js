import React, { useState, useCallback, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { SIGN_UP_REQUEST } from '../reducers/user';
import { Checkbox } from 'antd';

const Signup = memo(() => {
    const [id,setId] = useState('');
    const [idError,setIdError] = useState(false);
    const [nickname,setNickname] = useState('');
    const [nicknameLengthError,setNicknameLengthError] = useState('');
    const [password,setPassword] = useState('');
    const [passwordCheck,setPasswordCheck] = useState('');
    const [passwordError,setPasswordError] = useState(false);
    const [passwordLengthError,setPasswordLengthError] = useState(false);
    const [term,setTerm] = useState(false);
    const [termError,setTermError] = useState(false);
    const dispatch = useDispatch();
    const { me, isSignedUp, signUpError, isSigningUp } = useSelector(state => state.user);
   
    useEffect(() => {
        if(me) {
            Router.push('/');
        }

        if(isSignedUp){
            alert('가입이 완료되었습니다.');
            Router.push('/');
        }
    },[me && me.id, isSignedUp]);

    const regExpId = /^[a-z0-9]{4,20}$/;
    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        
        if(!id.match(regExpId)){
            return setIdError(true);
        }
        if(password !== passwordCheck){
            return setPasswordError(true);
        };
        if(password.length > 20 || password.length <= 4){
            return setPasswordLengthError(true);
        }
        if(nickname.length > 20 || nickname.length+1 <= 1){
            return setNicknameLengthError(true);
        }
        if(!term){
            return setTermError(true);
        };

        dispatch({
            type: SIGN_UP_REQUEST,
            data: {
                userId: id,
                password,
                nickname,
            }
        });

        
    },[id, nickname, password, passwordCheck, term]);
   

    const onChangeId = (e) => {
        setId(e.target.value);
        if(!id.match(regExpId)){
            return setIdError(true);
        }else{
            return setIdError(false);
        }
    };

    const onChangeNickname = (e) => {
        setNickname(e.target.value);
        if(e.target.value.length > 20 || e.target.value.length+1 <= 1){
            return setNicknameLengthError(true);
        }else{
            setNicknameLengthError(false);
        }
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
        setPasswordError(e.target.value !== passwordCheck);
        if(password.length > 20 || password.length < 4){
            setPasswordLengthError(true);
        }else{
            setPasswordLengthError(false);
        }
    };

    const onChangePasswordChk = (e) => {
        setPasswordCheck(e.target.value);
        setPasswordError(e.target.value !== password);
    };

    const onChangeTerm = useCallback((e) => {
        setTermError(false);
        setTerm(e.target.checked);
    },[]);

    if(me){
        return null;
    }

    return (
        <>
            
            {isSigningUp

            ?   <div className="loading">로딩중입니다.</div>

            :
                <>
                <section className="sub_tit">회원가입</section>
                <section className="signup_cont">
                    <form onSubmit={onSubmitForm}>
                        <div className="input_box">
                            <input type="text" id="user_id" name="user_id" value={id} onChange={onChangeId} placeholder="아이디" required />
                        </div>
                        {idError && <p className="validation_message">! 5~20자의 영문 소문자와 숫자로만 입력해주세요.</p>}
                        <div className="input_box">
                            <input type="text" name="user_nickname" value={nickname} onChange={onChangeNickname} placeholder="닉네임" required />
                        </div>
                        {nicknameLengthError && <p className="validation_message">! 1~20자로 입력해주세요.</p>}
                        <div className="input_box">
                            <input type="password" name="user_password" value={password} onChange={onChangePassword} placeholder="비밀번호" required />
                        </div>
                        {passwordLengthError && <p className="validation_message">! 5~20자로 입력해주세요.</p>}
                        <div className="input_box">
                            <input type="password" name="user_password_check" value={passwordCheck} onChange={onChangePasswordChk} placeholder="비밀번호 확인" required />
                            
                        </div>
                        {passwordError && <p className="validation_message">! 비밀번호가 일치하지 않습니다.</p>}
                        <div className="input_box">
                            <Checkbox checked={term} onChange={onChangeTerm}>약관에 동의합니다.</Checkbox>
                            {/* <input type="checkbox" name="user-term" id="user_term" checked={term} onChange={onChangeTerm}/><label htmlFor="user_term">약관에 동의합니다.</label> */}
                        </div>
                        {termError && <p className="validation_message">! 약관에 동의하셔야 합니다.</p>}
                        <p className="validation_message">{signUpError}</p>
                        <button class="btn_join">가입하기</button>
                    </form>
                </section>
            </>
            }
        </>
    );
});

export default Signup;