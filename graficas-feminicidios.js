/* 
var filePath = "https://raw.githubusercontent.com/manuel1155/trabajo_visualuzacion_feminicidios/main/comparativaEdosFem.json"
d3.json(filePath, function (err, data) {
    console.log(err)
    if (err) console.log("error fetching data");
    console.log(data);

    var estados = [];
    var _2020 = [];
    var _2019 = [];

    for (let edo of data) {
        estados.push(edo.estado);
        _2019.push(edo.feminicidios.filter(f => f.ano == '2019')[0]['casos']);
        _2020.push(edo.feminicidios.filter(f => f.ano == '2020')[0]['casos']);
    }

    var data = {
        labels: estados,
        series: [
            {
                label: '2019',
                values: _2019
            },
            {
                label: '2020',
                values: _2020
            }
        ]
    };

    var chartWidth = 600,
        barHeight = 20,
        groupHeight = barHeight * data.series.length,
        gapBetweenGroups = 10,
        spaceForLabels = 150,
        spaceForLegend = 150;

    // Zip the series data together (first values, second values, etc.)
    var zippedData = [];
    for (var i = 0; i < data.labels.length; i++) {
        for (var j = 0; j < data.series.length; j++) {
            zippedData.push(data.series[j].values[i]);
        }
    }

    // Color scale
    // var color = d3.scale.category20();
    var color = d3.scale.ordinal()
        .range(["#710d0d", "#0d710d", "#d5d5d5", "#92c5de", "#0571b0"]);
    var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

    var x = d3.scale.linear()
        .domain([0, d3.max(zippedData)])
        .range([0, chartWidth]);

    var y = d3.scale.linear()
        .range([chartHeight + gapBetweenGroups, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickFormat('')
        .tickSize(0)
        .orient("left");


    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            console.log(d)
            return "<strong>Frequency:</strong> <span style='color:red'>" + d + "</span>";
        })

    // Add text label in bar
    chart.call(tip);



    // Specify the chart area and dimensions
    var chart = d3.select(".chart")
        .attr("width", spaceForLabels + chartWidth + spaceForLegend)
        .attr("height", chartHeight);

    // Create bars

    var bar = chart.selectAll("g")
        .data(zippedData)
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / data.series.length))) + ")";
        });

    // Create rectangles of the correct width
    bar.append("rect")
        .attr("fill", function (d, i) { return color(i % data.series.length); })
        .attr("class", "bar")
        .attr("width", x)
        .attr("height", barHeight - 1)


    bar.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.letter); })
        .attr("width", x.rangeBand())
        .attr("y", function (d) { return y(d.frequency); })
        .attr("height", function (d) { return height - y(d.frequency); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)


    bar.append("text")
        .attr("x", function (d) { return x(d) + 30; })
        .attr("y", barHeight / 2)
        .attr("fill", "red")
        .attr("dy", ".35em")
        .text(function (d) { return d; });

    // Draw labels
    bar.append("text")
        .attr("class", "label")
        .attr("x", function (d) { return - 10; })
        .attr("y", groupHeight / 2)
        .attr("dy", ".35em")
        .text(function (d, i) {
            //console.log(d);
            if (i % data.series.length === 0) {
                console.log(data.labels[Math.floor(i / data.series.length)]);
                return data.labels[Math.floor(i / data.series.length)];
            }
            else
                return ""
        });

    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups / 2 + ")")
        .call(yAxis);

    // Draw legend
    var legendRectSize = 18,
        legendSpacing = 4;

    var legend = chart.selectAll('.legend')
        .data(data.series)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = -gapBetweenGroups / 2;
            var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function (d, i) { return color(i); })
        .style('stroke', function (d, i) { return color(i); });

    legend.append('text')
        .attr('class', 'legend')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d) { return d.label; });

});



 */

var filePath = "https://raw.githubusercontent.com/manuel1155/trabajo_visualuzacion_feminicidios/main/comparativaEdosFem.json"

