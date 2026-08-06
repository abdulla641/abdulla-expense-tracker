const defaultData={expenses:[],receivables:[],payables:[],cards:[],accounts:[],goals:[],investments:[]};
let financeData=JSON.parse(localStorage.getItem('abdullaFinance'))||defaultData;
function saveData(){localStorage.setItem('abdullaFinance',JSON.stringify(financeData));updateDashboard();}
function addTransaction(type,item){financeData[type].push(item);saveData();}
function totals(){return {receive:financeData.receivables.reduce((a,b)=>a+Number(b.amount||0),0),pay:financeData.payables.reduce((a,b)=>a+Number(b.amount||0),0),cards:financeData.cards.reduce((a,b)=>a+Number(b.amount||0),0)}}
function updateDashboard(){const t=totals();document.querySelectorAll('.dashboard div')[0].innerHTML=`💵 Cash Balance<br><b>${t.receive-t.pay} QAR</b>`;document.querySelectorAll('.dashboard div')[1].innerHTML=`🟢 Receive<br><b>${t.receive} QAR</b>`;document.querySelectorAll('.dashboard div')[2].innerHTML=`🔴 Pay<br><b>${t.pay} QAR</b>`;document.querySelectorAll('.dashboard div')[3].innerHTML=`💳 Cards<br><b>${t.cards} QAR</b>`}
function exportBackup(){const blob=new Blob([JSON.stringify(financeData,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='abdulla-finance-backup.json';a.click()}
updateDashboard();