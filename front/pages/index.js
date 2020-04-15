import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { bookSearch } from '../components/BookAPI';
import List from './list';
import { SearchOutlined } from '@ant-design/icons';

const Home = memo(() => {
    const [query, setQuery] = useState('');
    const [text, setText] = useState('');
    const [bookResult, setBookResult] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isEndPage, setIsEndPage] = useState(true);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
        if(query.length > 0) {
            bookSearchHandler(query, true);
        }
        setCurrentPage(2);
    },[query]);
    
    const onMoreItems = (e) => {
        e.preventDefault();
        setCurrentPage(currentPage+1);
        bookSearchHandler(query, true, currentPage);
    };
   
    const bookSearchHandler = async (query, reset, currentPage) => {
        const params = {
            query: query,
            sort: "accuracy",
            page: currentPage,
            size: 10,
        };

        const { data } = await bookSearch(params);
        setBookResult([...bookResult, ...data.documents]);
        setIsEndPage(data.meta.is_end);
    };

    const onChangeText = (e) => {
        setText(e.target.value);
    };

    const onhandleKeyUp = (e) => {
        const inputBox = document.querySelector('.search_box');
        inputBox.classList.add('on');
        if(text.length <= 0){
            inputBox.classList.remove('on');
        }
    }

    const onEnter = useCallback((e) => {
        if(e.keyCode === 13){
            setQuery(text);
            if(text !== query){
                setBookResult([]);
            }
            
        }
    });
      
    return (
        <>
            
            <section className="visual">
               <h2>BOOK SPACE</h2>
               <blockquote>With freedom, books, flowers, and the moon, who could not be happy? <span>-Oscar Wilde</span></blockquote>
            </section>
            <div className="search_box">
                <SearchOutlined />
                <input className="input_search" type="text" ref={inputRef} value={text} onKeyDown={onEnter} onChange={onChangeText} onKeyUp={onhandleKeyUp} placeholder="책을 검색해 보세요."/>
            </div>
            <section className="search_result">
                <ul>
                    {bookResult.map((book, index) => (
                        <List
                            key={index}
                            thumbnail={book.thumbnail}
                            title={book.title}
                            authors={book.authors}
                            isbn={book.isbn}
                            datetime={book.datetime}
                        />
                    ))}
                </ul>
                {isEndPage || <button className="btn_more btn_type1" onClick={onMoreItems}>더보기</button>}
            </section>
        </>
    );
});

export default Home;