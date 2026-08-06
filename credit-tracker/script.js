let data=JSON.parse(localStorage.getItem('creditData'))||[];
function save(){localStorage.setItem('creditData',JSON.stringify(data));render();}
function addReceive(){let n=receiveName.value,a=Number(receiveAmount.value),c=receiveCurrency.value;if(n&&a)data.push({type:'receive',name:n,amount:a,currency:c});save();}
function addPay(){let n=payName.value,a=Number(payAmount.value),c=payCurrency.value;if(n&&a)data.push({type:'pay',name:n,amount:a,currency:c});save();}
function render(){let list=document.getElementById('list'),qRec=0,qPay=0,iRec=0,iPay=0;list.innerHTML='';data.forEach(x=>{if(x.type==='receive'){x.currency==='QAR'?qRec+=x.amount:iRec+=x.amount}else{x.currency==='QAR'?qPay+=x.amount:iPay+=x.amount}list.innerHTML+=`<div class='card ${x.type}'><b>${x.name}</b><br>${x.amount} ${x.currency}</div>`});dashboard.innerHTML=`🟢 Receive: ${qRec} QAR | ${iRec} INR<br>🔴 Pay: ${qPay} QAR | ${iPay} INR`;}
render();