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
  let preferredWindRange = [];

  if (preferred_wind_dir_min <= preferred_wind_dir_max) {
    for (let i = preferred_wind_dir_min; i <= preferred_wind_dir_max; i++) {
      preferredWindRange.push(i);
    }
  } else {
    for (let i = preferred_wind_dir_min; i <= 360; i++) {
      preferredWindRange.push(i);
    }
    for (let i = 0; i <= preferred_wind_dir_max; i++) {
      preferredWindRange.push(i);
    }
  }

  return preferredWindRange;
};

const windDirections = (surfData, locationData) => {
  const { preferred_wind_dir_max, preferred_wind_dir_min } = locationData;
  const preferredWindRange = calculatePreferredWindRange(preferred_wind_dir_min, preferred_wind_dir_max);

  console.log('Preferred Wind Direction Range:', preferredWindRange);

  // Create an array to store true/false results
  const results = surfData.map((forecast) => {
    const windDir = forecast.winddirDegree;
    const isInPreferredRange = preferredWindRange.includes(windDir);
    return isInPreferredRange; // Store true/false
  });

  console.log('Wind Direction Matches:', results); // Log the results array
  return results; // Return the results if needed elsewhere
};

const calculateSwellRange = (min, max) => {
  let range = [];

  if (min <= max) {
    for (let i = min; i <= max; i++) {
      range.push(i);
    }
  } else {
    for (let i = min; i <= 360; i++) {
      range.push(i);
    }
    for (let i = 0; i <= max; i++) {
      range.push(i);
    }
  }

  return range;
};

const swellDirections = (surfData, locationData) => {
  const { 
    preferred_swell_dir_min, 
    preferred_swell_dir_max, 
    bad_swell_dir_min, 
    bad_swell_dir_max 
  } = locationData;

  const preferredSwellRange = calculateSwellRange(preferred_swell_dir_min, preferred_swell_dir_max);
  const badSwellRange = calculateSwellRange(bad_swell_dir_min, bad_swell_dir_max);

  console.log('Preferred Swell Direction Range:', preferredSwellRange);
  console.log('Bad Swell Direction Range:', badSwellRange);

  // Check each surfData entry against the ranges
  const results = surfData.map((forecast) => {
    const swellDir = forecast.swelldir; // Assuming `swelldir` is the field name
    const isInPreferredRange = preferredSwellRange.includes(swellDir);
    const isInBadRange = badSwellRange.includes(swellDir);

    return { swellDir, isInPreferredRange, isInBadRange };
  });

  console.log('Swell Direction Matches:', results);
  return results;
};

const calculateWaveHeight = (swellHeights, waveFactor) => {
  // Calculate wave heights based on swell heights and wave factor
  const waveHeights = swellHeights.map((height) => {
    // Step 1: Divide the swell height by the wave factor
    let result = (height / waveFactor).toFixed(1); // Rounded to the nearest 10th
    
    // Step 2: Check the decimal place
    const decimalPart = result.split('.')[1];

    // Step 3: Determine the range for the wave height
    let waveHeightRange = '';

    // Check if result has a decimal place (tens decimal place exists)
    if (decimalPart !== undefined) {
      const tensDecimalPlace = parseInt(decimalPart[0]); // Extract the tens place of the decimal
      
      // Apply new logic for numbers with decimal places
      if (tensDecimalPlace < 5) {
        // If tens decimal place is less than 5, keep the whole number and add '+'
        const lower = Math.floor(result);
        waveHeightRange = `${lower} +`;
      } else {
        // If tens decimal place is 5 or greater, round up and add '+'
        const lower = Math.floor(result);
        const upper = lower + 1;
        waveHeightRange = `${upper} +`;
      }
    } else {
      // Apply original logic for whole numbers or numbers without decimal places
      const wholeResult = parseFloat(result);
      const lower = Math.floor(wholeResult);
      const upper = Math.ceil(wholeResult);
      if (wholeResult - lower > 0.4) {
        // If the difference between whole and decimal part is more than 0.4, add range
        waveHeightRange = `${lower}-${upper}`;
      } else {
        // Otherwise, use the '+'
        waveHeightRange = `${lower}-${upper}+`;
      }
    }

    return waveHeightRange;
  });

  return waveHeights;
};


const RatingCalcs = {
  logWindDirections,
  logWindDirection,
  windDirections,
  swellDirections,
  calculateWaveHeight,
};

export default RatingCalcs;
