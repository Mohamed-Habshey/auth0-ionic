angular.module('starter.services', ['firebase'])

/**
 * A simple example service that returns some data.
 */
.service('Friends', function( store, $state,$firebaseArray) {

  var friendsRef = new Firebase("https://irehearsehabashy.firebaseio.com/");
  friendsRef.authWithCustomToken(store.get('firebaseToken'), function(error, auth) {
    if (error) {
      // There was an error logging in, redirect the user to login page
      $state.go('login');
    }
  });

  //var friendsSync = $firebase(friendsRef);
  //var friends = friendsSync.$asArray();
   var friends = $firebaseArray(friendsRef);
  

  this.all = function() {
    return friends;
  };

  this.add = function(friend) {
    friends.$add(friend);
  };

  this.get = function(id) {
    return friends.$getRecord(id);
  };

  this.save = function(friend) {
    friends.$save(friend);
  };

  this.delete = function(friend) {
    friends.$remove(friend);
  };

});
