import { addButton } from "./helper.js";

export async function drawPieChart(object) {
  const jsonObj = JSON.parse(object);

  const auditRatio = jsonObj.data.user.auditRatio;
  const totalUp = jsonObj.data.user.totalUp;
  const totalDown = jsonObj.data.user.totalDown;

  const upAngle = (totalUp / (totalUp + totalDown)) * 360;

  const upPath = describeArc(100, 100, 80, 0, upAngle);
  const downPath = describeArc(100, 100, 80, upAngle, 360);

  const svg = document.getElementById("auditRatioChart");
  svg.setAttribute("viewBox", "0 0 200 200");

  const upSlice = createSVGElement("path", {
    d: upPath,
    fill: "lightgreen",
    class: "slice",
    "data-total": totalUp,
  });
  upSlice.innerHTML = `<title>Done: ${totalUp} kB</title>`;
  svg.appendChild(upSlice);

  const downSlice = createSVGElement("path", {
    d: downPath,
    fill: "darkblue",
    class: "slice",
    "data-total": totalDown,
  });
  downSlice.innerHTML = `<title>Received: ${totalDown} kB</title>`;
  svg.appendChild(downSlice);

  const auditRatioDisplay = document.getElementById("auditRatioDisplay");
  auditRatioDisplay.innerHTML = `Audit Ratio: ${auditRatio.toFixed(
    2
  )}<br>Done: ${totalUp} kB<br>Received: ${totalDown} kB`;
}

export function createSVGElement(tag, attributes) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const attr in attributes) {
    element.setAttribute(attr, attributes[attr]);
  }
  return element;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
}

// draw level progression over project chart using SVG
// Get Level From Projects: {"data":{"user":{"transactions":[{"amount":24,"path":"/gritlab/school-curriculum/typing-in-progress","object":{"name":"real-time-forum-typing-in-progress"}},{"amount":23,"path":"/gritlab/school-curriculum/real-time-forum","object":{"name":"real-time-forum"}},{"amount":22,"path":"/gritlab/school-curriculum/make-your-game","object":{"name":"make-your-game"}},{"amount":21,"path":"/gritlab/school-curriculum/make-your-game","object":{"name":"make-your-game"}},{"amount":20,"path":"/gritlab/school-curriculum/make-your-game","object":{"name":"make-your-game"}},{"amount":17,"path":"/gritlab/school-curriculum/forum","object":{"name":"forum"}},{"amount":16,"path":"/gritlab/school-curriculum/forum","object":{"name":"forum"}},{"amount":15,"path":"/gritlab/school-curriculum/forum","object":{"name":"forum"}},{"amount":14,"path":"/gritlab/school-curriculum/lem-in","object":{"name":"lem-in"}},{"amount":13,"path":"/gritlab/school-curriculum/visualizations","object":{"name":"groupie-tracker-visualizations"}},{"amount":12,"path":"/gritlab/school-curriculum/groupie-tracker","object":{"name":"groupie-tracker"}},{"amount":11,"path":"/gritlab/school-curriculum/net-cat","object":{"name":"net-cat"}},{"amount":10,"path":"/gritlab/school-curriculum/stylize","object":{"name":"ascii-art-web-stylize"}},{"amount":9,"path":"/gritlab/school-curriculum/fs","object":{"name":"ascii-art-fs"}},{"amount":8,"path":"/gritlab/school-curriculum/output","object":{"name":"ascii-art-output"}},{"amount":7,"path":"/gritlab/school-curriculum/ascii-art-web","object":{"name":"ascii-art-web"}},{"amount":6,"path":"/gritlab/school-curriculum/ascii-art","object":{"name":"ascii-art"}},{"amount":5,"path":"/gritlab/school-curriculum/go-reloaded","object":{"name":"go-reloaded"}},{"amount":4,"path":"/gritlab/school-curriculum/go-reloaded","object":{"name":"go-reloaded"}}]}}}
// amount is the level, object.name is the project name
export function drawLevelProgression(levelProgression) {
  const jsonObj = JSON.parse(levelProgression);
  const transactions = jsonObj.data.user.transactions;

  // Create a filtered array that only contains the highest level instance of each project
  const filteredTransactions = [];
  transactions.forEach((transaction) => {
    const index = filteredTransactions.findIndex(
      (filteredTransaction) =>
        filteredTransaction.object.name === transaction.object.name
    );
    if (index === -1) {
      filteredTransactions.push(transaction);
    } else if (transaction.amount > filteredTransactions[index].amount) {
      filteredTransactions[index] = transaction;
    }
  });

  const levels = filteredTransactions.map((transaction) => transaction.amount);
  const projects = filteredTransactions.map(
    (transaction) => transaction.object.name
  );

  const maxLevel = Math.max(...levels);
  const numProjects = projects.length;

  const svgWidth = 600;
  const svgHeight = 300;
  const padding = 30;

  const svg = document.getElementById("levelProgressionChart");
  svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

  const xScale = (svgWidth - 2 * padding) / numProjects;
  const yScale = (svgHeight - 2 * padding) / maxLevel;

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    const project = projects[i];
    const x = padding + i * xScale;
    const y = svgHeight - padding - level * yScale;
    const width = xScale * 0.8;
    const height = level * yScale;
    const color = "lightgreen";
    const title = `Level ${level}: ${project}`;

    const levelSlice = createSVGElement("rect", {
      x: x,
      y: y,
      width: width,
      height: height,
      fill: color,
      class: "slice",
      "data-total": level,
    });
    levelSlice.innerHTML = `<title>${title}</title>`;
    svg.appendChild(levelSlice);

    const projectLabel = createSVGElement("text", {
      x: x + width / 2 + -70,
      y: svgHeight - padding + 20,
      "text-anchor": "middle",
      "font-size": 12,
      transform: `rotate(-90, ${x + width / 2}, ${svgHeight - padding + 20})`,
    });
    projectLabel.textContent = project;
    svg.appendChild(projectLabel);

    const levelLabel = createSVGElement("text", {
      x: x + width / 2,
      y: y - 5,
      "text-anchor": "middle",
      "font-size": 12,
    });
    levelLabel.textContent = level;

    // Add chart title
    const chartTitle = createSVGElement("text", {
      x: padding,
      y: padding - 10,
      "text-anchor": "start",
      "font-size": 16,
      "font-weight": "bold",
    });
    chartTitle.textContent = "Level Progression";
    svg.appendChild(chartTitle);
    svg.appendChild(levelLabel);
  }
}

