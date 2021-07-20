console.log('popup.js loaded');

let myAmazonHistory = angular.module("myamazonhistory", ['ui.router']);

myAmazonHistory.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '../views/home.html'
		})
		.state('login', {
			url: '/login',
			templateUrl: '../views/login.html'
		})
		.state('signup', {
			url: '/signup',
			templateUrl: '../views/signup.html'
		})
		.state('welcome', {
			url: '/welcome',
			templateUrl: '../views/welcome.html'
		})
		.state('search-options', {
			url: '/search-options',
			templateUrl: '../views/search-options.html'
		})
		
		

	$urlRouterProvider.otherwise('login')
})

myAmazonHistory.controller("PopupCtrl", ['$scope', '$state', function($scope, $state){
	console.log('PopupCtrl Initialized');

	$scope.onPopupInit = function() {
        console.log('ran $scope.onPopupInit function');
        chrome.runtime.sendMessage({type:"onPopupInit"}, 
            function(response){
                console.log('this is the response from the background page for onPopupInit message',response);
                if(response.user == null){
                    console.log('no user logged in yet - show signup/login screen')
                } else {
                    $scope.name = response.user.name;
                    $state.go('welcome');
                }
            }
        );
    };

    $scope.onPopupInit();

	$scope.login = function(formData){
		console.log('formData from Login: ', formData);
		chrome.runtime.sendMessage({type: "login", data: formData},
			function(response){
				console.log('response from the background is: ', response);
				if(response.user){
					$scope.name = response.user.username; 
					$state.go('welcome');	
				}
				
			} 
		)
	}

	$scope.signup = function(formData){
		console.log('formData from Signup: ', formData);
		chrome.runtime.sendMessage({type: "signup", data: formData},
			function(response){
				console.log('response from the background is: ', response);
				if(response.token){
					$state.go('login');
				}
			} 
		)
	}

}]);
