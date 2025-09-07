import { StrictMode, Profiler } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './containers/App/App.jsx'

createRoot(document.getElementById('root')).render(
    <>
      {/* <Profiler 
        id="App" 
        onRender={(id, phase, actualDuration) => {
          if (actualDuration > 5) {  // Log only if render takes more than 5ms
            console.log(`[Profiler] ${id} ${phase} took ${actualDuration}ms`);
          }
        }}> */}
        <App />
      {/* </Profiler> */}
    </>
  )
