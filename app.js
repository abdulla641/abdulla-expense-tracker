// 🌴 Kerala Vacation Tracker 2026


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







// ADD MONEY


function addMoney(){


let amount =
document.getElementById("moneyAmount").value;



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








// ADD EXPENSE



function addExpense(){



let amount =
document.getElementById("amount").value;



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









// DASHBOARD



function updateDashboard(){



let available = 0;


let spent = 0;





wallet.forEach(item=>{


available += item.amount;


});






expenses.forEach(item=>{


spent += item.amount;


});






document.getElementById(
"moneyAvailable"
)
.innerHTML =

"₹"+available;





document.getElementById(
"totalSpent"
)
.innerHTML =

"₹"+spent;






document.getElementById(
"remainingMoney"
)
.innerHTML =

"₹"+(available-spent);






document.getElementById(
"transactionCount"
)
.innerHTML =

wallet.length + expenses.length;



}









// TRIP DAY



function updateTripDay(){



let today =
new Date();



let totalDays =
Math.ceil(
(tripEnd-tripStart)
/86400000
)+1;





let day =
Math.floor(
(today-tripStart)
/86400000
)+1;





if(day<1){

day=1;

}




if(day>totalDays){

day=totalDays;

}





document.getElementById(
"tripDay"
)
.innerHTML =

"Day "+day+" / "+totalDays;



}









// HISTORY



function showHistory(){



let box =
document.getElementById("history");



box.innerHTML="";





wallet.forEach(item=>{


box.innerHTML +=


`

<div class="item">


💰 ${item.source}

<br>

₹${item.amount}


<br>


${item.note || ""}


</div>


`;



});






expenses.forEach(item=>{


box.innerHTML +=


`

<div class="item">


💸 ${item.category}


<br>


₹${item.amount}


<br>


${item.note || ""}


</div>


`;



});





}









// BACKUP



function exportData(){



let data={


wallet,


expenses


};





let blob =

new Blob(

[

JSON.stringify(
data,
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
"Kerala_Vacation_Backup.json";



link.click();



}









// RESTORE



function importData(event){



let file =
event.target.files[0];



if(!file)
return;





let reader =
new FileReader();





reader.onload=function(e){



let data =
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









// DELETE



function clearData(){



if(confirm("Delete all vacation data?")){



localStorage.clear();



wallet=[];


expenses=[];



render();



}



}









// START



function render(){


updateDashboard();


updateTripDay();


showHistory();


}



render();