import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import authReducer from './auth/_authReducer';
import utilsReducer from './utils/_utilsReducer';
import dataReducer from './data/_dataReducer';

// eslint-disable-next-line import/no-anonymous-default-export
export default (history) =>
    combineReducers({
        router: connectRouter(history),
        auth: authReducer,
        data: dataReducer,
        utils: utilsReducer
    });