<script>
    import axios from "axios";
    import { onMount } from "svelte";
    import { DateTime } from "luxon";
    import graphBuilder from "../includes/graph-builder";
    import tippy from "tippy.js";
    import "tippy.js/dist/tippy.css";
    // ***************************** INI VARS ***************************** //
    let pedestriansNum = 0;
    $: pedestriansNumCommas = formatCommas(pedestriansNum);
    $: pedestriansPerc = 0;
    let passengersNum = 0;
    $: passengersNumCommas = formatCommas(passengersNum);
    $: passengersPerc = 0;
    let vehiclesNum = 0;
    $: vehiclesNumCommas = formatCommas(vehiclesNum);
    $: vehiclesPerc = 0;
    $: yearStr = 0;
    $: monthStr = "";
    onMount(async () => {
        borderCrossings();
        internationalCommerce();
        sentimentAnalysis();
        tippy("#myButton", {
            content:
                "Total Northbound crossings from all three ports of entry - San Ysidro, Otay Mesa, and Tecate - are included in this snapshot. Data is updated frequently and reflect the most recent month available",
            placement: "right",
        });
        tippy("#myOtherButton", {
            content:
                "Crossings and trade value through the Otay Mesa port of entry are included in this snapshot. Data is updated frequently and reflect the most recent month for which data is available.",
            placement: "right",
        });
    });
    const borderCrossings = async () => {
        // Define Dates For Query
        let month = DateTime.now().month;
        let year = DateTime.now().year;
        let startDate = `${year - 1}-01-01T00:00:00.000`;
        // Define arrays for filters
        let ports = ["San Ysidro", "Otay Mesa", "Tecate"];
        let passengersArr = [
            "Train Passengers",
            "Personal Vehicle Passengers",
            "Bus Passengers",
        ];
        let vehiclesArr = ["Buses", "Trains", "Personal Vehicles"];
        let filterPorts = (data) => {
            let pedestrians = data
                .filter((x) => x.measure == "Pedestrians")
                .reduce((sum, { value }) => sum + Number(value), 0);
            let passengers = data
                .filter((x) => passengersArr.includes(x.measure))
                .reduce((sum, { value }) => sum + Number(value), 0);
            console.log(passengers);
            let vehicles = data
                .filter((x) => vehiclesArr.includes(x.measure))
                .reduce((sum, { value }) => sum + Number(value), 0);
            return { pedestrians, passengers, vehicles };
        };
        let percDiff = (numCur, numPrev) => {
            return Math.round(((numCur - numPrev) / numPrev) * 100 * 100) / 100;
        };
        let endDate = `${year}-${("0" + month).slice(-2)}-01T00:00:00.000`;
        let { data } = await axios.get(
            `https://data.transportation.gov/resource/keg4-3bc2.json?$limit=100000&$where=date between '${startDate}' and '${endDate}'&border=US-Mexico Border&state=California`
        );
        let lastDate = DateTime.fromISO(
            data.reduce((a, { date }) => (a > date ? a : date), 0)
        );
        console.log(lastDate);
        monthStr = lastDate.monthLong;
        yearStr = lastDate.year;
        let portsFiltered = data.filter((x) => ports.includes(x.port_name));
        let dataCurrentMonth = portsFiltered.filter(
            (x) =>
                x.date ==
                `${lastDate.year}-${("0" + lastDate.month).slice(
                    -2
                )}-01T00:00:00.000`
        );
        let dataPreviousMonth = portsFiltered.filter(
            (x) =>
                x.date ==
                `${lastDate.year - 1}-${("0" + lastDate.month).slice(
                    -2
                )}-01T00:00:00.000`
        );
        let numbersMeasuresCurrent = filterPorts(dataCurrentMonth);
        pedestriansNum = numbersMeasuresCurrent["pedestrians"];
        passengersNum = numbersMeasuresCurrent["passengers"];
        vehiclesNum = numbersMeasuresCurrent["vehicles"];
        let numPrev = filterPorts(dataPreviousMonth);
        pedestriansPerc = percDiff(pedestriansNum, numPrev["pedestrians"]);
        passengersPerc = percDiff(passengersNum, numPrev["passengers"]);
        vehiclesPerc = percDiff(vehiclesNum, numPrev["vehicles"]);
        await generateGraph(dataCurrentMonth);
    };
    const generateGraph = async (passedData) => {
        let ctx = document.getElementById("borderGraph");
        let labels = [
            "San Ysidro",
            "Otay Mesa",
            "Tecate",
            "Andrade",
            "Calexico",
        ];
        let data = [];
        labels.forEach((element) => {
            let filter = passedData.filter((x) => x.port_name == element);
            let sum = filter.reduce((sum, { value }) => sum + Number(value), 0);
            data.push(sum);
        });
        graphBuilder.pieChart(labels, data, "# Crossings By Port", ctx);
    };
    const internationalCommerce = async () => {
        let ctx = document.getElementById("internationalCommerce");
        let data = [1000, 100, 5000, 10000, 20000, 1500];
        let labels = [
            "San Ysidro",
            "Hidalgo",
            "Detroit",
            "Andrade",
            "Otay Mesa",
            "Calexico",
        ];
        let labelell = "$ trade of port";
        graphBuilder.horizontalBar(labels, data, labelell, ctx);
    };
    const sentimentAnalysis = async () => {
        let ctx = document.getElementById("sentimentAnalysis");
        let data = [13.9, 36.1, 5.6, 5.6, 5.6, 5.6, 5.6, 5.6, 5.6];
        let labels = [
            "Covid-19",
            "Migracion",
            "Seguridad",
            "Politica Exterior",
            "Economia",
            "Energia",
            "Tecnologia",
            "Comercio",
            "Administracion Biden",
        ];
        let labelell = "$ trade of port";
        if (typeof window != "undefined") {
            graphBuilder.treeMap(labels, data, labelell, ctx);
        }
    };
    const formatCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    // pedestrian
    // personal vehicle passanger
    // bus passangers
