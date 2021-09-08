import { combineReducers } from 'redux';

import themeReducer from './themeReducers';
import userReducer from './UserReducer';

export default combineReducers({
	themeReducer, userReducer
});
