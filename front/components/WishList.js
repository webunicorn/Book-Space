import React from 'react';
import PropTypes from 'prop-types';
import { DeleteOutlined } from '@ant-design/icons';

const WishList = ({ myWishs, onClickDelete }) => {
    return(
        <>
            <section className="wish_list">
                <h4>위시리스트<span>{myWishs.length}</span></h4>
                <ul>
                    {myWishs.map(book => (
                        <>
                            <li>
                                <img src={book.src} alt={book.title}/>
                                <strong className="title">{book.title.length > 10 ? book.title.slice(0,10) + '...' : book.title.slice(0,10)}</strong>
                                <span className="author">{book.author}</span>
                                <button className="btn_wish_delete" onClick={onClickDelete(book.id)}><DeleteOutlined />삭제</button>
                            </li>
                        </>
                    ))}
                </ul>
            </section>
        </>
    )
}

WishList.propTypes = {
    myWishs : PropTypes.array.isRequired,
    onClickDelete : PropTypes.func.isRequired,
}

export default WishList;