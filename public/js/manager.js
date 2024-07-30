function onAddTicket() {
    $(location).attr('href', '/tickets/edit');
}

function onAddNews() {
    $(location).attr('href', '/about/edit');
}

function onAddProduct() {
    $(location).attr('href', '/products/edit');
}

function onAddFacebookPost() {
    $(location).attr('href', '/manager/edit-facebook');
}

function onEditAbout() {
    $(location).attr('href', '/about/edit-shops');
}

function onGetClientsPage() {
    $(location).attr('href', '/clients');
}

async function getStats() {
    try {
        const ordersCount = await $.ajax({
            url: '/manager/getStats',
            method: 'GET',
            contentType: 'application/json',
        })
        return ordersCount

    } catch (error) {
        console.error('Error:', error)
    }
}

// Create the graphs
updateGraphs()

// timeOutFunctionId stores a numeric ID which is  
// used by clearTimeOut to reset timer 
var timeOutFunctionId

// With every viewport change, create the graphs again
window.addEventListener("resize", function () {
    
    // Resize is triggered continuously while we are resizing the window 
    // clearTimeOut() resets the setTimeOut() timer 
    // so that the function will be fired after we are done resizing 
    clearTimeout(timeOutFunctionId);
    
    // setTimeout returns the numeric ID which is used by 
    // clearTimeOut to reset the timer 
    timeOutFunctionId = setTimeout(updateGraphs, 500);
})

