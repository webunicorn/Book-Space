import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';

const AppLayout = ({ children }) => {
    const { me } = useSelector(state => state.user);

    return (
        <>
            <header>
                <nav>
                    <h1><Link href="/"><a>BookSpace</a></Link></h1>
                    <ul>
                    {me 
                    ?
                        <li className="btn_nav_mypage"><Link href={{ pathname: '/mypage', query: { id: me.id } }} as={`/mypage/${me.id}`}><a><UserOutlined /></a></Link></li>
                    :
                        <>
                            <li className="btn_nav_signup"><Link href="/signup"><a>회원가입</a></Link></li>
                            <li className="btn_nav_login"><Link href="/login"><a>로그인</a></Link></li>
                        </>
                    }
                    </ul>
                </nav>
            </header>
            <main>
                {children}
            </main>
        </>
    )

}

AppLayout.propeTypes = {
    children : PropTypes.node,
}

export default AppLayout;