</script>

<svelte:head>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
    />
    <!-- <script src="https://cdn.rawgit.com/Keyang/node-csvtojson/d41f44aa/browser/csvtojson.min.js"></script> -->
    <!-- <script src="https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js"></script>
    <script src="https://unpkg.com/tippy.js@6/dist/tippy-bundle.umd.js"></script> -->
    <!-- <script src="unpkg.com/treemap-chart"></script> -->
</svelte:head>
<div class="w3-top">
    <div class="w3-bar w3-blue w3-wide w3-padding w3-card">
        <a href="#home" class="w3-bar-item w3-button"
            ><b>SB</b> Smart Border Coalition
        </a>
        <!-- Float links to the right. Hide them on small screens -->
        <div class="w3-right w3-hide-small">
            <a href="#projects" class="w3-bar-item w3-button">Latest Data</a>
            <a href="#about" class="w3-bar-item w3-button">Articles</a>
            <a href="#contact" class="w3-bar-item w3-button">News</a>
            <a href="#contact" class="w3-bar-item w3-button">Research</a>
        </div>
    </div>
</div>
<div class="w3-container w3-padding-64" style="height: 100vh;">
    <div class="w3-row-padding" style="height: 100vh;">
        <div class="w3-third m6 s4 w3-margin-bottom">
            <div class="w3-card-4" style="height: 100vh">
                <header
                    class="w3-container"
                    style="background-color: #123C97; color: white; position: relative"
                >
                    <h1 class="w3-center">Crossings of People</h1>
                    <div style="position: absolute;top: 10px;right: 30px;">
                        <!-- <div class="tooltip"> -->

                        <!-- </div> -->
                        <!-- svelte-ignore a11y-missing-content -->
                        <a class="info" id="myButton" />
                    </div>
                </header>
                <div class="w3-left" style="padding: 0px 10px">
                    <p><em>In <b>{monthStr}, {yearStr}</b> </em></p>
                </div>
                <div class="w3-right" style="padding: 0px 10px">
                    <p>
                        <em>Compared to <b>{monthStr}, {yearStr - 1}</b> </em>
                    </p>
                </div>
                <div
                    class="w3-row-padding"
                    style="width: 100%; padding-top: 64px"
                >
                    <div class="w3-ul w3-left" style="width: 50%">
                        <h1 class=" s4">
                            <b>{pedestriansNumCommas}</b>
                        </h1>
                        <h4 class="">PEDESTRIANS</h4>
                    </div>
                    {#if Math.sign(pedestriansPerc) == -1}
                        <div class="w3-right" style="display: inline-flex">
                            <i
                                class="fas fa-angle-double-down fa-4x "
                                style="color: red; padding: 8px 5px"
                                aria-hidden="true"
                            />
                            <h3 style="margin-top: 20px">
                                {pedestriansPerc}%
                            </h3>
                        </div>
                    {/if}
                    {#if Math.sign(pedestriansPerc) == 1}
                        <div class="w3-right" style="display: inline-flex">
                            <i
                                class="fas fa-angle-double-up fa-4x "
                                style="color: green; padding: 8px 5px"
                                aria-hidden="true"
                            />
                            <h3 style="margin-top: 20px">
                                {pedestriansPerc}%
                            </h3>
                        </div>
                    {/if}
                </div>
                <div
                    class="w3-row-padding"
                    style="width: 100%; padding-top: 16px"
                >
                    <div class="w3-ul w3-left" style="width: 50%">
                        <h1 class=" s4">
                            <b>{passengersNumCommas}</b>
                        </h1>
                        <h4 class="">PASSENGERS *</h4>
                    </div>
                    {#if Math.sign(passengersPerc) == -1}
                        <div class="w3-right" style="display: inline-flex">
                            <i
                                class="fas fa-angle-double-down fa-4x "
                                style="color: red; padding: 8px 5px"
                                aria-hidden="true"
                            />
                            <h3 style="margin-top: 20px">
                                {passengersPerc}%
                            </h3>
                        </div>
                    {/if}
                    {#if Math.sign(passengersPerc) == 1}
                        <div class="w3-right" style="display: inline-flex">
                            <i
                                class="fas fa-angle-double-up fa-4x "
                                style="color: green; padding: 8px 5px"
                                aria-hidden="true"
                            />
                            <h3 style="margin-top: 20px">
                                {passengersPerc}%
                            </h3>
                        </div>
                    {/if}
                </div>
                <div
                    class="w3-row-padding"
                    style="width: 100%; padding-top: 16px"
                >
                    <div class="w3-ul w3-left" style="width: 50%">
                        <h1 class=" s4">
                            <b>{vehiclesNumCommas}</b>
                        </h1>
                        <h4 class="">VEHICLES **</h4>
                    </div>
                    {#if Math.sign(vehiclesPerc) == -1}
                        <div class="w3-right" style="display: inline-flex">
                            <i
                                class="fas fa-angle-double-down fa-4x "
                                style="color: red; padding: 8px 5px"
                                aria-hidden="true"
                            />
                            <h3 style="margin-top: 20px">
                                {vehiclesPerc}%
                            </h3>
                        </div>
                    {/if}
                    {#if Math.sign(vehiclesPerc) == 1}
                        <div class="w3-right" style="display: inline-flex">
                            <i
                                class="fas fa-angle-double-up fa-4x "
                                style="color: green; padding: 8px 5px"
                                aria-hidden="true"
                            />
                            <h3 style="margin-top: 20px">
                                {vehiclesPerc}%
                            </h3>
                        </div>
                    {/if}
                </div>
                <div class="w3-container w3-left w3-padding-16">
                    <h4 class="w3-text-gray">Source data: Bureau of Transportation Statistics.</h4>
                    <ul>
                        <li>
                            * Total passengers in personal vehicles, buses, and
                            trains
                        </li>
                        <li>
                            ** Total Vehicles includes personal vehicles, buses,
                            and trains
                        </li>
                    </ul>
                </div>
                <!-- <div class="chart-wrapper w3-center" style="height: 40vh;">
                    <canvas id="borderGraph" />
                </div> -->
            </div>
        </div>
        <div class="w3-third 13 m6 s4 w3-container w3-margin-bottom">
            <div class="w3-card-4" style="height: 100vh">
                <header
                    class="w3-container"
                    style="background-color: #228B22; color: white; position: relative"
                >
                    <h1 class="w3-center">Crossings of Goods</h1>
                    <div style="position: absolute;top: 10px;right: 30px;">
                        <!-- <div class="tooltip"> -->

                        <!-- </div> -->
                        <a class="info" id="myOtherButton" />
                    </div>
                </header>
                <div class="w3-left" style="padding: 0px 10px">
                    <p><em>In <b>{monthStr}, {yearStr}</b> </em></p>
                </div>
                <div class="w3-right" style="padding: 0px 10px">
                    <p>
                        <em>Compared to <b>{monthStr}, {yearStr - 1}</b> </em>
                    </p>
                </div>
                <div
                    class="w3-row-padding"
                    style="width: 100%; padding-top: 64px"
                >
                    <div class="w3-ul w3-left" style="width: 50%">
                        <h1 class=" s4">
                            <b>88, 188</b>
                        </h1>
                        <h4 class="">TRUCKS *</h4>
                    </div>
                        <div class="w3-right" style="display: inline-flex">
                            <i
                                class="fas fa-angle-double-up fa-4x "
                                style="color: green; padding: 8px 5px"
                                aria-hidden="true"
                            />
                            <h3 style="margin-top: 20px">
                                18.2%
                            </h3>
                        </div>
                
                </div>
                <div
                    class="w3-row-padding"
                    style="width: 100%; padding-top: 16px"
                >
                    <div class="w3-ul w3-left" style="width: 50%">
                        <h1 class=" s4">
                            <b>$4,266</b>
                        </h1>
                        <h4 class="">TOTAL TRADE VALUE  (IN MILLIONS) **</h4>
    
    
                    </div>

                    {#if Math.sign(passengersPerc) == 1}
                        <div class="w3-right" style="display: inline-flex">
                            <i
                                class="fas fa-angle-double-up fa-4x "
                                style="color: green; padding: 8px 5px"
                                aria-hidden="true"
                            />
                            <h3 style="margin-top: 20px">
                                18.2%
                            </h3>
                        </div>
                    {/if}
                </div>
                <div class="w3-left" style="padding: 0px 10px">
                    <p><em>In <b>Jan-Mar, {yearStr}</b> </em></p>
                </div>
                <div class="w3-right" style="padding: 0px 10px">
                    <p>
                        <em>Compared to <b>Jan-Mar, {yearStr - 1}</b> </em>
                    </p>
                </div>
                <div
                    class="w3-row-padding"
                    style="width: 100%; padding-top: 16px"
                >
                    <div class="w3-ul w3-left" style="width: 50%">
                        <h1 class=" s4">
                            <b>$11, 382</b>
                        </h1>
                        <h4 class="">TOTAL TRADE VALUE (IN MILLIONS) ***</h4>
                    </div>



                    {#if Math.sign(vehiclesPerc) == 1}
                        <div class="w3-right" style="display: inline-flex">
                            <i
                                class="fas fa-angle-double-up fa-4x "
                                style="color: green; padding: 8px 5px"
                                aria-hidden="true"
                            />
                            <h3 style="margin-top: 20px">
                                4.5%
                            </h3>
                        </div>
                    {/if}
                </div>
                <div class="w3-container w3-left w3-padding-16">
                    <h4 class="w3-text-gray">Source data: Bureau of Transportation Statistics.</h4>
                    <ul>
                        <li>
                            * Total northbound crossings of trucks
                        </li>
                        <li>
                            ** Total imports and exports for trucks
                        </li>
                        <li>
                            *** Total cumulative imports and exports for trucks
                        </li>
                    </ul>
                </div>
                <!-- <div class="chart-wrapper w3-center" style="height: 40vh;">
                    <canvas id="borderGraph" />
                </div> -->
            </div>
        </div>
        <div class="w3-third 13 m6 s4  w3-margin-bottom">
            <div class="w3-card-4" style="height: 100vh">
                <header
                    class="w3-container"
                    style="background-color: #849CC8; color: white;"
                >
                    <h1 class="w3-center">Sentiment Analysis</h1>
                </header>
                <div class="w3-padding-32">
                    <canvas id="sentimentAnalysis" />
                </div>

                <div class="w3-padding-32">
                    <h1 class="w3-center">Top-Mentioned topics in the news</h1>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .w3-container,
    h1,
    h5,
    span,
    li,
    h4,
    h3,
    p {
        font-family: "Raleway", sans-serif !important;
    }
    h1 {
        font-size: 2em;
    }
    a.info {
        position: relative;
        /* Anything but static */
        width: 1.5em;
        height: 1.5em;
        display: inline-block;
        color: white;
        font-weight: bold;
        font-size: 1em;
        line-height: 1em;
        background-color: #91b2d2;
        margin-left: 0.25em;
        -webkit-border-radius: 0.75em;
        -moz-border-radius: 0.75em;
        border-radius: 0.75em;
    }

    a.info:hover {
        background-color: #628cb6;
        cursor: hand;
        cursor: pointer;
    }

    a.info:before {
        content: "?";
        position: absolute;
        top: 0.25em;
        left: 0;
        text-indent: 0;
        display: block;
        width: 1.5em;
        text-align: center;
    }
</style>

