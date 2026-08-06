let data=JSON.parse(localStorage.getItem('creditData'))||[];
function save(){localStorage.setItem('creditData',JSON.stringify(data));render();}
function addReceive(){addItem('receive',receiveName.value,receiveAmount.value,receiveCurrency.value)}
function addPay(){addItem('pay',payName.value,payAmount.value,payCurrency.value)}
function addCard(){addItem('card',cardName.value,cardAmount.value,cardCurrency.value)}
function addItem(type,name,amount,currency){if(name&&amount){data.push({type,name,amount:Number(amount),currency,date:new Date().toLocaleDateString()});save();}}
function render(){let list=document.getElementById('list');let qr=0,qi=0,qp=0,qpi=0,cc=0;list.innerHTML='';data.forEach(x=>{if(x.type==='receive'){x.currency==='QAR'?qr+=x.amount:qi+=x.amount}else if(x.type==='pay'){x.currency==='QAR'?qp+=x.amount:qpi+=x.amount}else{cc+=x.amount}list.innerHTML+=`<div class="card ${x.type}"><b>${x.name}</b><br>${x.amount} ${x.currency}<br>${x.date}</div>`});dashboard.innerHTML=`<div class="dash">🟢 Receive: ${qr} QAR | ${qi} INR</div><div class="dash">🔴 Pay: ${qp} QAR | ${qpi} INR</div><div class="dash">💳 Cards: ${cc}</div>`}
render();