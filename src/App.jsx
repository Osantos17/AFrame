import {Header} from "./Header";
import { BrowserRouter } from "react-router-dom"

function App() {
  return(
    <div>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </div>
  )
}

export default App;