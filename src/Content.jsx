// import axios from 'axios';
import{ Route, Routes} from "react-router-dom";
import { SurfReport} from "./forecast/SurfReport"

export function Content() {
  return (
    <div>
      <Routes>
        <Route path="/forecast/SurfReport.jsx" element={<SurfReport />} />
      </Routes>
    </div>
  )
} 