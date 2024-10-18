import {Header} from "./Header";
import { Fetch } from "./Fetch"
import {MapHome} from "/src/Location/MapHome.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { SurfReport} from '/src/forecast/surfReport.jsx';
// import { Content } from "./Content.jsx";
import { BottomNav } from "./BottomNav.jsx";


function App() {
  return(
    <div className="flex flex-col h-screen">
      <BrowserRouter>
        <Header />
        <div className="flex-grow flex flex-col">
          <Routes>
            <Route path="*" element={<MapHome />} />
            <Route path='/data' element={<Fetch />} />
            {/* <Route path="/surfreport" element={< SurfReport />} />
            <Route path="/content" element={<Content />} /> */}
          </Routes>
         </div>
        <BottomNav />
      </BrowserRouter>
    </div>
  )
}

export default App;