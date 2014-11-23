/// function jHealth(data) {
d3.csv("Skin_Cancer.csv", function(error, data) {
    var dateFormat = d3.time.format("%Y/%m/%_d").parse;
    var yearFormat = d3.time.format("%y").parse;
    var numberFormat = d3.format("%");

    data.forEach(function(d) {
        d.cancerCat = d["Cancer category"];
        d.dischargeLoc = d["Discharge destination"];
        d._30DayReadmission = d["30 day readmission"];
        d.mortality = d["Mortality"];
        d._30DayReoperation = d["30 day reoperation"];
        d.lengthOfStayICU = parseInt(d["length of stay in ICU (days)"]);
        d.lenghtOfStayInHospital = parseInt(d["length of stay in hospital"]);
        d.gender = d["Gender"];
        d.smoker = d["Smoking "];
        d.surgeryCompletion = d["Surgery Completion "];

        var yr = dateFormat(d["Cancer diagnosis date"]);
        d.diagnosedYear = yr.getFullYear();
        d.yearsWithCancer = new Date().getFullYear() - yr.getFullYear();
        d.ic = d["IC"];

        var bday = dateFormat(d["date of birth"]);
        //d.diagnosedYear = bday.getFullYear();
        d.age = new Date().getFullYear() - bday.getFullYear();

        d.testOne = parseInt(d["Test1"]);
        d.testTwo = parseInt(d["Test2"]);
        d.testThree = parseInt(d["Test3"]);
        d.testFour = parseInt(d["Test4"]);
        d.testFive = parseInt(d["Test5"]);
        d.testStatus = d["test status"];

        d.surgicalUrgency = d["Surgical Urgency"];

        d.lastFollowUpStatus = d["Last follow up status"];

        d.perforation = d["Perforation (Y/N)"];

        d.tumorType = d["Tumor type (1 to 6)"];
        d.tumorDiameter = parseInt(d["Maximum tumor diameter (mm)"]);

        //bmi
        var wei = parseInt(d["Weight (Kg)"]);
        var hei = parseInt(d["Height (m)"]);
        d.bmi = wei / ((hei / 130) * (hei / 130));
        // console.log(d.bmi);

    });


    //var ndx = crossfilter(data);
    var ndx = crossfilter(data),


        runDimension = ndx.dimension(function(d) {
            return +d.testStatus;
        }),
        tumorTypeDimension = ndx.dimension(function(d) {
            return +d.tumorType;
        }),
        runGroup = runDimension.group(),
        experimentDimension = ndx.dimension(function(d) {
            return d.testStatus;
        }),
        _1thTestGroup = experimentDimension.group().reduce(
            function(p, v) {
                p.push(v.testOne);
                return p;
            },
            function(p, v) {
                p.splice(p.indexOf(v.testOne), 1);
                return p;
            },
            function() {
                return [];
            }
        ),
        _2thTestGroup = experimentDimension.group().reduce(
            function(p, v) {
                p.push(v.testTwo);
                return p;
            },
            function(p, v) {
                p.splice(p.indexOf(v.testTwo), 1);
                return p;
            },
            function() {
                return [];
            }
        ),
        _3thTestGroup = experimentDimension.group().reduce(
            function(p, v) {
                p.push(v.testThree);
                return p;
            },
            function(p, v) {
                p.splice(p.indexOf(v.testThree), 1);
                return p;
            },
            function() {
                return [];
            }
        ),
        _4thTestGroup = experimentDimension.group().reduce(
            function(p, v) {
                p.push(v.testFour);
                return p;
            },
            function(p, v) {
                p.splice(p.indexOf(v.testFour), 1);
                return p;
            },
            function() {
                return [];
            }
        ),
        _5thTestGroup = experimentDimension.group().reduce(
            function(p, v) {
                p.push(v.testFive);
                return p;
            },
            function(p, v) {
                p.splice(p.indexOf(v.testFive), 1);
                return p;
            },
            function() {
                return [];
            }
        ),
        tumorSizeGroup = experimentDimension.group().reduce(
            function(p, v) {
                p.push(v.tumorDiameter);
                return p;
            },
            function(p, v) {
                p.splice(p.indexOf(v.tumorDiameter), 1);
                return p;
            },
            function() {
                return [];
            }
        );

    var all = ndx.groupAll();

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<span style='color: #f0027f'>" + d.key + "</span> : " + numberFormat((d.value /
                all.value()));
        });

    // tooltips for pie chart
    var pieTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            // var proportion=   ;
            //  return "<span style='color: #f0027f'>" + d.data.key + "</span> : " + all.value();
            return "<span style='color: #f0027f'>" + d.data.key + "</span> : " + numberFormat((d.value /
                all.value()));
        });

    // tooltips for bar chart
    var barTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            //   console.log(d);
            return "<span style='color: #f0027f'>" + d.data.key + "</span> : " + numberFormat((d.y /
                all.value()));
        });

    var boxPlotTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {

            //console.log(d);
            var max = 0;
            var min = 0;
            var outlier=0;
            var size = d3.select(this).selectAll("svg text")[0].length;
            if (size != 0) {
                max = d3.select(this).selectAll("svg text")[0][size - 1];
                min = d3.select(this).selectAll("svg text")[0][size - 2];
                outlier=d3.select(this).selectAll("svg circle")[0].length;
                //console.log(outlier);

                if (outlier > 0){
                return "<span style='color: #f0027f;'>" + d.key +
                    "</span> : " + "<br />&#09; Maximum : " + $(max).html() +
                    "<br />75<sup>th</sup> Percentile: " + d.value.quartiles[2] +
                    "<br />&#09; 50<sup>th</sup> Percentile: " + d.value.quartiles[1] +
                    "<br />&#09; 25<sup>th</sup>Percentile: " + d.value.quartiles[0] +
                    "<br />&#09;Minimum: " + $(min).html() + " <br />&#09;Outlier Exist?: Yes(Red Circle)";
                }else {
                    return "<span style='color: #f0027f;'>" + d.key +
                    "</span> : " + "<br />&#09; Maximum : " + $(max).html() +
                    "<br />75<sup>th</sup> Percentile: " + d.value.quartiles[2] +
                    "<br />&#09; 50<sup>th</sup> Percentile: " + d.value.quartiles[1] +
                    "<br />&#09; 25<sup>th</sup>Percentile: " + d.value.quartiles[0] +
                    "<br />&#09;Minimum: " + $(min).html() + " <br />&#09;Outlier Exist?: No";
                    }


            } else {
                return "";
            }

        });


    var icDimensions = ndx.dimension(function(d) {
        return d.ic;
    });

    var bmiDimensions = ndx.dimension(function(d) {

        if (d.bmi < 18.5) {
            return "Too Thin";
        } else if (d.bmi > 18.5 && d.bmi < 22.9) {
            return "Low Risk";
        } else if (d.bmi > 23 && d.bmi < 27.4) {
            return "Moderate Risk";
        } else if (d.bmi > 27.5) {
            return "High Risk";
        } else {
            return "Error";
        }

    });

    var surgicalUrgencyDimension = ndx.dimension(function(d) {
        return d.surgicalUrgency;
    });

    //get dimensions by type
    var smokerDimensions = ndx.dimension(function(d) {
        if (d.smoker === "Y") {
            return "Yes";
        } else if (d.smoker === "N") {
            return "No";
        } else {
            return "Unknown";
        }
    });

    var surgeryCompletionDimension = ndx.dimension(function(d) {
        if (d.surgeryCompletion === "Y") {
            return "Yes";
        } else if (d.surgeryCompletion === "N") {
            return "No";
        } else {
            return "Unknown";
        }
    });

    var perforationDimensions = ndx.dimension(function(d) {
        if (d.perforation === "Y") {
            return "Yes";
        } else if (d.perforation === "N") {
            return "No";
        } else {
            return "Unknown";
        }

    });

    var cancerCatDimensions = ndx.dimension(function(d) {

        if (d.cancerCat === "CategoryA") {
            return "Cat A";
        } else if (d.cancerCat === "CategoryB") {
            return "Cat B";
        } else if (d.cancerCat === "CategoryC") {
            return "Cat C";
        } else if (d.cancerCat === "CategoryD") {
            return "Cat D";
        } else {
            return "Error";
        }

        // return d.cancerCat;
    });

    var lastFollowUpStatusDimensions = ndx.dimension(function(d) {
        return "Status: " + d.lastFollowUpStatus;
    });

    var ageDimensions = ndx.dimension(function(d) {
        return d.age;
    });

    var yearsWithCancerDimensions = ndx.dimension(function(d) {
        return d.yearsWithCancer;
    });

    var dischargeLocDimensions = ndx.dimension(function(d) {

        if (d.dischargeLoc === "nursing house") {
            return "Nurs.Hm";
        } else {
            return d.dischargeLoc;
        }

        return d.dischargeLoc;
    });

    var _30DayReadmissionDimensions = ndx.dimension(function(d) {
        //return d._30DayReadmission;
        if (d._30DayReadmission === "1") {
            return "Yes";
        } else {
            return "No";
        }
    });

    var mortalityDimensions = ndx.dimension(function(d) {
        //return d.mortality;
        if (d.mortality === "1") {
            return "Yes";
        } else {
            return "No";
        }
    });

    var _30DayReoperationDimensions = ndx.dimension(function(d) {
        //return d._30DayReoperation;
        if (d._30DayReoperation === "N") {
            return "No";
        } else if (d._30DayReoperation === "Y (cause1)") {
            return "Yes:C1";
        } else if (d._30DayReoperation === "Y (cause2)") {
            return "Yes:C2";
        }
    });

    var lengthOfStayInHospitalDimension = ndx.dimension(function(d) {
        return d.lenghtOfStayInHospital;
    });

    var lengthOfStayICUDimensions = ndx.dimension(function(d) {
        return d.lengthOfStayICU;
    });

    var genderDimensions = ndx.dimension(function(d) {
        // console.log(d);
        if (d.gender === "M") {
            //console.log(d);
            return "Male";
        } else {
            return "Female";
        }
    });


    var cancerCatDimensionsGroup = cancerCatDimensions.group();
    var dischargeLocDimensionsGroup = dischargeLocDimensions.group();
    var _30DayReadmissionDimensionsGroup = _30DayReadmissionDimensions.group();
    var mortalityDimensionsGroup = mortalityDimensions.group();
    var _30DayReoperationDimensionsGroup = _30DayReoperationDimensions.group();
    var lengthOfStayICUDimensionsGroup = lengthOfStayICUDimensions.group();
    var genderGroups = genderDimensions.group();
    var smokerGroup = smokerDimensions.group();
    var yearsWithCancerGroup = yearsWithCancerDimensions.group();
    var icGroup = icDimensions.group();
    var ageGroup = ageDimensions.group();
    var surgeryCompletionDateGroup = surgeryCompletionDimension.group();
    var lastFollowUpStatusGroup = lastFollowUpStatusDimensions.group();
    var perforationDimensionsGroup = perforationDimensions.group();
    var lengthOfStayInHospitalGroup = lengthOfStayInHospitalDimension.group();
    var surgicalUrgencyGroup = surgicalUrgencyDimension.group();
    var bmiDimensionsGroup = bmiDimensions.group();

    var cancerGroup = dc.pieChart("#cancerGroups");
    var dischargeLoc = dc.pieChart("#dischargeLoc");
    var _30DayReadmission = dc.pieChart("#_30DayReadmission");
    var mortality = dc.pieChart("#mortality");
    var _30DayReoperation = dc.pieChart("#_30DayReoperation");
    var daysInICUChart = dc.barChart("#daysInICU");
    var genderPie = dc.pieChart("#gender");
    var smokerRowChart = dc.rowChart("#smoker");
    var yearsWithCancerBarChaer = dc.barChart('#yearsWithCancer');
    var oneTests = dc.boxPlot("#firstTest");
    var twoTests = dc.boxPlot("#secondTest");
    var threeTests = dc.boxPlot("#thirdTest");
    var fourTests = dc.boxPlot("#forthTest");
    var fiveTests = dc.boxPlot("#fifthTest");
    var ageChart = dc.barChart("#ageBarChart");
    var surgeryCompletionChart = dc.rowChart("#surgeryCompletion");
    var lastFollowUpStatusRow = dc.rowChart("#lastFollowUpStatus");
    var profilerationRowChart = dc.rowChart("#profilerationRowChart");
    var tumorPlot = dc.boxPlot("#tumorSize");
    var daysInHospitalChart = dc.barChart("#daysInHospital");
    var surgicalUrgencyRowChart = dc.rowChart("#surgicalUrgency");
    var bmiChart = dc.barChart("#bmiChart");

    bmiChart
        .height(300)
        .width(450)
        .dimension(bmiDimensions)
        .group(bmiDimensionsGroup)
        .elasticY(true)
        .gap(2)
        //			.xUnits(d3.time.days)
        // (optional) set filter brush rounding
        .round(dc.round.floor)
        .xAxisLabel('BMI')
        .x(d3.scale.ordinal().domain(["Too Thin", "Low Risk", "Moderate Risk", "High Risk"])) // Need empty val to offset first value
        .xUnits(dc.units.ordinal)
        .yAxisLabel('Count')
        .alwaysUseRounding(true)
        .colors(d3.scale.category10())
        //			.xUnits(dc.units.linear())
        //.x(d3.scale.linear().domain([0, 16]))
        //.x(d3.scale.linear().domain([bmiDimensions.bottom(1)[0].bmi,
        //bmiDimensions.top(1)[0].bmi
        //]))
        .renderHorizontalGridLines(true)
        // customize the filter displayed in the control span
        .filterPrinter(function(filters) {
            var filter = filters[0],
                s = "";
            s += filter[0] + " days -> " + filter[1] + " days";
            return s;
        });

    surgicalUrgencyRowChart.width(450)
        .height(300)
        //.transitionDuration(750)
        .dimension(surgicalUrgencyDimension)
        .group(surgicalUrgencyGroup)
        .renderLabel(true)
        .gap(2)
        .title(function(d) {
            ""
        })
        .elasticX(true)
        .colors(d3.scale.category10())
        .xAxis().ticks(5).tickFormat(d3.format("s"));



    daysInHospitalChart
        .height(300)
        .width(450)
        .dimension(lengthOfStayInHospitalDimension)
        .group(lengthOfStayInHospitalGroup)
        .elasticY(true)
        //     .yAxis().tickFormat(d3.format("f"))
        .gap(2)
        //			.xUnits(d3.time.days)
        // (optional) set filter brush rounding
        .round(dc.round.floor)
        .xAxisLabel('Days in Hospital')
        .yAxisLabel('Count')
        .alwaysUseRounding(true)
        .colors(d3.scale.category10())
        //			.xUnits(dc.units.linear())
        //.x(d3.scale.linear().domain([0, 16]))
        .x(d3.scale.linear().domain([lengthOfStayInHospitalDimension.bottom(1)[0].lenghtOfStayInHospital,
            lengthOfStayInHospitalDimension.top(1)[0].lenghtOfStayInHospital
        ]))
        .renderHorizontalGridLines(true)
        // customize the filter displayed in the control span
        .filterPrinter(function(filters) {
            var filter = filters[0],
                s = "";
            s += filter[0] + " days -> " + filter[1] + " days";
            return s;
        });

    tumorPlot
        .width(450)
        .height(300)
        .ordinalColors(['orange'])
        .dimension(tumorTypeDimension)
        .group(tumorSizeGroup)
        .elasticY(true)
        .elasticX(true);



    profilerationRowChart.width(450)
        .height(300)
        //.transitionDuration(750)
        .dimension(perforationDimensions)
        .group(perforationDimensionsGroup)
        .renderLabel(true)
        .gap(2)
        .title(function(d) {
            ""
        })
        .elasticX(true)
        .colors(d3.scale.category10())
        .xAxis().ticks(5).tickFormat(d3.format("s"));

    lastFollowUpStatusRow.width(450)
        .height(300)
        //.transitionDuration(750)
        .dimension(lastFollowUpStatusDimensions)
        .group(lastFollowUpStatusGroup)
        .renderLabel(true)
        .gap(2)
        .title(function(d) {
            ""
        })
        .elasticX(true)
        .colors(d3.scale.category10())
        .xAxis().ticks(5).tickFormat(d3.format("s"));

    surgeryCompletionChart.width(450)
        .height(300)
        //.transitionDuration(750)
        .dimension(surgeryCompletionDimension)
        .group(surgeryCompletionDateGroup)
        .renderLabel(true)
        .gap(2)
        .title(function(d) {
            ""
        })
        .elasticX(true)
        .colors(d3.scale.category10())
        .xAxis().ticks(5).tickFormat(d3.format("s"));


    ageChart
        .height(300)
        .width(450)
        .dimension(ageDimensions)
        .group(ageGroup)
        .elasticY(true)
        .gap(2)

    .xAxisLabel('Age Distribution')
        .yAxisLabel('Count')
        .round(dc.round.floor)
        .alwaysUseRounding(true)
        .x(d3.scale.linear().domain([ageDimensions.bottom(1)[0].age,
            ageDimensions.top(1)[0].age
        ]))

    //.yAxis().tickFormat(d3.format("f"))
    .renderHorizontalGridLines(true)
        // customize the filter displayed in the control span
        .filterPrinter(function(filters) {
            var filter = filters[0],
                s = "";
            s += "Age: " + filter[0] + " -> Age: " + filter[1];
            return s;
        });


    oneTests
        .width(400)
        .height(250)
        //.brushOn(false)
        .ordinalColors(['orange'])
         .dimension(experimentDimension)
        .group(_1thTestGroup)
        .elasticY(true)

        .elasticX(true);



    twoTests
        .width(400)
        .height(250)
        .brushOn(false)
        .ordinalColors(['orange'])
        .dimension(experimentDimension)
        .group(_2thTestGroup)
        .elasticY(true)
        //.title("Test5")
        .elasticX(true);


    threeTests
        .height(250)
        .width(450)
        .ordinalColors(['orange'])
        .brushOn(false)
        //.colors(['#ffa500'])
        //.height(250)

    .dimension(experimentDimension)
        .group(_3thTestGroup)
        .elasticY(true)
        //.title("Test5")
        .elasticX(true);




    fourTests
        .width(450)
        .brushOn(false)
        //.colors(['#ffa500'])

    .height(250)
        .ordinalColors(['orange'])
        .dimension(experimentDimension)

    .group(_4thTestGroup)
        .elasticY(true)
        //.title("Test5")
        .elasticX(true);
    // console.log(fourTests.valueAccessor(function(d) { return d.value.sum / d.value.count; }));


    fiveTests
        .width(450)
        .height(250)
        .y(d3.scale.linear().domain([experimentDimension.top(1)[0].testFive - 4,
            experimentDimension.bottom(1)[0].testFive + 5
        ]))
        .brushOn(false)
        .ordinalColors(['orange'])
        //.colors(['#c454da'])
        .height(250)
        .dimension(experimentDimension)
        .group(_5thTestGroup)
        .elasticY(true)
        //.title("Test5")
        .elasticX(true);


    yearsWithCancerBarChaer
        .height(300)
        .width(450)
        .dimension(yearsWithCancerDimensions)
        .group(yearsWithCancerGroup)
        .elasticY(true)
        .gap(2)
        // (optional) set filter brush rounding
        .round(dc.round.floor)
        .xAxisLabel('Years with Cancer')
        .yAxisLabel('Count')
        .alwaysUseRounding(true)
        //.yAxis().tickFormat(d3.format("f"))
        .colors(d3.scale.category20())
        .x(d3.scale.linear().domain([yearsWithCancerDimensions.bottom(1)[0].yearsWithCancer,
            yearsWithCancerDimensions.top(1)[0].yearsWithCancer
        ]))

    .renderHorizontalGridLines(true)
        // customize the filter displayed in the control span
        .filterPrinter(function(filters) {
            var filter = filters[0],
                s = "";
            s += filter[0] + " years -> " + filter[1] + " years";
            return s;
        });


    smokerRowChart.width(450)
        .height(300)
        //.transitionDuration(750)
        .dimension(smokerDimensions)
        .group(smokerGroup)
        .renderLabel(true)

    //.xAxisLabel('Number of Smokers')
    .gap(2)
        .title(function(d) {
            ""
        })
        .elasticX(true)
        .colors(d3.scale.category10())
        .xAxis().ticks(5).tickFormat(d3.format("s"));



    genderPie
        .width(150).height(130)
        .dimension(genderDimensions)
        .group(genderGroups)
        .innerRadius(40)
        .renderLabel(false)
        .colors(d3.scale.category10())
        .title(function(d) {
            ""
        })
        .legend(dc.legend().x(45).y(49).itemHeight(10).gap(2));

    mortality
        .width(150).height(130)
        .dimension(mortalityDimensions)
        .group(mortalityDimensionsGroup)
        .innerRadius(40)
        .renderLabel(false)
        .colors(d3.scale.category10())
        .title(function(d) {
            ""
        })
        .legend(dc.legend().x(45).y(49).itemHeight(10).gap(2));

    //mortality.render();

    cancerGroup
        .width(150).height(130)
        .dimension(cancerCatDimensions)
        .group(cancerCatDimensionsGroup)
        .innerRadius(40)
        .colors(d3.scale.category10())
        .renderLabel(false)
        .title(function(d) {
            ""
        })
        .legend(dc.legend().x(45).y(43).itemHeight(10).gap(2));

    //cancerGroup.render();

    //cancerGroup.render();

    dischargeLoc
        .width(150).height(130)
        .dimension(dischargeLocDimensions)
        .group(dischargeLocDimensionsGroup)
        .innerRadius(40)
        .colors(d3.scale.category10())
        .renderLabel(false)
        .title(function(d) {
            ""
        })
        .legend(dc.legend().x(45).y(43).itemHeight(10).gap(2));

    //dischargeLoc.render();

    _30DayReadmission
        .width(125).height(130)
        .dimension(_30DayReadmissionDimensions)
        .group(_30DayReadmissionDimensionsGroup)
        .innerRadius(40)
        .colors(d3.scale.category10())
        .renderLabel(false)
        .title(function(d) {
            ""
        })
        .legend(dc.legend().x(30).y(49).itemHeight(10).gap(2));

    // _30DayReadmission.render();


    _30DayReoperation
        .width(125).height(130)
        .dimension(_30DayReoperationDimensions)
        .group(_30DayReoperationDimensionsGroup)
        .innerRadius(40)
        .colors(d3.scale.category10())
        .renderLabel(false)
        .title(function(d) {
            ""
        })
        .legend(dc.legend().x(30).y(49).itemHeight(10).gap(2));

    daysInICUChart
        .height(300)
        .width(450)
        .dimension(lengthOfStayICUDimensions)
        .group(lengthOfStayICUDimensionsGroup)
        .elasticY(true)
        // .yAxis().tickFormat(d3.format("f"))

    //    .brushOn(false)
    .gap(2)
        //			.xUnits(d3.time.days)
        // (optional) set filter brush rounding
        .round(dc.round.floor)
        .xAxisLabel('Days in ICU')
        .yAxisLabel('Count')
        .alwaysUseRounding(true)
        .colors(d3.scale.category10())
        //			.xUnits(dc.units.linear())
        //.x(d3.scale.linear().domain([0, 16]))
        .x(d3.scale.linear().domain([lengthOfStayICUDimensions.bottom(1)[0].lengthOfStayICU,
            lengthOfStayICUDimensions.top(1)[0].lengthOfStayICU
        ]))
        .renderHorizontalGridLines(true)
        // customize the filter displayed in the control span
        .filterPrinter(function(filters) {
            var filter = filters[0],
                s = "";
            s += filter[0] + " days -> " + filter[1] + " days";
            return s;
        });


    var allDim = ndx.dimension(function(d) {
        return +d.diagnosedYear;
    });

    dc.dataCount(".dc-data-count")
        .dimension(ndx)
        .group(all);

    datatable = $(".ls-data-table").dataTable({
        "bDeferRender": true,
        // Restricted data in table to 10 rows, make page load faster
        // Make sure your field names correspond to the column headers in your data file. Also make sure to have default empty values.
        "aaData": allDim.top(10),
        "aaSorting": [
            [1, "desc"]
        ],
        "bDestroy": true,
        "iDisplayLength": 100,
        "aoColumns": [{

            "mData": "Name",
            "sDefaultContent": " "
        }, {
            "mData": "IC",
            "sDefaultContent": " "
        }, {
            "mData": "Case No",
            "sDefaultContent": " "
        }, {
            "mData": "Gender",
            "sDefaultContent": " "
        }, {
            "mData": "date of birth",
            "sDefaultContent": " "
        }, {
            "mData": "Height (m)",
            "sDefaultContent": " "
        }, {
            "mData": "Weight (Kg)",
            "sDefaultContent": " "
        }, {
            "mData": "Smoking ",
            "sDefaultContent": " "
        }, {
            "mData": "Cancer diagnosis date",
            "sDefaultContent": " "
        }, {
            "mData": "Cancer category",
            "sDefaultContent": " "
        }, {
            "mData": "Staging",
            "sDefaultContent": " "
        }, {
            "mData": "Date of last med test",
            "sDefaultContent": " "
        }, {
            "mData": "test status",
            "sDefaultContent": " "
        }, {
            "mData": "Test1",
            "sDefaultContent": " "
        }, {
            "mData": "Test2",
            "sDefaultContent": " "
        }, {
            "mData": "Test3",
            "sDefaultContent": " "
        }, {
            "mData": "Test4",
            "sDefaultContent": " "
        }, {
            "mData": "Test5",
            "sDefaultContent": " "
        }, {
            "mData": "Date of surgery",
            "sDefaultContent": " "
        }, {
            "mData": "Surgical Urgency",
            "sDefaultContent": " "
        }, {
            "mData": "length of stay in ICU (days)",
            "sDefaultContent": " "
        }, {
            "mData": "length of stay in hospital",
            "sDefaultContent": " "
        }, {
            "mData": "Discharge destination",
            "sDefaultContent": " "
        }, {
            "mData": "30 day readmission",
            "sDefaultContent": " "
        }, {
            "mData": "Mortality",
            "sDefaultContent": " "
        }, {
            "mData": "30 day reoperation",
            "sDefaultContent": " "
        }, {
            "mData": "Tumor type (1 to 6)",
            "sDefaultContent": " "
        }, {
            "mData": "Maximum tumor diameter (mm)",
            "sDefaultContent": " "
        }, {
            "mData": "Perforation (Y/N)",
            "sDefaultContent": " "
        }, {
            "mData": "Date last review",
            "sDefaultContent": " "
        }, {
            "mData": "Surgery Completion ",
            "sDefaultContent": " "
        }, {
            "mData": "Last follow up status",
            "sDefaultContent": " "
        }]
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

    d3.selectAll(".box").call(boxPlotTip);
    d3.selectAll(".box").on('mouseover', boxPlotTip.show)
        .on('mouseout', boxPlotTip.hide);



    function print_filter(filter) {
        var f = eval(filter);
        if (typeof(f.length) != "undefined") {} else {}
        if (typeof(f.top) != "undefined") {
            f = f.top(Infinity);
        } else {}
        if (typeof(f.dimension) != "undefined") {
            f = f.dimension(function(d) {
                return "";
            }).top(Infinity);
        } else {}
        console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t")
            .replace(
                /}\,/g, "},\n\t").replace("]", "\n]"));
    }

    function AddXAxis(chartToUpdate, displayText) {
        chartToUpdate.svg()
            .append("text")
            .attr("class", "x-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", chartToUpdate.width() / 2)
            .attr("y", chartToUpdate.height())
            .text(displayText);
    }

    AddXAxis(profilerationRowChart, "Count");

    AddXAxis(smokerRowChart, "Count");

    AddXAxis(surgicalUrgencyRowChart, "Count");

    AddXAxis(surgeryCompletionChart, "Count");

    AddXAxis(lastFollowUpStatusRow, "Count");



});

