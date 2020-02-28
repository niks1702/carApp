
var app= angular
		.module("myapp", [])
		
app.directive('loading', function () {
    return {
      restrict: 'E',
      replace:true,
      template: '<p ng-show="showloader"><img alt="" src="image/loading.gif"/></p>',
      link: function ($scope, element, attr) {
            $scope.$watch('loading', function (val) {
                if (val)
                    $scope.showloader=true;
                else
                	 $scope.showloader=false;
            });
      }
    }
})

		app.controller(
				"carAppController",
				function($scope, $http) {
					
					$scope.showSubmit=true;
					$scope.showReSubmit=false;
					$scope.showDistanceTime = false;
					$scope.errMsg = "";
					// $scope.loading = false;
					
					$scope.reset=function(){
						$scope.pickupLocation ="";
						$scope.dropLocation="";
						$scope.showSubmit=true;
						$scope.showReSubmit=false;
						$scope.showDistanceTime = false;
						$scope.errMsg = "";
					}

					$scope.getRouteDetail = function(pickupLocation,
							dropLocation) {
						$scope.showSubmit=false;
						$scope.showReSubmit=true;
						$scope.errMsg = "";
						$scope.showDistanceTime = false;
						if($scope.validateLocationDetails()){
							
						
					
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
											
											//console.log("success",response);
											$scope.token = response.data.token;
											 $scope.loading = false;
											$scope.getRouteDetails = $scope.getTrackDetails
													+ "/" + $scope.token;
											$scope.getWaypointDetails();

											// this function will be called when the request is success

										},
										function error(response) {
											$scope.loading = false;
											$scope.errMsg = "There is some problem. Please try again!!!"
											// this function will be called when the request returned error status

										});
						}
					}

					$scope.getWaypointDetails = function() {
						$scope.errMsg="";
						$scope.totalDistance = "";
						$scope.totalTime = "";
						$scope.showDistanceTime = false;
						$scope.loading = true;
						$http
								.get($scope.getRouteDetails, $scope.token)
								.then(
										function success(response) {
											
											//console.log("response",response);
											if (response.data.status == "in progress") {
												$scope.errMsg="Please wait.We are almost there!!!"
												$scope.getWaypointDetails();
											}
											$scope.loading = false;
											if (response.data.status == "success") {
												
												$scope.showDistanceTime = true;
												console.log("waypoints",response.data);
												
												$scope.waypoint1= response.data.path[0];
												$scope.waypoint2= response.data.path[1];
												$scope.waypoint3= response.data.path[2];
												$scope.totalDistance = response.data.total_distance;
												$scope.totalTime = response.data.total_time;
												initMap();
											}
											if (response.data.status == "failure") {
												$scope.errMsg = response.data.error;
											}

										},
										function error(response) {
											$scope.loading = false;
											if (response.data == "Internal Server Error") {
												$scope.errMsg = "There is some problem is processing the data.Please try again.";
											}

											// this function will be called when the request returned error status

										});
					}
					$scope.validateLocationDetails=function(){
						if($scope.pickupLocation !== "" && $scope.pickupLocation!=undefined && $scope.dropLocation!="" && $scope.dropLocation!=undefined ){
							return true;
						}else{
							if($scope.pickupLocation==""|| $scope.pickupLocation==null || $scope.pickupLocation==undefined){
								$scope.errMsg="Please enter pickup location"
									return false;
							}
							if($scope.dropLocation==""|| $scope.dropLocation==null || $scope.dropLocation==undefined){
								$scope.errMsg="Please enter drop location"
									return false;
							}
						}
						
					}
					console.log("jjjjjjjjeeee");
					function initMap() {
						  console.log("jjjj")
						  var abbb=new google.maps.LatLng(22.372081, 114.107877);
						  
					        var map = new google.maps.Map(document.getElementById('map'), {
					          zoom: 10,
					          center: {lat: 22.3193, lng: 114.1694}  // honkong.
					        });
					      var directionsService = new google.maps.DirectionsService;
					        var directionsRenderer = new google.maps.DirectionsRenderer();
					        directionsRenderer.setMap(map);
					        /* directionsRenderer.addListener('directions_changed', function() {
					          computeTotalDistance(directionsRenderer.getDirections());
					        }); */
					  
				 displayRoute( $scope.startLocation,$scope.dropLocation, directionsService,
				        directionsRenderer);
				  } 
				
				function displayRoute(origin, destination, service, display) {
				   service.route({
				     origin: origin,
				     destination: destination,
				     waypoints: [{
				         location: new google.maps.LatLng($scope.waypoint1[0],$scope.waypoint1[1]),
				         stopover: false
				       },{
					         location: new google.maps.LatLng($scope.waypoint2[0],$scope.waypoint2[1]),
					         stopover: false
					       },{
						         location: new google.maps.LatLng($scope.waypoint3[0],$scope.waypoint3[1]),
						         stopover: false
						       }],
				    // waypoints: [{"22.372081", "114.107877"}, {"22.326442", "114.167811"},{"22.284419", "114.159510"}],
						       optimizeWaypoints: true,
				     travelMode: 'DRIVING',
				     avoidTolls: true
				   }, function(response, status) {
				     if (status === 'OK') {
				       display.setDirections(response);
				       console.log("route",response);
				     } else {
				       alert('Could not display directions due to: ' + status);
				     }
				   });
				 }
				/* function computeTotalDistance(result) {
				    var total = 0;
				    var myroute = result.routes[0];
				    for (var i = 0; i < myroute.legs.length; i++) {
				      total += myroute.legs[i].distance.value;
				    }
				    total = total / 1000;
				    document.getElementById('total').innerHTML = total + ' km';
				  } 
				  
				  */
					 
				});

