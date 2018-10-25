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
            console.log(data.data);
        })
    }

}