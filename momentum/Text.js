const a = 10;
const b = 2;
let myName = "nico";

console.log(a+b); 
console.log(a*b);
console.log(a/b);
console.log("hello" + myName);

myName = "nicolas"

console.log("your new name is" + myName)

const amIFat = null;
let something;
console.log(amIFat)
console.log(something)

const mon = "mon";
const tue = "tue";
const wed = "wed";
const thu = "thu";
const fri = "fri";
const sat = "sat";
const sun = "sund";
const daysofWeek = [mon , tue , wed , thu , fri , sat];
const nonsense = [1,2,"hello",true,false]

// Get Item from Array
console.log(daysofWeek)

// Add one more day to the arreay
daysofWeek.push(sun);

console.log(daysofWeek);


const playerName = "nico";
const playerPoints = 121212;
const playerHandsome = false;
const playerFat = "little bit";

const player = {
    name: "nico",
    points: 10,
    fat: true, 
};

console.log(player);
player.lastname = "potato";
player.fat = false;
player.points = 15;
console.log(player);

function sayHello(nameOfPerson, age) {
    console.log("Hello my name is" + nameOfPerson +"and I'm" + age);

}

sayHello("nico", 10);
sayHello("dal", 23);
sayHello("lynn", 21);

function plus(firstNumber, secondNumber){
    console.log(firstNumber + secondNumber);
}
function divide(a,b) {
    console.log(a/b);
}
plus(8, 60);
divide(98, 20);

const player2 = {
    name: "nico",
    sayHello: function(otherPersonsName){
        console.log("Hello! " + otherPersonsName + "nice to meet you");
    },
};

console.log(player2.name);
player2.sayHello("lynn");

const calculator = {
add: function (a, b) {
return a + b;
},
minus: function (a, b) {
return a - b;
},
div: function (a, b) {
return  a / b;
},
multi: function (a, b) {
return  a * b;
},
power: function (a, b) {
return  a ** b;
},
};

const plusResult = calculator.add(2,3);
const minusResult = calculator.minus(plusResult,10);
const multiResult = calculator.multi(10, minusResult);
const divResult = calculator.div(multiResult, plusResult);
const powerResult = calculator.power(divResult, minusResult);

console.log(plusResult);

const age = parseInt(prompt("How old are you"));


console.log(isNaN(age));

if(isNaN(age) || age <0){
    console.log("Please write a real positive number")

} else if(age < 18) {
    console.log("You are too young.");
} else if(age >= 18 && age <= 50){
    console.log("You can drink");
} else if (age > 50 && age <= 80) {
    console.log("You should exercise");
} else if (age === 100) {
    console.log("wow you are wise")
} else if (age >80) {
    console.log ("You can do whatever you want.");
} 

const title = document.querySelector(".hello h1");
console.log(title);


const h1 = document.querySelector("div.hello:first-child h1");
console.dir(h1);

function handletitleClick() {
    h1.style.color = "blue";
}
function handleMouseEnter() {
    h1.innerText = "Mouse is here!";
}
function handleMouseLeave() {
    h1.innerText = "Mouse is gone";

}

function handleWindowResize(){
    document.body.style.backgroundColor = "tomato";
}
function handleWindowCopy(){
    alert("copier!");
}
function handleWindowOffline(){
    alert("SOS no WIFI");
}
function handleWindowOnline(){
    alert("WIFI Good");
}

h1.addEventListener("click", handletitleClick);
h1.addEventListener("mouseenter",handleMouseEnter);
h1.addEventListener("mouseleave",handleMouseLeave);

window.addEventListener("resize", handleWindowResize);
window.addEventListener("copy", handleWindowCopy);
window.addEventListener("offline", handleWindowOffline);
window.addEventListener("online", handleWindowOnline);

const h1 = document.querySelector("div.hello:first-child h1");

function handletitleClick() {
    const currentColor = h1.style.color;
    let newColor;
    if (currentColor === "blue"){
        newColor = "tomato";
    } else {
        newColor = "blue";
    }
    h1.style.color = newColor;
}
h1.addEventListener("click", handletitleClick);

const h1 = document.querySelector("div.hello:first-child h1");

function handletitleClick() {
    h1.classList.toggle("clicked");
}
h1.addEventListener("click", handletitleClick);

// const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input");
const loginButton = document.querySelector("#login-form button");

function onLoginBtnlick() {
    const username = loginInput.value;
    if (username === "") {
        alert("Please write your name");
    } else if(username.length > 15) {
        alert("your name is too long.");
    }
}

loginButton.addEventListener("click", onLoginBtnlick);


}
