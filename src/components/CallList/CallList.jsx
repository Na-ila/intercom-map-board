import React from 'react';
import {observer} from 'mobx-react-lite'

import store from '../../store/MapStore'

const CallListItem = observer((props) => {

    React.useEffect(() => {
        const callListItem = document.getElementById(`call-list-item-${props.call.id}`)
        const x = callListItem?.getBoundingClientRect().x
        const y = callListItem?.getBoundingClientRect().y

        const xOffset = store.popupCoords[props.call.intercom_id]?.x - x
        const yOffset = store.popupCoords[props.call.intercom_id]?.y - y

        const arr = {...store.popupCoords}
        delete arr[props.call.intercom_id]
        store.setPopupCoords(arr)

        document.documentElement.style.setProperty("--callListXOffset", `${xOffset - 100}px`);
        document.documentElement.style.setProperty("--callListYOffset", `${yOffset - 130}px`);
        callListItem && (callListItem.classList.add('popup_move'))
    }, [])

    return (
        <div
            id={`call-list-item-${props.call.id}`}
            className={`popup_call ${props.call.className ?? ''}`}
        >
            <img src={`https://domofon.tattelecom.ru${props.call.snapshot}`}/>
        </div>
    )
})

const CallList = observer(() => {

    React.useEffect(() => {
        const oneVH = window.innerHeight / 100
        const callListWidth = window.innerWidth - (60 * oneVH) - 30

        const callListItemWidth = window.innerHeight / 100 * 18 + 34
        const callListItemAmount = Math.floor(callListWidth / callListItemWidth)
        store.setCallListItemAmount(callListItemAmount + 2)
    }, [])

    return (
        <div className='callList'>
            {store.callList.map(call => <CallListItem key={call.id} call={call}/>)}
        </div>
    );
})

export default CallList;