// window.onload = function () {
//     var chart = new CanvasJS.chart("chartContainer", {
//         animationEnabled: true,
//         zoomEnabled: true,
//         theme: "dark2",
//         title: {
//             text: "Business Growth From 2000 to 2017"
//         },
//         axisX: {
//             title: "Year",
//             valueFormatString: "####",
//             interval: 2
//         },
//         axisY: {
//             logarithmic: true, //change it to false
//             title: "Profit in USD (Log)",
//             prefix: "$",
//             titleFontColor: "#6D78AD",
//             lineColor: "#6D78AD",
//             gridThickness: 0,
//             lineThickness: 1,
//             labelFormatter: addSymbols
//         },
//         axisY2: {
//             title: "Profit in USD",
//             prefix: "$",
//             titleFontColor: "#51CDA0",
//             logarithmic: false, //change it to true
//             lineColor: "#51CDA0",
//             gridThickness: 0,
//             lineThickness: 1,
//             labelFormatter: addSymbols
//         },
//         legend: {
//             verticalAlign: "top",
//             fontSize: 16,
//             dockInsidePlotArea: true
//         },
//         data: [{
//             type: "line",
//             xValueFormatString: "####",
//             yValueFormatString: "$#,##0.##",
//             showInLegend: true,
//             name: "Log Scale",
//             dataPoints: [
//                 { x: 2001, y: 8000 },
//                 { x: 2002, y: 20000 },
//                 { x: 2003, y: 40000 },
//                 { x: 2004, y: 60000 },
//                 { x: 2005, y: 90000 },
//                 { x: 2006, y: 140000 },
//                 { x: 2007, y: 200000 },
//                 { x: 2008, y: 400000 },
//                 { x: 2009, y: 600000 },
//                 { x: 2010, y: 800000 },
//                 { x: 2011, y: 900000 },
//                 { x: 2012, y: 1400000 },
//                 { x: 2013, y: 2000000 },
//                 { x: 2014, y: 4000000 },
//                 { x: 2015, y: 6000000 },
//                 { x: 2016, y: 8000000 },
//                 { x: 2017, y: 9000000 }
//             ]
//         },
//         {
//             type: "line",
//             xValueFormatString: "####",
//             yValueFormatString: "$#,##0.##",
//             axisYType: "secondary",
//             showInLegend: true,
//             name: "Linear Scale",
//             dataPoints: [
//                 { x: 2001, y: 8000 },
//                 { x: 2002, y: 20000 },
//                 { x: 2003, y: 40000 },
//                 { x: 2004, y: 60000 },
//                 { x: 2005, y: 90000 },
//                 { x: 2006, y: 140000 },
//                 { x: 2007, y: 200000 },
//                 { x: 2008, y: 400000 },
//                 { x: 2009, y: 600000 },
//                 { x: 2010, y: 800000 },
//                 { x: 2011, y: 900000 },
//                 { x: 2012, y: 1400000 },
//                 { x: 2013, y: 2000000 },
//                 { x: 2014, y: 4000000 },
//                 { x: 2015, y: 6000000 },
//                 { x: 2016, y: 8000000 },
//                 { x: 2017, y: 9000000 }
//             ]
//         }]
//     });
//     chart.render();

//     function addSymbols(e) {
//         var suffixes = ["", "K", "M", "B"];

//         var order = Math.max(Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)), 0);
//         if (order > suffixes.length - 1)
//             order = suffixes.length - 1;

//         var suffix = suffixes[order];
//         return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
//     }

//     var pie = new CanvasJS.Chart("pieContainer", {
//     // var options = {
//         title: {
//             text: "Desktop OS Market Share"
//         },
//         subtitles: [{
//             text: "As of November, 2017"
//         }],
//         theme: "light2",
//         animationEnabled: true,
//         data: [{
//             type: "pie",
//             startAngle: 40,
//             toolTipContent: "<b>{label}</b>: {y}%",
//             showInLegend: "true",
//             legendText: "{label}",
//             indexLabelFontSize: 16,
//             indexLabel: "{label} - {y}%",
//             dataPoints: [
//                 { y: 48.36, label: "Windows 7" },
//                 { y: 26.85, label: "Windows 10" },
//                 { y: 1.49, label: "Windows 8" },
//                 { y: 6.98, label: "Windows XP" },
//                 { y: 6.53, label: "Windows 8.1" },
//                 { y: 2.45, label: "Linux" },
//                 { y: 3.32, label: "Mac OS X 10.12" },
//                 { y: 4.03, label: "Others" }
//             ]
//         }]
//     })
//     // $("#pieContainer").CanvasJSChart(options);
//     pie.render();
// }

