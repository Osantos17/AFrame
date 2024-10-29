import { useEffect, useState } from 'react';

export const ForecastResult = () => {
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

    return (
        <div>
            {data.map(location => (
                <div key={location.location_id}>
                    <h2>{location.location_name}</h2>
                    <h3>Surf Data</h3>
                    {location.surf_data.map(surf => (
                        <div key={surf.id}>
                            <p>Dagte: {surf.date} ({surf.date})</p>
                            <p>Swell Direction: {surf.swellDir} ({surf.swellDir16Point})</p>
                            <p>Swell Height: {surf.swellHeight_ft} ft</p>
                            <p>Time: {surf.time}</p>
                            <p>Wind Direction: {surf.winddirDegree}° ({surf.winddir16point})</p>
                            <p>Wind Speed: {surf.windspeedMiles} mph</p>
                        </div>
                    ))}
                    <h3>Tide Data</h3>
                    {location.tide_data.map(tide => (
                        <div key={tide.id}>
                            <p>Tide Height: {tide.tide_height} ft</p>
                            <p>Tide Time: {tide.tide_time}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
