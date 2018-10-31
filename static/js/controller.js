function homePage() {

}

function dashboard($scope, $http, $timeout) {

    var timeoutPromise;

    $scope.applyDefaults = {
        'enableSlider': false,
        'delayInMs': 2000,
        'init': true,
        }
    $scope.initData = {
        'listCompany':['SPY','C','ESP','MSFT'],
        'indent': [{
            'value': '0',
            'toFixed': 0
        },
        {
            'value': '0.0',
            'toFixed': 1
        },
        {
            'value': '0.00',
            'toFixed': 2
        },
        {
            'value': '0.000',
            'toFixed': 3
        }

    ]
    }

    function convertTime(timeValue) {

        return timeValue.substring(0, timeValue.length - 2)
    }

    $scope.default = {
        "startDate": new Date(new Date().toDateString() + ' ' + '09:30:00.000'),
        "endDate": new Date(new Date().toDateString() + ' ' + '11:30:00.000')
    }
    $scope.selectedIndent = 2

    $scope.buildChart = function () {
        $scope.startDate_send = document.getElementById('example_start_Input').value
        $scope.endDate_send = document.getElementById('example_end_Input').value
        $http({
            method: 'GET',
            url: '/query',
            params: {
                "sym": $scope.selectedCompany,
                "startTime": $scope.startDate_send,
                "endTime": $scope.endDate_send
            }
        }).then(function (data) {
            $scope.httpGetData = data.data;
            $scope.data = $scope.dataFormatter(data.data);
            $scope.slider = {
                'min': Math.min.apply(Math, $scope.data.map(function (item) { return item.price; })),
                'max': Math.max.apply(Math, $scope.data.map(function (item) { return item.price; })),
                'options': {
                    'floor': Math.min.apply(Math, $scope.data.map(function (item) { return item.price; })),
                    'ceil': Math.max.apply(Math, $scope.data.map(function (item) { return item.price; })),
                    'step': 0.01,
                    'precision': 10,
                    'logScale': true,
                    'onEnd': function (id) {
                        $timeout.cancel($scope.applyDefaults.timeoutPromise);  //does nothing, if timeout alrdy done
                        timeoutPromise = $timeout(function () {
                            console.log(chart.dataProvider);
                            chart.valueAxes[0].minimum = $scope.slider.min;
                            chart.valueAxes[0].maximum = $scope.slider.max;
                            chart.validateNow();
                        }, $scope.applyDefaults.delayInMs);
                    }
                }
            }
            var chart = AmCharts.makeChart("chartdiv", {
                "type": "serial",
                "theme": "light",
                "rotate": true,
                "dataProvider": $scope.data,
                "valueAxes": [ {
                    "gridAlpha": 0.2,
                    "dashLength": 0,
                    "position": "right"
                   } ],
                  "startDuration": 1,
                "columnWidth": 0.4,
                "graphs": [ {
                    "balloonText": "[[category]]: <b>[[value]]</b>",
                    "fillAlphas": 1,
                    "lineAlpha": 0.2,
                    "type": "column",
                    "valueField": "price",
                 } ],
                "categoryField": "volume",
                "categoryAxis": {
                    "inside": false,
                }
            })
            chart.addListener("axisChanged", $scope.changeAxisValue);
            $scope.changeIndent = function(){
                if(!$scope.init){
                    chart.dataProvider = $scope.dataFormatter($scope.httpGetData)
                    chart.validateData();
                    $scope.$broadcast('reCalcViewDimensions');
                }
            }
            $scope.applyDefaults = {
                'enableSlider': true,
                'init': false
            }
        });
    };

    $scope.dataFormatter = function(getData){
        var tempObject = [];
        angular.forEach(getData, function (key) {
            tempObject.push(
                {
                    'volume': parseInt(key.size),
                    'price': parseFloat(key.price).toFixed($scope.selectedIndent)
                }
            )
        });
        $scope.subByValue = _(tempObject)
        .groupBy('price')
        .map((objs, key) => ({
           'price': key,    
           'volume': _.sumBy(objs, 'volume'),
       })) 
       .value();
       return $scope.subByValue
    }


};