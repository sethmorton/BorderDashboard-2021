
export default class graphBuilder {
    static async pieChart(labels, data, ellabel, element) {
        let newChart = new Chart(element, {
            height: 300,
            width: 300,
            type: 'pie',
            data: {
                "labels": labels,
                datasets: [{
                    label: ellabel,
                    "data": data,
                    backgroundColor: [
                        '#123C97',
                        '#C1384C',
                        '#090909',
                        '#849CC8',
                        '#ffa500',
                    ],
                    borderColor: '#000000',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        })
    }
    static async horizontalBar(labels, data, ellabel, element) {
        console.log(labels, data, ellabel, element)
        let newChart = new Chart(element, {
            type: 'horizontalBar',
            data: {
                "labels": labels,
                datasets: [{
                    label: ellabel,

                    "data": data,
                    backgroundColor: [
                        '#123C97',
                        '#C1384C',
                        '#090909',
                        '#849CC8',
                        '#ffa500',
                        '#cd6070',
                        '#5977b6',
                        '#270b0f',
                        '#c74c5e'
                    ],
                    borderColor: '#000000',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
            }
        })
    }
    static async treeMap(labels, data, ellabel, element) {
        let tree = []
        data.forEach((x, i) => {
            tree.push({ value: x, title: labels[i] })
        });
        console.log(tree)
        let chart = new Chart(element, {
            type: 'treemap',
            data: {
                label: "Sample with labels",
                datasets: [{
                    tree: tree,
                    key: "value",
                    fontColor: "white",
                    fontSize: 12,
                    groups: ['title'],
                    color: '#000',
                    backgroundColor: [
                        '#123C97',
                        '#C1384C',
                        '#090909',
                        '#849CC8',
                        '#ffa500',
                        '#cd6070',
                        '#5977b6',
                        '#270b0f',
                        '#c74c5e'
                    ],
                    rtl: false // control in which direction the squares are positioned
                }]
            },
            options: {
                legend: { display: false },
                tooltips: {
                    callbacks: {
                    title: function (tooltipItem, data) { 
                        console.log(tooltipItem[0].index)
                        let dataset = data.datasets[0].data[tooltipItem[0].index]
                        console.log(dataset)
                        var { g } = dataset;
                        return g; 
                    },
                      label: function(tooltipItem, data) {
                        //get the concerned dataset
                        let dataset = data.datasets[tooltipItem.datasetIndex];
                        //calculate the total of this data set
                        console.log(dataset)
                        let total = dataset.data.reduce((a, {v}) => {
                          return a + v;
                        }, 0);
                        console.log(total)
                        //get the current items value
                        var { v } = dataset.data[tooltipItem.index];
                        console.log(v / 100)
                        //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
                        var percentage = Math.floor(((v/total) * 100)+0.5);
                        console.log(percentage)
                        return percentage + "%";
                      }
                    }
                  } 
            }
        });
        //     });
        //     let myChart = Treemap().data({
        //         name: 'main',
        //         color: 'magenta',
        //         children: [{
        //           name: 'a',
        //           color: 'yellow',
        //           size: 1
        //         },{
        //           name: 'b',
        //           color: 'red',
        //           children: [{
        //             name: 'ba',
        //             color: 'orange',
        //             size: 1
        //           }, {
        //             name: 'bb',
        //             color: 'blue',
        //             children: [{
        //               name: 'bba',
        //               color: 'green',
        //               size: 1
        //             }, {
        //               name: 'bbb',
        //               color: 'pink',
        //               size: 1
        //             }]
        //           }]
        //         }]
        //       })     .size('size')
        //       .color('color').width(100).height(100)(element)
    }
}