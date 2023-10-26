import {configureStore,combineReducers} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import userReducer from './slices/userSlice'
import {persistReducer,persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
    user:userReducer
})

const persistConfig ={
    key:'root',
    storage,
    version:1

}

const persistreducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
    reducer:{persistreducer},
    middleware:[thunk]
})

export const persistor = persistStore(store)
