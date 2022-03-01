import React from 'react';
import ReactMapGL, { NavigationControl, FullscreenControl} from 'react-map-gl';
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import 'mapbox-gl/dist/mapbox-gl.css'

import store from '../../store/MapStore'
import * as DataAPI from '../API/API'

import ThemeSwitch from '../Filters/ThemeSwitch'
import Locations from '../Filters/Locations'
import Clustering from '../Filters/Clustering'
import Sound from '../Filters/Sound'
import MarkersLayer from './MarkersLayer'
import CameraList from '../CameraList'
import AlertMessage from '../AlertMessage'
import CallList from '../CallList'
import Title from '../Title'
import FakeStreamLayer from '../CameraList/FakeStreamLayer'

const IntercomMap = observer(() => {
    const myMap = React.useRef(null)
    const [serverError, setServerError] = React.useState(false)
    const [count, setCount] = React.useState({})

    const getBuildingList = () => {
        DataAPI.getBuildingList()
        .then(res => {
            setServerError(false)
            setCount(res.data.count)
            store.setBuildingIdList(
                res.data.result.map(item => {
                    return {
                        ...item,
                        coordinates: [+item.coords[1], +item.coords[0]],
                        point_count: item.intercoms.length
                    }
                }).filter(item => item.intercoms.length > 0).slice(0, 10)
            )
            store.setMarkerList(store.buildingList)
        })
        .catch(err => {
            setServerError(true)
            let timer = setTimeout(() => {
                getBuildingList()
                clearTimeout(timer)
            }, 10000)
        })
    }

    React.useEffect(() => {
        getBuildingList()
    }, [])

    React.useEffect(() => {
        document.getElementsByClassName('scale-up-center')[0]?.classList.remove('scale-up-center')
        const marker = document.getElementById(store.buildingList.filter(building => building.intercoms.includes(store.currentStreamID))[0]?.id)?.firstChild
        const markerY = marker?.getBoundingClientRect().y
        const markerX = marker?.getBoundingClientRect().x

        const playerBlock = document.getElementById(`react-player-${store.currentStreamID}`)
        const playerY = playerBlock?.getBoundingClientRect().y
        const playerX = playerBlock?.getBoundingClientRect().x

        const yOffset = markerY - playerY
        const xOffset = markerX - playerX
        
        document.documentElement.style.setProperty("--yOffset", `${yOffset-(window.innerHeight * 0.095)}px`);
        document.documentElement.style.setProperty("--xOffset", `${xOffset-(window.innerWidth * 0.085)}px`);
        document.documentElement.style.setProperty("--initialScale", 0.1);
        playerBlock && (playerBlock.className = 'scale-up-center')
    }, [store.currentStreamID])

    React.useEffect(() => {
        store.setCurrentViewport([
            myMap.current?.getMap().getBounds()._sw.lng,
            myMap.current?.getMap().getBounds()._sw.lat,
            myMap.current?.getMap().getBounds()._ne.lng,
            myMap.current?.getMap().getBounds()._ne.lat,
        ])
    }, [store.selectedLocation])

    return (
        <ReactMapGL
            ref={myMap}
            attributionControl={false}
            mapboxApiAccessToken='pk.eyJ1IjoibmFpLWxhIiwiYSI6ImNrbWV0c2NwajBoc3gyd3Bqbm1sMXl3bW0ifQ.Xutqt1VOZcc1FHN7F6zAOw'
            mapStyle={store.mapStyle}
            width='100vw'
            height='100vh'
            {...store.mapViewState}
            onViewportChange={e => {
                store.setMapViewState({
                    ...e,
                    width: 'fit',
                    height: 'fit'
                })

                store.setCurrentViewport([
                    myMap.current?.getMap().getBounds()._sw.lng,
                    myMap.current?.getMap().getBounds()._sw.lat,
                    myMap.current?.getMap().getBounds()._ne.lng,
                    myMap.current?.getMap().getBounds()._ne.lat,
                ])
            }}
        >
            {serverError && <AlertMessage/>}
            <MarkersLayer/>
            <div className="mapControls" style={{ position: "absolute", left: 10, bottom: 10, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 5 }}>
                <NavigationControl showCompass={false}/>
                <FullscreenControl/>
            </div>
            <div key='static-map-block' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh', width: '100%'}}>
                    <div className="filters">
                        <div className="first-line">
                            <div>
                                <ThemeSwitch/>
                            </div>
                            <div className="locations">
                                <Locations/>
                            </div>
                        </div>
                        {/* <div>
                            <Clustering/>
                        </div> */}
                        <div>
                            <Sound/>
                        </div>
                    </div>
                    <div className="title_container">
                        <Title count={count}/>
                    </div>
                    <div className="callListContainer">
                        {/* <CallList/> */}
                    </div>
                </div>
                <div className="streamList">
                    {/* <CameraList/> */}
                </div>
                <div className="fakeStreamLayer">
                    {/* <FakeStreamLayer/> */}
                </div>
            </div>
        </ReactMapGL>
    );
})

export default IntercomMap;