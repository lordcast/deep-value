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
            $scope.slider = {
                'value': 0.01,
                'options': {
                    'floor': 0.01,
                    'ceil': 0.10,
                    'step': 0.01,
                    'precision': 10,
                    'minLimit': 0.01,
                    'maxLimit': 0.1,
                    'showTicks': true,
                    'onEnd': function (id) {
                        $timeout.cancel($scope.applyDefaults.timeoutPromise);  //does nothing, if timeout alrdy done
                        timeoutPromise = $timeout(function () {
                            chart.dataProvider = $scope.dataFormatter($scope.httpGetData)
                            chart.validateData();
                        }, $scope.applyDefaults.delayInMs);
                    }
                }
            }
            $scope.httpGetData = data.data;
            $scope.data = $scope.dataFormatter(data.data);
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
                    "valueField": "volume",
                 } ],
                "categoryField": "price",
                "categoryAxis": {
                    "inside": false,
                }
            })
            chart.addListener("axisChanged", $scope.changeAxisValue);
            $scope.changeIndent = function(){
                if(!$scope.init){
                    chart.dataProvider = $scope.dataFormatter($scope.httpGetData)
                    chart.validateData();
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
                    'price': ((parseFloat(key.price)/$scope.slider.value).toFixed(0)*$scope.slider.value).toFixed(2)
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
