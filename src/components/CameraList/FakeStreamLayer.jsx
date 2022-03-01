import React from 'react';
import {observer} from 'mobx-react-lite'
import ReactPlayer from 'react-player'

import store from '../../store/MapStore'

const FakeStreamLayer = observer((props) => {

    return (
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <div key={num} style={{display: 'flex', alignItems: 'flex-end'}}>
                <div className="address">
                    {store.buildingList.filter(item => item.intercoms.includes(store.fakeStreamList[num]?.id))[0]?.address}
                </div>
                <ReactPlayer
                    url={store.fakeStreamList[num]?.live.stream_url?.replace('http://89.232.115.40', 'https://vn.tattelecom.ru')}
                    playing={false}
                    volume={store.sound === 'on' ? 1 : 0}
                    width='30vh'
                    height='20vh'
                />
            </div>
        ))
    );
})

export default FakeStreamLayer;