



const logWindDirections = (locationData) => {
  const { preferred_wind_dir_max, preferred_wind_dir_min } = locationData;
  console.log('Preferred Wind Directions:', {
    preferred_wind_dir_max,
    preferred_wind_dir_min,
  });
};

const logWindDirection = (surfData) => {
  const windDirections = [];
  surfData.forEach((forecast) => {
    windDirections.push(forecast.winddirDegree);
  });
  console.log('Wind Directions:', windDirections);
  return windDirections;
};

const calculatePreferredWindRange = (preferred_wind_dir_min, preferred_wind_dir_max) => {
  let preferredRange = [];
  
  if (preferred_wind_dir_min <= preferred_wind_dir_max) {
    // Simple range from min to max
    for (let i = preferred_wind_dir_min; i <= preferred_wind_dir_max; i++) {
      preferredRange.push(i);
    }
  } else {
    // Wrap-around range (min to 360 and 0 to max)
    for (let i = preferred_wind_dir_min; i <= 360; i++) {
      preferredRange.push(i);
    }
    for (let i = 0; i <= preferred_wind_dir_max; i++) {
      preferredRange.push(i);
    }
  }

  return preferredRange;
};

const windDirections = (surfData, locationData) => {
  const { preferred_wind_dir_max, preferred_wind_dir_min } = locationData;
  const preferredRange = calculatePreferredWindRange(preferred_wind_dir_min, preferred_wind_dir_max);

  console.log("Preferred Wind Direction Range:", preferredRange);

  // Create an array to store true/false results
  const results = surfData.map((forecast) => {
    const windDir = forecast.winddirDegree;
    const isInPreferredRange = preferredRange.includes(windDir);
    return isInPreferredRange; // Store true/false
  });

  console.log("Wind Direction Matches:", results); // Log the results array
  return results; // Return the results if needed elsewhere
};


const WindCalcs = {
  logWindDirections,
  logWindDirection,
  windDirections, // Include this function
};

export default WindCalcs;
