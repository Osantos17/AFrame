import './ForecastSingle.css'

export function ForecastSingle({ 
  time, 
  swelldir, 
  swelldir16point, 
  swellHeight_ft, 
  swellperiod_secs, 
  windspeedMiles, 
  winddirDegree, 
  winddir16point, 
  windDirectionMatch, 
  swellDirectionMatch,
  waveHeight,
}) {

  const getSwellArrow = () => {
    if (swellDirectionMatch?.isInPreferredRange) {
      return '/src/Images/SwellGreenArrow.png';
    } else if (swellDirectionMatch?.isInBadRange) {
      return '/src/Images/SwellRedArrow.png';
    }
    return '/src/Images/SwellBlueArrow.png';
  };

  const getWindArrow = () => {
    if (windDirectionMatch) {
      return '/src/Images/WindGreenArrow.png';
    }
    if (windspeedMiles && windspeedMiles < 5) {
      return '/src/Images/WindGreenArrow.png';
    }
    if (windspeedMiles && windspeedMiles <= 8) {
      return '/src/Images/WindYellowArrow.png';
    }
    return '/src/Images/WindRedArrow.png';
  };

  const getOverallRating = () => {
    const swellRating = swellDirectionMatch?.isInBadRange 
      ? 'Red' 
      : swellDirectionMatch?.isInPreferredRange 
      ? 'Green' 
      : 'Yellow';

    const windRating = windDirectionMatch 
      ? 'Green' 
      : windspeedMiles <= 8 
      ? 'Yellow' 
      : 'Red';

    // Determine overall rating
    if (windRating === 'Red' || swellRating === 'Red') {
      return '/src/Images/RatingRed.png';
    }
    if (windRating === 'Yellow' || swellRating === 'Yellow') {
      return '/src/Images/RatingYellow.png';
    }
    return '/src/Images/RatingGreen.png';
  };

  return (
    <div className="ForecastCol">
      <div className="Forecastcontainer flex flex-col items-center space-y-1 relative">
        <div className="RatingBar flex flex-col items-center mt-[-10px]">
        <img 
            src={getOverallRating()}
            width="40"
            height="20"
            alt="Overall Rating"
          />
        </div>
        <div className="timeWaveContainer">
          <div className="time flex flex-col items-center text-white mt-[-6px] mb-1">
          {time ? (parseInt(time, 10) / 100) % 12 || 12 : 'N/A'}
          </div>
          <div className="waveHeight mb-1">
            <div className="swellHeight flex items-center space-x-0.5 ml-2 mt-.5">
              <div className="waveCalc text-white items-center">{waveHeight || 'N/A'}</div>
              <div className="feet text-gray-500 mb-2">ft</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-400 w-10 ml-0"></div>
        <div className="swellContainer flex flex-col items-center">
          <div className="swellTitle">
            <div className="title items-center text-gray-300 ml-0 pb-1">SWELL</div>
          </div>
          <div className="swellLogo mt-0 flex flex-col items-center">
          <img
              src={getSwellArrow()}
              width="20"
              height="20"
              alt="Swell Arrow"
              style={{
                transform: `rotate(${(swelldir + 180) % 360}deg)`,
              }}
            />
            <div className="swellDirection degrees mt-1 text-gray-500">{swelldir || 'N/A'}</div>
            <div className="pointDirection text-white">{swelldir16point || 'N/A'}</div>
          </div>
          <div className="swellHeight flex items-center space-x-0.5 ml-2 mt-1 align-bottom">
            <div className="swellCalc text-white">{swellHeight_ft || 'N/A'}</div>
            <div className="feet text-gray-500 pt-1">ft</div>
          </div>
          <div className="swellContainer flex flex-col items-center">
            <div className="swellTime flex flex-col items-center mt-[-4px]">
              <div className="swell mt-2 text-white">{swellperiod_secs || 'N/A'}</div>
              <div className="seconds text-gray-500 mt-[-5px]">sec</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-400 w-10 ml-0"></div>
        <div className="windContainer flex flex-col items-center">
          <div className="windTitle">
            <div className="title items-center text-gray-300 ml-0">WIND</div>
          </div>
          <div className="Wind flex flex-col items-center">
            <div className="windSpeed mt-[-3px] text-white pt-1">{windspeedMiles || 'N/A'}</div>
            <div className="mph text-gray-500 mt-[-2px]">mph</div>
          </div>
          <div className="windLogo flex flex-col items-center mt-1">
            <img
              src={
                windDirectionMatch
                  ? '/src/Images/WindGreenArrow.png'
                  : (windspeedMiles && windspeedMiles < 5)
                  ? '/src/Images/WindGreenArrow.png'
                  : (windspeedMiles && windspeedMiles <= 8)
                  ? '/src/Images/WindYellowArrow.png'
                  : '/src/Images/WindRedArrow.png'
              }
              width="20"
              height="20"
              alt="Wind Arrow"
              style={{
                transform: `rotate(${(winddirDegree || 0) + 180}deg)`,
              }}
            />
          </div>
          <div className="windDirection degrees text-gray-500 mt-1">{winddirDegree || 'N/A'}</div>
          <div className="pointDirection">{winddir16point || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
}
