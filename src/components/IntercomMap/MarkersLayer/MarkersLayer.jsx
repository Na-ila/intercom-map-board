import React from 'react';
import { observer } from 'mobx-react-lite'
import {toJS} from 'mobx'

import store from '../../../store/MapStore'

import BuildingMarker from '../Marker'

const MarkersLayer = observer(() => {

    const markersDistance = (coords1, coords2) => {
        return Math.sqrt(Math.pow((coords1[0] - coords2[0]), 2) + Math.pow((coords1[1] - coords2[1]), 2))
    }

    const isMarkersOverLap = (coords1, coords2) => {

    }

    React.useEffect(() => {
        console.log(document.getElementsByClassName('marker'), store.buildingList.length)
        if (store.buildingList.length > 0 && document.getElementsByClassName('marker').length === store.buildingList.length) {
            console.log('layer mounted')
            console.log('zoom', toJS(store.mapViewState.zoom))
            console.log('points', toJS(store.markerList))
            
            let defaultList = store.buildingList
            
            store.buildingList.forEach(building => {
                let markersToMerge = []
                console.log(building)
                console.log(building.id)
                console.log(document.getElementById(building.id))
                let buildingMarkerCoords = document.getElementById(building.id)?.firstChild.getBoundingClientRect()
                store.buildingList.forEach(building2 => {
                    // let building2MarkerCoords = document.getElementById(building2.id).firstChild.getBoundingClientRect()
                    // if (isMarkersOverLap(building1MarkerCoords, building2MarkerCoords)) {
                    //     markersToMerge.push(building2)
                    // }
                })
            })
        }
    }, [store.mapViewState.zoom, store.buildingList, document.getElementsByClassName('marker').length])

    return (
        store.markerList.map(building => 
            <BuildingMarker key={building.id} building={building}/>
        )
    );
});

export default MarkersLayer;