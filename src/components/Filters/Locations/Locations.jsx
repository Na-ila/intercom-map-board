import React from 'react';
import {observer} from 'mobx-react-lite'
import {FlyToInterpolator} from 'react-map-gl';

import store from '../../../store/MapStore'
import {isRegionsOverlap} from '../../App/utils'

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

const Locations = observer((props) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleMenuItemClick = (event, location) => {
    store.setMapViewState({
        ...store.mapViewState,
        latitude: location.latitude,
        longitude: location.longitude + location.offset,
        zoom: location.zoom,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator()
    })
    store.setSelectedLocation(location);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  React.useEffect(() => {
    const viewportBounds = store.currentViewport
    
    let selectedLocations = []
    for (var i = 0; i < store.locationList.length; i++) {
        if (isRegionsOverlap(viewportBounds, store.locationList[i].bounds)) {
        selectedLocations = [...selectedLocations, store.locationList[i]]
      }
    }
    
    if (selectedLocations.length > 2) {
      store.setSelectedLocation(store.locationList[0])
    } else if (selectedLocations.length === 2) {
      store.setSelectedLocation(selectedLocations.filter(location => location.city !== 'Татарстан')[0])
    } else {
      store.setSelectedLocation(store.locationList.filter(location => location.city === 'Татарстан')[0])
    }
  }, [store.currentViewport])

  const returnToLocation = (e) => {
    handleMenuItemClick(e, store.selectedLocation)
  }

  return (
    <React.Fragment>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button" size="small">
        <Button style={{width: '115px'}} onClick={(e) => returnToLocation(e)}>{store.selectedLocation.city}</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper className="ListBlock">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" className="CityList">
                  {store.locationList.map(location => (
                    <MenuItem
                      key={location.city}
                      selected={location.city === store.selectedLocation.city}
                      onClick={(event) => handleMenuItemClick(event, location)}
                      className={location.city === store.selectedLocation.city && "SelectedItem"}
                    >
                      {location.city}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
})

export default Locations
