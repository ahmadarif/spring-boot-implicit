'use strict';

const app = angular.module('aplikasiOauthClient', ['ngStorage']);

app.config(function($locationProvider){
    $locationProvider.html5Mode(true);
});

app.controller('NavCtrl', function ($scope, $window, $location, $http, $localStorage) {
    $scope.authUrl = 'http://localhost:8080/sso/oauth/authorize?client_id=clientimplicit&response_type=token';

    $scope.token;
    
    $scope.login = function(){
        $window.location.href = $scope.authUrl;
        //$window.location.reload();
    };
   
   $scope.logout = function(){
       const token = $localStorage.token;
       const url = `http://localhost:8080/sso/logout?token=${token}&redirect=${$scope.authUrl}`;

       delete $localStorage.token;
       $window.location.href = url;
   };
   
   $scope.getTokenFromUrl = function(){
       let token;
       let hashParams = $location.hash();
       if(!hashParams) {
           console.log("Tidak ada token di url");
           return;
       }
       console.log(hashParams);
       const eachParam = hashParams.split('&');
       for(let i=0; i<eachParam.length; i++){
           const param = eachParam[i].split('=');
           if('access_token' === param[0]) {
               token = param[1];
           }
       }
       console.log("Access Token : "+token);
       if(token){
           $localStorage.token = token;
       }
       $location.hash('');
   };
   
   $scope.checkLogin = function(){
       // check apa ada token di URL
       if($localStorage.token){
           $scope.token = $localStorage.token;

           $scope.validasiToken();
           return;
       }

       $scope.getTokenFromUrl();

       if($localStorage.token){
           $scope.token = $localStorage.token;
           return;
       }
       
       $scope.login();
   };

   $scope.validasiToken = function () {
       console.debug("validasi");
       const body = {
           params: {
               access_token: $scope.accessToken
           }
       };
       $http.get('/implicit/api/auth/checkToken', body)
           .success(function(data){
               $scope.checkTokenOutput = data;
           }).error(function(data){
               delete $localStorage.token;
               $window.location.href = $scope.authUrl;
           });
   };
   
   $scope.checkLogin();
});


app.controller('OauthCtrl', function($scope, $http, $window, $localStorage){
   $scope.currentUser; 
   $scope.accessToken = $localStorage.token;

   $scope.userApi = function(){
       if(!$scope.accessToken) {
           alert("Belum punya token, login dulu ya");
           return;
       }

       var body = {
           params: {
               access_token: $scope.accessToken
           }
       };
       $http.get('/implicit/api/user', body)
           .success(function(data){
               $scope.userApiOutput = data;
           }).error(function(data){
               if (data.error) alert(data.error);
           });
   };

    $scope.adminApi = function(){
        if(!$scope.accessToken) {
            alert("Belum punya token, login dulu ya");
            return;
        }

        const body = {
            params: {
                access_token: $scope.accessToken
            }
        };
        $http.get('/implicit/api/admin', body)
            .success(function(data){
                $scope.adminApiOutput = data;
            }).error(function(data){
            if (data.error) alert(data.error);
        });
    };
   
   $scope.checkToken = function(){
       if(!$scope.accessToken) {
           alert("Belum punya token, login dulu ya");
           return;
       }

       const body = {
           params: {
               access_token: $scope.accessToken
           }
       };
       $http.get('/implicit/api/auth/checkToken', body)
           .success(function(data){
               $scope.checkTokenOutput = data;
           }).error(function(data){
               if (data.error) alert(data.error);
           });
   };

    $scope.currentUserApi = function(){
        const body = {
            params: {
                access_token: $scope.accessToken
            }
        };
        $http.get('/implicit/api/auth/user', body)
            .success(function(data){
                $scope.currentUser = data;
            }).catch(function(data){
                if (data.error) alert(data.error);
            });
    };

    $scope.currentUserApi();
});