import React from 'react';
import ReactPlayer from 'react-player'
import {observer} from 'mobx-react-lite'

import store from '../../store/MapStore'

const CameraListItem = observer((props) => {

    return (
        <div key={props.num} id={`react-player-${store.streamList[props.num]?.id}`} style={{display: 'flex', alignItems: 'flex-end'}}>
            <div className="address">
                {store.buildingList.filter(item => item.intercoms.includes(store.streamList[props.num]?.id))[0]?.address}
            </div>
            <ReactPlayer
                url={store.streamList[props.num]?.live.stream_url?.replace('http://89.232.115.40', 'https://vn.tattelecom.ru')}
                playing={store.intercomView === 'stream'}
                volume={store.sound === 'on' ? 1 : 0}
                width='30vh'
                height='20vh'
            />
        </div>
    );
});

export default CameraListItem;