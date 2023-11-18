import { Chart } from "react-google-charts";

function Diagram({ title, data, type, columns, width, height, options}) {

    // Create a new array with columns as the first element and data as the rest
    let chartData = [columns, ...data];

    console.log(chartData)
    return (
        <>
            <div className="card">
            <h3>{title}</h3>

                <Chart
                    chartType={ type }
                    data={ chartData }
                    width={ width }
                    height={ height }
                    options={options}
                    legendToggle
                />
            </div>
           
        </>
    );
}

export default Diagram;