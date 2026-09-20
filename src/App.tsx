import { Route, Routes } from "react-router-dom";
import "./App.css";
import { CountdownTimerPage } from "./CountdownTimerPage";
import { HomePage } from "./HomePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/countdown" element={<CountdownTimerPage />} />
    </Routes>
  );
}
