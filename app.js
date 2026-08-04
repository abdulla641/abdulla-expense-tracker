// Abdulla Finance Tracker v1.1


let expenses =
JSON.parse(localStorage.getItem("expenses"))
|| [];



// Load saved settings

let budget =
localStorage.getItem("budget")
|| 0;


let goal =
JSON.parse(localStorage.getItem("goal"))
|| null;


let card =
JSON.parse(localStorage.getItem("card"))
|| null;





// Add Expense

function addExpense(){


let amount =
document.getElementById("amount").value;


let currency =
document.getElementById("currency").value;


let wallet =
document.getElementById("wallet").value;


let category =
document.getElementById("category").value;


let payment =
document.getElementById("payment").value;


let note =
document.getElementById("note").value;




if(!amount){

alert("Enter amount");

return;

}




let expense={


id:Date.now(),


amount:Number(amount),


currency,


wallet,


category,


payment,


note,


date:new Date().toISOString()


};




expenses.unshift(expense);



saveExpenses();


clearInputs();


render();



}





function saveExpenses(){


localStorage.setItem(

"expenses",

JSON.stringify(expenses)

);


}




function clearInputs(){


document.getElementById("amount").value="";


document.getElementById("note").value="";


}





// Display transactions


function render(){


let history =
document.getElementById("history");


history.innerHTML="";



expenses.forEach(e=>{


let date =
new Date(e.date)
.toLocaleDateString();



history.innerHTML += `


<div class="expense-item">


<div class="expense-top">

<span>

${e.category}

</span>


<span>

${e.currency} ${e.amount}

</span>


</div>


<div class="expense-details">


${date}

<br>

${e.wallet}

<br>

${e.payment}

<br>

${e.note || ""}


</div>


</div>



`;



});



updateDashboard();

updateBudget();

displayGoal();

displayCard();


}





// Dashboard


function updateDashboard(){



let qarTotal=0;

let monthTotal=0;

let vacation=0;



let currentMonth =
new Date().getMonth();



expenses.forEach(e=>{


if(e.currency==="QAR"){

qarTotal += e.amount;



let d =
new Date(e.date);


if(
d.getMonth()
===
currentMonth
){

monthTotal += e.amount;

}


}



if(
e.wallet==="India Vacation"
&&
e.currency==="INR"

){

vacation += e.amount;


}



});





document.getElementById(
"totalSpent"
)
.innerText =
"QAR "+qarTotal;



document.getElementById(
"monthSpent"
)
.innerText =
"QAR "+monthTotal;



document.getElementById(
"vacationSpent"
)
.innerText =
"₹"+vacation;



document.getElementById(
"transactionCount"
)
.innerText =
expenses.length;



}







// Budget


function saveBudget(){


budget =
document.getElementById(
"budget"
).value;



localStorage.setItem(
"budget",
budget
);



updateBudget();


}



function updateBudget(){


let spent=0;



expenses.forEach(e=>{


if(e.currency==="QAR"){

spent+=e.amount;

}


});



let remaining =
Number(budget)-spent;



if(budget>0){


document.getElementById(
"budgetStatus"
)
.innerHTML =

`
Budget:
QAR ${budget}

<br>

Used:
QAR ${spent}

<br>

Remaining:
QAR ${remaining}
`;



}



}






// Savings Goal


function saveGoal(){



goal={


name:
document.getElementById(
"goalName"
).value,


amount:
Number(
document.getElementById(
"goalAmount"
).value
),


saved:0


};



localStorage.setItem(

"goal",

JSON.stringify(goal)

);



displayGoal();



}



function displayGoal(){


if(goal){


document.getElementById(
"goalDisplay"
)
.innerHTML =


`
🎯 ${goal.name}

<br>

Target:
QAR ${goal.amount}

<br>

Saved:
QAR ${goal.saved}

`;


}



}







// Credit Card


function saveCard(){



card={


limit:
Number(
document.getElementById(
"cardLimit"
).value
),


used:
Number(
document.getElementById(
"cardUsed"
).value
)



};



localStorage.setItem(

"card",

JSON.stringify(card)

);



displayCard();



}




function displayCard(){


if(card){


let available =
card.limit-card.used;


document.getElementById(
"cardDisplay"
)
.innerHTML =


`

Limit:
QAR ${card.limit}

<br>

Used:
QAR ${card.used}

<br>

Available:
QAR ${available}

`;



}


}






// Export


function exportData(){



let backup = {


expenses,


budget,


goal,


card


};



let blob =

new Blob(

[
JSON.stringify(
backup,
null,
2
)

],

{
type:"application/json"
}

);



let link =
document.createElement("a");


link.href =
URL.createObjectURL(blob);


link.download =
"Abdulla_Finance_Backup.json";


link.click();



}







// Delete


function clearData(){


if(confirm(
"Delete everything?"
)){


localStorage.clear();


expenses=[];


render();


}



}







// Start

render();



if(
"serviceWorker"
in navigator
){


navigator.serviceWorker.register(
"service-worker.js"
);


}
