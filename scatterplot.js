// (i) Pan+Drag: Hold the curser on a circle to pan-drag
//               Both x-axis and y-axis are scaled automatically

// (ii) Zoom: Move your finger away on a circle to zoom in
//            Scroll backward (or move your finger in) on a mouse to zoom out
//            Both x-axis and y-axis are scaled automatically

// (iii) Tooltip: Appears next to the country
//                DOES NOT move automatically with pan+drag (Not supported)

//Define Margin
var margin = {left: 80, right: 5, top: 0, bottom: 50 }, 
    width = 1000 - margin.left -margin.right,
    height = 600 - margin.top - margin.bottom;

//Define Color
var colors = d3.scaleOrdinal(d3.schemePaired);


//Define SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Define Scales   
var xScale = d3.scaleLinear()
    .range([0, width]);

var yScale = d3.scaleLinear()
    .range([0, height]);
    
var xA = d3.axisBottom(xScale);
var yA = d3.axisLeft(yScale);

//parses input data into data array
function rowConverter(data, _, columns) {
    return {
        country : data.country,
        gdp : +data.gdp,
        pop: +data.population,
        epc: +data.ecc,
        ec: +data.ec
    }
}


d3.csv("scatterdata.csv", rowConverter).then(function(data) {  
    //set the domain from 0 to largest value to set axis
    xScale.domain([0, d3.max(data, function(d) { return d.gdp; })+2.5]);
    //same functionality as above but for the y-axis 
    yScale.domain([d3.max(data, function(d) { return d.epc; })+75, 0]);
   
    var tool = d3.select("#tooltip")
        .attr("draggable", "true");
    
    //Draw Scatterplot
     var scat = svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {return 12*Math.sqrt(d.ec)/Math.PI})
        .attr("cx", function(d) {return xScale(d.gdp);})
        .attr("cy", function(d) {return yScale(d.epc);})
        .style("fill", function (d) { return colors(d.country) })
        .on("mouseover", function(d) {
        //create (x,y) position to place tooltip
        var xpos = xScale(d.gdp);
        var ypos = yScale(d.epc)-30;
        svg.call(zoom);
        //Update the tooltip position and value 
            d3.select("#tooltip")
            .style("left", xpos + "px") 
            .style("top", ypos + "px")
            .select("#country").text(d.country);

            d3.select("#tooltip")
            .select("#population").text(d.pop);

            d3.select("#tooltip")
            .select("#gdp").text(d.gdp);

            d3.select("#tooltip")
            .select("#epc").text(d.epc);

            d3.select("#tooltip")
            .select("#total").text(d.ec);
            console.log(d);
        //Show the tooltip
            d3.select("#tooltip")
            .classed("hidden", false);
        })
        .on("mouseout", function() {
            //Hide the tooltip
            d3.select("#tooltip")
                .classed("hidden", true); 
        });
    
        
    //Draw Country Names Just Outside circle
    var lab = svg.selectAll(".text")
        .data(data)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp) + 12*Math.sqrt(d.ec)/Math.PI;})
        .attr("y", function(d) {return yScale(d.epc);})
        .style("fill", "black")
        .text(function (d) {return d.country; });
    
    
    //draw white rectangles under axes so that dots cannot be moved off grid
    svg.append("rect")
        .attr("x", -80)
        .attr("y", 0)
        .attr("width", 80)
        .attr("height", height)
        .attr("fill", "white");
    
    svg.append("rect")
        .attr("x", -80)
        .attr("y", height)
        .attr("width", width+80)
        .attr("height", 50)
        .attr("fill", "white");
 
    //draws x-axis
    var xAxis = svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xA);
    
    //label x axis
    svg.append("text")
        .attr("transform", "translate(0," + 10 + ")")
        .attr("x", width/2-80)
        .attr("y", height+15)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("GDP (in Trillion US Dollars) in 2010");

    //draws y-axis
    var yAxis = svg.append("g")
        .attr("class", "axis axis--y")
        .call(yA);
    
    //label y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height/2)-200)
        .attr("y", -50)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Energy Consumption per Capita (in Million BTUs per person)");
    
    //draw legend
    var h = 200;
    var w = 200;
    svg.append("rect")
        .attr("x", width-w-10)
        .attr("y", height-h-5)
        .attr("width", w)
        .attr("height", h)
        .style("opacity", .8)
        .attr("fill", "lightgrey");
    
    svg.append("circle")
        .attr("cx", width-w+(2/3*w)+10)
        .attr("cy", height-h+(2/3*h)-115)
        .attr("r", 12*Math.sqrt(1)/Math.PI)
        .style("opacity", 1)
        .style("fill", "white");
    svg.append("circle")
        .attr("cx", width-w+(2/3*w)+10)
        .attr("cy", height-h+(2/3*h)-85)
        .attr("r", 12*Math.sqrt(10)/Math.PI)
        .style("opacity", .85)
        .style("fill", "white");
    svg.append("circle")
        .attr("cx", width-w+(2/3*w)+10)
        .attr("cy", height-h+(2/3*h)-15)
        .attr("r", 12*Math.sqrt(100)/Math.PI)
        .style("opacity", .85)
        .style("fill", "white");
    
    svg.append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", width-w+(1/8*w)-15)
        .attr("y", height-h+(2/3*h)-110)
        .style("fill", "black")
        .text("1 Trillion BTUs");
    
    svg.append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", width-w+(1/8*w)-20)
        .attr("y", height-h+(2/3*h)-80)
        .style("fill", "black")
        .text("10 Trillion BTUs");
    
    svg.append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", width-w+(1/8*w)-25)
        .attr("y", height-h+(2/3*h)-15)
        .style("fill", "black")
        .text("100 Trillion BTUs");
    
    svg.append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", width-w+10)
        .attr("y", height-h+(2/3*h)+50)
        .style("fill", "green")
        .text("Total Energy Consumption");
    
    
    // Scale Changes as we Zoom
    // Call the function d3.behavior.zoom to Add zoom   
    var zoom = d3.zoom()
        .scaleExtent([.3, 5])
        .on("zoom", zoomed);
    
    d3.select("button")
        .on("click", resetted);
    
    function zoomed() {
        scat.attr("transform", d3.event.transform);
        lab.attr("transform", d3.event.transform);
        tool.attr("transform", d3.event.transform);
        xAxis.call(xA.scale(d3.event.transform.rescaleX(xScale)));
        yAxis.call(yA.scale(d3.event.transform.rescaleY(yScale)));
    }

    function resetted() {
        svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
    }
});
