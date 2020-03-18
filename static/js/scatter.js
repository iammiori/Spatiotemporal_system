var marginWhole = {top: 10, right: 10, bottom: 10, left: 10},
  sizeWhole = 500 - marginWhole.left - marginWhole.right

var svg = d3.select("#my_dataviz")
     .append("svg")
       .attr("width", sizeWhole  + marginWhole.left + marginWhole.right)
       .attr("height", sizeWhole  + marginWhole.top + marginWhole.bottom)
     .append("g")
       .attr("transform", "translate(" + marginWhole.left + "," + marginWhole.top + ")");


function drawplot(data){
  var allVar = ['pm10','noise','temp','humi','pm25']
  var numVar = allVar.length
  mar = 25
  size = sizeWhole/ numVar

  var position = d3.scalePoint()
    .domain(allVar)
    .range([0,sizeWhole-size])

  var color = d3.scaleOrdinal()
    .domain(["a","b","c"])
    .range([ "#a6d854", "#8da0cb", "#fc8d62"])

    for (i in allVar){
      for (j in allVar){

        // Get current variable name
        var var1 = allVar[i]
        var var2 = allVar[j]
        console.log(i)

        // If var1 == var2 i'm on the diagonal, I skip that
        if (var1 === var2) { continue; }

  //반쪽만 그리기 //scatter plot
      if (i<j){
        // Add X Scale of each graph
        xextent = d3.extent(data, function(d) { return +d[var1] })
        var x = d3.scaleLinear()
          .domain(xextent).nice()
          .range([ 0, size-2*mar ]);

        // Add Y Scale of each graph
        yextent = d3.extent(data, function(d) { return +d[var2] })
        var y = d3.scaleLinear()
          .domain(yextent).nice()
          .range([ size-2*mar, 0 ]);

        // Add a 'g' at the right position
        var tmp = svg
          .append('g')
          .attr("transform", "translate(" + (position(var1)+mar) + "," + (position(var2)+mar) + ")");
/*
  // add the y Axis
  var y = d3.scaleLinear()
            .range([size-2*mar, 0])
            .domain([0, 0.1]);
 tmp.append("g")
          .call(d3.axisLeft(y).ticks(3))
          .attr("stroke-width",0.3);
*/
        // Add X and Y axis in tmp
        tmp.append("g")
          .attr("transform", "translate(" + 0 + "," + (size-mar*2) + ")")
          .call(d3.axisBottom(x).ticks(2))
          
          .selectAll("text")
          .attr("dx","-1.2em")
          .attr("dy","0.3em")
            .attr("transform","rotate(-43)");
          
        tmp.append("g")
          .call(d3.axisLeft(y).ticks(2))
          /*
          .selectAll("text")
          .attr("dx","0.5em")
          .attr("dy","0em")
            .attr("transform","rotate(-43)");*/
        // Add circle
        tmp
          .selectAll("myCircles")
          .data(data)
          .enter()
          .append("circle")
            .attr("cx", function(d){ return x(+d[var1]) })
            .attr("cy", function(d){ return y(+d[var2]) })
            .attr("r", 1)
            .attr("fill", function(d){ return color(d.sepcolor)})
      }

  //반대쪽
      else{
        // Add X Scale of each graph
        
          section = allVar[j]
          console.log(corrD[0][section])
          //corrD.find((item)=>{return item === allVar[i]})
        svg
          .append('g')
          .attr("transform", "translate(" + position(var1) + "," + position(var2) + ")")
          .append('text')
            .attr("x", size/2)
            .attr("y", size/2)
            .text("corr:\n"  + corrD[i][section].toFixed(3))
            .attr("text-anchor", "middle")

      }
    }
  }


    // ------------------------------- //
    // Add variable names = diagonal
    // ------------------------------- //
    for (i in allVar){
      for (j in allVar){
        // If var1 == var2 i'm on the diagonal, otherwisee I skip
        if (i != j) { continue; }
        // Add text
        var var1 = allVar[i]
        var var2 = allVar[j]
 /*
        svg
          .append('g')
          .attr("transform", "translate(" + position(var1) + "," + position(var2) + ")")

          .append('text')
            .attr("x", size/2)
            .attr("y", size/2)
            .text(var1)
            .attr("text-anchor", "middle")
*/

                  var tmp = svg
          .append('g')
          .attr("transform", "translate(" + (position(var1)+mar) + "," + (position(var2)+mar) + ")");
if (i==0){
    

          // add the x Axis
    
  var x = d3.scaleLinear()
      .domain([-10,30])
      .range([ 0, size-2*mar]);

    
 tmp.append("g")
      .attr("transform", "translate(0," + 47.2 + ")")
    .call(d3.axisBottom(x).ticks(2))

          .attr("stroke-width",0.3);
          /*
       .selectAll("text")
          .attr("dx","-0.2em")
          .attr("dy","0.3em");
          */


  // add the y Axis
  var y = d3.scaleLinear()
            .range([size-2*mar, 0])
            .domain([0, 0.1]);
 tmp.append("g")
          .call(d3.axisLeft(y).ticks(3))
          .attr("stroke-width",0.3);
          /*
           .selectAll("text")
          .attr("dx","0.5em")
          .attr("dy","0.3em");*/

}

          if (i==1){
          // add the x Axis
  var x = d3.scaleLinear()
      .domain([40,65])
      .range([ 0, size-2*mar]);

 tmp.append("g")
      .attr("transform", "translate(0," + 47.2 + ")")
    .call(d3.axisBottom(x).ticks(2))

          .attr("stroke-width",0.3);
          /*
       .selectAll("text")
          .attr("dx","-1.2em")
          .attr("dy","0.3em");*/
          


  // add the y Axis
  var y = d3.scaleLinear()
            .range([size-2*mar, 0])
            .domain([0, 0.1]);
 tmp.append("g")
          .call(d3.axisLeft(y).ticks(3))
          .attr("stroke-width",0.3);
          /*
                         .selectAll("text")
          .attr("dx","0.5em")
          .attr("dy","0.3em");*/

}


               if (i==2){
          // add the x Axis
  var x = d3.scaleLinear()
      .domain([1150,1300])
      .range([ 0, size-2*mar]);

 tmp.append("g")
      .attr("transform", "translate(0," + 47.2 + ")")
    .call(d3.axisBottom(x).ticks(2))

          .attr("stroke-width",0.3);
          /*
       .selectAll("text")
          .attr("dx","-1.2em")
          .attr("dy","0.3em");
          */

  // add the y Axis
  var y = d3.scaleLinear()
            .range([size-2*mar, 0])
            .domain([0, 0.1]);
 tmp.append("g")
          .call(d3.axisLeft(y).ticks(3))
          .attr("stroke-width",0.3);
          /*
                              .selectAll("text")
          .attr("dx","0.5em")
          .attr("dy","0.3em");
*/
}


                   if (i==3){
          // add the x Axis
  var x = d3.scaleLinear()
      .domain([60,100])
      .range([ 0, size-2*mar]);

 tmp.append("g")
      .attr("transform", "translate(0," + 47.2 + ")")
    .call(d3.axisBottom(x).ticks(2))

          .attr("stroke-width",0.3);
          /*
       .selectAll("text")
          .attr("dx","-1.2em")
          .attr("dy","0.3em");*/
          


  // add the y Axis
  var y = d3.scaleLinear()
            .range([size-2*mar, 0])
            .domain([0, 0.1]);
 tmp.append("g")
          .call(d3.axisLeft(y).ticks(3))
          .attr("stroke-width",0.3);
          /*
                                  .selectAll("text")
          .attr("dx","0.5em")
          .attr("dy","0.3em");*/

}

          if (i==4){
          // add the x Axis
  var x = d3.scaleLinear()
      .domain([-10,30])
      .range([ 0, size-2*mar]);

 tmp.append("g")
      .attr("transform", "translate(0," + 47.2 + ")")
    .call(d3.axisBottom(x).ticks(2))

          .attr("stroke-width",0.3);
          /*
       .selectAll("text")
          .attr("dx","-1.2em")
          .attr("dy","0.3em");
          */


  // add the y Axis
  var y = d3.scaleLinear()
            .range([size-2*mar, 0])
            .domain([0, 0.1]);
 tmp.append("g")
          .call(d3.axisLeft(y).ticks(3))
          .attr("stroke-width",0.3);
          /*
                         .selectAll("text")
          .attr("dx","0.5em")
          .attr("dy","0.3em");
*/
}


  // Compute kernel density estimation
  var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(60))
  var density1 =  kde( data
      .filter( function(d){return d.sepcolor=== "a"} )
   .map(function(d){  return +d[var1]; }) )

  var density2 =  kde( data
      .filter( function(d){return d.sepcolor === "b"} )
    .map(function(d){  return +d[var1]; }) )

   var density3 =  kde( data
      .filter( function(d){return d.sepcolor === "c"} )
    .map(function(d){  return +d[var1]; }) )

//"#a6d854", "#8da0cb", "#fc8d62"

  // Plot the area
  tmp.append("path")
      .attr("class", "mypath")
      .datum(density1)
      .attr("fill", "#a6d854")
      .attr("opacity", "0.8")
      .attr("stroke", "#FFF")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );

  // Plot the area
  tmp.append("path")
      .attr("class", "mypath")
      .datum(density2)
      .attr("fill", "#8da0cb")
      .attr("opacity", "0.8")
      .attr("stroke", "#FFF")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );

           // Plot the area
  tmp.append("path")
      .attr("class", "mypath")
      .datum(density3)
      .attr("fill", "#fc8d62")
      .attr("opacity", "0.8")
      .attr("stroke", "#FFF")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );

             tmp.append('text')
            .attr("x", size/5)
            .attr("y", '-0.5em')
            .text(var1)
            .attr("text-anchor", "middle")

tmp.append("circle").attr("cx",50).attr("cy",0).attr("r", 2).style("fill", "#a6d854")
tmp.append("circle").attr("cx",50).attr("cy",7).attr("r", 2).style("fill", "#8da0cb")
tmp.append("circle").attr("cx",50).attr("cy",14).attr("r", 2).style("fill", "#fc8d62")
tmp.append("text").attr("x", 55).attr("y", 0).text("A").style("font-size", "8px").attr("alignment-baseline","middle")
tmp.append("text").attr("x", 55).attr("y", 7).text("B").style("font-size", "8px").attr("alignment-baseline","middle")
tmp.append("text").attr("x", 55).attr("y",14).text("C").style("font-size", "8px").attr("alignment-baseline","middle")
// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}



}
    }}
  drawplot(graphData);

