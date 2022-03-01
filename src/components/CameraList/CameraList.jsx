import React from 'react';
import {toJS} from 'mobx'
import {observer} from 'mobx-react-lite'
import ReactPlayer from 'react-player'

import * as DataAPI from '../API/API'
import store from '../../store/MapStore'
import {getPointsInViewport} from '../App/utils'

import CameraListItem from './CameraListItem'
import AlertMessage from '../AlertMessage'

const CameraList = observer((props) => {
    const [serverError, setServerError] = React.useState(false)
    let index = 0
    let selectedIntercoms 

    const checkIntercomStream = (res, add) => {
        DataAPI.checkIntercomStream(res.live.stream_url.replace('http://89.232.115.40', 'https://vn.tattelecom.ru'))
            .then(result => {
                const newArr = store.streamList.map(obj => ({...obj}))
                newArr[index] = res
                store.setStreamList(newArr)
                store.setCurrentStreamID(res.id)
                if (add) {
                    store.setIntercomStreamList([...store.intercomStreamList, res])
                }
                if (index < 9) {
                    index++
                } else {
                    index = 0
                }
            })
            .catch(err => {
                // console.log(res)
                store.setIntercomStreamList(store.intercomStreamList.filter(item => item.id !== res.id))
            })
    }

    const newIntercomList = () => {
        if (store.markerList.length > 0 && store.currentViewport) {
            clearInterval(store.timer)
            const points = getPointsInViewport(toJS(store.markerList), store.currentViewport)
            const intercoms = points.reduce((acc, point) => acc.concat(point.intercoms), [])
            selectedIntercoms = intercoms.filter(item => store.streamList.filter(stream => +stream.id === item).length === 0)
            index = 0
            if (intercoms.length < 10) {
                selectedIntercoms = intercoms
                store.setStreamList(store.streamList.slice(0, intercoms.length))
            }
    
            store.setTimer(setInterval(() => {
                if (selectedIntercoms.length > 0) {
                    let randomIntercom = selectedIntercoms[Math.floor(Math.random()*selectedIntercoms.length)]
    
                    if (store.streamList.filter(stream => +stream.id === randomIntercom).length === 0) {
                        if (store.intercomStreamList.filter(item => item.id === randomIntercom).length !== 0) {
                            checkIntercomStream(store.intercomStreamList.filter(item => item.id === randomIntercom)[0])
                        } else {
                            DataAPI.getIntercomStream(randomIntercom)
                                .then(res => {
                                    checkIntercomStream(res.data, true)
                                })
                                .catch(err => {
                                    clearInterval(store.timer)
                                    setServerError(true)
                                    let timer1 = setTimeout(() => {
                                        newIntercomList()
                                        clearTimeout(timer1)
                                    }, 10000)
                                })
                        }
                    }
                    selectedIntercoms = selectedIntercoms.filter(intercom => intercom !== randomIntercom)
                    if (selectedIntercoms.length === 0 && intercoms.length > 10) {
                        selectedIntercoms = intercoms.filter(intercom => store.streamList.filter(stream => +stream.id === intercom).length === 0)
                    }
                } else {
                    store.setCurrentStreamID(null)
                    clearInterval(store.timer)
                }
            }, 1000))
        }
    }

    React.useEffect(() => {
        newIntercomList()
    }, [store.currentViewport, store.markerList])

    return (
        <>
        {serverError && <AlertMessage/>}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <CameraListItem
                key={num}
                num={num}
            />
        ))}
        </>
    );
})

export default CameraList;