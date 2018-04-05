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
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {

        if (totalIncome > 0) {

            this.percentage = Math.round((this.value / totalIncome) * 100);

        } else {

            this.percentage = -1;
        }

    };

    Expense.prototype.getPercentage = function() {

        return this.percentage;

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

    // Public Interface for 'Data Module'
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

        calculatePercentages: function() {

            data.allItems.exp.forEach(function(current) {

                current.calcPercentage(data.totals.inc);

            });

        },

        getPercentages: function() {

            var allPercentages = data.allItems.exp.map(function(current) {

                return current.getPercentage();

            });

            // Array With All of The Individual Percentages Stored In
            return allPercentages;

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
        container           : '.container',
        expensePercLabel    : '.item__percentage',
        dateLabel           : '.budget__title--month'
    };

    // Custom Function For Node List Traversal
    var nodeListForEach = function(list, callback) {

        for (var i = 0; i < list.length; i++) {

            callback(list[i], i);
        }
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

        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMStrings.expensePercLabel);

            nodeListForEach(fields, function(current, index) {

                if (percentages[index] > 0) {

                    current.textContent = percentages[index] + '%';
            
                } else {

                    current.textContent = '--';

                }
            });
        },

        displayDate: function() {

            var now, year, month, monthArray;

            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            document.querySelector(DOMStrings.dateLabel).textContent = monthArray[month] + ', ' + year;

        },

        changeType: function() {

            var fields;

            fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

            nodeListForEach(fields, function(current) {

                current.classList.toggle('red-focus');

            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');

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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', view.changeType);

    };

    var updateBudget = function() {

        // 1. Calculate the budget
        model.calculateBudget();

        // 2. Return the budget
        var budget = model.getBudget();

        // 3. Display the budget on the UI
        view.displayBudget(budget);
    };

    var updatePercentages = function() {

        var percentages;

        // Calculate the Pecentages
        model.calculatePercentages();
        
        // Get Percentages From Data Module
        percentages = model.getPercentages();

        // Update the UI With New Percentages
        view.displayPercentages(percentages);

    };

    // IIFE For Addition of New Income or Expense Item
    var ctrlAddItem = function() {

        var input, newItem;

        // Get the field Input Data
        input = view.getInput();

        if(input.description !== "" && !isNaN(input.value) && (input.value > 0)) {

            // Add the item to the Data Module
            newItem = model.addItem(input.type, input.description, input.value);

            // Add the new item to the UI
            view.addListItem(newItem, input.type);

            // For clearing the input fields
            view.clearFields();

            // Calculate and Update Budget
            updateBudget();

            // Calculate and Update Percentages
            updatePercentages();

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

            // Calculate and Update Percentages
            updatePercentages();

        }

    };

    // Public Interface For controllerModule
    return {

        // Master Initialization Funtcion
        init: function() {
            
            console.log('Application has started');
            
            view.displayDate();

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
