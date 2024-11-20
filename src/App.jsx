// import { useState, useEffect } from 'react';
import { Header } from "./Header";
import { Fetch } from "./Fetch";
import { MapHome } from "/src/Location/MapHome.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BottomNav } from "./BottomNav.jsx";
import { MultiDay } from "/src/forecast/MultiDay.jsx";
import { GraphContainer } from "./forecast/GraphContainer.jsx";
import { ForecastSingle } from "./forecast/ForecastSingle.jsx";
import { withTooltip } from '@visx/tooltip';

function App() {
  // Set initial size of the graph


  // // Handle window resizing
  // useEffect(() => {
  //   const handleResize = () => {
  //     setGraphWidth(window.innerWidth); // Maintain padding of 15px on each side
  //   };
    
  //   window.addEventListener('resize', handleResize);
    
  //   // Cleanup the event listener on component unmount
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  // Wrapped GraphContainer with tooltip functionality
  const GraphContainerWithTooltip = withTooltip(GraphContainer);

  return (
    <div className="flex-grow flex items-center justify-center bg-gray-100">
      <BrowserRouter>
        <Header />
        <div className="flex-grow"> {/* Makes the content area grow and take available space */}
          <Routes>
            <Route path="*" element={<MapHome />} />
            <Route path='/data' element={<Fetch />} />
            <Route path="/results/:locationId" element={<MultiDay />} />
            <Route path='/single' element={<ForecastSingle />} />
            
            <Route 
              path='/time' 
              element={
                <div>
                  <GraphContainerWithTooltip />
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