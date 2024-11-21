const logWindDirections = (locationData) => {
  const { preferred_wind_dir_max, preferred_wind_dir_min } = locationData;
  console.log('Preferred Wind Directions:', {
    preferred_wind_dir_max,
    preferred_wind_dir_min,
  });
};

const logWindDirection = (surfData) => {
  const windDirections = [];  // Create an array to hold the wind directions
  
  surfData.forEach((forecast) => {
    windDirections.push(forecast.winddirDegree);  // Push the wind direction into the array
  });
  
  console.log(windDirections);  // Logs the array of wind directions
  return windDirections;  // Optionally return the array for further use
};

const WindCalcs = {
  logWindDirections,
  logWindDirection,
};

export default WindCalcs;
