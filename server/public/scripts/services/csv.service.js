myApp.service('CsvService', function ($http, $location, $mdToast) {

  //--------------------------------------
  //-------------VARIABLES----------------
  //--------------------------------------


  var self = this;

  self.questions = {};

  //--------------------------------------
  //-------------RUNTIME CODE-------------
  //--------------------------------------

  // none

  //--------------------------------------
  //-------------FUNCTION----------------
  //--------------------------------------

  // exports all responses to a csv file and tells the browser to download it
  self.exportAllResponses = function (year) {
    $http.get('/csv/export/' + year).then(function (response) {

      // format the data into a csv file
      var exportCsv = Papa.unparse(response.data);
      exportCsv = "data:text/csv;charset=utf-8," + exportCsv;
      exportCsv = encodeURI(exportCsv);

      // tell the browser to download it
      window.open(exportCsv);
    })
  }


  // gets all languages of questions from the db (for the updateQuestions view)
  self.getQuestions = function (year) {

    $http.get('/survey/questions/' + year).then(function (response) {
      self.questions.list = response.data;
      $location.path('/admin-questions');
    });
  }


  // updates all four languages of the selected question in the db
  self.updateQuestion = function (question, year) {

    $http.post('/survey/questions/' + year, question).then(function (response) {
      $location.path('/admin-questions');
    });

  }


  // called ultimately by the [UPLOAD] button on admin.html. Parses the imported file and sends it up to the server.
  self.uploadCsv = function (file, year) {
    // thanks Papa!
    var parsed = Papa.parse(file);

    for (var i = 0; i < parsed.data.length; i++) {
      parsed.data[i].push(year);
    }

    $http.post('/csv/upload', parsed).then(function (response) {
      $mdToast.show(
        $mdToast.simple()
        .textContent('CSV uploaded!')
        .hideDelay(2000)
      );
      $location.path('/admin');
    })
  }

});