// create the module and name it scotchApp
var dnApp = angular.module('dnApp', ['ngRoute', 'ngCookies', 'ngMaterial', 'ngMessages']);


dnApp.config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();
	
		return year + '/' + (monthIndex + 1) + '/' + day;
    };
});

// configure our routes
dnApp.config(function ($routeProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl: 'pages/home.html',
			controller: 'homeController'
		})

        // route for the history page
		.when('/history', {
			templateUrl: 'pages/history.html',
			controller: 'historyController'
		})
        
		// route for the booking page
		.when('/booking', {
			templateUrl: 'pages/booking.html',
			controller: 'bookingController'
		})

		// route for the main page
		.when('/main', {
			templateUrl: 'pages/main.html',
			controller: 'mainController'
		})

		// route for the snack page
		.when('/snack', {
			templateUrl: 'pages/snack.html',
			controller: 'snackController'
		})

		// route for the breakfast page
		.when('/breakfast', {
			templateUrl: 'pages/breakfast.html',
			controller: 'breakfastController'
		})

		// route for the beverage page
		.when('/beverage', {
			templateUrl: 'pages/beverage.html',
			controller: 'beverageController'
		})

		// route for the checkout page
		.when('/checkout', {
			templateUrl: 'pages/checkout.html',
			controller: 'checkoutController'
		})

		// route for the contact page
		.when('/signin', {
			templateUrl: 'pages/login.html',
			controller: 'signinController'
		});
});

dnApp.factory('UserService', function () {
	return {
		signedin: 'N'
	};
});

// create the controller and inject Angular's $scope
dnApp.controller('menuController', function ($scope) {

});

// create the controller and inject Angular's $scope
dnApp.controller('historyController', function ($scope, $rootScope, $http, $timeout, $cookies, UserService) {
    $scope.userid = $cookies.get('userid');
	$http({
		method: "GET",
		url: "php/history.php",
		params: { uid: $scope.userid }
	}).then(function mySuccess(response) {
		$scope.recordItems = response.data;
	}, function myError(response) {
		$scope.recordItems = response.status;
	});
});

// create the controller and inject Angular's $scope
dnApp.controller('bookingController', function ($scope, $rootScope, $http, $timeout, $cookies, UserService) {
	$scope.hours = ["09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"];
	$scope.minutes = ["00", "30"];

	//$scope.bkDate = new Date();

	$scope.errorMessage = false;

	$scope.booking = function () {
		$scope.userid = $cookies.get('userid');

		if ($scope.userid == undefined) {
			$scope.errorMessage = "Please login!";
			return;
		}

		if ($scope.bkDate == undefined) {
			$scope.errorMessage = "Please input booking date!";
			return;
		} else {
            $scope.bkDate = $scope.bkDate.getFullYear() + '/' + ($scope.bkDate.getMonth() + 1) + '/' + $scope.bkDate.getDate();
        }

		if ($scope.fmHour == undefined) {
			$scope.errorMessage = "Please select hour!";
			return;
		}

		if ($scope.fmMinute == undefined) {
			$scope.errorMessage = "Please select minute!";
			return;
		}

		if ($scope.noOfPerson == undefined) {
			$scope.errorMessage = "Please input number of person!";
			return;
		}

		$http({
			method: "GET",
			url: "php/booking.php",
			params: { uid: $scope.userid, 
					  bookingdate: $scope.bkDate, 
					  bookingstarttime: $scope.fmHour + ':' + $scope.fmMinute, 
                      bookingfinishtime: parseInt($scope.fmHour) + 1 + ':' + $scope.fmMinute, 
					  bookingattendance: $scope.noOfPerson
					}
		}).then(function mySuccess(response) {
			$scope.bookingStatus = response.data;
            
            if ( $scope.bookingStatus.status == 200 ) {
                $scope.bookingMessage = "Your booking is successfully created!";
                $scope.errorMessage = false;
                $timeout(function () {
                    $scope.bookingMessage = false;
                }, 5000);
            }
            else {
                $scope.bookingMessage = $scope.bookingStatus.error;
                $timeout(function () {
                    $scope.bookingMessage = false;
                }, 100000);
            }
		}, function myError(response) {
			$scope.bookingStatus = response.status;
		});
	};

});

dnApp.controller('homeController', function ($scope) {

});

