let expenses=JSON.parse(localStorage.getItem('expenses'))||[];
let wallet=JSON.parse(localStorage.getItem('wallet'))||[];
const tripStart=new Date('2026-09-17'),tripEnd=new Date('2026-10-20');
function saveData(){localStorage.setItem('expenses',JSON.stringify(expenses));localStorage.setItem('wallet',JSON.stringify(wallet));}
function addMoney(){let amount=moneyAmount.value;if(!amount)return alert('Enter amount');wallet.unshift({id:Date.now(),amount:Number(amount),source:moneySource.value,note:moneyNote.value,date:new Date().toISOString()});saveData();moneyAmount.value='';moneyNote.value='';render();}
function addExpense(){let amount=document.getElementById('amount').value;if(!amount)return alert('Enter amount');expenses.unshift({id:Date.now(),amount:Number(amount),category:category.value,payment:payment.value,note:note.value,date:new Date().toISOString()});saveData();document.getElementById('amount').value='';note.value='';render();}
function updateDashboard(){let available=wallet.reduce((a,b)=>a+b.amount,0),spent=expenses.reduce((a,b)=>a+b.amount,0);moneyAvailable.innerHTML='₹'+available;totalSpent.innerHTML='₹'+spent;remainingMoney.innerHTML='₹'+(available-spent);transactionCount.innerHTML=wallet.length+expenses.length;}
function updateTripDay(){let days=Math.ceil((tripEnd-tripStart)/86400000)+1;let d=Math.min(days,Math.max(1,Math.floor((new Date()-tripStart)/86400000)+1));tripDay.innerHTML='Day '+d+' / '+days;}
function showHistory(){let box=document.getElementById('history');box.innerHTML='';[...wallet.map(x=>({...x,type:'💰 '+x.source})),...expenses.map(x=>({...x,type:'💸 '+x.category}))].sort((a,b)=>b.id-a.id).forEach(x=>{box.innerHTML+=`<div class="item"><b>${x.type}</b><br>₹${x.amount}<br>${x.note||''}<br>📅 ${new Date(x.date).toLocaleString()}</div>`});}
function updateReports(){let spent=expenses.reduce((a,b)=>a+b.amount,0);let days=Math.max(1,Math.ceil((new Date()-tripStart)/86400000));let r=document.querySelector('#reports .card');if(r)r.innerHTML='<h2>📊 Vacation Report</h2><p>Total spent: ₹'+spent+'</p><p>Daily average: ₹'+Math.round(spent/days)+'</p><p>Transactions: '+expenses.length+'</p>';}
function exportData(){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({wallet,expenses},null,2)],{type:'application/json'}));a.download='Kerala_Vacation_Backup.json';a.click();}
function importData(e){let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=x=>{let d=JSON.parse(x.target.result);wallet=d.wallet||[];expenses=d.expenses||[];saveData();render()};r.readAsText(f)}
function clearData(){if(confirm('Delete all vacation data?')){wallet=[];expenses=[];saveData();render();}}
function render(){updateDashboard();updateTripDay();showHistory();updateReports();}
render();