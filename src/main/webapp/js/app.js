'use strict';

const app = angular.module('aplikasiOauthClient', []);

app.config(function($locationProvider){
    $locationProvider.html5Mode(true);
});

app.controller('NavCtrl', function ($scope, $window, $location, $http) {
    $scope.authUrl = 'http://localhost:8080/sso/oauth/authorize?client_id=clientimplicit&response_type=token';
    // $scope.authUrl = 'http://localhost:10000/sso/oauth/authorize?client_id=clientimplicit&response_type=token';
    // $scope.authUrl = 'http://10.254.62.38:8080/sso/oauth/authorize?client_id=etpa5&response_type=token&scope=write';

    $scope.token;
    
    $scope.login = function(){
        $window.location.href = $scope.authUrl;
        //$window.location.reload();
    };
   
   $scope.logout = function(){
       const token = $window.sessionStorage.getItem('token');
       const url = `http://localhost:8080/sso/logout?token=${token}&redirect=${$scope.authUrl}`;

       $window.sessionStorage.removeItem('token');
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
           $window.sessionStorage.setItem('token', token);
       }
       $location.hash('');
   };
   
   $scope.checkLogin = function(){
       // check apa ada token di URL
       if($window.sessionStorage.getItem('token')){
           $scope.token = $window.sessionStorage.getItem('token');

           $scope.validasiToken();
           return;
       }

       $scope.getTokenFromUrl();
       if($window.sessionStorage.getItem('token')){
           $scope.token = $window.sessionStorage.getItem('token');
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
               $window.sessionStorage.removeItem('token');
               $window.location.href = $scope.authUrl;
           });
   };
   
   $scope.checkLogin();
});


app.controller('OauthCtrl', function($scope, $http, $window){
   $scope.currentUser; 
   $scope.accessToken = $window.sessionStorage.getItem('token');

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