import { useEffect, useState } from 'react';

export function SurfReport({ selectedLocationId }) {
    console.log('SurfReport received selectedLocationId:', selectedLocationId); // Log received ID
    const [data, setData] = useState([]);
  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/locations/combined-data');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
  
        fetchData();
    }, []);
  
    const selectedLocation = data.find(location => location.location_id === selectedLocationId);

    // Get today's date in the required format
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Helper function to validate date strings
    const isValidDate = (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    };

    // Helper function to create a full datetime string for tide data validation
    const getFullDateTime = (timeString) => {
        return `${today}T${timeString}`; // Combine today's date with the time string
    };

    // Filter surf and tide data for today's date
    const todaySurfData = selectedLocation?.surf_data.filter(surf => {
        if (!isValidDate(surf.time)) {
            console.warn('Invalid surf time:', surf.time); // Log invalid time
            return false;
        }
        const surfDate = new Date(surf.time).toISOString().split('T')[0];
        return surfDate === today;
    });

    const todayTideData = selectedLocation?.tide_data.filter(tide => {
        const tideDateTime = getFullDateTime(tide.tide_time);
        if (!isValidDate(tideDateTime)) {
            console.warn('Invalid tide time:', tide.tide_time); // Log invalid time
            return false;
        }
        const tideDate = new Date(tideDateTime).toISOString().split('T')[0];
        return tideDate === today;
    });

    return (
        <div>
            {selectedLocation ? (
                <div key={selectedLocation.location_id}>
                    <h2>{selectedLocation.location_name}</h2>
                    <h3>Surf Data</h3>
                    {todaySurfData.length > 0 ? (
                        todaySurfData.map(surf => (
                            <div key={surf.id}>
                                <p>Date: {new Date(surf.time).toLocaleString()}</p>
                                <p>Swell Direction: {surf.swellDir} ({surf.swellDir16Point})</p>
                                <p>Swell Height: {surf.swellHeight_ft} ft</p>
                                <p>Time: {surf.time}</p>
                                <p>Wind Direction: {surf.winddirDegree}° ({surf.winddir16point})</p>
                                <p>Wind Speed: {surf.windspeedMiles} mph</p>
                            </div>
                        ))
                    ) : (
                        <p>No surf data available for today.</p>
                    )}
                    <h3>Tide Data</h3>
                    {todayTideData.length > 0 ? (
                        todayTideData.map(tide => (
                            <div key={tide.id}>
                                <p>Tide Height: {tide.tide_height} ft</p>
                                <p>Tide Time: {tide.tide_time}</p>
                            </div>
                        ))
                    ) : (
                        <p>No tide data available for today.</p>
                    )}
                </div>
            ) : (
                <p>Select a location on the map to view surf data</p>
            )}
        </div>
    );
}
