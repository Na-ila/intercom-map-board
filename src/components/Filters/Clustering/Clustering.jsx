import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {observer} from 'mobx-react-lite'

import store from '../../../store/MapStore'
import clusterIconLight from '../../../assets/cluster-icon-light.svg'
import markerIconLight from '../../../assets/marker-icon-light.svg'
import clusterIconDark from '../../../assets/cluster-icon-dark.svg'
import markerIconDark from '../../../assets/marker-icon-dark.svg'
import Tooltip from '@mui/material/Tooltip';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 54,
  height: 28,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url(${store.mode === 'dark' ? clusterIconDark : clusterIconLight})`,
    },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: store.mode === 'dark' ? '#8f8d8d' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.primary.main,
    width: 25,
    height: 25,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url(${store.mode === 'dark' ? markerIconDark : markerIconLight})`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: store.mode === 'dark' ? '#8f8d8d' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const Clustering = observer(() => {

  const handleSwitch = () => {
    store.setMapView(store.mapView === 'cluster' ? 'marker' : 'cluster')
  }

  return (
    <FormGroup>
      <FormControlLabel
        style={{margin: 0}}
        control={
            <Tooltip title={store.showTooltips ? (store.mapView === 'cluster' ? 'Кластеры' : 'Маркеры') : ''} placement="bottom-start">
                <MaterialUISwitch
                    sx={{ m: 1 }}
                    checked={store.mapView === 'cluster'}
                    value={store.mode}
                    onChange={handleSwitch}
                />
            </Tooltip>
        }
        label=""
      />
    </FormGroup>
  );
})

export default Clustering
