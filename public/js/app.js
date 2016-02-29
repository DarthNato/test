/*
-----------------------------------------------------------------------------------
|
| Initialize Angular Application
|
-----------------------------------------------------------------------------------
*/

var meanApp = angular.module('meanApp', ['ngResource']);

/*
-----------------------------------------------------------------------------------
|
| Add controller (we are only using one for the sake of simplicity)
|
-----------------------------------------------------------------------------------
*/

meanApp.controller('mainCtrl', function($scope, $http, misc) {


  // user model
  $scope.user = {
    user: null,
    pass: null
  };

    // user model
  $scope.newCompany = {
    name: null
  };


  // Populate the applicationa with all companies
  misc.getAllCompanies(function(response) {
    $scope.companies = response;
    $scope.$apply();
  });

  // Add new contact to database
  $scope.addCompany = function() {
    
    var formFields = [];
    for(key in $scope.newCompany) {
      formFields.push($scope.newCompany[key]);
    }   

    if (misc.isValid(formFields)) {
      $.post('/api/companies', $scope.newCompany);
      $scope.companies.push($scope.newCompany);
      $scope.newCompany = {};
    }

  }

//Not complete
   $scope.login = function() {
    var formFields = [];
    for(key in $scope.user) {
      formFields.push($scope.user[key]);
    }  
    var temp = $.post('/api/login', $scope.user)
    console.log(temp);
    $scope.user = {};
  }
  //Not complete

/** Delete template main functions.
  // Contact model
  $scope.newContact = {
    firstname: null,
    lastname: null,
    email: null
  };

  // Populate the applicationa with all contacts
  misc.getAllContacts(function(response) {
    $scope.contacts = response;
    $scope.$apply();
  });


  // Add new contact to database
  $scope.addContact = function() {
    
    var formFields = [];
    for(key in $scope.newContact) {
      formFields.push($scope.newContact[key]);
    }   

    if (misc.isValid(formFields)) {
      $.post('/api/contacts', $scope.newContact);
      $scope.contacts.push($scope.newContact);
      $scope.newContact = {};
    }

  }

  $scope.deleteContact = function($index) {
    var ObjectId = $scope.contacts[$index]._id;
    $http.delete('/api/contacts/' + ObjectId);
    $scope.contacts.splice($index, 1);
    $scope.$apply();
  }

*/

});

/*
-----------------------------------------------------------------------------------
|
| Factory
|
-----------------------------------------------------------------------------------
*/

meanApp.factory('misc', function($http) {
  return {
    getAllContacts: function(callback) {
      $.get('/api/contacts').success(function(response) {
        callback(response);
      });
    },
    getAllCompanies: function(callback) {
      $.get('/api/companies').success(function(response) {
        callback(response);
      });
    },
    isValid: function(formFields) {
      for (i = 0; i < formFields.length; i++) {
        var arg = formFields[i];
        if (arg == null || arg == undefined || arg == '') {
          return false;
        }
      }
      return true;
    }
  }
});

/*
-----------------------------------------------------------------------------------
|
| other functions
|
-----------------------------------------------------------------------------------
*/

