function homePage() {

}

function dashboard($scope, $http, $timeout) {

    var timeoutPromise;

    $scope.applyDefaults = {
        'enableSlider': false,
        'delayInMs': 2000,
        'init': true
    }
    $scope.listCompany = [
        'SPY',
        'C',
        'ESP',
        'MSFT'
    ];

    $scope.selectIndentlist = ['0', '0.0', '0.00']

    function convertTime(timeValue) {

        return timeValue.substring(0, timeValue.length - 2)
    }

    $scope.default = {
        "startDate": new Date(new Date().toDateString() + ' ' + '09:30:00.000'),
        "endDate": new Date(new Date().toDateString() + ' ' + '11:30:00.000')
    }
    $scope.selectIndent = '0.00';

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
            var tempObject = []
            $scope.data = data.data;

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
                        timeoutPromise = $timeout(function () {   //Set timeout
                            chart.valueAxes[1].minimum = $scope.slider.min;
                            chart.valueAxes[1].maximum = $scope.slider.max;
                            chart.validateNow();
                        }, $scope.applyDefaults.delayInMs);
                    }
                }
            }
            angular.forEach(data.data, function (key) {
                tempObject.push(
                    {
                        'time': key.time,
                        'volume': parseInt(key.size),
                        'price': parseFloat(key.price)
                    }
                )
            })
            var chart = AmCharts.makeChart("chartdiv", {
                "type": "serial",
                "theme": "light",
                "dataDateFormat": "HH:mm:ss",
                "precision": 2,
                "valueAxes": [{
                    "id": "v1",
                    "title": "Volume",
                    "position": "left",
                    "autoGridCount": false,
                }, {
                    "id": "v2",
                    "title": "Price",
                    "gridAlpha": 0,
                    "position": "right",
                    "autoGridCount": false,
                    "labelFunction": function (value) {
                        return "$" + value;
                    },
                }],
                "graphs": [{
                    "id": "g4",
                    "valueAxis": "v1",
                    "lineColor": "#00416e",
                    "fillColors": "#00416e",
                    "fillAlphas": 1,
                    "type": "column",
                    "title": "Volume",
                    "valueField": "volume",
                    "clustered": false,
                    "columnWidth": 0.3,
                    "legendValueText": "[[value]]",
                    "balloonText": "[[title]]<br /><b style='font-size: 130%'>[[value]]</b>"
                }, {
                    "id": "g1",
                    "valueAxis": "v2",
                    "bulletColor": 0,
                    "lineThickness": 1,
                    "lineColor": "#ff0000",
                    "type": "smoothedLine",
                    "title": "Price",
                    "useLineColorForBulletBorder": true,
                    "valueField": "price",
                    "balloonText": "[[title]]<br /><b style='font-size: 130%'>[[value]]</b>"
                }],
                "chartCursor": {
                    "pan": true,
                    "valueLineEnabled": true,
                    "valueLineBalloonEnabled": true,
                    "cursorAlpha": 0,
                    "valueLineAlpha": 0.2
                },
                "rotate": true,
                "categoryField": "time",
                "categoryAxis": {
                    "parseDates": false,
                    "dashLength": 1,
                    "minorGridEnabled": false
                },
                "legend": {
                    "useGraphSettings": true,
                    "position": "top"
                },
                "balloon": {
                    "borderThickness": 1,
                    "shadowAlpha": 0
                },
                "export": {
                    "enabled": true
                },
                'dataProvider': tempObject
            })
            chart.addListener("axisChanged", $scope.changeAxisValue);
            $scope.applyDefaults = {
                'enableSlider': true,
                'init': false
            }
        });
    };
};