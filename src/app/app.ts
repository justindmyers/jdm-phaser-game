/// <reference path="../../typings/tsd.d.ts"/>
module PhaserGame {
    window['state'] = {}; 
    
    window['myVarWatch'] = (function() {
        var watches = {};

        return {
            watch: function(callback) {
                var id = Math.random().toString();
                watches[id] = callback;

                // Return a function that removes the listener
                return function() {
                    watches[id] = null;
                    delete watches[id];
                }
            },
            trigger: function() {
                for (var k in watches) {
                    watches[k](window['state']);
                }
            }
        }
    })();
} 

module PhaserGame {
    "use strict";
    angular.module("app", []);
    export var getModule: () => ng.IModule = () => {
        return angular.module("app");
    }
} 

module PhaserGame {
    "use strict";
    var app = getModule();
    class MainController {
        private currentState: Phaser.StateManager;
        private health: String = 'test';
        constructor(private $scope: ng.IScope, private $window: ng.IWindowService) {
            var self = this;
            var unbind = $window['myVarWatch'].watch(function(value) {
                $scope.$apply(function() {
                    self.currentState = value;
                    console.log(self.currentState);
                });
            });
            
            // Unbind the listener when the scope is destroyed
            $scope.$on('$destroy', unbind);
        }
        
        goToMainMenu() {
            this.currentState.start('MainMenu', true);
        }
    }
    
    app.controller("mainCtrl", MainController);
}