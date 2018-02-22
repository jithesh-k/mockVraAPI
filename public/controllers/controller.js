var app = angular.module("myApp", []);

app.controller("AppCntrl", function ($scope, $http) {
    console.log("Hello Everybody I'm AppCntrl")

    var refresh = function () {
        $http.get('/users').then(getsuccessCallback, geterrorCallback);

        function getsuccessCallback(response) {
            console.log("I got the data I requested");
            console.log(response)
            $scope.restList = response.data
        }

        function geterrorCallback(error) {
            console.log("error")
        }
    }

    var nullDetails = function () {
        $scope.rest.url = '';
        $scope.rest.method = '';
        $scope.rest.authorization = '';
        $scope.rest.headers = '';
        $scope.rest.restbody = '';
        $scope.rest.response = '';
    }


    $scope.add = function () {
        console.log($scope.rest);
        $http.post('/users', $scope.rest).then(postsuccessCallback, posterrorCallback);

        function postsuccessCallback(response) {
            console.log("I got the data I requested");
            console.log(response)
            refresh();
            nullDetails();

        }

        function posterrorCallback(error) {
            console.log("error")
        }


    }


    $scope.edit = function(id){
        console.log(id);
        $http.get('/users/'+id).then(editsuccessCallback, editerrorCallback);
        
         function editsuccessCallback(response) {
            console.log("I got the data I requested");
            console.log(response)
            $scope.rest=response.data
        }

        function editerrorCallback(error) {
            console.log("error")
        }       

    }


    $scope.update = function(){
        console.log($scope.rest._id);
        $http.put('/users/' + $scope.rest._id, $scope.rest).then(putsuccessCallback, puterrorCallback);
        
         function putsuccessCallback(response) {
            console.log("I got the data I requested");
            console.log(response)
            refresh();
            nullDetails();
        }

        function puterrorCallback(error) {
            console.log("error")
        }

    }



    $scope.remove = function (id) {
        console.log(id);
        $http.delete('/users/' + id).then(deletesuccessCallback, deleteerrorCallback);

        function deletesuccessCallback(response) {
            console.log("I got the data I requested");
            console.log(response)
            refresh();
            nullDetails();

        }

        function deleteerrorCallback(error) {
            console.log("error")
        }

    }

    refresh();

})