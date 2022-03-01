import React from 'react';

import logo from '../../assets/logo.svg'

const Title = (props) => {
    const {count} = props

    return (
        <div className="title">
            <img src={logo} width='25%'/> <br/>
            <div className="title_text">
                Установлено панелей: <b>{count.intercom ?? '-'}</b> <br/>
                Охвачено квартир: <b>{count.apartment ?? '-'}</b>
            </div>
        </div>
    );
}

export default Title;