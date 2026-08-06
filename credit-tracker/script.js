let data=JSON.parse(localStorage.getItem('creditData'))||[];
function save(){localStorage.setItem('creditData',JSON.stringify(data));render();}
function addReceive(){addItem('receive',receiveName.value,receiveAmount.value,receiveCurrency.value)}
function addPay(){addItem('pay',payName.value,payAmount.value,payCurrency.value)}
function addCard(){addItem('card',cardName.value,cardAmount.value,cardCurrency.value)}
function addItem(type,name,amount,currency){if(name&&amount)data.push({type,name,amount:Number(amount),paid:0,currency,date:new Date().toLocaleDateString(),history:[]});save();}
function addPayment(i){let p=prompt('Enter payment amount');if(p){p=Number(p);data[i].paid+=p;data[i].history.push({amount:p,date:new Date().toLocaleDateString()});save();}}
function removeItem(i){if(confirm('Delete this record?')){data.splice(i,1);save();}}
function render(){let list=document.getElementById('list');let qr=0,qi=0,qp=0,qpi=0,cc=0;list.innerHTML='';data.forEach((x,i)=>{let remain=x.amount-x.paid;if(x.type==='receive'){x.currency==='QAR'?qr+=remain:qi+=remain}else if(x.type==='pay'){x.currency==='QAR'?qp+=remain:qpi+=remain}else cc+=remain;list.innerHTML+=`<div class="card ${x.type}"><b>${x.name}</b><br>Total: ${x.amount} ${x.currency}<br>Paid: ${x.paid} ${x.currency}<br>Remaining: ${remain} ${x.currency}<br><button onclick="addPayment(${i})">Add Payment</button><button onclick="removeItem(${i})">Delete</button></div>`});dashboard.innerHTML=`🟢 Receive: ${qr} QAR | ${qi} INR<br>🔴 Pay: ${qp} QAR | ${qpi} INR<br>💳 Cards: ${cc}`}
render();