// The Data that we wish to display on our graph, an array of Javascript Objects
var data = [{
    'name':"Bar Charts",'value': 7
  },{
    'name':"Pie Charts",'value': 19
  },{
    'name':"Scatterplots",'value': 12
  },{
    'name':"Timelines",'value': 14
  },{
    'name':"Node Graphs", 'value': 23
  },{
    'name':"Tree Graphs",'value': 8
  },{
    'name':"Stream Graphs",'value': 11
  },{
    'name':"Voronoi Diagrams",'value': 14
  }];
  
  
  // Set the dimensions of our chart to be displayed 
  var barsWidth = 500,
      barsHeight = 400,
      axisMargin = 100;
  
  var chartHeight = barsHeight+axisMargin,
      chartWidth = barsWidth+axisMargin;
  
  
  // Select the chart element on the page so we can reference it in code
  // Also set the width and height attributes of the chart SVG 
  var chart = d3.select('#chart')
      .attr('width', chartWidth+100)
      .attr('height', chartHeight);
  
  // Create a linear scale for our y-axis to map datapoint values to pixel heights of bars
  var yScale = d3.scaleLinear()
      .domain([0,d3.max(data, function(d){
      // return the value property of each datapoint so the max function can compare
          return d.value;
      })])
      .rangeRound([barsHeight, 0]);
  
  // Create a scale that returns the bands each bar should be in along the x-axis
  let xScale = d3.scaleBand()
      .domain(
          data.map(
              function(d){
          // For each datapoint in our data array
          // Return the name property into our new domain array
                  return d.name;
              }
          )
      )
      .rangeRound([0,barsWidth])
      .padding(0.1);
  
  // Create an SVG group that we will add the individual bar elements of our chart to
  var bars = chart.append('g')
      .attr('id', "bars-container");
  
  // Bind the data to our .bars svg elements
  // Create a rectangle for each data point and set position and dimensions using scales
  bars.selectAll('.bar')
      .data(data)
      .enter().append("rect")
          .attr('class', "bar")
          .attr('x', function(d){
              return xScale(d.name);
          })
          .attr('y', function(d){
              return yScale(d.value); 
          })
          .attr('width', xScale.bandwidth())
          .attr('height', function(d){return barsHeight-yScale(d.value);});
  
  // Move the bars so that there is space on the left for the y-axis
  bars.attr('transform', 'translate('+axisMargin+',0)');
  
  // Create a new SVG group for the y-axis elements
  // Generate the y-axis with 10 ticks and move into position
  yAxis = chart.append('g')
      .attr('id','y-axis')
      .call(d3.axisLeft(yScale).ticks(10))
          .attr('transform', 'translate('+axisMargin+',0)');
  
  // Create another group for the x-axis elements
  // Generate the x-axis using the our x scale and move into positon
  // Select the text elements and rotate by 45 degrees
  xAxis = chart.append('g')
      .attr('id', 'x-axis')
      .call(d3.axisBottom(xScale))
      .attr('transform', 'translate('+axisMargin+','+barsHeight+')')
      .selectAll("text")
          .style("text-anchor",'start')
          .attr('transform', 'rotate(45)');
  
          
  







//           var width = 400;
// var height = 400;
// var radius = 200;
// // var colors = d3.schemeCategory20;
// var colors = d3.scaleOrdinal(d3.schemeCategory20c);

// var pieData = [
//   {
//     console:'PS4',
//     purchases: 2500
//   },
//   {
//     console:'XBox One',
//     purchases: 2100
//   },
//   {
//     console:'PS3',
//     purchases: 1800
//   },
//   {
//     console:'XBox 360',
//     purchases: 1900
//   },
//   {
//     console:'Wii',
//     purchases: 1300
//   }
// ]

