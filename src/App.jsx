import {Header} from "./Header";
import {MapHome} from "/src/Location/MapHome.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SurfReport} from '/src/forecast/surfReport.jsx';
import { Content } from "./Content.jsx";


function App() {
  return(
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="*" element={<MapHome />} />
          <Route path="/surfreport" element={< SurfReport />} />
          <Route path="/content" element={<Content />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;