var dataModule = (function() {

    // Some Code

})();

var UIModule = (function() {

    // HTML Class Names
    var DOMStrings = {
        inputType           : '.add__type',
        inputDescription    : '.add__description',
        inputValue          : '.add__value',
        inputBtn            : '.add__btn'
    };

    // Public Interface of UIModule
    return {

        // Returns User Input in UI
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        // Public Interface of DOMStrings Variable
        getDOMStrings: function() {
            return DOMStrings;
        }
    };

})();

var controllerModule = (function(model, view) {

    // Event Listeners Module
    var setupEventListeners = function() {

        // Variable for Class Names in this controllerModule
        var DOM = view.getDOMStrings();

        // Event Listener For Click of UI 'Right' Button
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // Event Listener For Press of 'Enter' Key
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

    };

    // IIFE For Addition of New Income or Expense Item
    var ctrlAddItem = function() {

        // 1. Get the field Input Data
        var input = view.getInput();

        // 2. Add the item to the budget Controller

        // 3. Add the new item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    };

    // Public Interface For controllerModule
    return {

        // Master Initialization Funtcion
        init: function() {
            console.log('Application has started');
            setupEventListeners();
        }
    };

})(dataModule, UIModule);

// Triggers The Program
controllerModule.init();
