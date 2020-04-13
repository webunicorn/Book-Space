import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const List = memo((props) => {
    const { me } = useSelector(state => state.user);
    const isbn = props.isbn.split(' ')[0];

    return(
        <>
            <li>
                <Link href={{ pathname: '/detail', query: me ? { isbn: `${isbn}`, id: me.id } :  { isbn: `${isbn}` } }} as={`/detail/${isbn}`}>
                    <a>
                        <img src={props.thumbnail} alt={props.title}/>
                        <strong className="title">{props.title.length > 10 ? props.title.slice(0,9) + '...' : props.title.slice(0,9)}</strong>
                        <span className="date">{props.datetime.slice(0,4)}</span><span className="author">{props.authors.map(v => v + ' ')}</span>
                    </a>
                </Link>
            </li>
            
        </>
    )
});

export default List;