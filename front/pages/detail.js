import React, { useEffect, useState, useCallback, memo } from 'react';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { bookSearch } from '../components/BookAPI';
import { ADD_WISH_REQUEST, LOAD_WISH_INFO_REQUEST, REMOVE_WISH_REQUEST } from '../reducers/post';
import { LOAD_USER_REQUEST } from '../reducers/user';
import { PlusOutlined, TagOutlined, LoadingOutlined } from '@ant-design/icons';

const Detail = memo(({ id }) => {
    
    const router = useRouter();
    const [detailBook, setDetailBook] = useState([]);
    const { myWishs, wishAdded, isAddingWish, isLoadingWish } = useSelector(state => state.post);
    const [changeId, setChangeId] = useState(myWishs.length);
    const { me } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const query = router.query.isbn;
    
    useEffect(() => {
        dispatch({
            type: LOAD_USER_REQUEST,
        });

        setTimeout(() => {
            dispatch({
                type: LOAD_WISH_INFO_REQUEST,
                data: {
                    isbn: query,
                    id : me.id
                }
            });
        }, 50);
        
        bookSearchHandler(query, true);
 
    },[changeId]);

    const bookSearchHandler = async (query) => {
        const params = {
            query: query,
            size: 1,
        };
        const { data } = await bookSearch(params);
        setDetailBook(data.documents);
    };
    
    const onAddWish = useCallback((e) => {
        e.preventDefault();
        changeId === 0 ? setChangeId(1) : setChangeId(0);

        if(!me) {
            alert('로그인이 필요합니다.');
            return Router.push('/login');
        }

        let title, author, isbn, src;
        detailBook.map(v => {
            title = v.title;
            author = v.authors[0];
            isbn = v.isbn.split(' ')[0];
            src = v.thumbnail;
        });

        dispatch({
            type: ADD_WISH_REQUEST,
            data: {
                title: title,
                author: author,
                isbn : isbn,
                src : src
            }
        });
        
        // setTimeout(() => {
        //     dispatch({
        //         type: LOAD_WISH_INFO_REQUEST,
        //         data: {
        //             isbn,
        //             id: me.id
        //         }
        //     });
        // }, 800);

    },[detailBook]);

    const onRemoveWish = useCallback(userId => (e) => {
        e.preventDefault();
        changeId === 0 ? setChangeId(1) : setChangeId(0);
        dispatch({
            type: REMOVE_WISH_REQUEST,
            data: userId
        });
    });

    console.log(myWishs.map(v=> v.id));
    console.log(changeId);

    return (
        <>
            {isLoadingWish

            ?   <div className="loading">로딩중입니다.</div>

            :
            <>
                {detailBook.map((book, index) => (
                <>
                    <section className="visual_thumb"><div style={{backgroundImage:`url(${book.thumbnail})`}}></div></section>
                    <section className="book_cont">
                        <div className="item_info_wrap">
                            <div className="item_info clear" key={index}>
                                <img className="thumb_img" src={book.thumbnail} alt={book.title}/>
                                <h3 className="title">{book.title}</h3>
                                <strong className="authors">{book.authors.map(v => v + ' ')}</strong>
                                {myWishs.length > 0 
                                ? <button className="btn_wish_cancel" onClick={onRemoveWish(myWishs.map(v=> v.id))}> {(isAddingWish) ? <LoadingOutlined /> : <TagOutlined />} 읽고 싶어요</button> 
                                : <button className="btn_wish" onClick={onAddWish}><PlusOutlined /> 읽고 싶어요</button>}
                            </div>
                        </div>
                        <div className="item_intro">
                            <h4>기본 정보</h4>
                            {book.publisher.length > 0 && <em className="publisher">{book.publisher} <span>출판</span></em>}
                            {book.translators.length > 0 && <em className="translators">{book.translators} <span>역</span></em>}
                            {book.datetime.length > 0 && <em className="date">{book.datetime.slice(0,10)} <span>출간</span></em>}
                        </div>
                        <div className="item_preview">
                            <h4>도서 소개</h4>
                            <p>{book.contents + '...'}</p>
                        </div>
                    </section>
                </>
                ))}
            </>
            }
        </>
    );

});

Detail.getInitialProps = async (context) => {
    const isbn = context.query.isbn;
    const id = parseInt(context.query.id, 10);
    context.store.dispatch({
        type: LOAD_WISH_INFO_REQUEST,
        data: {
            isbn,
            id
        }
    });
    return { isbn, id };
};

export default Detail;