async function updateGraphs() {
    // Create a new graph after every viewport resize
    $('#chart').empty()
    $('#graph').empty()

    // Update the vh and vw after every viewport resize
    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    //////////////////// LINE GRAPH ///////////////////////////
    var dataFromDB = await getStats()
    var clientsData = dataFromDB.clientStats
    var data = clientsData.map(datapoint => {
        const newDataPoint = { year: datapoint._id.year, count: datapoint.count }
        return newDataPoint
    })

    // Create SVG and padding for the graph
    const padding = { top: 30, bottom: 20, left: 30, right: 20 }
    const svg = d3
        .select("#graph")
        // Add an SVG element
        .append("svg")
        // Give the SVG element height and width
        .attr("height", (vh - padding.top - padding.bottom) / 2)
        .attr("width", vw * (6 / 9) - padding.left - padding.right)

    // Add an SVG group (g tag) to act as a container for the graph
    const graph = svg
        .append("g")
        // Move the container right, so the y-axis will have space (it will start from here and go left)
        .attr("transform", `translate(${padding.left},${padding.top})`)

    // Save width and height vars for the scales (leaving out the padding area for the numbers to be shown)
    const width = +svg.attr("width") - padding.left - padding.right
    const height = +svg.attr("height") - padding.top - padding.bottom

    // Create a g tag to act as a path container
    const pathConatiner = graph.append("g")
    // Add empty SVG groups for the scales (x-axis and y-axis)
    graph.append("g").attr("class", "x-axis")
    graph.append("g").attr("class", "y-axis")

    // Create an empty path
    pathConatiner
        .append("path")
        // .attr("transform", `translate(${padding.left},0)`)
        .attr("fill", "none")
        // Add a color to the path
        .attr("stroke", "steelblue")
        // stroke-linejoin sets the shape of the corners where two lines meet
        .attr("stroke-linejoin", "round")
        // stroke-linecap sets the shape of the end-lines for a line or open path
        .attr("stroke-linecap", "round")
        // Give the path the following width
        .attr("stroke-width", 1.5)


    // Make the graph visible using the data saved up until now, 
    // and using the following funcs (below)
    updategraph(data)

    function updategraph(data) {
        // Save data of scales
        const { yScale, xScale } = updateScales(data)
        // Shoe scale data on axes
        updateAxes(data, graph, xScale, yScale)
        // Save data of line
        const line = createLine(xScale, yScale)
        // Show the line
        updatePath(data, line)
    }

    function updateScales(data) {
        // Create scales
        const yScale = d3
            // Create a scale for the y-axis to map dataPoint values to pixel heights 
            .scaleLinear()
            // rang sets the scale's range to the specified array of values ( in y-axis: [end, start])
            .range([height, 0])
            // Domain defines the range of values that the scale will accept (in our case: from zero until max point)
            // Max returns the maximum value out of values
            .domain([0, d3.max(data, dataPoint => dataPoint.count)])
        const xScale = d3
            // Create a scale for the x-axis to map dataPoint values to pixel heights 
            .scaleLinear()
            // rang sets the scale's range to the specified array of values ( in x-axis: [start, end])
            .range([0, width])
            // Domain defines the range of values that the scale will accept (in our case: from zero until max point)
            // extent() is used to return the min and max value in an array from the given array
            .domain(d3.extent(data, dataPoint => dataPoint.year))
        return { yScale, xScale }
    }

    function updateAxes(data, graph, xScale, yScale) {
        graph
            .select(".x-axis")
            // Move x-axis to bottom (because in d3 the direction is from top left corner)
            .attr("transform", `translate(0,${height})`)
            // Generate the x-axis with ticks (using the values from xScale and the amount of dataPoints)
            .call(d3.axisBottom(xScale).ticks(data.length).tickFormat(d3.format("d"))) // tickFormat(d3.format("d") - removes comma delimiters for thousands

        graph
            .select(".y-axis")
            // Generate the y-axis with ticks (using the values from yScale and the amount of dataPoints)
            .call(d3.axisLeft(yScale))
    }

    function createLine(xScale, yScale) {
        return line = d3
            // constructs a new line generator with the default settings
            .line()
            // Sets x vals according to data 
            .x(dataPoint => xScale(dataPoint.year))
            // Sets y vals according to data 
            .y(dataPoint => yScale(dataPoint.count))
    }

    function updatePath(data, line) {
        d3.select("path")
            // creates one large svg element with the data instead of multiple elements
            .datum(data)
            // defines a path to be drawn
            .attr("d", line)
    }

    //////////////////// BAR GRAPH ///////////////////////////

    // The Data that we wish to display on our graph, an array of Javascript Objects

    var productsData = dataFromDB.productStats
    var data = productsData.map(datapoint => {
        const newDataPoint = { name: datapoint._id, value: datapoint.count }
        return newDataPoint
    })
    // var data = [{
    //     'name': "Bar Charts", 'value': 7
    // }, {
    //     'name': "Pie Charts", 'value': 19
    // }, {
    //     'name': "Scatterplots", 'value': 12
    // }, {
    //     'name': "Timelines", 'value': 14
    // }, {
    //     'name': "Node Graphs", 'value': 23
    // }, {
    //     'name': "Tree Graphs", 'value': 8
    // }, {
    //     'name': "Stream Graphs", 'value': 11
    // }, {
    //     'name': "Voronoi Diagrams", 'value': 14
    // }]

    // Set the dimensions of the bars in the bar chart  
    let barsHeight = vh / 2,
        barsWidth = vw * (1 / 3)

    // Set the dimensions of the bar chart and the margin around it for the bands (תגיות) to be seen  
    let axisMargin = 100,
        chartHeight = vh / 2 + axisMargin,
        chartWidth = vw * (1 / 3) + axisMargin


    // Select the chart bar element and set the width and height attributes of the chart SVG 
    let chart = d3.select('#chart')
        .attr('width', chartWidth + 100)
        .attr('height', chartHeight)

    // Create a scale for the y-axis to map dataPoint values to pixel heights of the bars
    let yScale = d3.scaleLinear()
        // Domain defines the range of values that the scale will accept (in our case: from zero until max point)
        // Max returns the maximum value out of values from data array
        .domain([0, d3.max(data, dataPoint => dataPoint.value)])
        // rangRound sets the scale's range to the specified array of values ( in y-axis: [end, start]), and setting round (the numbers) to true
        .rangeRound([barsHeight, 0])

    // Create a scale for the x-axis that returns the bands (תגיות) and their places 
    let xScale = d3.scaleBand()
        // Domain defines the range of values that the scale will accept (in our case: the name of each dataPoint)
        .domain(
            // For each dataPointatapoint in our data array return the name 
            data.map(dataPoint => dataPoint.name)
        )
        // rangRound sets the scale's range to the specified array of values (in x-axis: [start, end])
        .rangeRound([0, barsWidth])
        // Adds padding between each band (תגית)
        .padding(0.1)


    // Create an SVG group to which we will add the bar elements 
    var bars = chart.append('g')
        // Give the g tag the id: "bars-container"
        .attr('id', "bars-container")

    // Bind the data to our .bars svg elements
    // Create a rectangle for each data point and set position and dimensions using scales
    bars.selectAll('.bar')
        // enter() creates the initial join of data to elements, 
        // creating one rect element for every dataPoint in the array
        .data(data).enter().append("rect")
        // Give each bar a class bar
        .attr('class', "bar")
        // Start the x poistion of each bar at the x-axis value (the start of the band)
        .attr('x', d => xScale(d.name))
        // Start the y poistion of each bar at the y-axis value which is the opposite value than what we expect 
        // because with D3 we are working from the top left corner, meaning the values start at top and end at the bottom)
        .attr('y', d => yScale(d.value))
        // Give each bar the width of the band (תגית) 
        .attr('width', xScale.bandwidth())
        // Give each bar a height (position starts at value given, 
        // then we add the tallest bar height which makes the bar seem below the x-axis,
        // and then we remove the y-axis value, which is the opposite value than what we expect 
        // because with D3 we are working from the top left corner, meaning the values start at top and end at the bottom)
        .attr('height', dataPoint => barsHeight - yScale(dataPoint.value))

    // Move the bars right, so that there is space on the left for the y-axis scale
    bars.attr('transform', 'translate(' + axisMargin + ',0)')

    // Create a new SVG group for the y-axis elements
    yAxis = chart.append('g')
        .attr('id', 'y-axis')
        // Generate the y-axis with 10 ticks (using the values from yScale)
        .call(d3.axisLeft(yScale).ticks(10))
        // Move the y-axis into position (left from the bars container)
        .attr('transform', 'translate(' + axisMargin + ',0)')

    // Create another group for the x-axis elements
    xAxis = chart.append('g')
        .attr('id', 'x-axis')
        // Generate the x-axis using the values from the xScale 
        .call(d3.axisBottom(xScale))
        // Move the x-axis into position (from top of graph add highest bar val that will get us down 
        // and add the margin to go lower. This will be the position where the text of the scale will end)
        .attr('transform', 'translate(' + axisMargin + ',' + barsHeight + ')')
        // Select the text elements 
        .selectAll("text")
        // Rotate by 45 degrees (from position of the start of the text)
        .style("text-anchor", 'start')
        .attr('transform', 'rotate(45)')

}


























