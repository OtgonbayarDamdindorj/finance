// Дэлгэцтэй ажилах контроллер
var uiController = (function(){
var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    IncomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    containerDiv: ".container"
};
return {
    getInput: function() {
        return {
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseInt(document.querySelector(DOMstrings.inputValue).value)
        };
    },

    getDOMstrings: function() {
        return DOMstrings;
    },

    clearFields: function() {
        var fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
        var fieldsArr = Array.prototype.slice.call(fields);
        fieldsArr.forEach(function(el, index, array){
            el.value = "";
        });

        fieldsArr[0].focus();
        // for(var i = 0; i < fieldsArr.length; i++) {
        //     fieldsArr[i].value = "";
        // }
    },

    tusviigUzuuleh: function(tusuv){
        document.querySelector(DOMstrings.tusuvLabel).textContent = tusuv.tusuv;
        document.querySelector(DOMstrings.incomeLabel).textContent = tusuv.totalInc;
        document.querySelector(DOMstrings.expenseLabel).textContent = tusuv.totalExp;
        if(tusuv.huvi !== 0) {
            document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi + "%";
        } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi;
        }
        },

        deleteListItem: function(id) {
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },

    addListItem: function(item, type) {
        // Орлого зарлагын элементийг агуулсан html-ийг бэлтгэнэ
        var html, list; 
        if(type === 'inc') {
            list = DOMstrings.IncomeList;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">+%VALUE%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else {
            list = DOMstrings.expenseList;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">-%VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
        }
        // Тэр html дотроо  орлого зарлагын утгуудыг Replace ашиглаж өөрчилж өгнө
        html = html.replace('%id%', item.id);
        html = html.replace('%DESCRIPTION%', item.description);
        html = html.replace('%VALUE%', item.value);
        // Бэлтгэсэн HTML ээ DOM руу хийж өгнө.
        document.querySelector(list).insertAdjacentHTML('beforeend', html);
    }
};
})();

//Санхүүтэй ажиллах контроллер
var financeController = (function(){
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0)
        this.percentage = Math.round((this.value / totalIncome) * 100);
        else this.percentage = 0;
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.items[type].forEach(function(el) {
            sum = sum + el.value;
        });

        data.totals[type] = sum;
    }

    var data = {
        items: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        tusuv: 0,

        huvi: 0
    };
    return {
        tusuvTootsooloh: function() {
            // Нийт орлогын нийлбэрийг тооцоолно
        calculateTotal("inc");
            // Нийт зарлагын нийлбэрийг тооцоолно
        calculateTotal("exp");
            // Төсвийг шинээр тооцоолно 
        data.tusuv = data.totals.inc - data.totals.exp;
            // Орлого зарлагын хувийг тооцоолно
            if(data.totals.inc > 0)
        data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
            else
        data.huvi = 0;
    },

    calculatePercentages: function() {
        data.items.exp.forEach(function(el){
            el.calcPercentage(data.totals.inc);
        });
    },

    getPercentages: function() {
        var allPercentages = data.items.exp.map(function(el){
            return el.getPercentage();
        });
        return allPercentages;
    },


        tusviigAvah: function() {
            return {
                tusuv: data.tusuv,
                huvi: data.huvi,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },

        deleteItem: function(type, id) {
            var ids = data.items[type].map(function(el){
                return el.id;
            });
            
            var index = ids.indexOf(id);

            if (index !== 1) {
                data.items[type].splice(index, 1);
            }
        },

    addItem: function(type, desc, val) {
        var item, id;

        if (data.items[type].length === 0) id = 1;
        else {
            id = data.items[type][data.items[type].length - 1].id + 1;
        }

        if (type === "inc") {
            item = new Income(id, desc, val);
        } else {
            item = new Expense(id, desc, val);
        }
        data.items[type].push(item);

        return item;
    }, 
    seeData: function(){
        return data;
    }  
    };
})();

//Программын холбогч контроллер
var appController = (function(uiController, financeController){
var ctrlAddItem = function() {
// 1. Оруулах өгөгдлийг дэлгэцээс олж авна
var input = uiController.getInput();

if(input.description !== "" && input.value !== ""){
// 2. Олж авсан өгөдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална
var item = financeController.addItem(
    input.type, 
    input.description, 
    input.value
    );
    // 3. Олж авсан өгөгдлүүдээ веб дээрээ тохирох хэсэгт нь гаргана
    uiController.addListItem(item, input.type);
    uiController.clearFields();
// Төсвийг шинээр тооцоолоод дэлгэцэнд үзүүлнэ.
    updateTusuv();
}
};

var updateTusuv = function() {
    // 4. Төсвийг тооцоолно
financeController.tusuvTootsooloh();

// 5. Эцсийн үлдэгдэл 
var tusuv = financeController.tusviigAvah();

// 6. тооцоог дэлгэцэнд гаргана
uiController.tusviigUzuuleh(tusuv);

// 7. Элементүүдийн хувийг тооцоолно.
financeController.calculatePercentages();

// 8. Элементүүдийн хувийг хүлээж авна
var allPercentages = financeController.getPercentages();

// 9. Эдгээр хувийг дэлгэцэнд гаргана.
console.log(allPercentages);
};

var setupEventListeners = function () {

    var DOM = uiController.getDOMstrings();

    document.querySelector(DOM.addBtn).addEventListener("click", function(){
        ctrlAddItem();
        });
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
            }
        });

        document
        .querySelector(DOM.containerDiv)
        .addEventListener('click', function(event){
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id; 
        if(id){
        // inc-2
        var arr = id.split("-");
        var type = arr[0];
        var itemId = parseInt(arr[1]);
        // 1.Санхүүгийн модиулаас type, id ашиглан устгана.
            financeController.deleteItem(type, itemId);
        // 2.Дэлгэц дээрээс энэ элементийг устгана.
            uiController.deleteListItem(id);
        // 3.Үлдэгдэл тооцоог шинэчилж харуулна.
        // Төсвийг шинээр тооцоолоод дэлгэцэнд үзүүлнэ.
    updateTusuv();  
        }
        });

};

    return {
        init: function() {
            console.log("Aplication started...");
            uiController.tusviigUzuuleh({
                tusuv: 0,
                huvi: 0,
                totalInc: 0,
                totalExp: 0
            });
            setupEventListeners();
        }
    };
})(uiController, financeController);

appController.init();