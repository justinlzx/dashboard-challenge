import { useState, useEffect } from 'react';
import Diagram from './components/Diagram.jsx';
import Header from './components/Header.jsx';
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
      {data && (
        <>
            <div className="row">
              <div className="col-6"></div>
                            <div className="col-6"></div>

            </div>
            <div className="container-fluid">
              
              <div className="row mt-3" id='header'>
                <Header text='Weather Report' />
              </div>

              <div className="row mb-1" id="temperature">
                <Diagram
                  title='Min & Max Temperature / Day'
                  type="LineChart"
                  data={data.temperature}
                  width="100%"
                  height="400px"
                  columns={['Date', 'Min. Temperature', 'Max. Temperature' ]}
                  options = {{
                    hAxis: { title: "Date", 
                              titleTextStyle: { color: "#333" },
                            },
                    vAxis: { 
                              title: 'Temperature/C', 
                              minValue: 0,
                              gridlines: {color: '#7a7b7d'}
                            },
                    curveType: "function",
                    legend: { position: "top", alignment: "center" },
                    backgroundColor: "#e0f1fa",
                    colors:['#22a828', 'blue']

                  }}
                />
              </div>


            </div>

            <div className="row justify-content-center gx-2">
                  <div className="col-md-6 col-sm-12" id="humidity">
                    <Diagram
                      title='Average Relative Humidity / Day'
                      type="ColumnChart"
                      width="100%"
                      height="400px"
                      data={data.humidity}
                      columns={['Date', 'Average Relative Humidity' ]}
                      options = {{
                        hAxis: { title: "Date", titleTextStyle: { color: "#333" } },
                        vAxis: { title: 'Relative Humidity/%', minValue: 0 },
                        curveType: "function",
                        legend: {position: 'top'},
                        backgroundColor: "#d9d1f8",
                        colors:['#6845e6']

                      }}
                      
                    />
                  </div>

                  <div className="col-md-6 col-sm-12" id="radiation">
                    <Diagram
                      title='Average Direct Radiation / Day'
                      type="AreaChart"
                      width="100%"
                      height="400px"
                      data={data.radiation}
                      columns={['Date', 'Min. Temperature' ]}
                      options = {{
                        hAxis: { title: "Date", titleTextStyle: { color: "#333" } },
                        vAxis: { title: 'Radiation/W/m²', minValue: 0 },
                        curveType: "function",
                        legend: {position: 'top'},
                        backgroundColor: "#cad5fc",
                        colors:['#0011ff']
                      }}
                    
                    />
                  </div>
              </div>
          {/* </div> */}
        </>
      )}
    </>
  );
}

export default App;

async function getData() {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=1.29&longitude=103.85&hourly=relativehumidity_2m,direct_radiation&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FSingapore&start_date=2023-10-01&end_date=2023-10-10';
  const response = await axios.get(url);

  console.log(response.data)

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

  return dailyAverages.map((average, index) => [dates[index], Number.parseFloat(average.toFixed(2))]);
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
