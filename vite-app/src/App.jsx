import { useState, useEffect } from 'react';
import Diagram from './components/Diagram.jsx';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getData();
        setData(response);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <h1>Weather Dashboard</h1>
      {data && (
        <>
          <div className="row">
            <Diagram
              title='Min & Max Temperature'
              type="LineChart"
              data={data.temperature}
              width="100%"
              height="400px"
              columns={['Date', 'Min. Temperature', 'Max. Temperature' ]}
              options = {{
                hAxis: { title: "Date", titleTextStyle: { color: "#333" } },
                vAxis: { title: 'Temperature/C', minValue: 0 },
                curveType: "function",
                legend: { position: "bottom" },
              }}
            />
          </div>
          <div className="row">
              <div className="col">
                <Diagram
                  title='Relative Humidity'
                  type="ColumnChart"
                  width="50%"
                  height="400px"
                  data={data.humidity}
                  columns={['Date', 'Min. Temperature', 'Max. Temperature' ]}
                />
              </div>

              <div className="col">
                <Diagram
                  title='Direct Radiation'
                  type="AreaChart"
                  width="50%"
                  height="400px"
                  data={data.radiation}
                  columns={['Date', 'Min. Temperature', 'Max. Temperature' ]}
                />
              </div>
          </div>

         

         

          
        </>
      ) 
        
      }
    </>
  );
}

export default App;

async function getData() {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=1.29&longitude=103.85&hourly=relativehumidity_2m,direct_radiation&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FSingapore&start_date=2023-10-01&end_date=2023-10-10';
  const response = await axios.get(url);

  const processedData = processWeatherData(response.data);
  return processedData;
}

function processWeatherData(data) {
  const dates = data.daily.time;
  const temperature = processTemperature(data.daily.temperature_2m_min, data.daily.temperature_2m_max, dates);
  const humidity = processValues(data.hourly.relativehumidity_2m, dates);
  const radiation = processValues(data.hourly.direct_radiation, dates);

  return {
    temperature,
    humidity,
    radiation
  };
}

function processTemperature(minTemperatures, maxTemperatures, dates) {
  return dates.map((date, index) => [
    date,
    minTemperatures[index],
    maxTemperatures[index]
  ]);
}

function processValues(hourlyValues, dates) {
  const dailyAverages = calculateDailyAverages(hourlyValues);

  return dailyAverages.map((average, index) => [dates[index], Number.parseFloat(average.toFixed(2)),  0]);
}

function calculateDailyAverages(hourlyValues) {
  const dailyAverages = [];
  for (let i = 0; i < hourlyValues.length; i += 24) {
    const dailyValues = hourlyValues.slice(i, i + 24);
    const dailyAverage = dailyValues.reduce((sum, value) => sum + value, 0) / dailyValues.length;
    dailyAverages.push(dailyAverage);
  }
  return dailyAverages;
}
