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

  $scope.newEmployee = {
    name: null,
    company: null
  };

  $scope.newTest = {
    employee: null,
    name: null,
    date: null,
    pass: false
  };


  // Populate the applicationa with all companies
  misc.getAllCompanies(function(response) {
    $scope.companies = response;
    //$scope.$apply();
  });

    // Populate the applicationa with all employees
  misc.getAllEmployees(function(response) {
    $scope.employees = response;
    $scope.$apply();
  });

  misc.getAllTests(function(response) {
    $scope.tests = response;
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

    $scope.addEmployee = function() {
    
    var formFields = [];
    for(key in $scope.newEmployee) {
      formFields.push($scope.newEmployee[key]);
    }   

    if (misc.isValid(formFields)) {
      $.post('/api/employees', $scope.newEmployee);
      $scope.employees.push($scope.newEmployee);
      $scope.newEmployee = {};
    }

  }

  $scope.addTest = function() {
    console.log("test add in");
    console.log($scope.newTest.employee);
    var formFields = [];
    for(key in $scope.newTest) {
      formFields.push($scope.newTest[key]);
      console.log(key);
      console.log($scope.newTest[key]);
    }   

    if (misc.isValid(formFields)) {
      console.log("valid");
      $.post('/api/tests', $scope.newTest);
      $scope.tests.push($scope.newTest);
      $scope.newTest = {};
    }
    console.log("test add out");

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
    getAllEmployees: function(callback) {
      $.get('/api/employees').success(function(response) {
        callback(response);
      });
    },
    getAllTests: function(callback) {
      $.get('/api/tests').success(function(response) {
        callback(response);
      });
    },
    isValid: function(formFields) {
      for (i = 0; i < formFields.length; i++) {
        var arg = formFields[i];
        if (arg === null || arg === undefined || arg === '') {
          console.log(arg);
          console.log(i);
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

