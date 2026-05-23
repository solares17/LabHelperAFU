const data = {
1:{
  det1:[
    {uc:0.03,U_if:1.009},{uc:0.04,U_if:1.224},{uc:0.05,U_if:1.439},
    {uc:0.06,U_if:1.600},{uc:0.07,U_if:1.708},{uc:0.08,U_if:1.826},
    {uc:0.09,U_if:1.955},{uc:0.10,U_if:2.019},{uc:0.11,U_if:2.030},
    {uc:0.12,U_if:2.019},{uc:0.13,U_if:2.012},{uc:0.14,U_if:1.999},{uc:0.15,U_if:1.965}
  ],
  det2:[
    {uc:0.03,U_if:1.246},{uc:0.04,U_if:1.353},{uc:0.05,U_if:1.568},
    {uc:0.06,U_if:1.611},{uc:0.07,U_if:1.643},{uc:0.08,U_if:1.654},
    {uc:0.09,U_if:1.654},{uc:0.10,U_if:1.665},{uc:0.11,U_if:1.675},
    {uc:0.12,U_if:1.686},{uc:0.13,U_if:1.697},{uc:0.14,U_if:1.708},{uc:0.15,U_if:1.729}
  ],
  det3:[
    {uc:0.03,U_if:0.851},{uc:0.04,U_if:1.095},{uc:0.05,U_if:1.523},
    {uc:0.06,U_if:1.804},{uc:0.07,U_if:2.030},{uc:0.08,U_if:2.288},
    {uc:0.09,U_if:2.535},{uc:0.10,U_if:2.696},{uc:0.11,U_if:2.868},
    {uc:0.12,U_if:3.104},{uc:0.13,U_if:3.211},{uc:0.14,U_if:3.405},{uc:0.15,U_if:3.480}
  ]
},
2:{
  det1:[
    {fc:500,U_if:0.839},{fc:1000,U_if:0.005},{fc:1500,U_if:0.575},
    {fc:2000,U_if:0.039},{fc:2500,U_if:1.224}
  ],
  det2:[
    {fc:500,U_if:1.020},{fc:1000,U_if:0.005},{fc:1500,U_if:1.224},
    {fc:2000,U_if:0.966},{fc:2500,U_if:1.084}
  ],
  det3:[
    {fc:500,U_if:0.884},{fc:1000,U_if:1.002},{fc:1500,U_if:0.006},
    {fc:2000,U_if:0.003},{fc:2500,U_if:0.183}
  ]
},
3:{
  det1:[{fc:535,channel:"main",U_if:1.127},{fc:1465,channel:"mirror",U_if:0.406}],
  det2:[{fc:535,channel:"main",U_if:0.934},{fc:1465,channel:"mirror",U_if:0.602}],
  det3:[{fc:535,channel:"main",U_if:0.730},{fc:1465,channel:"mirror",U_if:0.290}]
},
4:{
  det1:[
    {fc:500,channel:"main",U_if:0.002},{fc:1500,channel:"p1",U_if:0.001},
    {fc:2000,channel:"p2",U_if:0.002},{fc:2500,channel:"p3",U_if:0.003},{fc:3000,channel:"p4",U_if:0.004}
  ],
  det2:[
    {fc:500,channel:"main",U_if:0.002},{fc:1500,channel:"p1",U_if:0.001},
    {fc:2000,channel:"p2",U_if:0.002},{fc:2500,channel:"p3",U_if:0.003},{fc:3000,channel:"p4",U_if:0.004}
  ],
  det3:[
    {fc:500,channel:"main",U_if:0.002},{fc:1500,channel:"p1",U_if:0.001},
    {fc:2000,channel:"p2",U_if:0.002},{fc:2500,channel:"p3",U_if:0.003},{fc:3000,channel:"p4",U_if:0.004}
  ]
},
5:{
  det1:[{fc:1035,channel:"main",U_if:0.002},{fc:465,channel:"straight",U_if:0.017}],
  det2:[{fc:1035,channel:"main",U_if:0.002},{fc:465,channel:"straight",U_if:0.003}],
  det3:[{fc:1035,channel:"main",U_if:0.002},{fc:465,channel:"straight",U_if:0.002}]
}
};

let detector=1;

function lerp(x1,y1,x2,y2,x){
  if(x2===x1)return y1;
  return y1+(x-x1)*(y2-y1)/(x2-x1);
}