// draw xp gained through go-piscine exercises
// {"data":{"user":{"transactions":[{"amount":175,"objectId":100155,"object":{"name":"introduction"}},{"amount":500,"objectId":100156,"object":{"name":"make-it-better"}},{"amount":325,"objectId":100158,"object":{"name":"who-are-you"}},{"amount":325,"objectId":100154,"object":{"name":"cl-camp1"}},{"amount":325,"objectId":100159,"object":{"name":"cl-camp2"}},{"amount":325,"objectId":100160,"object":{"name":"cl-camp3"}},{"amount":400,"objectId":100161,"object":{"name":"cl-camp4"}},{"amount":400,"objectId":100162,"object":{"name":"cl-camp5"}},{"amount":400,"objectId":100168,"object":{"name":"cl-camp6"}}, ....
// y-axis is the name of the exercise, x-axis is the xp gained
export function drawXPFromPiscineGo(xpFromPiscineGo) {
  const jsonObj = JSON.parse(xpFromPiscineGo);
  const transactions = jsonObj.data.user.transactions;
  const exercises = transactions.map((transaction) => transaction.object.name);
  const xp = transactions.map((transaction) => transaction.amount);

  const svgWidth = 600;
  const padding = 30;
  const dataColumnHeight = 30;
  const svgHeight = padding * 2 + exercises.length * dataColumnHeight;

  const svg = document.getElementById("xpFromPiscineGoChart");
  svg.setAttribute("width", svgWidth);
  svg.setAttribute("height", svgHeight);

  const xScale = (svgWidth - 2 * padding) / Math.max(...xp);
  const yScale = dataColumnHeight;

  // Add chart title
  const chartTitle = createSVGElement("text", {
    x: padding,
    y: padding - 10,
    "text-anchor": "start",
    "font-size": 16,
    "font-weight": "bold",
  });
  chartTitle.textContent = "XP Gained from Go Piscine Exercises";
  svg.appendChild(chartTitle);

  // Store original height for uncollapsing
  const originalSvgHeight = svgHeight;

  const callback = () => {
    const slices = document.getElementsByClassName("sliceOfGoPiscine");

    // If the chart is collapsed, uncollapse it
    if (svg.getAttribute("height") == 60) {
      svg.setAttribute("height", originalSvgHeight);
      chartTitle.setAttribute("y", padding - 10);
      addButton(svg, padding, callback);
      for (let i = 0; i < slices.length; i++) {
        const slice = slices[i];
        slice.style.display = "";
      }
    } else {
      // Otherwise, collapse the chart
      svg.setAttribute("height", 60);
      chartTitle.setAttribute("y", 40);
      addButton(svg, padding, callback);
      for (let i = 0; i < slices.length; i++) {
        const slice = slices[i];
        slice.style.display = "none";
      }
    }

    // Adjust the position of the exercise and XP labels
    const exerciseLabels = document.getElementsByClassName("exerciseLabel");
    const xpLabels = document.getElementsByClassName("xpLabel");

    for (let i = 0; i < exerciseLabels.length; i++) {
      const exerciseLabel = exerciseLabels[i];
      const xpLabel = xpLabels[i];

      if (svg.getAttribute("height") == 60) {
        exerciseLabel.style.display = "none";
        xpLabel.style.display = "none";
      } else {
        exerciseLabel.style.display = "";
        xpLabel.style.display = "";
      }
    }
  };

  addButton(svg, padding, callback);

  for (let i = 0; i < xp.length; i++) {
    const exercise = exercises[i];
    const xpGained = xp[i];
    const x = padding;
    const y = padding + i * yScale;
    const width = xpGained * xScale;
    const height = yScale * 1;
    const color = "lightgreen";
    const title = `${exercise}: ${xpGained} xp`;

    const xpSlice = createSVGElement("rect", {
      x: x,
      y: y,
      width: width,
      height: height,
      fill: color,
      class: "sliceOfGoPiscine",
      "data-total": xpGained,
      // add borderline to each bar
      stroke: "black",
    });
    xpSlice.innerHTML = `<title>${title}</title>`;
    svg.appendChild(xpSlice);

    const exerciseLabel = createSVGElement("text", {
      x: x + width + 15,
      y: y + height / 2 + 5,
      "text-anchor": "start",
      "font-size": 12,
      class: "exerciseLabel",
    });
    exerciseLabel.textContent = exercise;
    svg.appendChild(exerciseLabel);

    const xpLabel = createSVGElement("text", {
      x: x + width / 2,
      y: y + 20,
      "text-anchor": "middle",
      "font-size": 12,
      class: "xpLabel",
    });
    xpLabel.textContent = xpGained;
    svg.appendChild(xpLabel);
  }
}

