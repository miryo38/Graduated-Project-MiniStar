import {combineReducers} from 'redux';

import userSlice from '../slices/user';
import counterSlice from '../slices/counter';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  count : counterSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;