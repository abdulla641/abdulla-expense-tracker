const defaultData={expenses:[],receivables:[],payables:[],cards:[],accounts:[],goals:[],investments:[]};
let financeData=JSON.parse(localStorage.getItem('abdullaFinance'))||defaultData;

function saveData(){localStorage.setItem('abdullaFinance',JSON.stringify(financeData));updateDashboard();renderLists();}

function addTransaction(type,name,amount,note=''){
 financeData[type].push({id:Date.now(),name,amount:Number(amount),note,date:new Date().toISOString(),settled:0});
 saveData();
}

function addReceive(){
 const n=document.getElementById('receiveName').value;
 const a=document.getElementById('receiveAmount').value;
 if(n&&a)addTransaction('receivables',n,a);
}

function addPay(){
 const n=document.getElementById('payName').value;
 const a=document.getElementById('payAmount').value;
 if(n&&a)addTransaction('payables',n,a);
}

function deleteTransaction(type,id){financeData[type]=financeData[type].filter(x=>x.id!==id);saveData();}

function totals(){return {receive:financeData.receivables.reduce((a,b)=>a+Number(b.amount||0),0),pay:financeData.payables.reduce((a,b)=>a+Number(b.amount||0),0),cards:financeData.cards.reduce((a,b)=>a+Number(b.amount||0),0)}}

function updateDashboard(){const t=totals();document.getElementById('cash').innerHTML=`${t.receive-t.pay} QAR`;document.getElementById('receive').innerHTML=`${t.receive} QAR`;document.getElementById('pay').innerHTML=`${t.pay} QAR`;document.getElementById('cards').innerHTML=`${t.cards} QAR`;}

function renderLists(){
 const r=document.getElementById('receiveList');
 const p=document.getElementById('payList');
 if(r)r.innerHTML=financeData.receivables.map(x=>`<p>🟢 ${x.name}: ${x.amount} QAR</p>`).join('');
 if(p)p.innerHTML=financeData.payables.map(x=>`<p>🔴 ${x.name}: ${x.amount} QAR</p>`).join('');
}

function exportBackup(){const blob=new Blob([JSON.stringify(financeData,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='abdulla-finance-backup.json';a.click();}

updateDashboard();
renderLists();