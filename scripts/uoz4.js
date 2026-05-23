let activeLinks=new Set(["M"]);

const linkBtns=document.querySelectorAll(".link-btn");
const fcInput=document.getElementById("fc_04");
const tuningInput=document.getElementById("tuning_04");
const tuningLabel=document.getElementById("tuning_label");

linkBtns.forEach(btn=>{
  btn.onclick=()=>{
    const link=btn.getAttribute("data-link");
    if(link==="M"||link==="C1"){
      if(activeLinks.has("C2")||activeLinks.has("C3"))activeLinks.clear();
      if(activeLinks.has(link)){
        if(activeLinks.size>1)activeLinks.delete(link);
      } else {
        activeLinks.add(link);
      }
    } else {
      activeLinks.clear();
      activeLinks.add(link);
    }
    linkBtns.forEach(b=>b.classList.toggle("active",activeLinks.has(b.getAttribute("data-link"))));
    update();
  };
});

function row(lbl,val){
  return`<div class="row"><span class="lbl">${lbl}</span><span class="val">${val}</span></div>`;
}

function update(){
  const fc=parseFloat(fcInput.value)||1021;
  const tuning=parseFloat(tuningInput.value)||50;
  tuningLabel.textContent=tuning;

  const currentLink=[...activeLinks].sort().join("+");

  const fc0=390, fc1_M=1021, fc1=1320;
  let u_max=0;
  if(currentLink==="C1")   u_max=0.069+(fc-fc0)*(0.251-0.069)/(1350-fc0);
  if(currentLink==="C2")   u_max=0.215+(fc-fc0)*(0.505-0.215)/(fc1_M-fc0);
  if(currentLink==="C3")   u_max=0.425+(fc-fc0)*(1.428-0.425)/(fc1-fc0);
  if(currentLink==="M")    u_max=0.026+(fc-fc0)*(0.083-0.026)/(fc1_M-fc0);
  if(currentLink==="C1+M") u_max=0.095+(fc-fc0)*(0.325-0.095)/(fc1-fc0);

  const peakPos=(fc-fc0)*(85-65)/(fc1-fc0)+65;
  const width=15;
  let u_out=u_max*Math.exp(-Math.pow(tuning-peakPos,2)/(2*Math.pow(width,2)));
  if(u_out<0.001)u_out=0;

  const linkLabel={
    "C1":"ёмкостная (C1)",
    "C2":"ёмкостная (C2)",
    "C3":"ёмкостная (C3)",
    "M":"индуктивная (M)",
    "C1+M":"C1 + M"
  }[currentLink]||currentLink;

  let html=row("Связь",linkLabel);
  html+=`<hr class="sep">`;
  html+=row("fс, кГц",fc.toFixed(1));
  html+=row("Расстройка",tuning);
  html+=row("Uвых.макс, В",u_max.toFixed(3));
  html+=`<hr class="sep">`;
  html+=row("Uвых, В",u_out.toFixed(3));

  document.getElementById("screen_04").innerHTML=html;
}

fcInput.addEventListener("input",update);
tuningInput.addEventListener("input",update);
update();
