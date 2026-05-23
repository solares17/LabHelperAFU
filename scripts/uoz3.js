const data={
  task1:[
    {fc:2281,Usm:0.06},{fc:2493,Usm:1.1},{fc:2578,Usm:2.95},
    {fc:2601,Usm:4.03},{fc:2707,Usm:8.67},{fc:2748,Usm:10.28},
    {fc:2769,Usm:11.13},{fc:2789,Usm:11.92}
  ],
  task2:{
    none:[
      {fc:2280,v:1.45},{fc:2387,v:3.18},{fc:2444,v:5.03},
      {fc:2470,v:5.46},{fc:2495,v:5.13},{fc:2514,v:4.71},
      {fc:2534,v:3.91},{fc:2570,v:2.95},{fc:2626,v:2.01},
      {fc:2704,v:1.33},{fc:2786,v:0.96}
    ],
    q1:[
      {fc:2276,v:1.24},{fc:2387,v:2.53},{fc:2495,v:4.26},
      {fc:2504,v:4.17},{fc:2525,v:3.86},{fc:2550,v:3.39},
      {fc:2608,v:2.34},{fc:2700,v:1.42},{fc:2786,v:1.00}
    ],
    q2:[
      {fc:2280,v:1.10},{fc:2387,v:2.03},{fc:2470,v:2.78},
      {fc:2495,v:2.83},{fc:2534,v:2.74},{fc:2570,v:2.39},
      {fc:2626,v:1.87},{fc:2704,v:1.33},{fc:2786,v:1.00}
    ],
    q1q2:[
      {fc:2280,v:0.98},{fc:2354,v:1.45},{fc:2425,v:2.01},
      {fc:2464,v:2.24},{fc:2495,v:2.43},{fc:2539,v:2.45},
      {fc:2558,v:2.34},{fc:2585,v:2.17},{fc:2626,v:1.91},
      {fc:2704,v:1.38},{fc:2786,v:1.05}
    ]
  },
  task3:{
    none:[
      {fc:2280,v:4.94},{fc:2387,v:6.06},{fc:2495,v:6.11},
      {fc:2514,v:5.2},{fc:2534,v:4.07},{fc:2570,v:1.95},
      {fc:2626,v:-1.35},{fc:2704,v:-5.06},{fc:2786,v:-6.65}
    ],
    q1:[
      {fc:2276,v:4.33},{fc:2387,v:4.8},{fc:2495,v:4.10},
      {fc:2525,v:2.97},{fc:2550,v:1.94},{fc:2608,v:-0.46},
      {fc:2700,v:-3.71},{fc:2786,v:-4.99}
    ],
    q2:[
      {fc:2280,v:3.32},{fc:2387,v:3.30},{fc:2495,v:1.71},
      {fc:2534,v:1.00},{fc:2570,v:0.28},{fc:2626,v:-1.47},
      {fc:2704,v:-2.69},{fc:2786,v:-3.37}
    ],
    q1q2:[
      {fc:2280,v:2.69},{fc:2387,v:2.43},{fc:2465,v:1.33},
      {fc:2500,v:0.63},{fc:2540,v:0.18},{fc:2570,v:-0.35},
      {fc:2626,v:-1.35},{fc:2704,v:-2.34},{fc:2786,v:-2.78}
    ]
  },
  task4:[
    {fc:2280,v:-0.51},{fc:2387,v:-1.26},{fc:2465,v:-1.64},
    {fc:2514,v:-1.02},{fc:2540,v:-0.68},{fc:2570,v:0.72},
    {fc:2626,v:1.42},{fc:2704,v:1.52},{fc:2786,v:1.17}
  ],
  task5:{
    det1:[
      {fm:338,v:0.309},{fm:1446,v:0.327},{fm:4000,v:0.332},
      {fm:5000,v:0.337},{fm:7000,v:0.339},{fm:12000,v:0.340}
    ],
    det2:[
      {fm:500,v:0.561},{fm:1000,v:0.561},{fm:2000,v:0.560},
      {fm:4000,v:0.560},{fm:8000,v:0.539},{fm:11000,v:0.524},{fm:12000,v:0.515}
    ],
    det3:[
      {fm:500,v:0.247},{fm:1000,v:0.247},{fm:2000,v:0.247},
      {fm:4000,v:0.237},{fm:8000,v:0.209},{fm:11000,v:0.191},{fm:12000,v:0.186}
    ]
  },
  task6:{
    det1:[
      {uc:0.008,v:0.039},{uc:0.104,v:0.206},{uc:0.226,v:0.372},
      {uc:0.304,v:0.514},{uc:0.401,v:0.656},{uc:0.503,v:0.747},
      {uc:0.631,v:0.720},{uc:0.692,v:0.676}
    ],
    det2:[
      {uc:0.008,v:0.051},{uc:0.104,v:0.344},{uc:0.226,v:0.625},
      {uc:0.304,v:0.923},{uc:0.401,v:1.192},{uc:0.503,v:1.450},
      {uc:0.625,v:1.675},{uc:0.692,v:1.772}
    ],
    det3:[
      {uc:0.008,v:0.023},{uc:0.104,v:0.139},{uc:0.226,v:0.297},
      {uc:0.304,v:0.402},{uc:0.401,v:0.528},{uc:0.503,v:0.622},
      {uc:0.631,v:0.644},{uc:0.692,v:0.666}
    ]
  }
};

