const defaultData={expenses:[],receivables:[],payables:[],cards:[],accounts:[],goals:[],investments:[]};
let financeData=JSON.parse(localStorage.getItem('abdullaFinance'))||defaultData;
function saveData(){localStorage.setItem('abdullaFinance',JSON.stringify(financeData));updateDashboard();renderLists();}
function addTransaction(type,name,amount,note=''){financeData[type].push({id:Date.now(),name,amount:Number(amount),note,date:new Date().toISOString()});saveData();}
function addReceive(){let n=receiveName.value,a=receiveAmount.value;if(n&&a)addTransaction('receivables',n,a);}
function addPay(){let n=payName.value,a=payAmount.value;if(n&&a)addTransaction('payables',n,a);}
function addCard(){let n=cardName.value,l=cardLimit.value,o=cardOutstanding.value;if(n&&o){financeData.cards.push({id:Date.now(),name:n,limit:Number(l),amount:Number(o)});saveData();}}
function deleteTransaction(type,id){financeData[type]=financeData[type].filter(x=>x.id!==id);saveData();}
function totals(){return {receive:financeData.receivables.reduce((a,b)=>a+b.amount,0),pay:financeData.payables.reduce((a,b)=>a+b.amount,0),cards:financeData.cards.reduce((a,b)=>a+b.amount,0)}}
function updateDashboard(){let t=totals();cash.innerHTML=`${t.receive-t.pay} QAR`;receive.innerHTML=`${t.receive} QAR`;pay.innerHTML=`${t.pay} QAR`;cards.innerHTML=`${t.cards} QAR`;}
function renderLists(){if(receiveList)receiveList.innerHTML=financeData.receivables.map(x=>`<p>🟢 ${x.name}: ${x.amount} QAR</p>`).join('');if(payList)payList.innerHTML=financeData.payables.map(x=>`<p>🔴 ${x.name}: ${x.amount} QAR</p>`).join('');if(cardList)cardList.innerHTML=financeData.cards.map(x=>`<p>💳 ${x.name}: ${x.amount} QAR / Limit ${x.limit}</p>`).join('');}
function exportBackup(){let blob=new Blob([JSON.stringify(financeData,null,2)],{type:'application/json'});let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='abdulla-finance-backup.json';a.click();}
updateDashboard();renderLists();