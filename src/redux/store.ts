import { Action, applyMiddleware, combineReducers, createStore } from 'redux'
import thunkMiddleWare, { ThunkAction } from 'redux-thunk'
import tasksReducer from './tasksReducer'

let rootReducer = combineReducers({
  task: tasksReducer,
})

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunkMiddleWare))
)

export default store

type RootReducerType = typeof rootReducer
export type AppStateType = ReturnType<RootReducerType>
export type InferActionsType<T> = T extends {
  [key: string]: (...args: any[]) => infer U
}
  ? U
  : never
export type BaseThunk<A extends Action, R = Promise<void>> = ThunkAction<
  R,
  AppStateType,
  any,
  A
>
export type AppDispatch = typeof store.dispatch
