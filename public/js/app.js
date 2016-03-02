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

/*
  // user model
  $scope.user = {
    user: null,
    pass: null
  };
*/
    // user Company
  $scope.newCompany = {
    name: null
  };

  $scope.newEmployee = {
    name: null,
    company: null
  };

  $scope.newTest = {
    company: null,
    employee: null,
    name: null,
    date: null,
    pass: false
  };

  $scope.newTestInCatalog = {
    name: null
  };


  // Populate the applicationa with all companies
  misc.getAllCompanies(function(response) {
    $scope.companies = response;
    //$scope.$apply();
  });

    // Populate the applicationa with all employees
  misc.getAllEmployees(function(response) {
    $scope.employees = response;
    //$scope.$apply();
  });

  misc.getAllTests(function(response) {
    $scope.tests = response;
    $scope.$apply();
  });

  // Add new element to database
  $scope.addElement = function(elementType) {
    var newElement,
        collection;
    switch(elementType){
      case "company":
        newElement=$scope.newCompany;
        collection=$scope.companies;
        break;
      case "employee":
        newElement=$scope.newEmployee;
        collection=$scope.employees;
        break;
      case "test":
        newElement=$scope.newTest;
        collection=$scope.tests;
        break;
      default: return;
    }

    var formFields = [];
    for(key in newElement) {
      formFields.push(newElement[key]);
    }   

    if (misc.isValid(formFields)) {
      $.post('/api/new/'+elementType, newElement).success(function(insertedElement){
        collection.push(insertedElement);
        for(key in newElement) newElement[key]=null;
        $scope.$apply();
      });
    }
  }

  $scope.removeElement = function($index,elementType) {
    console.warn("in new remove");
    var message = "Are you sure you want to delete this "+elementType+"?\n",
        scopeCollection;

    switch(elementType){
      case "company":
        scopeCollection=$scope.companies;
        message+=scopeCollection[$index].name;
        break;
      case "employee":
        scopeCollection=$scope.employees;
        message+=scopeCollection[$index].name;
        break;
      case "test":
        scopeCollection=$scope.tests;
        message+=scopeCollection[$index].company+"\n"+scopeCollection[$index].employee+"\n"+scopeCollection[$index].name;
        break;
    }

    if (confirm(message)){
    $http.delete('/api/'+elementType+ '/'+ scopeCollection[$index]._id);
      scopeCollection.splice($index, 1);
    }
  }

  // update element to database
  $scope.edit = function($index, elementType) {

    switch(elementType){
      case "company":
        $scope.oldCompany=$scope.companies[$index];
        break;
      case "employee":
        $scope.oldEmployee=$scope.employees[$index];
        break;
      case "test":
        $scope.oldTest=$scope.tests[$index];
        break;
      default: return;
    }
  }

  // update element to database
  $scope.updateElement = function(elementType) {
    var newElement,
        oldElement;
    switch(elementType){
      case "company":
        newElement=$scope.updateCompany;
        oldElement=$scope.oldCompany;
        break;
      case "employee":
        newElement=$scope.updateEmployee;
        oldElement=$scope.oldElement;
        break;
      case "test":
        newElement=$scope.updateTest;
        oldElement=$scope.oldElement;
        break;
      default: return;
    }

    var formFields = [];
    for(key in oldElement) {
      newElement[key]=newElement[key] || oldElement[key];
      formFields.push(newElement[key]);
    }   

    if (misc.isValid(formFields)) {
    console.warn(oldElement);
    console.warn(newElement);
    $.post('/api/update/'+elementType+"/"+newElement._id, newElement).success(function(res){  
        if (res.err) console.warn(res);
        else {
          for (key in oldElement){ 
            oldElement[key]=newElement[key];
            newElement[key]=null;
          }
          $scope.$apply();
        }
      });
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