// var pie = d3.pie()
//   .value(function(d){
//     return d.purchases;
//   })

// var arc = d3.arc()
//   .outerRadius(radius) 

// var chart = d3.select('#chart').append('svg')
//   .attr('width', width)
//   .attr('height', height)
//   .append('g')
//     .attr('transform', 'translate('+(width - radius)+','+(height - radius)+')')
//     .selectAll('path')
//     .data(pie(pieData))
//     .enter()
//     .append('g')
//       .attr('class', 'slice')

// var slices = d3.selectAll('g.slice')
//   .append('path')
//     .attr('fill', function(d, i){
//       return colors(i);
//     })
//     .attr('d', arc)

// var text = d3.selectAll('g.slice')
//   .append('text')
//   .text(function(d,i){
//     return d.data.console;
//   })
//   .attr('text-anchor', 'middle')
//   .attr('fill', 'white')
//   .attr('transform', function(d){
//     d.innerRadius = 0;
//     d.outerRadius = radius;
//     return 'translate('+arc.centroid(d)+')';
//   })



















// Fake data
var data = [
    {
      year: 2000,
      popularity: 50
    },
    {
      year: 2001,
      popularity: 150
    },
    {
      year: 2002,
      popularity: 200
    },
    {
      year: 2003,
      popularity: 130
    },
    {
      year: 2004,
      popularity: 240
    },
    {
      year: 2005,
      popularity: 380
    },
    {
      year: 2006,
      popularity: 420
    }
  ];
  
  // Create SVG and padding for the graph
  const svg = d3
    .select("#graph")
    .append("svg")
    .attr("height", 300)
    .attr("width", 600);
  const margin = { top: 0, bottom: 20, left: 30, right: 20 };
  const graph = svg.append("g").attr("transform", `translate(${margin.left},0)`);
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;
  const grp = graph
    .append("g")
    .attr("transform", `translate(-${margin.left},-${margin.top})`);
  
  // Add empty scales group for the scales to be attatched to on update 
  graph.append("g").attr("class", "x-axis");
  graph.append("g").attr("class", "y-axis");
  
  // Add empty path
  const path = grp
    .append("path")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5);
  
  function updateScales(data) {
    // Create scales
    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, dataPoint => dataPoint.popularity)]);
    const xScale = d3
      .scaleLinear()    
      .range([0, width])
      .domain(d3.extent(data, dataPoint => dataPoint.year));
    return { yScale, xScale };
  }
  
  function createLine(xScale, yScale) {
    return line = d3
    .line()
    .x(dataPoint => xScale(dataPoint.year))
    .y(dataPoint => yScale(dataPoint.popularity));
  }
  
  function updateAxes(data, graph, xScale, yScale) {
    graph
      .select(".x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(data.length));
    graph
      .select(".y-axis")
      .attr("transform", `translate(0, 0)`)
      .call(d3.axisLeft(yScale));
  }
  
  function updatePath(data, line) {
    const updatedPath = d3
      .select("path")
      .interrupt()
      .datum(data)
      .attr("d", line);
  
    const pathLength = updatedPath.node().getTotalLength();
    // D3 provides lots of transition options, have a play around here:
    // https://github.com/d3/d3-transition
    const transitionPath = d3
      .transition()
      .ease(d3.easeSin)
      .duration(2500);
    updatedPath
      .attr("stroke-dashoffset", pathLength)
      .attr("stroke-dasharray", pathLength)
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0);
  }
  
  function updategraph(data) {
      const { yScale, xScale } = updateScales(data);
      const line = createLine(xScale, yScale);
      updateAxes(data, graph, xScale, yScale);
      updatePath(data, line);
  }
  
  updategraph(data);
  // Update graph when button is clicked
  d3.select("button").on("click", () => {
    // Create new fake data
    const newData = data.map(row => {
      return { ...row, popularity: row.popularity * Math.random() };
    });
    updategraph(newData);
  });


























  