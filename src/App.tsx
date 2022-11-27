import React from 'react'
import { Tasks } from './components/Tasks/Tasks'
import { Header } from './components/Header/Header'
import './App.less'

function App() {
  return (
    <div className="appContainer">
      <Header />
      <Tasks />
    </div>
  )
}

export default App
