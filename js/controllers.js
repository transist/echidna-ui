// controllers.js

app.controller('MainCtrl', function($scope) {
    
    $scope.name = 'World';

    var keywords = [];
    for (var i = 0; i < 25; i++) {
        keywords.push( { 'title': 'Keyword'+i, 'drag': true } );
    };

    $scope.keywords = keywords;

    $scope.list = [{ 'title': 'Keyword', 'drag': true },];

    $scope.startCallback = function(event, ui) {
        console.log('You started draggin');
    };

    $scope.stopCallback = function(event, ui) {
      console.log('Why did you stop draggin me?');
    };

    $scope.dragCallback = function(event, ui) {
      console.log('hey, look I`m flying');
    };

    $scope.dropCallback = function(event, ui) {
      console.log('hey, you dumped me :-(');
    };

    $scope.overCallback = function(event, ui) {
      console.log('Look, I`m over you');
    };

    $scope.outCallback = function(event, ui) {
      console.log('I`m not, hehe');
    };
});

app.controller('StreamCtrl', function($scope, $http) {

    $http.get('data/keywords.json').success(function(data) {
        $scope.data = data;
        // console.log (data);
    });
});

