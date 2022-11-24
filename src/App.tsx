import React, { useEffect } from 'react'
import { Tasks } from './components/Tasks/Tasks'
import { Header } from './components/Header/Header'
import './App.less'
import { Dispatch, getTasks } from './redux/tasksReducer'
import { useDispatch } from 'react-redux'

function App() {
  return (
    <div className="appContainer">
      <Header />
      <Tasks />
    </div>
  )
}

export default App