d3.json(filePath, function (err, data) {
    console.log(err)
    if (err) console.log("error fetching data");
    console.log(data);

    var dataset = [];

    for (let edo of data) {
        dataset.push({
            label: edo.estado,
            "2019": edo.feminicidios.filter(f => f.ano == '2019')[0]['casos'],
            "2020": edo.feminicidios.filter(f => f.ano == '2020')[0]['casos']
        });

    }

    /*     dataset = [
            { label: "Men", "": 20, "Not Much Satisfied": 10, "Satisfied": 50, "Very Satisfied": 20 },
            { label: "Women", "Not Satisfied": 15, "Not Much Satisfied": 30, "Satisfied": 40, "Very Satisfied": 15 }
        ]; */

    function verticalWrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                // if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y - 15).attr("class", "edo").attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                //}
            }
        });
    }


    d3.select("body").append("h1").text("Crecimiento de los feminicidios por estado: 2019-2020");

    var div = d3.select("body").append("div").attr("class", "principal")


    var margin = { top: (parseInt(1500, 10) / 20), right: (parseInt(d3.select('.principal').style('width'), 10) / 20), bottom: (parseInt(1500, 10) / 20), left: (parseInt(d3.select('.principal').style('width'), 10) / 10) },
        width = parseInt(d3.select('.principal').style('width'), 10) - margin.left - margin.right,
        height = parseInt(1500, 10) - margin.top - margin.bottom;

    var y0 = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .2, 0.5);

    var y1 = d3.scale.ordinal();

    var x = d3.scale.linear()
        .range([0, width]);

    var colorRange = d3.scale.category20();
    var color = d3.scale.ordinal()
        //.range(colorRange.range());
        .range(["#710d0d", "#0d710d", "#d5d5d5", "#92c5de", "#0571b0"]);


    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(-height)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y0)
        .orient("left");
    //.tickFormat(d3.format(".2s"));

    var divTooltip = d3.select("body").append("div").attr("class", "toolTip");

    var svg = div.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var options = d3.keys(dataset[0]).filter(function (key) { return key !== "label"; });

    dataset.forEach(function (d) {
        d.valores = options.map(function (name) { return { name: name, value: +d[name] }; });
    });

    y0.domain(dataset.map(function (d) { return d.label; }));
    y1.domain(options).rangeRoundBands([0, y0.rangeBand()]);
    x.domain([0, d3.max(dataset, function (d) { return d3.max(d.valores, function (d) { return d.value; }); })]);


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    /*
     .append("text")
     .attr("transform", "rotate(0)")
     .attr("x", 60)
     .attr("dx", ".71em")
     .style("text-anchor", "end")
     .text("Satisfaction %");
     */

    svg.selectAll(".y.axis .tick text")
        .call(verticalWrap, y0.rangeBand());


    var bar = svg.selectAll(".bar")
        .data(dataset)
        .enter().append("g")
        .attr("class", "rect22")
        .attr("transform", function (d) { return "translate( 0," + y0(d.label) + ")"; })

    var bar_enter = bar.selectAll("rect")
        .data(function (d) { return d.valores; })
        .enter()

    posiciones_Y = [25, 65, 105, 145, 190, 230, 270, 315, 355, 395, 440, 480, 520, 560, 600, 640, 680, 720, 760, 805, 845, 885, 930, 970, 1010, 1060, 1095, 1135, 1175, 1215, 1255, 1295, 0, 0, 0, 0, 0, 0]




    bar_enter.append("rect")
        .attr("height", y1.rangeBand())
        .attr("y", function (d) { return y1(d.name); })
        .attr("x", function (d) { return 0; })
        .attr("value", function (d) { return d.name; })
        .attr("width", function (d) { return x(d.value); })
        .attr("class", "bar2")
        .style("fill", function (d) { return color(d.name); });

    bar_enter.append("text")
        .attr("x", function (d) { return x(d.value) + 5; })
        .attr("y", function (d) { return y1(d.name) + (y1.rangeBand() / 2); })
        .attr("dy", ".35em")
        .text(function (d) { return d.value; });

    bar
        .on("mousemove", function (d) {
            divTooltip.style("left", d3.event.pageX + 10 + "px");
            divTooltip.style("top", d3.event.pageY - 25 + "px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY
            var elements = document.querySelectorAll(':hover');
            l = elements.length
            l = l - 1
            elementData = elements[l].__data__

            var icon = ""
            if (data.filter(edo => edo.estado == d.label)[0]['incremento'] > 0) icon = 'tendencia_alta.png';
            else icon = 'tendencia_baja.png';

            divTooltip.html("<b>Estado: </b>" + (d.label) + "<br> <b>Año:</b> " + elementData.name + "<br> <b>Casos:</b> " + elementData.value + "<br> <b>Tendencia:</b> " + data.filter(edo => edo.estado == d.label)[0]['incremento'].toFixed(2) + "<img width='20px' src='img/" + icon + "'>");
        });
    bar
        .on("mouseout", function (d) {
            divTooltip.style("display", "none");
        });

    var legend = svg.selectAll(".legend")
        .data(options.slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });


    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });

    svg.selectAll(".rect22").each(function (d, i) {

        console.log(d.label)

        if (data.filter(edo => edo.estado == d.label)[0]['incremento'] > 0) {
            svg.append('svg:foreignObject')
                .attr('height', '15px')
                .attr('width', '15px')
                .attr('fill', 'red')
                .attr('x', -margin.left+10)
                .attr('y', posiciones_Y[31-i])
                .html('<i class="fa fa-arrow-up" style="color: green;"></i>');
        } else {
//            console.log(d.label + ':   ' + data.filter(edo => edo.estado == d.label)[0]['incremento']);
  //          console.log(data.filter(edo => edo.estado == d.label)[0]['incremento'] > 0);
            svg.append('svg:foreignObject')
                .attr('height', '15px')
                .attr('width', '15px')
                .attr('fill', 'red')
                .attr('x', -margin.left+10)
                .attr('y', posiciones_Y[31-i])
                .html('<i class="fa fa-arrow-down" style="color: red;"></i>');
        }
    });

});
