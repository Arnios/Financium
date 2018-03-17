var dataModule = (function() {

    // Function Constructor For Income
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Function Constructor For Expense
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {

        allItems: {
            inc: [],
            exp: []
        },

        totals: {
            inc: 0,
            exp: 0
        }
    };

    // Public Interface for dataNodule
    return {

        addItem: function(type, des, val) {
            var newItem, ID;

            // Obtaining the last ID of the respective array and add 1
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            

            // Creating new 'inc' or 'exp' object
            if(type === 'inc') {
                newItem = new Income(ID, des, val);
            } else if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }

            // Pushing the newly create 'inc' or 'exp' object to the respective array
            data.allItems[type].push(newItem);

            // Making newly created object publicly avaiable foe usage by other modules
            return newItem;    
        },

        testing: function() {
            console.log(data);
        }
    };

})();

var UIModule = (function() {

    // HTML Class Names
    var DOMStrings = {
        inputType           : '.add__type',
        inputDescription    : '.add__description',
        inputValue          : '.add__value',
        inputBtn            : '.add__btn',
        incomeContainer     : '.income__list',
        expenseContainer    : '.expenses__list'
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

        addListItem: function(obj, type) {

            var html, newHTML, element;

            // Create HTML String with Placeholder Text
            
            if (type === 'inc') {

                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            } else if (type === 'exp') {

                element = DOMStrings.expenseContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            }

            // Replace the placeholder text with actual code
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);

            // Insert HTML into the DOM as last elemnt of the parent container
            document.querySelector(element).insertAdjacentHTML('beforeEnd', newHTML);

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

        var input, newItem;

        // 1. Get the field Input Data
        input = view.getInput();

        // 2. Add the item to the budget Controller
        newItem = model.addItem(input.type, input.description, input.value);

        // 3. Add the new item to the UI
        view.addListItem(newItem, input.type);

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
