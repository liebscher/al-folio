document.addEventListener('DOMContentLoaded', function () {
    var myChart = Highcharts.chart('container', {
        title: {
            text: 'Improving Estimation of Days Remaining on "The Brothers Karamazov"'
        },
        yAxis: {
            title: {
                text: 'Days until Completion'
            }
        },
        xAxis: {
            title: {
                text: 'Day Logged'
            }
        },
        tooltip: {
            crosshairs: [true, true],
            shared: true,
        },
        series: [{
            name: 'Days Remaining',
            data: [[2, 47],
                  [3, 41],
                  [4, 44],
                  [5, 42],
                  [6, 39],
                  [7, 38],
                  [8, 38],
                  [9, 35],
                  [10, 36],
                  [11, 37],
                  [12, 36],
                  [13, 31],
                  [14, 31],
                  [15, 30],
                  [16, 29],
                  [17, 29]],
            zIndex: 1,
            color: '#ad1d13',
            marker: {
                fillColor: 'white',
                lineWidth: 2,
                lineColor: '#ad1d13'
            }
        },
        {
            name: 'Simple',
            data: [[2, 38.11],
                  [3, 33.99],
                  [4, 33.75],
                  [5, 33.06],
                  [6, 31.80],
                  [7, 29.75],
                  [8, 28.80],
                  [9, 27.76],
                  [10, 26.54],
                  [11, 26.06],
                  [12, 25.91],
                  [13, 26.01],
                  [14, 24.73],
                  [15, 24.17],
                  [16, 23.49],
                  [17, 22.90]],
              zIndex: 1,
              color: '#000000',
              dashStyle: 'Dot',
              marker: {
                  fillColor: 'white',
                  lineWidth: 2,
                  lineColor: '#000000'
              }
        },{
            name: '89% Credible Interval',
            data: [[2, 32, 62],
                  [3, 30, 53],
                  [4, 33, 54],
                  [5, 33, 51],
                  [6, 32, 48],
                  [7, 31, 45],
                  [8, 31, 45],
                  [9, 29, 41],
                  [10, 30, 43],
                  [11, 31, 43],
                  [12, 30, 41],
                  [13, 26, 36],
                  [14, 26, 36],
                  [15, 25, 35],
                  [16, 24, 35],
                  [17, 24, 34]],
            type: 'arearange',
            lineWidth: 0,
            linkedTo: ':previous',
            opacity: 0.3,
            color: 'red',
            zIndex: 0,
            marker: {
                enabled: false
            }
        }, {
            name: '45% Credible Interval',
            data: [[2, 39, 54],
                  [3, 35, 47],
                  [4, 38, 49],
                  [5, 38, 47],
                  [6, 36, 44],
                  [7, 35, 41],
                  [8, 35, 41],
                  [9, 32, 38],
                  [10, 33, 39],
                  [11, 34, 40],
                  [12, 33, 38],
                  [13, 28, 33],
                  [14, 28, 34],
                  [15, 27, 32],
                  [16, 27, 32],
                  [17, 27, 31]],
            type: 'arearange',
            lineWidth: 0,
            linkedTo: ':previous',
            opacity: 0.3,
            color: 'red',
            zIndex: 0,
            marker: {
                enabled: false
            }
        }]
    });
});
