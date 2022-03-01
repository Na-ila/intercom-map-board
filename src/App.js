import React from 'react';
import './app.scss'
import {observer} from 'mobx-react-lite'
import { useHistory, useLocation } from "react-router-dom"
import Centrifuge from "centrifuge";
import {FlyToInterpolator} from 'react-map-gl';
import { v4 as uuidv4 } from 'uuid';

import store from './store/MapStore'
import * as DataAPI from './components/API/API'

import IntercomMap from './components/IntercomMap'

import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({ 
  palette: { 
    primary: { 
      main: '#d4d7db'
    }
   }
 })

const lightTheme = createTheme({ 
  palette: { 
    primary: { 
      main: '#495a67'
    }
   }
})

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const App = observer(() => {
  let history = useHistory()
  let query = useQuery()
  let location = useLocation()

  React.useEffect(() => {
    const elem = document.getElementById('appRoot')
    elem.setAttribute("app-theme", store.mode);
    
    history.push(`${location.pathname}?theme=${store.mode}&location=${store.selectedLocation.query}&intercom_view=${store.intercomView}&sound=${store.sound}`)
  }, [store.mode])

  React.useEffect(() => {
    history.push(`${location.pathname}?theme=${store.mode}&location=${store.selectedLocation.query}&intercom_view=${store.intercomView}&sound=${store.sound}`)
  }, [store.selectedLocation, store.sound])

  React.useEffect(() => {
    query.get('theme') && store.setMode(query.get('theme'))
    query.get('location') && store.setSelectedLocation(store.locationList.filter(item => item.query === query.get('location'))[0])
    query.get('location') && store.setMapViewState({
      ...store.mapViewState,
      latitude: store.locationList.filter(item => item.query === query.get('location'))[0].latitude,
      longitude: store.locationList.filter(item => item.query === query.get('location'))[0].longitude + store.locationList.filter(item => item.query === query.get('location'))[0].offset,
      zoom: store.locationList.filter(item => item.query === query.get('location'))[0].zoom
    })
    query.get('intercom_view') && store.setIntercomView(query.get('intercom_view'))
    // query.get('map_view') && store.setMapView(query.get('map_view'))
    query.get('sound') && store.setSound(query.get('sound'))
  }, []);

  React.useEffect(() => {
    DataAPI.getWsToken()
      .then(res => store.setWs(res.data))
      .catch(err => {})
  }, [])

  React.useEffect(() => {
    if (store.ws) {
      let centrifuge = new Centrifuge(`${store.ws.protocol}://${store.ws.server}`);
  
      centrifuge.setToken(store.ws.token);
  
      centrifuge.subscribe("dmfn_calls", function(message) {
        if (message.data.type === 'doorbell') {
          if (message.data.snapshot) {
            store.setPopupList([...store.popupList, {
              building_id: message.data.building_id,
              intercom_id: message.data.intercom_id,
              snapshot: message.data.snapshot.slice(25, message.data.snapshot.length),
              id: uuidv4()
            }])
            store.setWsCurrentMarkers([...store.wsCurrentMarkers, message.data.building_id])
          }
        } else if (message.data.type === 'reload') {
          document.location.reload();
        } else if (message.data.type === 'setparams') {
          // let paramsArray = []
          // message.data.params.split('&').map(param => {
          //   const newArr = param.split('=')
          //   paramsArray.push({[newArr[0]]: newArr[1]})
          // })

          // paramsArray.map(param => {
          //   switch (Object.keys(param)[0]) {
          //     case "theme":
          //       store.setMode(Object.values(param)[0])
          //       break;
          //     case "location":
          //       console.log(store.locationList.filter(location => location.query === Object.values(param)[0])[0])
          //       const location = store.locationList.filter(location => location.query === Object.values(param)[0])[0]
          //       store.setMapViewState({
          //         ...store.mapViewState,
          //         latitude: location.latitude,
          //         longitude: location.longitude + location.offset,
          //         zoom: location.zoom,
          //         transitionDuration: 1000,
          //         transitionInterpolator: new FlyToInterpolator()
          //     })
          //       store.setSelectedLocation(location)
          //       break;
          //     case "intercom_view":
          //       store.setIntercomView(Object.values(param)[0])
          //       break;
          //     case "map_view":
          //       store.setMapView(Object.values(param)[0])
          //       break;
          //     case "sound":
          //       store.setSound(Object.values(param)[0])
          //       break;
          //   }
          // })
        }
      });
      centrifuge.connect();
    }
  }, [store.ws])

  React.useEffect(() => {
    let timer = setTimeout(() => {
      document.documentElement.style.setProperty("--filtersBlockOpacity", 0);
      let timer1 = setTimeout(() => {
        document.documentElement.style.setProperty("--titleBlockOpacity", 1);
        clearTimeout(timer1)
      }, 300)
      store.setShowTooltips(false)
      clearTimeout(timer)
    }, 2000)
  }, [])

  React.useEffect(() => {
    const app = document.getElementById('appRoot')
    let timer
    app.addEventListener('mousemove', () => {
      clearTimeout(timer)
      document.documentElement.style.setProperty("--titleBlockOpacity", 0);
      let timer2 = setTimeout(() => {
        document.documentElement.style.setProperty("--filtersBlockOpacity", 1);
        clearTimeout(timer2)
      }, 300)
      store.setShowTooltips(true)
      timer = setTimeout(() => {
        document.documentElement.style.setProperty("--filtersBlockOpacity", 0);
        let timer1 = setTimeout(() => {
          document.documentElement.style.setProperty("--titleBlockOpacity", 1);
          clearTimeout(timer1)
        }, 300)
        store.setShowTooltips(false)
      }, 2000)
    })
  }, [document.getElementById('appRoot')])

  React.useEffect(() => {
    const timer = setInterval(() => {
      document.location.reload();
    }, 600000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <ThemeProvider theme={store.mode === 'dark' ? darkTheme : lightTheme}>
      <div id="appRoot" className="container">
        <IntercomMap/>
      </div>
    </ThemeProvider>
  );
})

export default App;
