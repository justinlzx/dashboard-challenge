import { Chart } from "react-google-charts";

function Diagram({ title, data, type, columns, width, height, options}) {

    // Create a new array with columns as the first element and data as the rest
    let chartData = [columns, ...data];

    console.log(chartData)
    return (
        <>
            <div className="border rounded-2 shadow-sm mb-2 p-0">
            <h3 className="text-center mt-2">{title}</h3>

            <div className="mb-2">
                <Chart 
                    chartType={ type }
                    data={ chartData }
                    width={ width }
                    height={ height }
                    options={ options }
                    
                    // legendToggle
                />
            </div>

            </div>
           
        </>
    );
}

export default Diagram;