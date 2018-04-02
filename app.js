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

    var calculateTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach(function(current) {
            sum = sum + current.value;
        });

        data.totals[type] = sum;
    };

    var data = {

        allItems: {
            inc: [],
            exp: []
        },

        totals: {
            inc: 0,
            exp: 0
        },

        budget: 0,
        percentage: -1
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
            if (type === 'inc') {
                newItem = new Income(ID, des, val);
            } else if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }

            // Pushing the newly create 'inc' or 'exp' object to the respective array
            data.allItems[type].push(newItem);

            // Making newly created object publicly avaiable foe usage by other modules
            return newItem;    
        },

        deleteItem : function(type, id) {

            var ids, index;

            // Mapping 'inc' and 'exp' array elements by their index by using 'map' method

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {

                data.allItems[type].splice(index, 1);

            }

        },

        calculateBudget: function() {

            // Calculate Total Income and Expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // Calculate the budget : Income - Expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income we have spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpense: data.totals.exp,
                percentage: data.percentage
            }
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
        expenseContainer    : '.expenses__list',
        budgetLabel         : '.budget__value',
        incomeLabel         : '.budget__income--value',
        expenseLabel        : '.budget__expenses--value',
        percentageLabel     : '.budget__expenses--percentage',
        container           : '.container'
    };

    // Public Interface of UIModule
    return {

        // Returns User Input in UI
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {

            var html, newHTML, element;

            // Create HTML String with Placeholder Text
            
            if (type === 'inc') {

                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            } else if (type === 'exp') {

                element = DOMStrings.expenseContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            }

            // Replace the placeholder text with actual code
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);

            // Insert HTML into the DOM as last elemnt of the parent container
            document.querySelector(element).insertAdjacentHTML('beforeEnd', newHTML);

        },

        deleteListItem: function(selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },
        
        // Clear Input Fields After Each Input Is Accpeted in UI
        clearFields: function() {
            
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
        
            // For converting 'fields' list to array
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {

            document.querySelector(DOMStrings.budgetLabel).textContent      = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent      = obj.totalIncome;
            document.querySelector(DOMStrings.expenseLabel).textContent     = obj.totalExpense;

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent  = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent  = '--';
            }

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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)

    };

    var updateBudget = function() {

        // 1. Calculate the budget
        model.calculateBudget();

        // 2. Return the budget
        var budget = model.getBudget();

        // 3. Display the budget on the UI
        view.displayBudget(budget);
    };

    // IIFE For Addition of New Income or Expense Item
    var ctrlAddItem = function() {

        var input, newItem;

        // 1. Get the field Input Data
        input = view.getInput();

        if(input.description !== "" && !isNaN(input.value) && (input.value > 0)) {

            // 2. Add the item to the budget Controller
            newItem = model.addItem(input.type, input.description, input.value);

            // 3. Add the new item to the UI
            view.addListItem(newItem, input.type);

            // 4. For clearing the input fields
            view.clearFields();

            // 5. Calculate and Update Budget
            updateBudget();

        }

    };

    var ctrlDeleteItem = function(event) {

        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // Delete the Item From the Data Structure
            model.deleteItem(type, ID);
            
            // Delete the Item From the UI
            view.deleteListItem(itemID);

            // Update and Show the New Budget
            updateBudget();

        }

    };

    // Public Interface For controllerModule
    return {

        // Master Initialization Funtcion
        init: function() {
            
            console.log('Application has started');
            
            view.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: -1
            });
            
            setupEventListeners();
        }
    };

})(dataModule, UIModule);

// Triggers The Program
controllerModule.init();
