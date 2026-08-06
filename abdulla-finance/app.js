const defaultData={expenses:[],receivables:[],payables:[],cards:[],accounts:[],goals:[],investments:[]};
let financeData=JSON.parse(localStorage.getItem('abdullaFinance'))||defaultData;

function saveData(){localStorage.setItem('abdullaFinance',JSON.stringify(financeData));updateDashboard();}

function addTransaction(type,name,amount,note=''){
 financeData[type].push({id:Date.now(),name,amount:Number(amount),note,date:new Date().toISOString()});
 saveData();
}

function deleteTransaction(type,id){
 financeData[type]=financeData[type].filter(x=>x.id!==id);
 saveData();
}

function totals(){
 return {
  receive:financeData.receivables.reduce((a,b)=>a+Number(b.amount||0),0),
  pay:financeData.payables.reduce((a,b)=>a+Number(b.amount||0),0),
  cards:financeData.cards.reduce((a,b)=>a+Number(b.amount||0),0)
 };
}

function updateDashboard(){
 const t=totals();
 const cards=document.querySelectorAll('.dashboard div');
 if(cards.length>=4){
 cards[0].innerHTML=`💵 Cash Balance<br><b>${t.receive-t.pay} QAR</b>`;
 cards[1].innerHTML=`🟢 Receive<br><b>${t.receive} QAR</b>`;
 cards[2].innerHTML=`🔴 Pay<br><b>${t.pay} QAR</b>`;
 cards[3].innerHTML=`💳 Cards<br><b>${t.cards} QAR</b>`;
 }
}

function exportBackup(){
 const blob=new Blob([JSON.stringify(financeData,null,2)],{type:'application/json'});
 const a=document.createElement('a');
 a.href=URL.createObjectURL(blob);
 a.download='abdulla-finance-backup.json';
 a.click();
}

function importBackup(file){
 const reader=new FileReader();
 reader.onload=e=>{financeData=JSON.parse(e.target.result);saveData();};
 reader.readAsText(file);
}

updateDashboard();