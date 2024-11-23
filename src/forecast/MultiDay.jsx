import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GraphContainer } from './GraphContainer.jsx';
import { ForecastSingle } from "./ForecastSingle.jsx";
import './Multiday.css';
import RatingCalcs from '/src/calcs/RatingCalcs.jsx';


export function MultiDay() {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [locationName, setLocationName] = useState('');
  const [locations, setLocations] = useState([]);
  const [swellHeights, setSwellHeights] = useState([]);
  const [waveFactor, setWaveFactor] = useState([]);
  const [calculatedWaveHeights, setCalculatedWaveHeights] = useState([]);
  const [waveHeightGroup, setWaveHeightGroup] = useState([]);
  const [sunTimes, setSunTimes] = useState([]);
  const [tideData, setTideData] = useState([]); // New state for tide data


  

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const graphWidth = windowWidth * 0.8;
  const graphHeight = graphWidth / 1;

  // Fetch locations data
  useEffect(() => {
    fetch('http://127.0.0.1:5000/locations') 
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        console.log('Fetched locations:', data);
        setLocations(data);
      })
      .catch((error) => {
        console.error('Error fetching locations:', error);
      });
  }, []);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/locations/${locationId}`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        console.log('Fetched location name:', data);
        setLocationName(data.location_name);
        setWaveFactor(data.wavecalc);
  
        // Log all swell-related values together
        const swellRange = {
          bad_swell_dir_max: data.bad_swell_dir_max,
          bad_swell_dir_min: data.bad_swell_dir_min,
          preferred_swell_dir_min: data.preferred_swell_dir_min,
          preferred_swell_dir_max: data.preferred_swell_dir_max,
        };
        console.log('Swell Range:', swellRange);
  
        // Optionally, log wind directions using RatingCalcs
        RatingCalcs.logWindDirections(data);
      })
      .catch((error) => {
        console.error('Error fetching location name:', error);
      });
  }, [locationId]);
  
  useEffect(() => {
    if (swellHeights.length > 0 && waveFactor) {
      const waveHeights = RatingCalcs.calculateWaveHeight(swellHeights, waveFactor);
      console.log('Calculated Wave Heights:', waveHeights);
      setCalculatedWaveHeights(waveHeights);
    }
  }, [swellHeights, waveFactor]);
  

  useEffect(() => {
    if (!locationId) return;
  
    Promise.all([
      fetch(`http://127.0.0.1:5000/surf/${locationId}`).then((res) => res.json()),
      fetch(`http://127.0.0.1:5000/locations/${locationId}`).then((res) => res.json()),
    ])
      .then(([surfData, locationData]) => {
        console.log('Fetched surf data:', surfData);
        console.log('Fetched location data:', locationData);
  
        setSwellHeights(surfData.map((data) => data.swellHeight_ft));
        setWaveFactor(locationData.wavecalc);
  
        const windDirectionMatches = RatingCalcs.windDirections(surfData, locationData);
        const swellDirectionMatches = RatingCalcs.swellDirections(surfData, locationData);
  
        const enrichedSurfData = surfData.map((data, index) => ({
          ...data,
          windDirectionMatch: windDirectionMatches[index],
          swellDirectionMatch: swellDirectionMatches[index],
        }));
  
        const chunkedData = [
          enrichedSurfData.slice(0, 7),
          enrichedSurfData.slice(7, 14),
          enrichedSurfData.slice(14, 21),
        ];
        setData(chunkedData);
        setIsLoading(false);
        
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, [locationId]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/graph-points/${locationId}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const json = await response.json();
        console.log('Fetched graph data:', json);

        const startEntry = json.find((item) => item.graph_time === '00:00');
        const startId = startEntry ? startEntry.id : null;

        const filteredData = startId ? json.filter((item) => item.id >= startId) : json;
        const graphDataChunks = [];
        let currentChunk = [];

        filteredData.forEach((item) => {
          if (item.graph_time === '00:00' && currentChunk.length > 0) {
            graphDataChunks.push(currentChunk);
            currentChunk = [];
          }
          currentChunk.push(item);
        });

        if (currentChunk.length > 0) {
          graphDataChunks.push(currentChunk);
        }

        const filteredGraphDataChunks = graphDataChunks.map((chunk) =>
          chunk.filter((item) => item.graph_time.slice(3) === '00')
        );

        setGraphData(filteredGraphDataChunks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching graph data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [locationId]);

  const handleMouseEnter = (event, dataPoint) => {
    if (!dataPoint) return;
    setTooltip({
      visible: true,
      content: `Time: ${dataPoint.graph_time} - Tide Height: ${dataPoint.tide_height}`,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const currentIndex = locations.findIndex((loc) => loc.id === parseInt(locationId));
  const leftLocation = locations[currentIndex - 1];
  const rightLocation = locations[currentIndex + 1];

  const handleLocationChange = (newLocationId) => {
    const container = document.querySelector('.multiday-container');
    container.classList.add('transitioning');

    setTimeout(() => {
      navigate(`/results/${newLocationId}`);
      container.classList.remove('transitioning');
    }, 600);
  };

  useEffect(() => {
    if (calculatedWaveHeights.length > 0) {
      const groupedWaveHeights = [
        calculatedWaveHeights.slice(0, 7),    // First day
        calculatedWaveHeights.slice(7, 14),  // Second day
        calculatedWaveHeights.slice(14, 21), // Third day
      ];
      setWaveHeightGroup(groupedWaveHeights); // Update state
      console.log('WaveHeightGroup:', groupedWaveHeights);
    }
  }, [calculatedWaveHeights]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Flatten the array if it contains nested arrays
      const flatData = data.flat();
      console.log("Flat Data:", flatData);
  
      // Filter every 7th entry
      const filteredData = flatData.filter((_, index) => index % 7 === 0);
      console.log("Filtered Data:", filteredData);
  
      // Map sunrise and sunset times and convert to 12-hour format
      const mappedSunTimes = filteredData.map((entry) => {
        const formatTime = (time) => {
          // Split the time into hour and minute
          let [hour, minute] = time.split(':');
          hour = parseInt(hour); // Convert to integer to remove leading zero if present
          
          // Determine AM or PM
          const suffix = hour >= 12 ? 'PM' : 'AM';
          
          // Convert to 12-hour format
          if (hour > 12) hour -= 12;
          if (hour === 0) hour = 12; // Handle midnight as 12 AM
          
          // Return formatted time
          return `${hour}:${minute} ${suffix}`;
        };
  
        return {
          sunrise: formatTime(entry.sunrise),
          sunset: formatTime(entry.sunset),
        };
      });
      setSunTimes(mappedSunTimes);
      console.log("Mapped Sun Times:", mappedSunTimes);
    }
  }, [data]);

  useEffect(() => {
    if (!locationId) return;
  
    fetch(`http://127.0.0.1:5000/tide-data/${locationId}`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        console.log('Tide Heights:', data);
        setTideData(data); // Separate state for tide data
      })
      .catch((error) => {
        console.error('Error fetching tide data:', error);
      });
  }, [locationId]);
  

  return (
    <div className="multiday-container bg-black mb-10">
      <div className="location-names grid grid-cols-3 justify-items-stretch mt-14">
        {leftLocation ? (
          <button
            onClick={() => handleLocationChange(leftLocation.id)}
            className="text-left justify-self-start text-gray-600 uppercase ml-5"
          >
            {leftLocation.location_name}-
          </button>
        ) : (
          <div className="w-1/4"></div>
        )}
        {locationName && (
          <h1 className="locationName justify-self-center w-max text-gray-300 uppercase">
            - {locationName} -
          </h1>
        )}
        {rightLocation ? (
          <button
            onClick={() => handleLocationChange(rightLocation.id)}
            className="text-right justify-self-end text-gray-600 uppercase mr-5"
          >
            -{rightLocation.location_name}
          </button>
        ) : (
          <div className="w-1/4"></div>
        )}
      </div>
      {isLoading ? (
        <p>Loading data...</p>
      ) : (
        <div className="graph-wrapper relative">
          {graphData.map((dayData, index) => (
            <div key={index}>
              <div className="graph-container relative">
                <GraphContainer
                  width={graphWidth}
                  height={graphHeight}
                  graphData={dayData}
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                />
                {sunTimes[index] && (
                  <div className="sun-times relative bottom-5 z- grid grid-cols-2 justify-items-stretch">
                    <div className='text-yellow-300 font-light text-xs grid justify-items-start ml-20'>{sunTimes[index].sunrise}</div>
                    <div className='text-orange-500 font-light text-xs grid justify-items-end mr-20'>{sunTimes[index].sunset}</div>
                  </div>
                )}
              </div>
              <div className="forecast-container flex justify-center mt-0 overflow-x-auto space-x-1">
              {data[index]?.map((forecast, idx) => (
                <div
                  key={idx}
                  className={`${idx !== 21 ? 'border-r border-gray-700' : ''}`}
                  style={{
                    width: `${windowWidth / 8}px`,
                  }}
                >
                  
                  <ForecastSingle
                    key={forecast.id}
                    {...forecast}
                    windDirectionMatch={forecast.windDirectionMatch}
                    waveHeight={waveHeightGroup[index]?.[idx]}
                  />
                </div>
              ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {tooltip.visible && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x + 10,
            top: tooltip.y + 10,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '5px',
            borderRadius: '4px',
            pointerEvents: 'none',
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}
