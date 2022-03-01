import React from 'react';
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'

import store from '../../../store/MapStore'

const PopupContent = observer((props) => {

    React.useEffect(() => {
        let timer
        const id = store.popupList.filter(item => item.building_id === props.building_id)[0].intercom_id
        const popupElem = document.getElementById(`popup-${id}`)
        const x = popupElem.getBoundingClientRect().x
        const y = popupElem.getBoundingClientRect().y
        store.setPopupCoords({
            ...store.popupCoords,
            [id]: {x, y}
        })
        timer = setTimeout(() => {
            const elems = [...document.getElementsByClassName('popup_call')]
            elems.map(elem => {
                elem.style.animation = 'none';
                setTimeout(() => { elem.style.animation = '' }, 1)
            })

            const newCallList = [...store.callList, store.popupList.filter(item => item.building_id === props.building_id)[0]]

            if (store.callList.length < store.callListItemAmount) {
                store.setCallList(newCallList
                    .map((item, idx) => {
                        return {
                            ...item,
                            className: (idx !== (store.callList.length)) ? 'popup_moving' : ''
                        }
                    })
                )
            } else {
                store.setCallList(newCallList.slice(1, store.callListItemAmount + 1)
                    .map((item, idx) => {
                        return {
                            ...item,
                            className: (idx !== (store.callList.length - 1)) ? 'popup_moving' : ''
                        }
                    })
                )
            }
            store.setPopupList(store.popupList.filter(item => item.building_id !== props.building_id))
            store.setWsCurrentMarkers(store.wsCurrentMarkers.filter(item => item !== props.building_id))
            clearTimeout(timer)
        }, 4000);
    }, [])

    return (
        <div className='popup-react-player' id={`popup-${store.popupList.filter(item => item.building_id === props.building_id)[0].intercom_id}`}>
            <img
                width="60px"
                height="60px"
                src={`https://domofon.tattelecom.ru${store.popupList.filter(item => item.building_id === props.building_id)[0].snapshot}`}
            />
        </div>
    );
})

export default PopupContent;