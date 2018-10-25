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
            var chart = AmCharts.makeChart("chartdiv", {
                "type": "serial",
                "theme": "light",
                "handDrawn":true,
                "handDrawScatter":3,
                "legend": {
                    "useGraphSettings": true,
                    "markerSize":12,
                    "valueWidth":0,
                    "verticalGap":0
                },
                "dataProvider": tempObject,
                "valueAxes": [{
                    "minorGridAlpha": 0.08,
                    "minorGridEnabled": true,
                    "position": "top",
                    "axisAlpha":0
                }],
                "startDuration": 0,
                "graphs": [{
                    "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b></span>",
                    "title": "Volume",
                    "type": "column",
                    "fillAlphas": 0.8,
            
                    "valueField": "volume"
                }, {
                    "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b></span>",
                    "bullet": "round",
                    "bulletBorderAlpha": 1,
                    "bulletColor": "#FFFFFF",
                    "useLineColorForBulletBorder": true,
                    "fillAlphas": 0,
                    "lineThickness": 2,
                    "lineAlpha": 1,
                    "bulletSize": 7,
                    "title": "Price",
                    "valueField": "price"
                }],
                "rotate": true,
                "categoryField": "time",
                "categoryAxis": {
                    "gridPosition": "start"
                },
                "export": {
                    "enabled": true
                 }
            
            }); // delay chart render by 1 second        
    })
}
}