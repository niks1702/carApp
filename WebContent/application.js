var app = angular.module("myapp", [])

app
		.directive(
				'loading',
				function() {
					return {
						restrict : 'E',
						replace : true,
						template : '<p ng-show="showloader"><img alt="" src="image/loading.gif" style="max-width: 100%;height: auto;"/></p>',
						link : function($scope, element, attr) {
							$scope.$watch('loading', function(val) {
								if (val)
									$scope.showloader = true;
								else
									$scope.showloader = false;
							});
						}
					}
				})

app
		.controller(
				"carAppController",
				function($scope, $http) {

					$scope.showSubmit = true;
					$scope.showReSubmit = false;
					$scope.showDistanceTime = false;
					$scope.errMsg = "";
					$scope.loading = false;
					$scope.showMap = false;

					$scope.reset = function() {
						$scope.pickupLocation = "";
						$scope.dropLocation = "";
						$scope.showSubmit = true;
						$scope.showReSubmit = false;
						$scope.showDistanceTime = false;
						$scope.errMsg = "";
						$scope.showMap = false;
					}

					$scope.getRouteDetail = function(pickupLocation,
							dropLocation) {
						$scope.showMap = false;
						$scope.showSubmit = false;
						$scope.showReSubmit = true;
						$scope.errMsg = "";
						$scope.showDistanceTime = false;
						if ($scope.validateLocationDetails()) {

							$scope.startLocation = $scope.pickupLocation;
							$scope.dropOffPoint = $scope.dropLocation;
							$scope.data = {}
							$scope.data.origin = $scope.startLocation;
							$scope.data.destination = $scope.dropOffPoint;
							$scope.url = "https://mock-api.dev.lalamove.com"
							$scope.getTrackDetails = $scope.url + "/route"
							$scope.loading = true;
							$http
									.post($scope.getTrackDetails, $scope.data)
									.then(
											function success(response) {

												// console.log("success",response);
												$scope.token = response.data.token;
												$scope.loading = false;
												$scope.getRouteDetails = $scope.getTrackDetails
														+ "/" + $scope.token;
												$scope.getWaypointDetails();

												// this function will be called
												// when the request is success

											},
											function error(response) {
												$scope.loading = false;
												$scope.errMsg = "There is some problem. Please try again!!!"
												// this function will be called
												// when the request returned
												// error status

											});
						}
					}

					$scope.getWaypointDetails = function() {
						$scope.errMsg = "";
						$scope.totalDistance = "";
						$scope.totalTime = "";
						$scope.showDistanceTime = false;
						$scope.loading = true;
						$http
								.get($scope.getRouteDetails, $scope.token)
								.then(
										function success(response) {

											// console.log("response",response);
											if (response.data.status == "in progress") {
												$scope.errMsg = "Please wait.We are almost there!!!"
												$scope.getWaypointDetails();
											}

											if (response.data.status == "success") {
												$scope.loading = false;
												$scope.showDistanceTime = true;
											/*	console.log("waypoints",
														response.data);*/

												$scope.waypoint1 = response.data.path[0];
												$scope.waypoint2 = response.data.path[1];
												$scope.waypoint3 = response.data.path[2];
												$scope.totalDistance = response.data.total_distance;
												$scope.totalTime = response.data.total_time;
												$scope.showMap = true;
												initMap();
											}
											if (response.data.status == "failure") {
												$scope.loading = false;
												$scope.errMsg = response.data.error;
											}

										},
										function error(response) {

											if (response.data == "Internal Server Error") {
												$scope.loading = false;
												$scope.errMsg = "There is some problem in processing the data. Please try again.";
											}

											// this function will be called when
											// the request returned error status

										});
					}
					$scope.validateLocationDetails = function() {
						if ($scope.pickupLocation !== ""
								&& $scope.pickupLocation != undefined
								&& $scope.dropLocation != ""
								&& $scope.dropLocation != undefined) {
							return true;
						} else {
							if ($scope.pickupLocation == ""
									|| $scope.pickupLocation == null
									|| $scope.pickupLocation == undefined) {
								$scope.errMsg = "Please enter pickup location"
								return false;
							}
							if ($scope.dropLocation == ""
									|| $scope.dropLocation == null
									|| $scope.dropLocation == undefined) {
								$scope.errMsg = "Please enter drop location"
								return false;
							}
						}

					}
					
				
					
					function initMap() {
						$scope.showMap = true;

						

						var map = new google.maps.Map(document
								.getElementById('map'), {
							zoom : 10,
							center : {
								lat : 22.3193,
								lng : 114.1694
							}
						// hongkong.
						});
						
						
						var directionsService = new google.maps.DirectionsService;
						var directionsRenderer = new google.maps.DirectionsRenderer();
						directionsRenderer.setMap(map);
					

						displayRoute($scope.startLocation, $scope.dropLocation,
								directionsService, directionsRenderer);
					}

					function displayRoute(origin, destination, service, display) {
						service.route({
							origin : origin,
							destination : destination,
							waypoints : [
									{
										location : new google.maps.LatLng(
												$scope.waypoint1[0],
												$scope.waypoint1[1]),
										stopover : true
									},
									{
										location : new google.maps.LatLng(
												$scope.waypoint2[0],
												$scope.waypoint2[1]),
										stopover : true
									},
									{
										location : new google.maps.LatLng(
												$scope.waypoint3[0],
												$scope.waypoint3[1]),
										stopover : true
									} ],
							
							optimizeWaypoints : true,
							travelMode : 'DRIVING',
							avoidTolls : true
						}, function(response, status) {
							if (status === 'OK') {
								display.setDirections(response);
								//console.log("route", response);
							} else {
								alert('Could not display directions due to: '
										+ status);
							}
						});
					}

				

				});
