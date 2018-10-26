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

    $scope.convertTime = function(timeValue){
        return timeValue.substring(0, timeValue.length - 2)
    }

    $scope.default = {
        "startDate": new Date (new Date().toDateString() + ' ' + '09:30:00.0'),
        "endDate": new Date (new Date().toDateString() + ' ' + '11:30:00.0')
    } 
    $scope.selectIndent = '0.00';

    $scope.buildChart = function(){
        $scope.startDate_send =  $scope.convertTime(document.getElementById('example_start_Input').value)
        $scope.endDate_send = $scope.convertTime(document.getElementById('example_end_Input').value)
        
        $http({
            method: 'GET',
            url: '/query',
            params: {
                "sym": $scope.selectedCompany,
                "startTime": $scope.startDate_send,
                "endTime": $scope.endDate_send
            }
        }).then(function(data){
              var tempObject = []
            angular.forEach(data.data, function(key){
                tempObject.push(
                    {
                        'time': key.time,
                        'volume': parseInt(key.size),
                        'price': parseFloat(key.price)
                    }
                )
            })
            console.log(tempObject)
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
                  "labelFunction": function(value) {
                    return "$" + value;
                  },
                }],
                "graphs": [{
                  "id": "g4",
                  "valueAxis": "v1",
                  "lineColor": "#62cf73",
                  "fillColors": "#62cf73",
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
                  "minorGridEnabled": true
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
        }); // delay chart render by 1 second        
}
};