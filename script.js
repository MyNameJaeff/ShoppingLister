import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-3f6c3-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);

let householdName = "";
console.log(localStorage.getItem("houseHoldName"));
function startStorage() {
    if (!localStorage.getItem('firsttime') && !localStorage.getItem("houseHoldName")) {
        localStorage.setItem('firsttime', true);
    }
}
startStorage();

let firstTime = localStorage.getItem('firsttime');
if (firstTime && !localStorage.getItem("houseHoldName")) {
    localStorage.setItem("firsttime", false);
    do{
        householdName = window.prompt("What's the household tag?");
    }while(householdName == null || householdName == "" );
    householdName = householdName.toLocaleLowerCase();
    localStorage.setItem("houseHoldName", householdName);
} else {
    householdName = localStorage.getItem("houseHoldName");
    householdName = householdName.toLocaleLowerCase();
}
const shoppingListInDB = ref(database, `${householdName}/shoppingList`);

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const list = document.getElementById("list-items");
const remLocal = document.getElementById("remLocal-button");

onValue(shoppingListInDB, function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());

        clearList();

        itemsArray.forEach(element => {
            createItem(element);
        });
    } else {
        list.innerHTML = "No items yet added";
    }
})

addButtonEl.addEventListener("click", function () {
    let inputValue = inputFieldEl.value;
    if (inputValue !== "") {
        let inputValue2 = capitalizeFirstLetter(inputValue);

        push(shoppingListInDB, inputValue2);
        clearInput();
    } else {
        alert("You have to have an input!");
    }
})

remLocal.addEventListener("click", function () {
    localStorage.removeItem("houseHoldName");
    localStorage.setItem("firsttime", true);
    location.reload();
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
const clearInput = () => {
    inputFieldEl.value = "";
}
const clearList = () => {
    list.innerHTML = "";
}
const createItem = (item) => {
    let listItem = document.createElement("li");
    listItem.textContent = item[1];
    listItem.addEventListener("click", function () {
        let exactLocationOfItemInDB = ref(database, `${householdName}/shoppingList/${item[0]}`);
        remove(exactLocationOfItemInDB);
    })
    list.appendChild(listItem);
}