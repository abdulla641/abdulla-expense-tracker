// Abdulla Expense Tracker
// Version 1.0


let expenses = JSON.parse(
    localStorage.getItem("expenses")
) || [];



// Add Expense

function addExpense() {


    let amount = document.getElementById("amount").value;

    let currency = document.getElementById("currency").value;

    let wallet = document.getElementById("wallet").value;

    let category = document.getElementById("category").value;

    let payment = document.getElementById("payment").value;

    let note = document.getElementById("note").value;



    if(!amount){

        alert("Please enter amount");
        return;

    }



    let expense = {


        id: Date.now(),

        amount:Number(amount),

        currency:currency,

        wallet:wallet,

        category:category,

        payment:payment,

        note:note,

        date:new Date().toISOString()


    };



    expenses.unshift(expense);



    saveData();


    clearForm();


    displayExpenses();


}





// Save locally

function saveData(){

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

}



// Clear input fields

function clearForm(){

    document.getElementById("amount").value="";

    document.getElementById("note").value="";

}




// Display history

function displayExpenses(){


let history=document.getElementById("history");


history.innerHTML="";



expenses.forEach(e=>{


let date=new Date(e.date)
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

Wallet: ${e.wallet}

<br>

Payment: ${e.payment}

<br>

${e.note || ""}

</div>


</div>


`;



});



calculateDashboard();


}





// Dashboard calculations

function calculateDashboard(){



let totalQAR=0;

let monthQAR=0;


let currentMonth =
new Date().getMonth();



expenses.forEach(e=>{


// Only add QAR totals

if(e.currency==="QAR"){


totalQAR += e.amount;



let d=new Date(e.date);


if(
d.getMonth()===currentMonth
){

monthQAR += e.amount;

}


}



});




document.getElementById(
"totalSpent"
).innerText =
"QAR " + totalQAR;



document.getElementById(
"monthSpent"
).innerText =
"QAR " + monthQAR;



document.getElementById(
"transactionCount"
).innerText =
expenses.length;



}




// Export backup

function exportData(){


let data =
JSON.stringify(
expenses,
null,
2
);



let blob =
new Blob(
[data],
{
type:"application/json"
}
);



let url =
URL.createObjectURL(blob);



let a=document.createElement("a");

a.href=url;

a.download="Abdulla_Expense_Backup.json";

a.click();



}




// Delete all

function clearData(){


if(confirm(
"Delete all expenses?"
)){


expenses=[];

saveData();

displayExpenses();


}


}




// Start app

displayExpenses();



// Enable offline mode

if("serviceWorker" in navigator){

navigator.serviceWorker.register(
"service-worker.js"
);

}
