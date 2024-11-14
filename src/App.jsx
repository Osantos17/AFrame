import { useState } from 'react';
import { Header } from "./Header";
import { Fetch } from "./Fetch";
import { MapHome } from "/src/Location/MapHome.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BottomNav } from "./BottomNav.jsx";
import { LongForecast } from "/src/forecast/LongForecast.jsx";
import { ShortForecast } from "/src/forecast/ShortForecast.jsx";
import { TideLongGraphPage } from "./forecast/TideLongGraphPage.jsx";
import { TimedGraph } from "./forecast/TimedGraph.jsx";
import { withTooltip } from '@visx/tooltip';

function App() {
  // Set initial size of the graph
  const [graphWidth, setGraphWidth] = useState(600); // default width
  const [graphHeight, setGraphHeight] = useState(400); // default height

  // Manual resize handlers for graph size
  const handleWidthChange = (e) => setGraphWidth(Number(e.target.value));
  const handleHeightChange = (e) => setGraphHeight(Number(e.target.value));

  // Wrapped TimedGraph with tooltip functionality
  const TimedGraphWithTooltip = withTooltip(TimedGraph);

  return (
    <div className="flex flex-col h-screen">
      <BrowserRouter>
        <Header />
        <div className="flex-grow flex flex-col">
          <Routes>
            {/* Other routes remain unchanged */}
            <Route path="*" element={<MapHome />} />
            <Route path='/data' element={<Fetch />} />
            <Route path='/results' element={<LongForecast />} />
            <Route path='/short' element={<ShortForecast />} />
            <Route path='/long' element={<TideLongGraphPage />} />
            
            {/* Route for the TimedGraph chart */}
            <Route 
              path='/time' 
              element={
                <div>
                  {/* Manually adjust the size of the chart */}
                  <div className="mb-4">
                    <label>Width:</label>
                    <input 
                      type="number" 
                      value={graphWidth} 
                      onChange={handleWidthChange} 
                      min="200" 
                      max="1200" 
                      className="mx-2"
                    />
                    <label>Height:</label>
                    <input 
                      type="number" 
                      value={graphHeight} 
                      onChange={handleHeightChange} 
                      min="200" 
                      max="800" 
                      className="mx-2"
                    />
                  </div>
                  <TimedGraphWithTooltip width={graphWidth} height={graphHeight} />
                </div>
              }
            />
          </Routes>
        </div>
        <BottomNav />
      </BrowserRouter>
    </div>
  );
}

export default App;
