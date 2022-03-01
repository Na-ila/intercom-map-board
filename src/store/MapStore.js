import {makeAutoObservable} from 'mobx'

class mapStore {
    ws = null
    timer = null
    wsCurrentMarkers = []
    popupList = []
    currentViewport = null
    locationList = [
        {
            city: 'Татарстан',
            query: 'tatarstan',
            latitude: 55.448217,
            longitude: 50.4763591,
            offset: 3,
            zoom: 6.5,
            bounds: [47.2323667, 53.905808, 54.36121, 56.710594]
        },
        {
            city: 'Казань',
            query: 'kazan',
            latitude: 55.7887400,
            longitude: 49.1221400,
            offset: 0.15,
            zoom: 11,
            bounds: [48.960452, 55.642117, 49.383897, 55.920785]
        },
        {
            city: 'Наб. Челны',
            query: 'chelny',
            latitude: 55.7254500,
            longitude: 52.4112200,
            offset: 0.15,
            zoom: 11,
            bounds: [52.180516, 55.635273, 52.551285, 55.794494]
        },
        {
            city: 'Бугульма',
            query: 'bugulma',
            latitude: 54.5378000,
            longitude: 52.7985000,
            offset: 0.03,
            zoom: 13,
            bounds: [52.729632, 54.501417, 52.856351, 54.553711]
        },
        {
            city: 'Елабуга',
            query: 'yelabuga',
            latitude: 55.7577131,
            longitude: 52.0539938,
            offset: 0,
            zoom: 13,
            bounds: [51.943071, 55.735176, 52.107198, 55.794862]
        },
        {
            city: 'Альметьевск',
            query: 'almetyevsk',
            latitude: 54.907,
            longitude: 52.316611,
            offset: 0,
            zoom: 13,
            bounds: [52.219002, 54.820769, 52.466278, 54.944832]
        },
    ]
    buildingList = []
    markerList = []
    fakeStreamList = [
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} }
    ]
    streamList = [
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} },
        { id: null, live: {stream_url: null} }
    ]
    callList = []
    callListItemAmount = 0
    mode = 'dark'
    intercomView = 'stream'
    mapView = 'cluster'
    sound = 'off'
    selectedLocation = {
        city: 'Татарстан',
        query: 'tatarstan',
        latitude: 55.448217,
        longitude: 50.4763591 + 1.5,
        zoom: 7.5
    }
    currentStreamID = null
    mapViewState = {
        longitude: 50.4763591 + 1.5,
        latitude: 55.448217,
        zoom: 7.5
    }
    showTooltips = true
    popupCoords = {}
    intercomStreamList = []

    constructor() {
        makeAutoObservable(this)
    }

    setWs(ws) {
        this.ws = ws
    }
    
    setTimer(t) {
        this.timer = t
    }

    setWsCurrentMarkers(markers) {
        this.wsCurrentMarkers = markers
    }

    setPopupList(list) {
        this.popupList = list
    }

    setCurrentViewport(viewport) {
        this.currentViewport = viewport
    }

    setBuildingIdList(list) {
        this.buildingList = list
    }

    setMarkerList(list) {
        this.markerList = list
    }

    setStreamList(list) {
        this.fakeStreamList = this.streamList
        this.streamList = list
    }

    setCallList(list) {
        this.callList = list
    }

    setCallListItemAmount(amount) {
        this.callListItemAmount = amount
    }

    setMode(mode) {
        this.mode = mode
    }

    setIntercomView(view) {
        this.intercomView = view
    }

    setMapView(view) {
        this.mapView = view
    }

    setSound(value) {
        this.sound = value
    }

    setSelectedLocation(location) {
        this.selectedLocation = location
    }

    setCurrentStreamID(id) {
        this.currentStreamID = id
    }

    get mapStyle() {
        return this.mode === 'dark' ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/light-v10'
    }

    setMapViewState(mapViewState) {
        this.mapViewState = mapViewState
    }

    setShowTooltips(value) {
        this.showTooltips = value
    }

    setPopupCoords(coords) {
        this.popupCoords = coords
    }

    setIntercomStreamList(list) {
        this.intercomStreamList = list
    }

}

export default new mapStore()