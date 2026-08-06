const defaultData={expenses:[],receivables:[],payables:[],cards:[],accounts:[],goals:[],investments:[],history:[],pin:null};
let financeData=JSON.parse(localStorage.getItem('abdullaFinance'))||defaultData;
function saveData(){localStorage.setItem('abdullaFinance',JSON.stringify(financeData));updateDashboard();renderLists();drawChart();}
function addHistory(type,data){financeData.history.unshift({type,...data,date:new Date().toISOString()});}
function addTransaction(type,name,amount){financeData[type].push({id:Date.now(),name,amount:Number(amount)});addHistory(type,{name,amount:Number(amount)});saveData();}
function addReceive(){if(receiveName.value&&receiveAmount.value)addTransaction('receivables',receiveName.value,receiveAmount.value);}
function addPay(){if(payName.value&&payAmount.value)addTransaction('payables',payName.value,payAmount.value);}
function addCard(){if(cardName.value&&cardOutstanding.value){financeData.cards.push({id:Date.now(),name:cardName.value,amount:Number(cardOutstanding.value)});saveData();}}
function addSaving(){let n=savingName.value,a=savingAmount.value,t=savingTarget.value;if(n&&a){financeData.goals.push({name:n,saved:Number(a),target:Number(t||a)});saveData();}}
function addInvestment(){let n=investmentName.value,a=investmentAmount.value,v=investmentValue.value;if(n&&a){financeData.investments.push({name:n,type:investmentType.value||'Other',amount:Number(a),value:Number(v||a)});saveData();}}
function totals(){return {receive:financeData.receivables.reduce((a,b)=>a+b.amount,0),pay:financeData.payables.reduce((a,b)=>a+b.amount,0),cards:financeData.cards.reduce((a,b)=>a+b.amount,0),savings:financeData.goals.reduce((a,b)=>a+b.saved,0),investments:financeData.investments.reduce((a,b)=>a+b.value,0)}}
function updateDashboard(){let t=totals();if(cash)cash.innerHTML=(t.receive-t.pay)+' QAR';if(receive)receive.innerHTML=t.receive+' QAR';if(pay)pay.innerHTML=t.pay+' QAR';if(cards)cards.innerHTML=t.cards+' QAR';if(summary)summary.innerHTML=`Savings: ${t.savings} QAR<br>Investments: ${t.investments} QAR`;}
function renderLists(){if(receiveList)receiveList.innerHTML=financeData.receivables.map(x=>`<p>🟢 ${x.name}: ${x.amount}</p>`).join('');if(payList)payList.innerHTML=financeData.payables.map(x=>`<p>🔴 ${x.name}: ${x.amount}</p>`).join('');if(cardList)cardList.innerHTML=financeData.cards.map(x=>`<p>💳 ${x.name}: ${x.amount}</p>`).join('');}
function drawChart(){}
function exportBackup(){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(financeData)]));a.download='backup.json';a.click();}
window.onload=()=>{updateDashboard();renderLists();};