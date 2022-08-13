import React from 'react';
import ReactDOM from "react-dom";

// Include the react-fusioncharts component
import ReactFC from "react-fusioncharts";

// Include the fusioncharts library
import FusionCharts from "fusioncharts";

// Include the chart type
import Chart from "fusioncharts/fusioncharts.charts";

// Include the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Chart, FusionTheme);

const chartCommponent = ({data}) => {
   const chartConfigs = {
     type: "Pie3D", // The chart type
     width: "100%", // Width of the chart
     height: "400", // Height of the chart
     dataFormat: "json", // Data type
     dataSource: {
       // Chart Configuration
       chart: {
         caption: "languages",
         theme: "fusion",
         decimals: 0,
         pieRadius: "45%"
       },
       // Chart Data
       data,
     },
   };
  return <ReactFC {...chartConfigs} />;
};

export default chartCommponent;