dnApp.controller('mainController', function ($scope, $http, $timeout, $cookies, UserService) {
	if (UserService.signedin == 'Y') {
		$scope.showOrder = true;
	} else {
		$scope.showOrder = false;
	}

	$http({
		method: "GET",
		url: "php/menu.php",
		params: { menutype: 'main' }
	}).then(function mySuccess(response) {
		$scope.menuItems = response.data;
	}, function myError(response) {
		$scope.menuItems = response.status;
	});

	$scope.placeOrder = function (OrderedMenuID) {
		$scope.userid = $cookies.get('userid');

		if ($scope.userid == undefined) {
			$scope.errorMessage = "Please login!";
			return;
		}

		$http({
			method: "GET",
			url: "php/order.php",
			params: { menuID: OrderedMenuID,
					  uid: $scope.userid }
		}).then(function mySuccess(response) {
			$scope.orderStatus = response.data;
			$scope.orderMessage = "Order added to cart!";
			$timeout(function () {
				$scope.orderMessage = false;
			}, 1000);
		}, function myError(response) {
			$scope.orderStatus = response.status;
		});
	};
});

dnApp.controller('snackController', function ($scope, $http, $timeout, $cookies, UserService) {
	if (UserService.signedin == 'Y') {
		$scope.showOrder = true;
	} else {
		$scope.showOrder = false;
	}

	$http({
		method: "GET",
		url: "php/menu.php",
		params: { menutype: 'Snack' }
	}).then(function mySuccess(response) {
		$scope.menuItems = response.data;
	}, function myError(response) {
		$scope.menuItems = response.status;
	});

	$scope.placeOrder = function (OrderedMenuID) {
		$scope.userid = $cookies.get('userid');

		if ($scope.userid == undefined) {
			$scope.errorMessage = "Please login!";
			return;
		}

		$http({
			method: "GET",
			url: "php/order.php",
			params: { menuID: OrderedMenuID,
					  uid: $scope.userid }
		}).then(function mySuccess(response) {
			$scope.orderStatus = response.data;
			$scope.orderMessage = "Order added to cart!";
			$timeout(function () {
				$scope.orderMessage = false;
			}, 1000);
		}, function myError(response) {
			$scope.orderStatus = response.status;
		});
	};
});

dnApp.controller('breakfastController', function ($scope, $http, $timeout, $cookies, UserService) {
	if (UserService.signedin == 'Y') {
		$scope.showOrder = true;
	} else {
		$scope.showOrder = false;
	}

	$http({
		method: "GET",
		url: "php/menu.php",
		params: { menutype: 'Breakfast' }
	}).then(function mySuccess(response) {
		$scope.menuItems = response.data;
	}, function myError(response) {
		$scope.menuItems = response.status;
	});

	$scope.placeOrder = function (OrderedMenuID) {
		$scope.userid = $cookies.get('userid');

		if ($scope.userid == undefined) {
			$scope.errorMessage = "Please login!";
			return;
		}

		$http({
			method: "GET",
			url: "php/order.php",
			params: { menuID: OrderedMenuID,
					  uid: $scope.userid }
		}).then(function mySuccess(response) {
			$scope.orderStatus = response.data;
			$scope.orderMessage = "Order added to cart!";
			$timeout(function () {
				$scope.orderMessage = false;
			}, 1000);
		}, function myError(response) {
			$scope.orderStatus = response.status;
		});
	};
});

dnApp.controller('beverageController', function ($scope, $http, $timeout, $cookies, UserService) {
	if (UserService.signedin == 'Y') {
		$scope.showOrder = true;
	} else {
		$scope.showOrder = false;
	}

	$http({
		method: "GET",
		url: "php/menu.php",
		params: { menutype: 'Beverages' }
	}).then(function mySuccess(response) {
		$scope.menuItems = response.data;
	}, function myError(response) {
		$scope.menuItems = response.status;
	});

	$scope.placeOrder = function (OrderedMenuID) {
		$scope.userid = $cookies.get('userid');

		if ($scope.userid == undefined) {
			$scope.errorMessage = "Please login!";
			return;
		}

		$http({
			method: "GET",
			url: "php/order.php",
			params: { menuID: OrderedMenuID,
					  uid: $scope.userid }
		}).then(function mySuccess(response) {
			$scope.orderStatus = response.data;
			$scope.orderMessage = "Order added to cart!";
			$timeout(function () {
				$scope.orderMessage = false;
			}, 1000);
		}, function myError(response) {
			$scope.orderStatus = response.status;
		});
	};
});

