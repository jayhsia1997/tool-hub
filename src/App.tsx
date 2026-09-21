import { Route, Routes } from "react-router-dom";
import "./App.css";
import { CountdownTimerPage } from "./CountdownTimerPage";
import { HomePage } from "./HomePage";
import { ThemeProvider } from "./theme/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/countdown" element={<CountdownTimerPage />} />
      </Routes>
    </ThemeProvider>
  );
}
