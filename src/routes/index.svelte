<script>
	import axios from "axios";
	import { onMount } from "svelte";
	import { DateTime } from "luxon";
	import graphBuilder from "../includes/graph-builder";
	let crossingsCurrentMonth = 0;
	$: crossingsCurrentMonthCommas = formatCommas(crossingsCurrentMonth);
	$: percentDif = 0;
	$: yearStr = 0;
	$: monthStr = "";
	onMount(async () => {
		borderCrossings();
		internationalCommerce();
		sentimentAnalysis();
	});
	const borderCrossings = async () => {
		// Define Dates For Query
		let month = DateTime.now().month;
		let year = DateTime.now().year;
		let startDate = `${year - 1}-01-01T00:00:00.000`;
		let endDate = `${year}-${("0" + month).slice(-2)}-01T00:00:00.000`;
		console.log(
			`https://data.transportation.gov/resource/keg4-3bc2.json?$limit=100000&$where=date between '${startDate}' and '${endDate}'&border=US-Mexico Border&state=California`
		);
		let { data } = await axios.get(
			`https://data.transportation.gov/resource/keg4-3bc2.json?$limit=100000&$where=date between '${startDate}' and '${endDate}'&border=US-Mexico Border&state=California`
		);
		let lastDate = DateTime.fromISO(
			data.reduce((a, { date }) => (a > date ? a : date), 0)
		);
		console.log(lastDate);
		monthStr = lastDate.monthLong;
		yearStr = lastDate.year;
		let dataCurrentMonth = data.filter(
			(x) =>
				x.date ==
				`${lastDate.year}-${("0" + lastDate.month).slice(
					-2
				)}-01T00:00:00.000`
		);
		crossingsCurrentMonth = dataCurrentMonth.reduce(
			(sum, { value }) => sum + Number(value),
			0
		);
		let dataYearAgoMonth = data.filter(
			(x) =>
				x.date ==
				`${lastDate.year - 1}-${("0" + lastDate.month).slice(
					-2
				)}-01T00:00:00.000`
		);
		let crossingsYearAgoMonth = dataYearAgoMonth.reduce(
			(sum, { value }) => sum + Number(value),
			0
		);
		percentDif =
			Math.round(
				((crossingsYearAgoMonth - crossingsCurrentMonth) /
					crossingsYearAgoMonth) *
					100 *
					100
			) / 100;
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
		let labels = ["San Ysidro", "Hidalgo", "Detroit", "Andrade", "Otay Mesa", "Calexico"];
		let labelell = "$ trade of port";
		graphBuilder.horizontalBar(labels, data, labelell, ctx);
	};
	const sentimentAnalysis = async () => {
		let ctx = document.getElementById('sentimentAnalysis')
		let data = [13.9, 36.1, 5.6, 5.6, 5.6, 5.6, 5.6, 5.6, 5.6];
		let labels = ["Covid-19", "Migracion", "Seguridad", "Politica Exterior", "Economia", "Energia", "Tecnologia", "Comercio", "Administracion Biden"];
		let labelell = "$ trade of port";
		if (typeof window != "undefined") {
			graphBuilder.treeMap(labels, data, labelell, ctx)
		}
	}
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
	<!-- <script src="unpkg.com/treemap-chart"></script> -->
</svelte:head>
<div class="w3-top">
	<div class="w3-bar w3-black w3-wide w3-padding w3-card">
	  <a href="#home" class="w3-bar-item w3-button"><b>SB</b> Smart Border Coallition	</a>
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
	<div class="w3-row-padding" style="height: 90vh;">
		<div class="w3-third m6 s4 w3-margin-bottom">
			<div class="w3-card-4" style="height: 90vh">
				<header class="w3-container" style="background-color: #123C97; color: white;">
					<h1 class="w3-center">Border Crossings</h1>
				</header>
				<h1 class="w3-margin-top w3-center s4">
					{crossingsCurrentMonthCommas}
				</h1>
				<h5 class="w3-center">Personal crossings in {monthStr}, {yearStr} </h5>
				<div class="w3-center">
					{#if Math.sign(percentDif) == -1}
					<div class="w3-bar">
						<i
							class="fas fa-angle-double-down fa-5x w3-bar-item"
							style="color: red"
							aria-hidden="true"
						/> <h1 class="w3-bar-item">{percentDif}%</h1>
					</div>
					{/if}
					{#if Math.sign(percentDif) == 1}
					<div class="w3-bar">
						<i
						class="fas fa-angle-double-up fa-5x w3-bar-item"
						style="color: green;"
						aria-hidden="true"
					/><h1>{percentDif}%</h1>
				
					</div>
					{/if}
				</div>
				<h5 class="w3-center">
					Compared to {monthStr}, {yearStr - 1}
				</h5>
				<div class="chart-wrapper w3-center" style="height: 40vh;">
					<canvas id="borderGraph" ></canvas>
				</div>

			</div>
		</div>
		<div class="w3-third 13 m6 s4 w3-container w3-margin-bottom">
			<div class="w3-card-4"style="height: 90vh">
				<header class="w3-container " style="background-color: #C1384C; color: white;">
					<h1>International Commerce</h1>
				</header>
				<h1 class="w3-margin-top w3-center s4">
					$7.3B <span style="font-size: 1em; color: gray">USD</span>
				</h1>
				<h5 class="w3-center">Regional border trade value so far in 2021 (updated Feb)</h5>
				<div class="w3-center">
					{#if Math.sign(percentDif) == -1}
					<div class="w3-bar">
						<i
							class="fas fa-angle-double-down fa-5x w3-bar-item"
							style="color: red"
							aria-hidden="true"
						/> <h1 class="w3-bar-item">-1.4%</h1>
					</div>
					{/if}
					{#if Math.sign(percentDif) == 1}
					<div class="w3-bar">
						<i
						class="fas fa-angle-double-up fa-5x w3-bar-item"
						style="color: green;"
						aria-hidden="true"
					/><h1>{percentDif}%</h1>
				
					</div>
					{/if}
				</div>
				<h5 class="w3-center">
					Compared to {monthStr}, {yearStr - 1}
				</h5>
				<div class="chart-wrapper w3-center w3-padding-16" style="height: 40vh;">
					<canvas id="internationalCommerce" ></canvas>
				</div>
			</div>
		</div>
		<div class="w3-third 13 m6 s4  w3-margin-bottom">
			<div class="w3-card-4"style="height: 90vh">
				<header class="w3-container"style="background-color: #849CC8; color: white;">
					<h1 class="w3-center">Sentiment Analysis</h1>
				</header>
				<div class="w3-padding-32">
					<canvas id="sentimentAnalysis"></canvas>
				</div>
				
				<div class="w3-padding-32">
					<h1 class="w3-center">Top-Mentioned topics in the news</h1>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.w3-container, h1, h5, span{
		font-family: 'Raleway', sans-serif !important;
	}
	h1 {
		font-size: 2em;
	}
</style>
