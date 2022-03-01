import React from 'react';
import { Marker, Popup } from 'react-map-gl';
import clsx from 'clsx'
import {observer} from 'mobx-react-lite'

import './app.scss'

import store from '../../../store/MapStore'

import PopupContent from '../Popup'

const BuildingMarker = observer((props) => {

    React.useEffect(() => {
        console.log('marker mounted')
    }, [])

    React.useEffect(() => {
        document.documentElement.style.setProperty("--markerCount", props.building.intercoms.length.toString().length);
    }, [props])

    return (
        <>
            {store.popupList.filter(item => item.building_id === props.building.id).length !== 0 &&
            <Popup
                latitude={+props.building.coords[0]}
                longitude={+props.building.coords[1]}
                dynamicPosition={false}
                offsetLeft={13}
                tipSize={10}
                closeButton={false}
                anchor="bottom" 
            >
                <PopupContent building_id={props.building.id}/>
            </Popup>
            }
            <div
                className="marker"
                id={props.building.id}
                style={store.wsCurrentMarkers.includes(props.building.id) ? {position: 'relative', zIndex: 3} :
                props.building.intercoms.includes(store.currentStreamID) ? {position: 'relative', zIndex: 2} : 
                store.streamList.filter(item => props.building.intercoms.includes(item.id)).length > 0 ? {position: 'relative', zIndex: 1} : {}
                }
            >
                <Marker key={props.building.id} longitude={+props.building.coords[1]} latitude={+props.building.coords[0]} >
                    <div className={clsx(
                        'icon',
                        props.building.intercoms.includes(store.currentStreamID) && 'current_marker',
                        store.streamList.filter(item => props.building.intercoms.includes(item.id)).length > 0 && 'marker_in_stream_list',
                    )}>
                        {props.building.intercoms.length}
                    </div>
                </Marker>
            </div>
        </>
    );
})

export default BuildingMarker;