angular.module('myApp').
controller('AddressController', ['$scope','UserFactory','OrderFactory',
'baseURL', '$window','$location','SharedDataFactory',
 function($scope,UserFactory,OrderFactory,baseURL,$window,$location,
  SharedDataFactory){
                  
                       //get watch on user  
        $scope.$on('UserController:getUserConfigSuccess', function() { 
        // calculation based on service value
  
           $scope.user = UserFactory.getUser();
           $scope.$watch(function(){return UserFactory.getUser();},
                      function(newValue,oldValue){
                               if (newValue!==oldValue) {
                               // console.log(newValue);
                               $scope.user = newValue;
                               }
                      });
           $scope.provincelist = SharedDataFactory.getProvinceList();
           $scope.userAddresses =  $scope.user.profile.addresses;
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
                       //get Unsuborder via ID after user loaded
          OrderFactory.getUnsuborder($location.search().id)
                           .then(function(data){
            
              $scope.unsuborder = data.unsuborder;
           
           })
            .catch(function(err){
               console.log(err);
           });
     
          });
      $scope.$on('UserController:getUserConfigFail', function() {
        // calculation based on service value

                $window.location.href=baseURL+'login.html';
                                 
          });         

      $scope.chooseAddr = function(index){

            ////set unsuborder addr and save unsuborder in DB
            OrderFactory.updateUnsubAddNolog($scope.userAddresses[index])
             .then(function(data){
               $scope.unsuborder=data.unsuborder;
                  $window.location.href=baseURL+'confirmorder.html?id='
                                  +    $scope.unsuborder._id;           
             })
             .catch(function(err){
                  console.log(err);
             });
            // go back to orderConfirm.html with unsuborder id 
      } ;
      $scope.gotoEdit = function(index){
          $window.location.href=baseURL+'editaddress.html?id='
                                  +    $scope.unsuborder._id+'&index='
                                  + index;           

      }

      //update profile addr and set unsuborder
     $scope.saveAddrprofileNunsuborder = function(){
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
                   console.log($scope.address);
       OrderFactory.saveAddress( $scope.address,true,parseInt($location.search().index))
                   .then(function(data){
                     //go to confirm order page

                  $scope.unsuborder=data.unsuborder;
                  $window.location.href=baseURL+'confirmorder.html?id='
                                  +    $scope.unsuborder._id;         
                   })
                     .catch(function(err){
                        console.log(err);
                     });
     };
     $scope.closeTip = function(){
          $('#yhd_alert_tip').hide();
     } 
}]);
