document.addEventListener("DOMContentLoaded", () => {
 
  const data = {
    task1: [
      { fc: 2281, Usm: 0.06 }, { fc: 2493, Usm: 1.1 }, { fc: 2578, Usm: 2.95 },
      { fc: 2601, Usm: 4.03 }, { fc: 2707, Usm: 8.67 }, { fc: 2748, Usm: 10.28 },
      { fc: 2769, Usm: 11.13 }, { fc: 2789, Usm: 11.92 }




    ],
    task2: {
      none: [
        { fc: 2280, Uconst: 1.45 }, { fc: 2387, Uconst: 3.18 }, { fc: 2444, Uconst: 5.03 },
        { fc: 2470, Uconst: 5.46 }, { fc: 2495, Uconst: 5.13 }, { fc: 2514, Uconst: 4.71 },
        { fc: 2534, Uconst: 3.91 }, { fc: 2570, Uconst: 2.95 }, { fc: 2626, Uconst: 2.01 },
        { fc: 2704, Uconst: 1.33 }, { fc: 2786, Uconst: 0.96 }
      ],
      q1: [
        { fc: 2276, Uconst: 1.24 }, { fc: 2387, Uconst: 2.53 }, { fc: 2495, Uconst: 4.26 },
        { fc: 2504, Uconst: 4.17 }, { fc: 2525, Uconst: 3.86 }, { fc: 2550, Uconst: 3.39 },
        { fc: 2608, Uconst: 2.34 }, { fc: 2700, Uconst: 1.42 }, { fc: 2786, Uconst: 1.00 }
      ],
      q2: [
        { fc: 2280, Uconst: 1.10 }, { fc: 2387, Uconst: 2.03 }, { fc: 2470, Uconst: 2.78 },
        { fc: 2495, Uconst: 2.83 }, { fc: 2534, Uconst: 2.74 }, { fc: 2570, Uconst: 2.39 },
        { fc: 2626, Uconst: 1.87 }, { fc: 2704, Uconst: 1.33 }, { fc: 2786, Uconst: 1.00 }
      ],
      q1q2: [
        { fc: 2280, Uconst: 0.98 }, { fc: 2354, Uconst: 1.45 }, { fc: 2425, Uconst: 2.01 },
        { fc: 2464, Uconst: 2.24 }, { fc: 2495, Uconst: 2.43 }, { fc: 2539, Uconst: 2.45 },
        { fc: 2558, Uconst: 2.34 }, { fc: 2585, Uconst: 2.17 }, { fc: 2626, Uconst: 1.91 },
        { fc: 2704, Uconst: 1.38 }, { fc: 2786, Uconst: 1.05 }
      ]
    },
    task3: {
      none: [
        { fc: 2280, Uconst: 4.94 }, { fc: 2387, Uconst: 6.06 }, { fc: 2495, Uconst: 6.11 },
        { fc: 2514, Uconst: 5.2 }, { fc: 2534, Uconst: 4.07 }, { fc: 2570, Uconst: 1.95 },
        { fc: 2626, Uconst: -1.35 }, { fc: 2704, Uconst: -5.06 }, { fc: 2786, Uconst: -6.65 }
      ],
      q1: [
        { fc: 2276, Uconst: 4.33 }, { fc: 2387, Uconst: 4.8 }, { fc: 2495, Uconst: 4.10 },
        { fc: 2525, Uconst: 2.97 }, { fc: 2550, Uconst: 1.94 }, { fc: 2608, Uconst: -0.46 },
        { fc: 2700, Uconst: -3.71 }, { fc: 2786, Uconst: -4.99 }
      ],
      q2: [
        { fc: 2280, Uconst: 3.32 }, { fc: 2387, Uconst: 3.30 }, { fc: 2495, Uconst: 1.71 },
        { fc: 2534, Uconst: 1.00 }, { fc: 2570, Uconst: 0.28 }, { fc: 2626, Uconst: -1.47 },
        { fc: 2704, Uconst: -2.69 }, { fc: 2786, Uconst: -3.37 }
      ],
      q1q2: [
        { fc: 2280, Uconst: 2.69 }, { fc: 2387, Uconst: 2.43 }, { fc: 2465, Uconst: 1.33 },
        { fc: 2500, Uconst: 0.63 }, { fc: 2540, Uconst: 0.18 }, { fc: 2570, Uconst: -0.35 },
        { fc: 2626, Uconst: -1.35 }, { fc: 2704, Uconst: -2.34 }, { fc: 2786, Uconst: -2.78 }
      ]
    },
    task4: [
      { fc: 2280, Uconst: -0.51 }, { fc: 2387, Uconst: -1.26 }, { fc: 2465, Uconst: -1.64 },
      { fc: 2514, Uconst: -1.02 }, { fc: 2540, Uconst: -0.68 }, { fc: 2570, Uconst: 0.72 },
      { fc: 2626, Uconst: 1.42 }, { fc: 2704, Uconst: 1.52 }, { fc: 2786, Uconst: 1.17 }
    ],
    task5: {
      det1: [
        { Fm: 338, Uomega: 0.309 }, { Fm: 1446, Uomega: 0.327 }, { Fm: 4000, Uomega: 0.332 },
        { Fm: 5000, Uomega: 0.337 }, { Fm: 7000, Uomega: 0.339 }, { Fm: 12000, Uomega: 0.34 }
      ],
      det2: [
        { Fm: 500, Uomega: 0.561 }, { Fm: 1000, Uomega: 0.561 }, { Fm: 2000, Uomega: 0.560 },
        { Fm: 4000, Uomega: 0.560 }, { Fm: 8000, Uomega: 0.539 }, { Fm: 11000, Uomega: 0.524 },
        { Fm: 12000, Uomega: 0.515 }
      ],
      det3: [
        { Fm: 500, Uomega: 0.247 }, { Fm: 1000, Uomega: 0.247 }, { Fm: 2000, Uomega: 0.247 },
        { Fm: 4000, Uomega: 0.237 }, { Fm: 8000, Uomega: 0.209 }, { Fm: 11000, Uomega: 0.191 },
        { Fm: 12000, Uomega: 0.186 }
      ]
    },
    task6: {
      det1: [
        { uc: 0.008, Uomega: 0.039 }, { uc: 0.104, Uomega: 0.206 }, { uc: 0.226, Uomega: 0.372 },
        { uc: 0.304, Uomega: 0.514 }, { uc: 0.401, Uomega: 0.656 }, { uc: 0.503, Uomega: 0.747 },
        { uc: 0.631, Uomega: 0.720 }, { uc: 0.692, Uomega: 0.676 }
      ],
      det2: [
        { uc: 0.008, Uomega: 0.051 }, { uc: 0.104, Uomega: 0.344 }, { uc: 0.226, Uomega: 0.625 },
        { uc: 0.304, Uomega: 0.923 }, { uc: 0.401, Uomega: 1.192 }, { uc: 0.503, Uomega: 1.450 },
        { uc: 0.625, Uomega: 1.675 }, { uc: 0.692, Uomega: 1.772 }
      ],
      det3: [
        { uc: 0.008, Uomega: 0.023 }, { uc: 0.104, Uomega: 0.139 }, { uc: 0.226, Uomega: 0.297 },
        { uc: 0.304, Uomega: 0.402 }, { uc: 0.401, Uomega: 0.528 }, { uc: 0.503, Uomega: 0.622 },
        { uc: 0.631, Uomega: 0.644 }, { uc: 0.692, Uomega: 0.666 }
      ]
    }
  };

  
  function interpolate(x, array, xKey, yKey) {
    if (!array || array.length === 0) return 0;
    
   
    if (x <= array[0][xKey]) return array[0][yKey];
    if (x >= array[array.length - 1][xKey]) return array[array.length - 1][yKey];

  
    for (let i = 0; i < array.length - 1; i++) {
      let p1 = array[i];
      let p2 = array[i + 1];
      
      if (x >= p1[xKey] && x <= p2[xKey]) {
       
        let ratio = (x - p1[xKey]) / (p2[xKey] - p1[xKey]);
        return p1[yKey] + ratio * (p2[yKey] - p1[yKey]);
      }
    }
    return 0;

  }

  
  const fcInput = document.getElementById("fc");
  const ucInput = document.getElementById("uc");
  const fmInput = document.getElementById("fm"); 
  const modeSelect = document.getElementById("mode");
  const q1Check = document.getElementById("q1");
  const q2Check = document.getElementById("q2");
  const detButtons = document.querySelectorAll(".det");
  const screen = document.getElementById("screen");

  let activeDetector = "1";


  detButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      detButtons.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      activeDetector = e.target.getAttribute("data-det");
      updateScreen();
    });
  });

  const inputs = [fcInput, ucInput, fmInput, modeSelect, q1Check, q2Check];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener("input", updateScreen);
      input.addEventListener("change", updateScreen);
    }
  });

  function updateScreen() {
    const mode = modeSelect.value;
    const fc = parseFloat(fcInput.value) || 0;
    const uc = parseFloat(ucInput.value) || 0;
    const fm = fmInput ? (parseFloat(fmInput.value) || 1000) : 1000;
    
    
    let qState = "none";
    if (q1Check.checked && q2Check.checked) qState = "q1q2";
    else if (q1Check.checked) qState = "q1";
    else if (q2Check.checked) qState = "q2";

    let result = 0;
    let outputText = "";

    switch (mode) {
      case "1":
        result = interpolate(fc, data.task1, "fc", "Usm");
        outputText = `Задание 1\nUсм = ${result.toFixed(2)} В\nfс = ${fc} кГц`;
        break;

      case "2": 
        result = interpolate(fc, data.task2[qState], "fc", "Uconst");
        outputText = `Задание 2\nfс = ${fc} кГц\nU= = ${result.toFixed(2)} В`;
        break;

      case "3": 
        result = interpolate(fc, data.task3[qState], "fc", "Uconst");
        outputText = `Задание 3\nfс = ${fc} кГц\nU= = ${result.toFixed(2)} В`;
        break;

      case "4": 
        result = interpolate(fc, data.task4, "fc", "Uconst");
        outputText = `Задание 4\nfс = ${fc} кГц\nU= = ${result.toFixed(2)} В`;
        break;

      case "5": 
        result = interpolate(fm, data.task5[`det${activeDetector}`], "Fm", "Uomega");
        outputText = `Задание 5\nfс = ${fc} кГц\nUм = ${uc} В\nFм = ${fm} Гц\nUω = ${result.toFixed(3)} В`;
        break;


      case "6": 
        result = interpolate(uc, data.task6[`det${activeDetector}`], "uc", "Uomega");
        outputText = `Задание 6\nfс = ${fc} кГц\nUм = ${uc} В\nUω = ${result.toFixed(3)} В`;
        break;

      default:
        outputText = "Выберите задание";
    }

    screen.innerText = outputText;


  }


  updateScreen();
});
