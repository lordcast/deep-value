function homePage(){

}

function dashboard($rootScope, $scope, $http, $filter){
    $scope.listCompany = [
        'SPY', 
        'C', 
        'ESP', 
        'MSFT'
    ];
    $scope.selectIndentlist = ['0', '0.0', '0.00']

    $scope.default = {
        "startDate": new Date (new Date().toDateString() + ' ' + '09:30:01'),
        "endDate": new Date (new Date().toDateString() + ' ' + '11:30:01')
    } 
    $scope.selectIndent = '0.00';

    $scope.buildChart = function(){
        $scope.startDate_send =  document.getElementById('example_start_Input').value
        $scope.endDate_send = document.getElementById('example_end_Input').value
        $http({
            method: 'GET',
            url: '/query',
            params: {
                "sym": $scope.selectedCompany,
                "startTime": $scope.startDate_send,
                "endTime": $scope.endDate_send
            }
        }).then(function(data){
            console.log(data);
              var tempObject = {
                'volume': [],
                'price':  []
            }
            angular.forEach(data.data, function(key){
                tempObject.volume.push([key['time'], key["size"]])
                tempObject.price.push([key['time'], key['price']])
            })
            $scope.options = {
                chart: {
                    type: 'linePlusBarChart',
                    height: 500,
                    margin: {
                        top: 30,
                        right: 75,
                        bottom: 50,
                        left: 75
                    },
                    bars: {
                        forceY: [0]
                    },
                    bars2: {
                        forceY: [0]
                    },
                    color: ['#2ca02c', 'darkred'],
                    x: function(d,i) { return i },
                    xAxis: {
                        axisLabel: 'X Axis',
                        tickFormat: function(d) {
                            var dx = $scope.data[0].values[d] && $scope.data[0].values[d].x || 0;
                            if (dx > 0) {
                                return dx
                            }
                            return null;
                        }
                    },
                    x2Axis: {
                        tickFormat: function(d) {
                            var dx = $scope.data[0].values[d] && $scope.data[0].values[d].x || 0;
                            return dx
                        },
                        showMaxMin: false
                    },
                    y1Axis: {
                        axisLabel: 'Y1 Axis',
                        tickFormat: function(d){
                            return d3.format(',f')(d);
                        },
                        axisLabelDistance: 12
                    },
                    y2Axis: {
                        axisLabel: 'Y2 Axis',
                        tickFormat: function(d) {
                            return '$' + d3.format(',.2f')(d)
                        }
                    },
                    y3Axis: {
                        tickFormat: function(d){
                            return d3.format(',f')(d);
                        }
                    },
                    y4Axis: {
                        tickFormat: function(d) {
                            return '$' + d3.format(',.2f')(d)
                        }
                    }
                }
            };
    
            $scope.data = [
                {
                    "key" : "Quantity" ,
                    "bar": true,
                    "values" : tempObject.volume
                },
                {
                    "key" : "Price" ,
                    "values" : tempObject.price
                }
            ].map(function(series) {
                    series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
                    return series;
                });
        })
    }

}