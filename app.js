//Storage controller
const StorageController = (function () {
    const storeProduct=function(product){
        let products;
        if(localStorage.getItem("products")===null){
            products=[];
        }else{
            products=JSON.parse(localStorage.getItem("products"));
        }
        products.push(product);
        localStorage.setItem("products",JSON.stringify(products));
    }

    const getProduct=function(){
        let products;
        if(localStorage.getItem("products")==null){
            products=[];
        }else{
           products= JSON.parse(localStorage.getItem("products"));
        }
        return products;

    }


    const updateStorage=function(product){
        let products=JSON.parse(localStorage.getItem("products"));
        products.forEach((element,index) => {
            if(element.id == product.id){
                products.splice(index,1,product);
            }
        });
        localStorage.setItem("products",JSON.stringify(products));
    }
    const removeStorage=function(product){
        let products=JSON.parse(localStorage.getItem("products"));
        products.forEach((element,index) => {
            if(element.id == product.id){
                products.splice(index,1);
            }
        });
        localStorage.setItem("products",JSON.stringify(products));
    }

    return{
        storeProduct,
        getProduct,
        removeStorage,
        updateStorage
    }
})();

//product controller
const ProductController = (function () {
    //private
    class Product {
        constructor(id, name, price) {
            this.id = id;
            this.name = name;
            this.price = price;
        }
    }
    const data = {
        products: StorageController.getProduct(),
        selectedProduct: null,
        totalPrice: 0
    }
    const getProducts = function () {
        return data.products;
    }
    const getData = function () {
        return data;
    }
    const getTotal = function () {
        let total = 0;
        data.products.forEach(function (item) {
            total += item.price;
        });
        data.totalPrice = total;
        return total;
    }
    const getProductById = function (id) {
        let product = null;
        data.products.forEach(element => {
            if (element.id == id) {
                product = element;
            }
        });
        return product;
    }
    const removeRow = function () {
        let product = null;
        data.products.forEach((prd, index) => {
            if (prd.id === data.selectedProduct.id) {
                product = prd;
                data.products.splice(index, 1);
            }
        });
        return product;
    }
    const setCurrentProduct = function (product) {
        data.selectedProduct = product;
    }
    const getCurrentProduct = function () {
        return data.selectedProduct;
    }
    const addProduct = function (productName, productPrice) {
        let id;
        if (data.products.length > 0) {
            id = data.products[data.products.length - 1].id + 1;
        } else {
            id = 0;
        }
        const newProduct = new Product(id, productName, parseFloat(productPrice));
        data.products.push(newProduct);
        return newProduct;
    }
    const updateProduct = function (name, price) {
        let product = null;
        data.products.forEach(index => {
            if (index.id == data.selectedProduct.id) {
                index.name = name;
                index.price = parseFloat(price);
                product = index;
            }
        });


        return product;
    }

    return {
        //public
        getProducts,
        getData,
        addProduct,
        updateProduct,
        getTotal,
        removeRow,
        getProductById,
        setCurrentProduct,
        getCurrentProduct
    }
})();

