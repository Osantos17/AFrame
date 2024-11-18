import './ForecastSingle.css';
import { useEffect, useState } from 'react';

export function ForecastSingle({ data, rangeStart, rangeEnd }) {
  const [error, setError] = useState(null);

  return (
    <div className="ForecastCol">
      {data?.slice(rangeStart, rangeEnd + 1).map((item, index) => (
        <div key={index}>
          <div className="Forecastcontainer flex flex-col items-center space-y-1 relative">
            <div className='timeWaveContainer'>
              <div className="time flex flex-col items-center text-white ">
                {/* Extract and format the time correctly */}
                {item.time ? parseInt(item.time, 10) / 100 : 'N/A'}
              </div>

              <div className="waveHeight mb-1">
                <div className="swellHeight flex items-center space-x-0.5 ml-2 mt-.5">
                  <div className="waveCalc text-white">3-4</div>
                  <div className="feet text-gray-500">ft</div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-400 w-12 ml-1"></div> 

            <div className='swellContainer flex flex-col items-center'>
              <div className="swellTitle">
                <div className="title items-center text-gray-300 ml-1 pb-1">SWELL</div>
              </div>

              <div className="swellHeight flex items-center space-x-1 ml-3 align-bottom">
                <div className="swellCalc text-sm text-white">{item.swellHeight_ft || 'N/A'}</div>
                <div className="feet text-gray-500 pt-1">ft</div>
              </div>

              <div className="swellLogo mt-2 flex flex-col items-center">
                <img
                  src="./src/Images/SwellArrow.png"
                  width="20"
                  height="20"
                  alt="Swell Arrow"
                />
                <div className="swellDirection degrees mt-1 text-gray-500">{item.swelldir || 'N/A'}</div>
                <div className='pointDirection text-xs text-white'>{item.swelldir16point || 'N/A'}</div>
              </div>

              <div className="swellContainer flex flex-col items-center">
                <div className="swellTime flex flex-col items-center mt-[-4px]">
                  <div className="swell text-sm mt-2 text-white">{item.swellperiod_secs || 'N/A'}</div>
                  <div className="seconds text-xs text-gray-500 mt-[-6px]">sec</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-400 w-12 ml-1"></div>

            <div className='windContainer flex flex-col items-center'>
              <div className="windTitle">
                <div className="title items-center text-gray-300 ml-1 ">WIND</div>
              </div>

              <div className="Wind flex flex-col items-center">
                <div className="windSpeed mt-[-5px] text-white pt-1">{item.windspeedMiles || 'N/A'}</div>
                <div className="mph text-xs text-gray-500 mt-[-6px]">mph</div>
              </div>

              <div className="windLogo flex flex-col items-center mt-3">
                <img
                  src="./src/Images/WindArrow.png"
                  width="20"
                  height="20"
                  alt="Wind Arrow"
                />
                <div className="windDirection degrees text-gray-500 mt-1 ">{item.winddirDegree || 'N/A'}</div>
                <div className='pointDirection text-sm'>{item.winddir16point || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
