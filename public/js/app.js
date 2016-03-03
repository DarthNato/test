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

$scope.updateCompany = {
  name: null
};
$scope.newCompany = {
  name: null
};

$scope.updateEmployee = {
  name: null,
  company: null
};
$scope.newEmployee = {
  name: null,
  company: null
};

$scope.updateTest = {
  company: null,
  employee: null,
  name: null,
  date: null,
  pass: false,
};
$scope.newTest = {
  company: null,
  employee: null,
  name: null,
  date: null,
  pass: false,
};

$scope.modalView="";
$scope.loginScreen=true;
$scope.fullApp=false;

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
    console.warn("adding a "+elementType);
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

    //hack... we need to return the value of the checkbox to false,
    //so we dont store empty data when unchecked 
    if (elementType=="test") newElement.pass=false;
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

    console.warn("editing a "+elementType);
    switch(elementType){
      case "company":
        $scope.oldCompany=$scope.companies[$index];
        console.warn($scope.updateCompany);
        for (key in $scope.updateCompany) $scope.updateCompany[key]= $scope.oldCompany[key];
        break;
      case "employee":
        $scope.oldEmployee=$scope.employees[$index];
        for (key in $scope.updateEmployee) $scope.updateEmployee[key]= $scope.oldEmployee[key];
        break;
      case "test":
        $scope.oldTest=$scope.tests[$index];
        for (key in $scope.updateTest) $scope.updateTest[key]= $scope.oldTest[key];
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
        oldElement=$scope.oldEmployee;
        break;
      case "test":
        newElement=$scope.updateTest;
        oldElement=$scope.oldTest;
        break;
      default: return;
    }

    var formFields = [];
    for(key in oldElement) {
      newElement[key]=newElement[key] || oldElement[key];
      formFields.push(newElement[key]);
    }   

    if (misc.isValid(formFields)) {
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

//Super hack!!! all the DB info is already on the browser memory, but is simply not shown xD
   $scope.login = function() {
    console.warn("login");
    $.post('/api/login', $scope.loginInfo).success(function(res){
      if (res){
        $scope.loginScreen=false;
        $scope.fullApp=true;
      }
      else alert("Wrong Password!!!");
    });
  }

  $scope.view = function(screen) {
    $scope.companyView=$scope.employeeView=$scope.testView=false;
    switch (screen){
      case 'company':
      $scope.companyView=true;
      $scope.modalView='#addCompany';
      break;
      case 'employee':
      $scope.employeeView=true;
      $scope.modalView='#addEmployee';
      break;
      case 'test':
      $scope.testView=true;
      $scope.modalView='#addTest';
      break;
    }
  }

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