//UI Controller
const UIController = (function () {

    const Selectors = {
        productList: "#item-list",
        productListTr: "#item-list tr",
        addButton: "#addBtn",
        editButton: "#editBtn",
        removeButton: "#deleteBtn",
        cancelButton: "#cancelBtn",
        productName: "#productName",
        productPrice: "#productPrice",
        productCard: "#productCard",
        totalTl: "#total-tl",
        totalDollar: "#total-dollar"



    }
    const createProductList = function (products) {
        let html = "";

        products.forEach(element => {
            html += `
                <tr>
                            <td>${element.id}</td>
                            <td>${element.name}</td>
                            <td>${element.price} $</td>
                            <td>1</td>
                            <td class="text-end ">
                               <i  class="fas fa-edit edit-product"></i>
                            </td>

                        </tr>
            
            `
        });

        document.querySelector(Selectors.productList).innerHTML = html;

    }
    const addProductToForm = function () {
        const selectedProduct = ProductController.getCurrentProduct();
        document.querySelector(Selectors.productName).value = selectedProduct.name;
        document.querySelector(Selectors.productPrice).value = selectedProduct.price;


    }
    const removeRow = function (remove) {
        const tr = document.querySelectorAll(Selectors.productListTr);
        tr.forEach(index => {

            if (remove.id == index.children[0].textContent) {
                index.remove();
            }
        });
    }
    const addProduct = function (product) {
        document.querySelector(Selectors.productCard).style.display = "block";
        let html = `
                <tr>
                            <td>${product.id}</td>
                            <td>${product.name}</td>
                            <td>${product.price} $</td>
                            <td>1</td>
                            <td class="text-end ">
                                <i  class="fas fa-edit edit-product"></i>
                            </td>

                        </tr>
                         `
        document.querySelector(Selectors.productList).innerHTML += html;

    }
    const clearWarning = function (removeClassName) {

        const list = document.querySelectorAll(Selectors.productListTr);
        list.forEach(index => {
            if (index.classList.contains(removeClassName)) {
                index.classList.remove(removeClassName);
            }
        });




    }
    const addingState = function () {
        UIController.clearWarning("bg-warning");
        UIController.clearInputs();
        document.querySelector(Selectors.addButton).style.display = "inline";
        document.querySelector(Selectors.editButton).style.display = "none";
        document.querySelector(Selectors.removeButton).style.display = "none";
        document.querySelector(Selectors.cancelButton).style.display = "none";


    }
    const editState = function (tr) {

        tr.classList.add("bg-warning");
        document.querySelector(Selectors.addButton).style.display = "none";
        document.querySelector(Selectors.editButton).style.display = "inline";
        document.querySelector(Selectors.removeButton).style.display = "inline";
        document.querySelector(Selectors.cancelButton).style.display = "inline";


    }


    const clearInputs = function () {
        document.querySelector(Selectors.productName).value = "";
        document.querySelector(Selectors.productPrice).value = "";

    }
    const getTotal = function (total) {

        let dollarRate = 8.6;



        document.querySelector(Selectors.totalTl).textContent = total;
        document.querySelector(Selectors.totalDollar).textContent = (total / dollarRate).toFixed(2);

    }
    const updateShow = function (prd) {

        let updateItem = null;
        let items = document.querySelectorAll(Selectors.productListTr);

        items.forEach(index => {
            if (index.classList.contains("bg-warning")) {
                index.children[1].textContent = prd.name;
                index.children[2].textContent = prd.price + " $";
                updateItem = index;

            }

        });
        return updateItem;




    }
    const hideCard = function () {
        document.querySelector(Selectors.productCard).style.display = "none";
    }
    const getSelectors = function () {
        return Selectors;
    }

    return {
        createProductList,
        getSelectors,
        addProduct,
        removeRow,
        clearWarning,
        clearInputs,
        hideCard,
        getTotal,
        updateShow,
        addProductToForm,
        addingState,
        editState
    }

})();

//App controller

const App = (function (productController, UIController,StorageCtrl) {

    const UISelectors = UIController.getSelectors();

    //load event listeners
    const loadEventListeners = function () {


        //add product event
        document.querySelector(UISelectors.addButton).addEventListener("click", productAddSubmit);


        //edit product
        document.querySelector(UISelectors.productList).addEventListener("click", productEditClick);
        //edit product submit
        document.querySelector(UISelectors.editButton).addEventListener("click", productEditSubmit);
        //cancel click
        document.querySelector(UISelectors.cancelButton).addEventListener("click", productCancelClick);
        //cancel click
        document.querySelector(UISelectors.removeButton).addEventListener("click", productRemoveClick);




    }
    const productRemoveClick = function (e) {
        const removeElement = productController.removeRow();

        UIController.removeRow(removeElement);
        //get total
        const total = productController.getTotal();
        console.log(total);
        //show total
        UIController.getTotal(total);
        //clear inputs
        UIController.addingState();
        //delete from ls
        StorageCtrl.removeStorage(removeElement);
        if(total==0){
            UIController.hideCard();
        }

        e.preventDefault();
    }
    const productCancelClick = function (e) {
        UIController.addingState();
        UIController.clearWarning("bg-warning");
        e.preventDefault();
    }
    const productEditSubmit = function (e) {
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;
        if (productName !== "" && productPrice !== "") {
            //update product
            const updatedProduct = productController.updateProduct(productName, productPrice);
            //UI CONTROLLER update product
            let item = UIController.updateShow(updatedProduct);
            //get total
            const total = productController.getTotal();
            
            //show total
            UIController.getTotal(total);
            //update storage
            StorageCtrl.updateStorage(updatedProduct);
            UIController.addingState();
        }



        e.preventDefault();
    }


    const productEditClick = function (e) {
        if (e.target.classList.contains("edit-product")) {


            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            //get selected product

            const product = productController.getProductById(id);
            //set current product
            productController.setCurrentProduct(product);
            //add product to UI
            UIController.addProductToForm();
            //clear warning
            UIController.clearWarning("bg-warning");
            //button show
            UIController.editState(e.target.parentNode.parentNode);
        }
        e.preventDefault();
    }
    const productAddSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productPrice !== "" && productName !== "") {
            const newProduct = productController.addProduct(productName, productPrice);
            //add product to list
            UIController.addProduct(newProduct);
            //go to storage
            StorageCtrl.storeProduct(newProduct); 
            //get total
            const total = productController.getTotal();
            //show total
            UIController.getTotal(total);
            //clear inputs
            UIController.clearInputs();
        }
        e.preventDefault();
    }

    const init = function () {
        console.log("starting");
        UIController.addingState();

        const products = productController.getProducts();

        if (products.length == 0) {
            UIController.hideCard();
        } else {
            UIController.createProductList(products);
        }


        //load event listeners
        loadEventListeners();
    }
    return {
        init

    }


})(ProductController, UIController,StorageController);

App.init();