dnApp.controller('checkoutController', function ($scope, $rootScope, $http, $cookies, $timeout, UserService) {
	$scope.haveOrders = false;
	$scope.totalAmt = 0;
	$scope.totalQty = 0;

	$scope.userid = $cookies.get('userid');

	if ($scope.userid == undefined) {
		$scope.errorMessage = "Please login!";
		return;
	}

	$http({
		method: "GET",
		url: "php/get-cart.php",
		params: { uid: $scope.userid }
	}).then(function mySuccess(response) {
		$scope.menuItems = response.data;
		if ($scope.menuItems.response.length > 0) {
			$scope.haveOrders = true;

			for(var i = 0; i < $scope.menuItems.response.length; i++){
				$scope.totalAmt += $scope.menuItems.response[i].menuprice;
			}
	
			$scope.totalQty = $scope.menuItems.response.length;

		}

	}, function myError(response) {
		$scope.menuItems = response.status;
	});
	
	$scope.removeCartItem = function (OrderedMenuID) {
		$http({
			method: "GET",
			url: "php/remove-cart.php",
			params: { menuID: OrderedMenuID,
					  uid: $scope.userid }
		}).then(function mySuccess(response) {
			$scope.orderStatus = response.data;
			$scope.removeMessage = "Order removed from cart!";
			$scope.haveOrders = false;
			$scope.totalAmt = 0;
			$scope.totalQty = 0;

			$timeout(function () {
				$scope.removeMessage = false;
				$http({
					method: "GET",
					url: "php/get-cart.php",
					params: { uid: $scope.userid }
				}).then(function mySuccess(response) {
					$scope.menuItems = response.data;
					if ($scope.menuItems.response.length > 0) {
						$scope.haveOrders = true;

						for(var i = 0; i < $scope.menuItems.response.length; i++){
							$scope.totalAmt += $scope.menuItems.response[i].menuprice;
						}
				
						$scope.totalQty = $scope.menuItems.response.length;

					}

				}, function myError(response) {
					$scope.menuItems = response.status;
				});
			}, 500);
		}, function myError(response) {
			$scope.orderStatus = response.status;
		});
	};

	$scope.checkoutAll = function (OrderedMenuID) {
		$http({
			method: "GET",
			url: "php/checkout.php",
			params: { uid: $scope.userid }
		}).then(function mySuccess(response) {
			$scope.orderStatus = response.data;
			$scope.removeMessage = "Checkout successfully!";
			$scope.haveOrders = false;
			$scope.totalAmt = 0;
			$scope.totalQty = 0;
			$timeout(function () {
				$scope.removeMessage = false;
				
				$http({
					method: "GET",
					url: "php/get-cart.php",
					params: { uid: $scope.userid }
				}).then(function mySuccess(response) {
					$scope.menuItems = response.data;
					if ($scope.menuItems.response.length > 0) {
						$scope.haveOrders = true;

						for(var i = 0; i < $scope.menuItems.response.length; i++){
							$scope.totalAmt += $scope.menuItems.response[i].menuprice;
						}
				
						$scope.totalQty = $scope.menuItems.response.length;
					}

				}, function myError(response) {
					$scope.menuItems = response.status;
				});
			}, 500);
		}, function myError(response) {
			$scope.orderStatus = response.status;
		});
	};

});

dnApp.controller('signinController', function ($scope, $http, $location, $cookies, $rootScope, UserService) {
	$scope.loginForm = function () {

		$scope.hasSignedIn = $cookies.get('signedin');

		if ($scope.hasSignedIn != 'Y') {

			$http({
				method: "GET",
				url: "php/login.php",
				params: { uid: $scope.uid, pw: $scope.pw }
			}).then(function mySuccess(response) {
				$scope.myWelcome = response.data;
				if ($scope.myWelcome.response == 'success') {

					$cookies.put('userid', $scope.uid);
					$cookies.put('signedin', 'Y');

					$scope.userid = $scope.uid;

					$rootScope.loggedIn = true;
					$rootScope.hasCheckOut = true;

					$scope.errorMessage = false;

					UserService.signedin = 'Y';

					$location.path("/");
				} else {
					$scope.errorMessage = 'Login failed, wrong user ID or password!';
				}

			}, function myError(response) {
				$scope.myWelcome = response.status;
			});
		} else {
			$location.path("/");
		}
	}
});

