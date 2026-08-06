let expenses =
JSON.parse(localStorage.getItem("expenses"))
|| [];


let wallet =
JSON.parse(localStorage.getItem("wallet"))
|| [];



const tripStart =
new Date("2026-09-17");

const tripEnd =
new Date("2026-10-20");




// Save Data

function saveData(){

localStorage.setItem(
"expenses",
JSON.stringify(expenses)
);


localStorage.setItem(
"wallet",
JSON.stringify(wallet)
);

}




// Add Money

function addMoney(){


let amount =
document.getElementById("moneyAmount").value;


let currency =
document.getElementById("moneyCurrency").value;


let source =
document.getElementById("moneySource").value;


let note =
document.getElementById("moneyNote").value;



if(!amount){

alert("Enter amount");

return;

}



let money={

id:Date.now(),

amount:Number(amount),

currency,

source,

note,

date:new Date().toISOString()

};



wallet.unshift(money);


saveData();


document.getElementById("moneyAmount").value="";

document.getElementById("moneyNote").value="";


render();


}





// Add Expense


function addExpense(){


let amount =
document.getElementById("amount").value;


let currency =
document.getElementById("currency").value;


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

category,

payment,

note,

date:new Date().toISOString()


};



expenses.unshift(expense);


saveData();


document.getElementById("amount").value="";

document.getElementById("note").value="";


render();


}





// Dashboard


function updateDashboard(){


let available=0;

let spent=0;



wallet.forEach(item=>{


if(item.currency==="QAR"){

available += item.amount;

}

});




expenses.forEach(item=>{


if(item.currency==="QAR"){

spent += item.amount;

}

});




document.getElementById(
"moneyAvailable"
).innerHTML =
"QAR "+available;



document.getElementById(
"totalSpent"
).innerHTML =
"QAR "+spent;



document.getElementById(
"remainingMoney"
).innerHTML =
"QAR "+(available-spent);



document.getElementById(
"transactionCount"
).innerHTML =
wallet.length + expenses.length;



}





// Trip Counter


function updateTripDay(){


let today=new Date();


let total=
Math.ceil(
(tripEnd-tripStart)
/86400000
)+1;



let current=
Math.floor(
(today-tripStart)
/86400000
)+1;



if(current<1){

current=1;

}


if(current>total){

current=total;

}



document.getElementById(
"tripDay"
).innerHTML=

"Day "+current+" / "+total;



}





// History


function showHistory(){


let history=
document.getElementById("history");


history.innerHTML="";



wallet.forEach(item=>{


history.innerHTML += `

<div class="item">

💰 ${item.source}

<br>

${item.currency} ${item.amount}

<br>

${item.note || ""}

</div>

`;

});




expenses.forEach(item=>{


history.innerHTML += `

<div class="item">

💸 ${item.category}

<br>

${item.currency} ${item.amount}

<br>

${item.note || ""}

</div>

`;

});



}




// Render


function render(){

updateDashboard();

updateTripDay();

showHistory();

}




// Backup


function exportData(){


let data={

wallet,

expenses

};



let blob =
new Blob(

[
JSON.stringify(data,null,2)

],

{
type:"application/json"
}

);



let link=document.createElement("a");


link.href=
URL.createObjectURL(blob);


link.download=
"Kerala_Vacation_Backup.json";


link.click();


}




// Restore


function importData(event){


let file =
event.target.files[0];


if(!file)
return;



let reader=new FileReader();


reader.onload=function(e){


let data=
JSON.parse(e.target.result);



wallet =
data.wallet || [];

expenses =
data.expenses || [];



saveData();

render();


alert("Backup restored");


};



reader.readAsText(file);


}




// Delete


function clearData(){


if(confirm("Delete all data?")){


localStorage.clear();


wallet=[];

expenses=[];


render();


}


}





render();