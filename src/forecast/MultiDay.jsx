import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GraphContainer } from './GraphContainer.jsx';
import { ForecastSingle } from "./ForecastSingle.jsx";
import './Multiday.css';

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
        console.log('Fetched locations:', data);  // Log locations data
        setLocations(data);
      })
      .catch((error) => {
        console.error('Error fetching locations:', error);
      });
  }, []);

  // Fetch location name
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/locations/${locationId}`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        console.log('Fetched location name:', data);  // Log location name
        setLocationName(data.location_name);
      })
      .catch((error) => {
        console.error('Error fetching location name:', error);
      });
  }, [locationId]);

  // Fetch surf data
  useEffect(() => {
    setIsLoading(true);
    fetch(`http://127.0.0.1:5000/surf/${locationId}`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        console.log('Fetched surf data:', data);  // Log surf data
        const day1 = data.slice(0, 7);
        const day2 = data.slice(7, 14);
        const day3 = data.slice(14, 21);

        setData([day1, day2, day3]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setIsLoading(false);
      });
  }, [locationId]);

  // Fetch graph data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/graph-points/${locationId}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const json = await response.json();
        console.log('Fetched graph data:', json);  // Log graph data
        
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

  // Tooltip Handlers
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

  // Find neighboring locations
  const currentIndex = locations.findIndex((loc) => loc.id === parseInt(locationId));
  const leftLocation = locations[currentIndex - 1];
  const rightLocation = locations[currentIndex + 1];

  // Handle location change
  const handleLocationChange = (newLocationId) => {
    // Add the transitioning class to the container to trigger fade effect
    const container = document.querySelector('.multiday-container');
    container.classList.add('transitioning');
  
    // Wait for the transition to finish, then navigate
    setTimeout(() => {
      navigate(`/results/${newLocationId}`);
      
      // After navigating, remove the transitioning class to reset state
      container.classList.remove('transitioning');
    }, 500); // Wait for the fade effect duration (500ms in this case)
  };

  return (
    <div className="multiday-container bg-black mb-10">
      <div className="location-names grid grid-cols-3 justify-items-stretch mt-8">
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
            -{locationName}-
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
        <div className="graph-wrapper">
          {graphData.map((dayData, index) => (
            <div key={index}>
              <div className="graph-container">
                <GraphContainer
                  width={graphWidth}
                  height={graphHeight}
                  graphData={dayData}
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                />
              </div>
              <div className="forecast-container flex justify-center mt-5 overflow-x-auto space-x-1">
                {data[index]?.map((forecast, idx) => (
                  <div
                    key={idx}
                    className={`${idx !== 6 ? 'border-r border-gray-700' : ''}`}
                    style={{
                      width: `${windowWidth / 8}px`,
                    }}
                  >
                    <ForecastSingle {...forecast} />
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
