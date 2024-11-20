const logWindDirection = (surfData, preferredWindDirMax, preferredWindDirMin) => {
  const windDirections = [];  // Create an array to hold the wind directions
  
  surfData.forEach((forecast) => {
    windDirections.push(forecast.winddirDegree);  // Push the wind direction into the array
  });
  
  console.log('Preferred Wind Max:', preferredWindDirMax); // Log preferred wind max
  console.log('Preferred Wind Min:', preferredWindDirMin); // Log preferred wind min
  console.log(windDirections);  // Log the array of wind directions
  return windDirections;  // Optionally return the array for further use
};

const WindCalcs = {
  logWindDirection,
};

export default WindCalcs;