function interpolate(table,key,val){
  const sorted=[...table].sort((a,b)=>a[key]-b[key]);
  if(val<=sorted[0][key])return sorted[0].U_if;
  if(val>=sorted[sorted.length-1][key])return sorted[sorted.length-1].U_if;
  for(let i=0;i<sorted.length-1;i++){
    if(val>=sorted[i][key]&&val<=sorted[i+1][key]){
      return lerp(sorted[i][key],sorted[i].U_if,sorted[i+1][key],sorted[i+1].U_if,val);
    }
  }
  return sorted[0].U_if;
}

function getClosestByFc(table,fc){
  let best=table[0],min=Infinity;
  table.forEach(r=>{const d=Math.abs(r.fc-fc);if(d<min){min=d;best=r;}});
  return best;
}

function getUif(mode,det,fc,fg,uc){
  const table=data[mode]?.["det"+det];
  if(!table)return 0;
  if(mode===1)return interpolate(table,"uc",uc);
  if(mode===2)return interpolate(table,"fc",fc);
  return getClosestByFc(table,fc).U_if;
}

function row(lbl,val){
  return`<div class="row"><span class="lbl">${lbl}</span><span class="val">${val}</span></div>`;
}

function update(){
  const fc_v=+document.getElementById("fc").value||1000;
  const fg_v=+document.getElementById("fg").value||1468;
  const uc_v=+document.getElementById("uc").value||0;
  const mode=+document.getElementById("mode").value;

  const f_if=Math.abs(fg_v-fc_v);
  const U_if=getUif(mode,detector,fc_v,fg_v,uc_v);

  let html=row("Детектор",detector);
  html+=`<hr class="sep">`;

  if(mode===1){
    html+=row("fс, кГц",fc_v);
    html+=row("fг, кГц",fg_v);
    html+=row("fпч, кГц",f_if.toFixed(1));
    html+=`<hr class="sep">`;
    html+=row("Uс, В",uc_v.toFixed(3));
    html+=row("Uпч, В",U_if.toFixed(3));
  } else if(mode===2){
    html+=row("fс, кГц",fc_v);
    html+=row("fпч, кГц","468");
    html+=`<hr class="sep">`;
    html+=row("Uс, В",uc_v.toFixed(3));
    html+=row("Uпч, В",U_if.toFixed(3));
    if(uc_v>0){
      html+=row("Kпр",( U_if/uc_v).toFixed(2));
    }
  } else if(mode===3){
    const best=getClosestByFc(data[3]["det"+detector],fc_v);
    const chanNames={main:"основной",mirror:"зеркальный"};
    html+=row("fг, кГц",fg_v);
    html+=row("fс, кГц",fc_v);
    html+=row("Канал",chanNames[best.channel]||best.channel);
    html+=`<hr class="sep">`;
    html+=row("Uс, В",uc_v.toFixed(3));
    html+=row("Uпч, В",U_if.toFixed(3));
  } else if(mode===4){
    const best=getClosestByFc(data[4]["det"+detector],fc_v);
    const chanLabel={main:"осн.",p1:"побоч.1",p2:"побоч.2",p3:"побоч.3",p4:"побоч.4"};
    html+=row("fг, кГц",fg_v);
    html+=row("fс, кГц",fc_v);
    html+=row("Канал",chanLabel[best.channel]||best.channel);
    html+=`<hr class="sep">`;
    html+=row("Uс, В",uc_v.toFixed(3));
    html+=row("Uпч, В",U_if.toFixed(3));
  } else if(mode===5){
    const best=getClosestByFc(data[5]["det"+detector],fc_v);
    const chanLabel={main:"осн.",straight:"прямой"};
    html+=row("fг, кГц",fg_v);
    html+=row("fс, кГц",fc_v);
    html+=row("Канал",chanLabel[best.channel]||best.channel);
    html+=`<hr class="sep">`;
    html+=row("Uс, В",uc_v.toFixed(3));
    html+=row("Uпч, В",U_if.toFixed(3));
  }

  document.getElementById("screen").innerHTML=html;
}

document.querySelectorAll(".det").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".det").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    detector=+btn.dataset.det;
    update();
  };
});

["fc","fg","uc","mode"].forEach(id=>{
  document.getElementById(id).addEventListener("input",update);
  document.getElementById(id).addEventListener("change",update);
});

update();