// draw XP gained through PiscineJS the is the same as the one above
export function drawXPFromPiscineJS(xpFromPiscineJS) {
  const jsonObj = JSON.parse(xpFromPiscineJS);
  const transactions = jsonObj.data.user.transactions;
  const exercises = transactions.map((transaction) => transaction.object.name);
  const xp = transactions.map((transaction) => transaction.amount);

  const svgWidth = 600;
  const padding = 30;
  const dataColumnHeight = 30;
  const svgHeight = padding * 2 + exercises.length * dataColumnHeight;

  const svg = document.getElementById("xpFromPiscineJSChart");
  svg.setAttribute("width", svgWidth);
  svg.setAttribute("height", svgHeight);

  const xScale = (svgWidth - 2 * padding) / Math.max(...xp);
  const yScale = dataColumnHeight;

  // Add chart title
  const chartTitle = createSVGElement("text", {
    x: padding,
    y: padding - 10,
    "text-anchor": "start",
    "font-size": 16,
    "font-weight": "bold",
  });
  chartTitle.textContent = "XP Gained from JS Piscine Exercises";
  svg.appendChild(chartTitle);

  // Store original height for uncollapsing
  const originalSvgHeight = svgHeight;

  const callback = () => {
    const slices = document.getElementsByClassName("sliceOfJSPiscine");

    // If the chart is collapsed, uncollapse it
    if (svg.getAttribute("height") == 60) {
      svg.setAttribute("height", originalSvgHeight);
      chartTitle.setAttribute("y", padding - 10);
      addButton(svg, padding, callback);
      for (let i = 0; i < slices.length; i++) {
        const slice = slices[i];
        slice.style.display = "";
      }
    } else {
      // Otherwise, collapse the chart
      svg.setAttribute("height", 60);
      chartTitle.setAttribute("y", 40);
      addButton(svg, padding, callback);
      for (let i = 0; i < slices.length; i++) {
        const slice = slices[i];
        slice.style.display = "none";
      }
    }

    // Adjust the position of the exercise and XP labels
    const exerciseLabels = document.getElementsByClassName(
      "exercisePiscineLabel"
    );
    const xpLabels = document.getElementsByClassName("xpPiscineLabel");

    for (let i = 0; i < exerciseLabels.length; i++) {
      const exerciseLabel = exerciseLabels[i];
      const xp = xpLabels[i];

      if (svg.getAttribute("height") == 60) {
        exerciseLabel.style.display = "none";
        xp.style.display = "none";
      } else {
        exerciseLabel.style.display = "";
        xp.style.display = "";
      }
    }
  };

  addButton(svg, padding, callback);

  for (let i = 0; i < xp.length; i++) {
    const exercise = exercises[i];
    const xpGained = xp[i];
    const x = padding;
    const y = padding + i * yScale;
    const width = xpGained * xScale;
    const height = yScale * 1;
    const color = "lightgreen";
    const title = `${exercise}: ${xpGained} xp`;

    const xpSlice = createSVGElement("rect", {
      x: x,
      y: y,
      width: width,
      height: height,
      fill: color,
      class: "sliceOfJSPiscine",
      "data-total": xpGained,
      // add borderline to each bar
      stroke: "black",
    });
    xpSlice.innerHTML = `<title>${title}</title>`;
    svg.appendChild(xpSlice);

    const exerciseLabel = createSVGElement("text", {
      x: x + width + 15,
      y: y + height / 2 + 5,
      "text-anchor": "start",
      "font-size": 12,
      class: "exercisePiscineLabel",
    });
    exerciseLabel.textContent = exercise;
    svg.appendChild(exerciseLabel);

    const xpLabel = createSVGElement("text", {
      x: x + width / 2,
      y: y + 20,
      "text-anchor": "middle",
      "font-size": 12,
      class: "xpPiscineLabel",
    });
    xpLabel.textContent = xpGained;
    svg.appendChild(xpLabel);
  }
}

