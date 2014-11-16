var genderRingChart = dc.pieChart("#chart-ring-gender");
var termBarChart = dc.barChart("#chart-bar-term");
var stateRowChart = dc.rowChart("#chart-row-state");
var partyRowChart = dc.rowChart("#chart-row-party");
var constRowChart = dc.rowChart("#chart-row-constituency");
var g;

d3.csv("Skin_Cancer.csv", function (data) {
// set colors to red <--> purple
    // format the data a bit
            var dateFormat = d3.time.format("%Y");
            var numberFormat = d3.format(",f");
console.log(data);
    var ndx = crossfilter(data);
    var all = ndx.groupAll();
// tooltips for row chart
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<span style='color: #f0027f'>" + d.key + "</span> : " + numberFormat(d.value);
        });

    // tooltips for pie chart
    var pieTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<span style='color: #f0027f'>" + d.data.key + "</span> : " + numberFormat(d.value);
        });

    // tooltips for bar chart
    var barTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<span style='color: #f0027f'>" + d.data.key + "</span> : " + numberFormat(d.y);
        });

    var genderDim = ndx.dimension(function (d) {
        return d.Gender;
    });
    var gender_total = genderDim.group().reduceSum(function (d) {
        return 1;
    });
    //print_filter("gender_total");


    var partyDim = ndx.dimension(function (d) {
        return d.party;
    });
    var party_total = partyDim.group().reduceSum(function (d) {
        return 1;
    });
    //print_filter("party_total");

    var termDim = ndx.dimension(function (d) {
        return d.year;
    });
    var term_total = termDim.group().reduceSum(function (d) {
        return 1;
    });
    //print_filter("term_total");

    var stateDim = ndx.dimension(function (d) {
        return d.state;
    });
    var state_total = stateDim.group().reduceSum(function (d) {
        return 1;
    });
    //print_filter("state_total");

    var constDim = ndx.dimension(function (d) {
        return d.constituency;
    });
    var const_total = constDim.group().reduceSum(function (d) {
        return 1;
    });


    genderRingChart
        .width(250).height(175)
        .dimension(genderDim)
        .group(gender_total)
        .innerRadius(50)
        .renderLabel(false)
                .title(function (d) {
            ""
        })
        .legend(dc.legend().x(100).y(70).itemHeight(15).gap(5))
        .colors(d3.scale.ordinal().domain(["M", "F"])
            .range(["#2E64FE", "#F781F3"]));


    termBarChart.width(350)
        .height(200)
        .margins({ top: 10, left: 50, right: 10, bottom: 60 })
        .transitionDuration(750)
        .xAxisLabel('Lok Sabha Formation Year')
        .yAxisLabel('Number of Members')
        .dimension(termDim)
        .group(term_total)
        .centerBar(false)
        .brushOn(false)
        .title(function (d) {
            ""
        })
        .gap(5)
        .elasticY(true)
        .colors(['#00FF00'])
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal())
        .y(d3.scale.linear().domain([0, 600]))
        .renderHorizontalGridLines(false)
        .yAxis().tickFormat(d3.format("s"));

    termBarChart.renderlet(function (chart) {
        chart.selectAll("g.x text").attr('dx', '-30').attr('dy', '-7').attr('transform', "rotate(-90)");
    })

    ;


    stateRowChart.width(300)
        .height(600)
        .margins({top: 20, left: 10, right: 10, bottom: 20})
        .transitionDuration(750)
        .dimension(stateDim)
        .group(state_total)
        .renderLabel(true)
        .gap(1)
        .title(function (d) {
            ""
        })
        .elasticX(true)
        .colors(d3.scale.category20())
        .xAxis().ticks(5).tickFormat(d3.format("s"))
    ;
    stateRowChart.data(function (group) {
        return group.top(30);
    });


    partyRowChart.width(300)
        .height(600)
        .margins({top: 20, left: 10, right: 10, bottom: 20})
        .transitionDuration(750)
        .dimension(partyDim)
        .group(party_total)
        .renderLabel(true)
        .gap(1)
        .title(function (d) {
            return "";
        })
        .elasticX(true)
        .colors(d3.scale.category20b())
        .xAxis().ticks(5).tickFormat(d3.format("s"))
    ;
    partyRowChart.data(function (group) {
        return group.top(30);
    });

    constRowChart.width(200)
        .height(1000)
        .margins({top: 20, left: 10, right: 10, bottom: 20})
        .transitionDuration(750)
        .dimension(constDim)
        .group(const_total)
        .renderLabel(true)
        .gap(1)
        .title(function (d) {
            return "";
        })
        .elasticX(true)
        .colors(d3.scale.category20c())
        .xAxis().ticks(3).tickFormat(d3.format("s"))
    ;
    constRowChart.data(function (group) {
        return group.top(50);
    });


    // dimension by term
    var allDim = ndx.dimension(function (d) {
        return +d.year;
    });


    dc.dataCount(".ls-data-count")
        .dimension(ndx)
        .group(all);


    datatable = $(".ls-data-table").dataTable({

        "bDeferRender": true,
        // Restricted data in table to 10 rows, make page load faster
// Make sure your field names correspond to the column headers in your data file. Also make sure to have default empty values.
        "aaData": allDim.top(100),
        "aaSorting": [
            [ 1, "desc" ]
        ],
        "bDestroy": true,
        "iDisplayLength": 25,
        "aoColumns": [
            { "mData": "Name", "sDefaultContent": " " },
            { "mData": "IC", "sDefaultContent": " " },
            { "mData": "Case No", "sDefaultContent": " " },
            { "mData": "Gender", "sDefaultContent": " " },
            { "mData": "date of birth", "sDefaultContent": " " },
			{ "mData": "Height (m)", "sDefaultContent": " " },
			{ "mData": "Weight (Kg)", "sDefaultContent": " " },
			{ "mData": "Smoking", "sDefaultContent": " " },
			{ "mData": "Cancer diagnosis date", "sDefaultContent": " " },
			{ "mData": "Cancer category", "sDefaultContent": " " },
			{ "mData": "Staging", "sDefaultContent": " " },
			{ "mData": "Date of last med test", "sDefaultContent": " " },
			{ "mData": "test status", "sDefaultContent": " " },
			{ "mData": "Test1", "sDefaultContent": " " },
			{ "mData": "Test2", "sDefaultContent": " " },
			{ "mData": "Test3", "sDefaultContent": " " },
			{ "mData": "Test4", "sDefaultContent": " " },
			{ "mData": "Test5", "sDefaultContent": " " },
			{ "mData": "Date of surgery", "sDefaultContent": " " },
			{ "mData": "Surgical Urgency", "sDefaultContent": " " },
			{ "mData": "length of stay in ICU (days)", "sDefaultContent": " " },
			{ "mData": "length of stay in hospital", "sDefaultContent": " " },
			{ "mData": "Discharge destination", "sDefaultContent": " " },
			{ "mData": "30 day readmission", "sDefaultContent": " " },
			{ "mData": "Mortality", "sDefaultContent": " " },
			{ "mData": "30 day reoperation", "sDefaultContent": " " },
			{ "mData": "Tumor type (1 to 6)", "sDefaultContent": " " },
			{ "mData": "Maximum tumor diameter (mm)", "sDefaultContent": " " },
			{ "mData": "Perforation (Y/N)", "sDefaultContent": " " },
			{ "mData": "Date last review", "sDefaultContent": " " },
			{ "mData": "Surgery Completion", "sDefaultContent": " " },
			{ "mData": "Last follow up status", "sDefaultContent": " " }
        ]
    });

    function RefreshTable() {
        datatable.fnClearTable();
        datatable.fnAddData(allDim.top(Infinity));
        datatable.fnDraw();
    };

    for (var i = 0; i < dc.chartRegistry.list().length; i++) {
        var chartI = dc.chartRegistry.list()[i];
        chartI.on("filtered", RefreshTable);
    }
    RefreshTable();


    dc.renderAll();
    d3.selectAll("g.row").call(tip);
                d3.selectAll("g.row").on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                d3.selectAll(".pie-slice").call(pieTip);
                d3.selectAll(".pie-slice").on('mouseover', pieTip.show)
                    .on('mouseout', pieTip.hide);

                d3.selectAll(".bar").call(barTip);
                d3.selectAll(".bar").on('mouseover', barTip.show)
                    .on('mouseout', barTip.hide);

});