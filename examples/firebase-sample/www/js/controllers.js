angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, auth, $state, store) {
  // auth.signin({
    // closable: false,
    // // This asks for the refresh token
    // // So that the user never has to log in again
    // authParams: {
      // scope: 'openid offline_access'
    // }
  // }, function(profile, idToken, accessToken, state, refreshToken) {
    // store.set('profile', profile);
    // store.set('token', idToken);
    // store.set('refreshToken', refreshToken);
    // auth.getToken({
      // api: 'firebase'
    // }).then(function(delegation) {
      // store.set('firebaseToken', delegation.id_token);
      // $state.go('tab.friends');
    // }, function(error) {
      // console.log("There was an error getting token in", JSON.stringify(error));
    // })
  // }, function(error) {
    // console.log("There was an error sign  in",JSON.stringify( error));
  // });
  
  
   // Initialize Passwordless Lock instance
    var lock = new Auth0LockPasswordless('gJ1hHRHwGRnZjdcpe4mPLy2mUHaMyVJy', 'mhabshey.auth0.com');
    // Open the lock in Email Code mode with the ability to handle
    // the authentication in page
    lock.emailcode( function (err, profile, id_token, state, refresh_token) {
      if (!err) {
        // Save the JWT token.
        localStorage.setItem('userToken', id_token);
		console.log("state: "+state);
        //use profile
		 store.set('profile', profile);
      store.set('token', id_token);
      store.set('refreshToken', refresh_token);
      auth.getToken({
        api: 'firebase'
      }).then(function(delegation) {
        store.set('firebaseToken', delegation.id_token);
        $state.go('tab.friends');
      }, function(error) {
        // Error getting the firebase token
		console.log("Error getting the firebase token: "+ error);
      })
      }else {
	  console.log("error auth with email: "+ err);
	  }
    });
	
	
})


.controller('FriendsCtrl', function($scope, Friends, $ionicModal) {
 $ionicModal.fromTemplateUrl('templates/friend-add-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.newFriend = {
    name: '',
    description: ''
  };

  $scope.friends = Friends.all();

  $scope.showAddFriend = function() {
    $scope.modal.show();
  };

  $scope.addFriend = function() {
    if(!$scope.newFriend.$id) {
      Friends.add($scope.newFriend);
    } else {
      Friends.save($scope.newFriend);
    }
    $scope.newFriend = {};
    $scope.modal.hide();
  };

  $scope.deleteFriend = function(friend) {
    Friends.delete(friend);
  };

  $scope.editFriend = function(friend) {
    $scope.newFriend = friend;
    $scope.modal.show();
  };

  $scope.close = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope, auth, $state, store) {

  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login');
  }
});
