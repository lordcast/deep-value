'use strict'

var app = angular.module('stkapp', [
    'ui.router',
    'oc.lazyLoad',
    'ui.bootstrap',
    'angular-loading-bar',
    'angularModalService',
]);
app.config(function ($urlRouterProvider,
    $stateProvider,
    $ocLazyLoadProvider,
    cfpLoadingBarProvider,
    $locationProvider,
) {
    $ocLazyLoadProvider.config({
        'debug': false,
        'events': false,
        'modules': [
            {
                name: 'nvd3',
                files: ['mod/d3/d3.js', 'mod/nvd3/build/nv.d3.js', 'mod/nvd3/build/nv.d3.css', '/mod/angular-nvd3/dist/angular-nvd3.js'],
                serie: true
            },
            {
                name: 'ploty',
                files:['https://www.amcharts.com/lib/3/amcharts.js', 'https://www.amcharts.com/lib/3/serial.js', 'https://www.amcharts.com/lib/3/plugins/export/export.min.js', 'https://www.amcharts.com/lib/3/plugins/export/export.css', 'https://www.amcharts.com/lib/3/themes/light.js'],
                serie: true
            }
        ]
    });
    cfpLoadingBarProvider = {
        includeSpinner: true,
        latencyThreshold: 0,    
    }

    //for main content
    $stateProvider.state('home', {
        url: '/',
        templateUrl: '/views/partials/index.html',
        controller: homePage
    })
    .state('dashboard', {
        url: '/dashboard',
        templateUrl: '/views/partials/dashboard.html',
        controller: dashboard,
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', '$window', function ($ocLazyLoad, $window) {
                return $ocLazyLoad.load(['ploty']);
            }]
        }
    })
    $urlRouterProvider.otherwise('/')
    $locationProvider.html5Mode(true);
});