let detector=1;

function interp(arr,x,xk){
  if(!arr||!arr.length)return null;
  const s=[...arr].sort((a,b)=>a[xk]-b[xk]);
  if(x<=s[0][xk])return s[0].v;
  if(x>=s[s.length-1][xk])return s[s.length-1].v;
  for(let i=0;i<s.length-1;i++){
    if(x>=s[i][xk]&&x<=s[i+1][xk]){
      const t=(x-s[i][xk])/(s[i+1][xk]-s[i][xk]);
      return s[i].v+t*(s[i+1].v-s[i].v);
    }
  }
  return null;
}

function qState(){
  const q1=document.getElementById("q1").checked;
  const q2=document.getElementById("q2").checked;
  if(q1&&q2)return"q1q2";
  if(q1)return"q1";
  if(q2)return"q2";
  return"none";
}

function row(lbl,val){
  return`<div class="row"><span class="lbl">${lbl}</span><span class="val">${val}</span></div>`;
}

function update(){
  const mode=+document.getElementById("mode").value;
  const fc=+document.getElementById("fc").value||2495;
  const uc=+document.getElementById("uc").value||0;
  const fm=+document.getElementById("fm").value||1000;
  const q=qState();
  const scr=document.getElementById("screen");

  let html=row("Детектор",detector);
  let warn="";
  let result=null;

  if(mode===1){
    html+=row("fс, кГц",fc);
    html+=`<hr class="sep">`;
    result=interp(data.task1,fc,"fc");
    html+=row("Uсм, В",result!==null?result.toFixed(2):"—");
  }
  else if(mode===2){
    const qLabel=q==="none"?"без контуров":q.toUpperCase();
    html+=row("Q",qLabel);
    html+=row("fс, кГц",fc);
    html+=`<hr class="sep">`;
    result=interp(data.task2[q],fc,"fc");
    html+=row("U=, В",result!==null?result.toFixed(2):"—");
  }
  else if(mode===3){
    const qLabel=q==="none"?"без контуров":q.toUpperCase();
    html+=row("Q",qLabel);
    html+=row("fс, кГц",fc);
    html+=`<hr class="sep">`;
    result=interp(data.task3[q],fc,"fc");
    html+=row("U=, В",result!==null?result.toFixed(3):"—");
  }
  else if(mode===4){
    html+=row("fс, кГц",fc);
    html+=`<hr class="sep">`;
    result=interp(data.task4,fc,"fc");
    html+=row("U=, В",result!==null?result.toFixed(2):"—");
  }
  else if(mode===5){
    const key="det"+detector;
    if(!data.task5[key])warn="Нет данных для этого детектора";
    else result=interp(data.task5[key],fm,"fm");
    html+=row("Fмод, Гц",fm);
    html+=`<hr class="sep">`;
    html+=row("Uω, В",result!==null?result.toFixed(3):"—");
  }
  else if(mode===6){
    const key="det"+detector;
    if(!data.task6[key])warn="Нет данных для этого детектора";
    else result=interp(data.task6[key],uc,"uc");
    html+=row("Uc, В",uc.toFixed(3));
    html+=`<hr class="sep">`;
    html+=row("Uω, В",result!==null?result.toFixed(3):"—");
  }

  if(warn)html+=`<div class="warn">⚠ ${warn}</div>`;
  scr.innerHTML=html;
}

document.querySelectorAll(".det").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".det").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    detector=+btn.dataset.det;
    update();
  };
});

["fc","uc","fm","mode","q1","q2"].forEach(id=>{
  const el=document.getElementById(id);
  if(el){
    el.addEventListener("input",update);
    el.addEventListener("change",update);
  }
});

update();
