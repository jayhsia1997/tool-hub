import { Route, Routes } from 'react-router-dom'
import { CountdownTimerPage } from './CountdownTimerPage'
import { HomePage } from './HomePage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/countdown" element={<CountdownTimerPage />} />
    </Routes>
  )
}
