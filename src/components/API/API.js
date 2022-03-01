import axios from 'axios'

import {
    ACCESS_TOKEN,
    WS_TOKEN,
    BUILDING_LIST,
    INTERCOM_STREAM
} from '../App/config'

export const getWsToken = () => 
    axios.get(WS_TOKEN)

export const getBuildingList = () => 
    axios.get(BUILDING_LIST, 
        {
            headers: {
                'access-token': ACCESS_TOKEN
            }
        }
    )

export const getIntercomStream = (building_id) => 
    axios.get(INTERCOM_STREAM + building_id, 
        {
            headers: {
                'access-token': ACCESS_TOKEN
            }
        }
    )

export const checkIntercomStream = (intercom_stream) => 
    axios.get(intercom_stream)