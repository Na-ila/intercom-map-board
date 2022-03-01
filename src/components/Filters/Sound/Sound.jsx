import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {observer} from 'mobx-react-lite'

import store from '../../../store/MapStore'
import soundOnLight from '../../../assets/sound-on-light.svg'
import soundOnDark from '../../../assets/sound-on-dark.svg'
import soundOffLight from '../../../assets/sound-off-light.svg'
import soundOffDark from '../../../assets/sound-off-dark.svg'
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
        backgroundImage: `url(${store.mode === 'dark' ? soundOnDark : soundOnLight})`,
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
      backgroundImage: `url(${store.mode === 'dark' ? soundOffDark : soundOffLight})`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: store.mode === 'dark' ? '#8f8d8d' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const Sound = observer(() => {

  const handleSwitch = () => {
    store.setSound(store.sound === 'off' ? 'on' : 'off')
  }

  return (
    // <FormGroup>
      <FormControlLabel
        style={{margin: 0}}
        control={
            <Tooltip title={store.showTooltips ? (store.sound === 'on' ? 'Звук вкл.' : 'Звук выкл.') : ''} placement="bottom-start">
                <MaterialUISwitch
                    sx={{ m: 1 }}
                    checked={store.sound === 'on'}
                    value={store.mode}
                    onChange={handleSwitch}
                />
            </Tooltip>
        }
        label=""
      />
    // </FormGroup>
  );
})

export default Sound
