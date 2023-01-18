angular.module("app", ["templates"])
  .directive("app", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/app.tpl.html",
    };
  })
  .directive("contentView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/content-view.tpl.html",
      controller: ["$scope", "storage",arrayElementControl]
    };
    function arrayElementControl($scope, storage){

      $scope.storage = storage;

      let arrayElements = JSON.parse(localStorage.getItem('arrayElements'));

      if(!arrayElements){
        arrayElements = makeDefaultData()
        localStorage.setItem('arrayElements', JSON.stringify(arrayElements))
      }

      let orderByOptions = ['Title', 'Date'];

      $scope.model = {
        arrayElements: [],
        titleForNewRow: '',
        searchTitle: '',
        showOnlyDate: false,
        orderOptions: orderByOptions,
        orderDefault: orderByOptions[0]
      }

      $scope.changeOrderBy = () => {
        switch ($scope.model.orderDefault){
          case 'Date':
            $scope.model.arrayElements = $scope.model.arrayElements.sort((a,b) => {

              let dateA = new Date(a.date);

              let dateB = new Date(b.date);

              return dateA > dateB ? 1 : -1
            });
            break;
          case 'Title':
            $scope.model.arrayElements = $scope.model.arrayElements.sort((a,b) => a.title > b.title ? 1 : -1)
            break;
        }
      }

      $scope.addToArray = () => {

        if(!$scope.model.titleForNewRow){
          return;
        }

        let date = new Date().toISOString();

        let newObject = {
          id: makeDataId(),
          title: $scope.model.titleForNewRow,
          tags: [],
          date: date,
        }

        $scope.model.titleForNewRow = '';

        $scope.model.arrayElements.push(newObject);

        storage.arrayOfElements = JSON.parse(JSON.stringify($scope.model.arrayElements));

        findLastElementByDate();

        setTimeout(() => localStorage.setItem('arrayElements', JSON.stringify($scope.model.arrayElements)))
      }

      $scope.getRightDateFormat = (date) => {

        let dataFromString = new Date(date);

        let result = dataFromString.toLocaleDateString();

        if(!$scope.model.showOnlyDate){
          result += " " + dataFromString.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }

        return result;

      }

      $scope.chooseRow = (row) => {
        $scope.model.arrayElements.forEach(e => e.chosenRow = false);
        row.chosenRow = true;
        storage.chosenRow = row;
      }

      $scope.changeOrderBy();

      $scope.model.arrayElements = arrayElements;

      storage.arrayOfElements = arrayElements;

      findLastElementByDate();

      storage.stringOfUniqueTags = findUniqueTags(arrayElements)

      function findLastElementByDate(){
        let sortedArray = $scope.model.arrayElements.sort((a,b) => {

          let dateA = new Date(a.date);

          let dateB = new Date(b.date);

          return dateA > dateB ? 1 : -1
        })

        storage.lastItem = JSON.parse(JSON.stringify(sortedArray)).pop()

      }

    }
  })
  .directive("sidebarView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/sidebar-view.tpl.html",
      controller: ["$scope", "storage", sidebarViewController],
    };
    function sidebarViewController($scope, storage){
      $scope.storage = storage;

      $scope.addTag = (tag) => {
        if(storage.chosenRow.tags.indexOf(tag) === -1) {
          storage.chosenRow.tags.push(tag)
          $scope.model.tagsForNewRow = '';
          storage.stringOfUniqueTags = findUniqueTags(storage.arrayOfElements)
        }
      }

      $scope.removeTag = (index) => {
        storage.chosenRow.tags.splice(index, 1)
        storage.stringOfUniqueTags = findUniqueTags(storage.arrayOfElements)
      }

    }
  })
  .directive("elementsView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/elements-view.tpl.html",
      controller: ["$scope", "$element", elementsViewCtrl],
    };
    function elementsViewCtrl($scope, $element) {
      $scope.model = {
        width: 300,
        listArray: [{name: 'Item 1 item 1 item 1 item 1 item 1'}, {name: 'Item 2 item 2 item 2 item 2'}, {name: 'Item 3'}]
      };
      $scope.setWidth = () => {
        let width = $scope.model.width;
        if (!width) {
          width = 1;
          $scope.model.width = width;
        }
        $element.css("width", `${width}px`);
      };
      $scope.setWidth();
    }
  })
  .directive("some1", () => {
    return {
      scope: {},
      restrict: "E",
      template: "<some-2></some-2>",
    };
  })
  .directive("some2", () => {
    return {
      scope: {},
      restrict: "E",
      template: "<some-3></some-3>",
    };
  })
  .directive("some3", () => {
    return {
      scope: {},
      restrict: "E",
      template: "<summary-view></summary-view>",
    };
  })
  .directive("summaryView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/summary-view.tpl.html",
      controller: ["$scope", "storage", lastElementController],
    };
    function lastElementController($scope, storage){

      $scope.storage = storage;

    }
  })
    .service('storage', function (){
      let chosenRow = undefined;
      let stringOfUniqueTags = undefined;
      let lastItem = undefined;
      let arrayOfElements = undefined;
    });

