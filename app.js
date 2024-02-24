(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var narrowCtrl = this;
        narrowCtrl.searchTerm = '';
        narrowCtrl.foundItems = [];

        narrowCtrl.narrowItDown = function () {
            // Call service to get matched menu items
            MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm)
                .then(function (foundItems) {
                    narrowCtrl.foundItems = foundItems;
                })
                .catch(function (error) {
                    console.error('Error:', error);
                });
        };

        narrowCtrl.removeItem = function (index) {
            // Remove item from foundItems array
            narrowCtrl.foundItems.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: 'GET',
                url: 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json'
            })
            .then(function (result) {
                console.log('Result:', result.data);
        
                // Process result and keep items that match searchTerm
                var foundItems = [];
        
                // Loop through categories
                for (var prop in result.data) {
                    if (result.data.hasOwnProperty(prop)) {
                        // Filter items within each category
                        var categoryItems = result.data[prop].menu_items.filter(function (item) {
                            return item.description.includes(searchTerm);
                        });
        
                        // Add filtered items to foundItems
                        foundItems = foundItems.concat(categoryItems);
                    }
                }
        
                // Return processed items
                return foundItems;
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
        };
    }

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'founditems.html', // Create a template file for displaying found items
            scope: {
                items: '<',
                onRemove: '&'
            }
        };

        return ddo;
    }

})();
