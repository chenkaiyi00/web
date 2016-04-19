angular.module('myApp').
controller('AddressuController', ['$scope','UserFactory',
'baseURL', '$window','$location','SharedDataFactory','$http','localStorageService',
 function($scope,UserFactory,baseURL,$window,$location,
  SharedDataFactory,$http,localStorageService){
                  
         $scope.showAlert =false;
         $scope.index =0;
                    //get watch on user  
        $scope.$on('UserController:getUserConfigSuccess', function() { 
        // calculation based on service value
            
           $scope.user = UserFactory.getUser();
          
           console.log($scope.user);
           $scope.provincelist = SharedDataFactory.getProvinceList();
           $scope.userAddresses =  $scope.user.profile.addresses;
           console.log($scope.userAddresses);
           if (($location.search().index)) {

          
           if (parseInt($location.search().index)==-1) {
            $scope.address={};
                $scope.address.address =null;
                 $scope.address.recipient=null;
                  $scope.address.selectedProvice=null;
                   $scope.address.selectedCity=null;
                    $scope.address.selectedArea=null;
                     $scope.address.phone=null;
           }else{
           $scope.address =   $scope.userAddresses[parseInt($location.search().index)];
               }

      }
          });

      $scope.$on('UserController:getUserConfigFail', function() {
        // calculation based on service value

                $window.location.href=baseURL+'login.html';
                                 
          });



      $scope.gotoEdit = function(index){
          $window.location.href=baseURL+'userpublic/addr/editaddress.html?index='
                                  + index;           
      };
     $scope.delete = function(index){
         //show alert          
           $scope.showAlert =true;
           $scope.index =index;
          
      };
        $scope.confirmDelete = function(){
         //show alert          
           if ($scope.showAlert){
               $http.post(baseURL+'user/deleteaddr',
                      {index:$scope.index,
                        token:localStorageService.get("token")})
               .then(function(response){
                       $window.location.href=$location.absUrl();
               })
               .catch(function(err){
                  console.log(err);
               });
           }else{
            return;
           }
          
      };
      $scope.cancel = function(index){
         //show alert   
           $scope.showAlert =false;       
      };
      //update profile addr 
     $scope.saveAddr = function(){
          //validate part
          if ( !$scope.address.selectedProvice) {
          
              $('#yhd_alert_contenttext').text('请填写收货省份');
          $('#yhd_alert_tip').show();
          return;
          }
          if ( !$scope.address.selectedCity) {
    $('#yhd_alert_contenttext').text('请填写收货城市');
          $('#yhd_alert_tip').show();
          return;
          }
          if (!$scope.address.selectedArea) {
    $('#yhd_alert_contenttext').text('请填写收货区/县');
          $('#yhd_alert_tip').show();
          return;
          }
          if (!$scope.address.address) {
    $('#yhd_alert_contenttext').text('请填写收货详细地址');
          $('#yhd_alert_tip').show();
          return;
          }
          if (!$scope.address.phone) {
    $('#yhd_alert_contenttext').text('请填写联系电话');
          $('#yhd_alert_tip').show();
          return;
          }
          if (!$scope.address.recipient) {
    $('#yhd_alert_contenttext').text('请填写收货人姓名');
          $('#yhd_alert_tip').show();
          return;
          }
                $scope.address.selectedProvice
                   =$scope.address.selectedProvice.name;
                  $scope.address.selectedCity
                   =$scope.address.selectedCity.name;

                  $http.post(baseURL+'user/saveaddr',
                      {index:$location.search().index,address:$scope.address,
                       token:localStorageService.get("token")})
               .then(function(response){

                       $window.location.href=baseURL+'userpublic/addr/addrmanage.html';
               })
               .catch(function(err){
                  console.log(err);
	    			             
  });
                                

     };
     $scope.closeTip = function(){
          $('#yhd_alert_tip').hide();
     } 
}]);