// draw a masteries pie chart that has 6 properties: Prog, Go, Back-end, Front-end, Js, Html that has the same skill value denominator of 100
// returned data: Get Masteries: {"data":{"user":{"transactions":[{"type":"skill_back-end","amount":50},{"type":"skill_front-end","amount":45},{"type":"skill_go","amount":55},{"type":"skill_html","amount":35},{"type":"skill_js","amount":40},{"type":"skill_prog","amount":60}]}}}

export function drawMasteries(getMasteries) {
  const jsonObj = JSON.parse(getMasteries);
  const masteries = jsonObj.data.user.transactions;
  const masteryNameOrg = masteries.map((mastery) => mastery.type);
  const masteryName = masteryNameOrg.map((mastery) => {
    return mastery.slice(6, 7).toUpperCase() + mastery.slice(7);
  });

  const masteryValue = masteries.map((mastery) => mastery.amount);

  const svgWidth = 500;
  const svgHeight = 500;
  const svgCenterX = svgWidth / 2;
  const svgCenterY = svgHeight / 2;
  const svgRadius = 150;

  const svg = document.getElementById("masteryPieChart");
  svg.setAttribute("width", svgWidth);
  svg.setAttribute("height", svgHeight);

  const sectors = masteryName.length;
  const anglePerSector = (2 * Math.PI) / sectors;

  // Create a text element to display the value
  const valueDisplay = document.createElementNS(svg.namespaceURI, "text");
  valueDisplay.setAttribute("x", svgCenterX + svgRadius);
  valueDisplay.setAttribute("y", svgCenterY + svgRadius);
  valueDisplay.setAttribute("text-anchor", "middle");
  valueDisplay.setAttribute("dominant-baseline", "middle");
  valueDisplay.setAttribute("font-size", "20px");
  valueDisplay.setAttribute("font-weight", "bold");
  valueDisplay.setAttribute("display", "none");
  svg.appendChild(valueDisplay);

  // Draw frame lines
  for (let i = 0; i < sectors; i++) {
    const currentAngle = anglePerSector * i;
    const nextAngle = currentAngle + anglePerSector;

    const x1 = svgCenterX + svgRadius * Math.cos(currentAngle);
    const y1 = svgCenterY + svgRadius * Math.sin(currentAngle);
    const x2 = svgCenterX + svgRadius * Math.cos(nextAngle);
    const y2 = svgCenterY + svgRadius * Math.sin(nextAngle);

    const frameLine = document.createElementNS(svg.namespaceURI, "line");
    frameLine.setAttribute("x1", svgCenterX);
    frameLine.setAttribute("y1", svgCenterY);
    frameLine.setAttribute("x2", x1);
    frameLine.setAttribute("y2", y1);
    frameLine.setAttribute("stroke", "black");
    frameLine.setAttribute("stroke-width", 1);
    svg.appendChild(frameLine);
  }

  // Draw sectors
  for (let i = 0; i < sectors; i++) {
    const currentAngle = anglePerSector * i;
    const nextAngle = currentAngle + anglePerSector;

    const currentRadius = (masteryValue[i] / 100) * svgRadius;

    const x1 = svgCenterX + currentRadius * Math.cos(currentAngle);
    const y1 = svgCenterY + currentRadius * Math.sin(currentAngle);
    const x2 = svgCenterX + currentRadius * Math.cos(nextAngle);
    const y2 = svgCenterY + currentRadius * Math.sin(nextAngle);

    const largeArcFlag = 0;

    const sectorPath = document.createElementNS(svg.namespaceURI, "path");
    sectorPath.setAttribute(
      "d",
      `M${svgCenterX} ${svgCenterY} L${x1} ${y1} A${currentRadius} ${currentRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
    );
    sectorPath.setAttribute("fill", `hsl(${(i * 60) % 360}, 50%, 50%)`);
    svg.appendChild(sectorPath);

    // Add click event listener to the sectorPath element
    sectorPath.addEventListener("click", () => {
      // Toggle value display visibility
      if (valueDisplay.getAttribute("display") === "none") {
        valueDisplay.setAttribute("display", "inline");
        valueDisplay.textContent = `Value: ${masteryValue[i]}`;
      } else {
        valueDisplay.setAttribute("display", "none");
      }
    });

    const labelX =
      svgCenterX +
      (svgRadius + 20) * Math.cos(currentAngle + anglePerSector / 2);
    const labelY =
      svgCenterY +
      (svgRadius + 20) * Math.sin(currentAngle + anglePerSector / 2);

    const textLabel = document.createElementNS(svg.namespaceURI, "text");
    textLabel.setAttribute("x", labelX);
    textLabel.setAttribute("y", labelY);
    textLabel.setAttribute("text-anchor", "middle");
    textLabel.setAttribute("dominant-baseline", "middle");
    textLabel.setAttribute("font-size", "12px");
    textLabel.textContent = masteryName[i];
    svg.appendChild(textLabel);

    // Draw frame circle
    const frameCircle = document.createElementNS(svg.namespaceURI, "circle");
    frameCircle.setAttribute("cx", svgCenterX);
    frameCircle.setAttribute("cy", svgCenterY);
    frameCircle.setAttribute("r", svgRadius);
    frameCircle.setAttribute("fill", "none");
    frameCircle.setAttribute("stroke", "black");
    frameCircle.setAttribute("stroke-width", 1);
    svg.appendChild(frameCircle);
  }
}
