// src/redux/store.js
import { createStore, combineReducers } from 'redux';
import { authReducer } from './reducers/authReducer';
import { notesReducer } from './reducers/notesReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  notes: notesReducer,
});

const store = createStore(rootReducer);

export default store;
