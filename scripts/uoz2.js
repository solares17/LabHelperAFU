const data={
  1:{
    det1:{
      R1C1:{
        weak:[
          {uc:0.1,Udc:0.000},{uc:0.2,Udc:0.009},
          {uc:0.25,Udc:0.034},{uc:0.3,Udc:0.058},{uc:0.4,Udc:0.117}
        ],
        strong:[
          {uc:0.5,Udc:0.170},{uc:0.75,Udc:0.395},
          {uc:1.0,Udc:0.747},{uc:1.25,Udc:0.966},
          {uc:1.5,Udc:1.215},{uc:2.0,Udc:1.682}
        ]
      },
      R2C1:{
        weak:[
          {uc:0.1,Udc:0.000},{uc:0.2,Udc:0.009},
          {uc:0.25,Udc:0.024},{uc:0.3,Udc:0.048},{uc:0.4,Udc:0.102}
        ],
        strong:[
          {uc:0.5,Udc:0.156},{uc:0.75,Udc:0.366},
          {uc:1.0,Udc:0.615},{uc:1.25,Udc:0.844},
          {uc:1.5,Udc:1.056},{uc:2.0,Udc:1.552}
        ]
      }
    }
  },
  2:{
    det2:{
      R1C1:[
        {uc:0.02,Udc:1.977},{uc:0.05,Udc:2.439},
        {uc:0.1,Udc:2.441},{uc:0.15,Udc:2.421},
        {uc:0.2,Udc:2.426},{uc:0.3,Udc:2.412}
      ],
      R2C1:[
        {uc:0.02,Udc:1.768},{uc:0.05,Udc:1.909},
        {uc:0.1,Udc:1.923},{uc:0.15,Udc:1.914},
        {uc:0.2,Udc:1.914},{uc:0.3,Udc:1.928}
      ]
    }
  },
  3:{
    det3:[
      {uc:0.012,Udc:0.004},{uc:0.03,Udc:0.019},
      {uc:0.073,Udc:0.039},{uc:0.114,Udc:0.053},
      {uc:0.137,Udc:0.063},{uc:0.18,Udc:0.078}
    ]
  },
  4:{
    det1:{
      C1:[
        {fm:1000,Uac:0.165},{fm:5000,Uac:0.161},
        {fm:10000,Uac:0.150},{fm:15000,Uac:0.128}
      ]
    },
    det3:[
      {fm:1000,Uac:0.047},{fm:5000,Uac:0.049},
      {fm:10000,Uac:0.050},{fm:15000,Uac:0.043}
    ]
  },
  5:{
    det1:[
      {uc:0.25,Uac:0.000},{uc:0.5,Uac:0.023},
      {uc:0.75,Uac:0.056},{uc:1.0,Uac:0.129},
      {uc:1.5,Uac:0.219},{uc:2.0,Uac:0.302}
    ]
  }
};

let detector=1;
let loads=new Set(["R1","C1"]);

function interp(table,x,xkey){
  if(!table||!table.length)return null;
  const arr=[...table].sort((a,b)=>a[xkey]-b[xkey]);
  const ykey=arr[0].Udc!==undefined?"Udc":"Uac";
  if(x<=arr[0][xkey])return arr[0][ykey];
  if(x>=arr[arr.length-1][xkey])return arr[arr.length-1][ykey];
  for(let i=0;i<arr.length-1;i++){
    if(x>=arr[i][xkey]&&x<=arr[i+1][xkey]){
      const t=(x-arr[i][xkey])/(arr[i+1][xkey]-arr[i][xkey]);
      return arr[i][ykey]+t*(arr[i+1][ykey]-arr[i][ykey]);
    }
  }
  return null;
}

function getLoadKey(){
  const hasR=loads.has("R1")?"R1":loads.has("R2")?"R2":null;
  const hasC=loads.has("C1")?"C1":loads.has("C2")?"C2":null;
  if(hasR&&hasC)return hasR+hasC;
  if(hasR)return hasR;
  if(hasC)return hasC;
  return null;
}

function row(lbl,val){
  return`<div class="row"><span class="lbl">${lbl}</span><span class="val">${val}</span></div>`;
}

function update(){
  const mode=+document.getElementById("mode").value;
  const Uc=+document.getElementById("uc").value;
  const Fm=+document.getElementById("fm").value;
  const loadKey=getLoadKey();
  const scr=document.getElementById("screen");

  let loadLabel=loads.size>0?[...loads].join("+"):"нет";
  let html=row("Детектор",detector);
  html+=row("Нагрузка",loadLabel);
  html+=`<hr class="sep">`;

  let result=null;
  let warn="";

  if(mode===1){
    if(detector!==1){warn="Задание 1 — только Детектор 1";}
    else{
      const detData=data[1].det1;
      const lk=detData[loadKey]?loadKey:"R1C1";
      if(!detData[lk])warn="Нагрузка не соответствует данным";
      else{
        const type=Uc<=0.4?"weak":"strong";
        result=interp(detData[lk][type],Uc,"uc");
        html+=row("Режим",Uc<=0.4?"слабый сигнал":"сильный сигнал");
      }
    }
    html+=row("Uc, В",Uc.toFixed(3));
    html+=row("Udc, В",result!==null?result.toFixed(3):"—");
  }
  else if(mode===2){
    if(detector!==2)warn="Задание 2 — только Детектор 2";
    else{
      const detData=data[2].det2;
      const lk=detData[loadKey]?loadKey:"R1C1";
      result=interp(detData[lk],Uc,"uc");
    }
    html+=row("Uc, В",Uc.toFixed(3));
    html+=row("Udc, В",result!==null?result.toFixed(3):"—");
  }
  else if(mode===3){
    if(detector!==3)warn="Задание 3 — только Детектор 3";
    else result=interp(data[3].det3,Uc,"uc");
    html+=row("Uc, В",Uc.toFixed(3));
    html+=row("Udc, В",result!==null?result.toFixed(3):"—");
  }
  else if(mode===4){
    if(detector===3){
      result=interp(data[4].det3,Fm,"fm");
    } else if(detector===1){
      result=interp(data[4].det1.C1,Fm,"fm");
    } else {
      warn="Задание 4 — Детектор 1 или 3";
    }
    html+=row("Fмод, Гц",Fm);
    html+=row("Uac, В",result!==null?result.toFixed(3):"—");
  }
  else if(mode===5){
    if(detector!==1)warn="Задание 5 — только Детектор 1";
    else result=interp(data[5].det1,Uc,"uc");
    html+=row("Uc, В",Uc.toFixed(3));
    html+=row("Uac, В",result!==null?result.toFixed(3):"—");
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

document.querySelectorAll(".load").forEach(btn=>{
  btn.onclick=()=>{
    const v=btn.dataset.load;
    if(loads.has(v)){loads.delete(v);btn.classList.remove("active");}
    else{loads.add(v);btn.classList.add("active");}
    update();
  };
});

["fm","uc","mode"].forEach(id=>{
  document.getElementById(id).addEventListener("input",update);
  document.getElementById(id).addEventListener("change",update);
});

update();
