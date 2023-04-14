export async function drawPieChart(object) {
  const jsonObj = JSON.parse(object);

  const auditRatio = jsonObj.data.user.auditRatio;
  const totalUp = jsonObj.data.user.totalUp;
  const totalDown = jsonObj.data.user.totalDown;

  const upAngle = (totalUp / (totalUp + totalDown)) * 360;

  const upPath = describeArc(100, 100, 80, 0, upAngle);
  const downPath = describeArc(100, 100, 80, upAngle, 360);

  const svg = document.getElementById('auditRatioChart');
  svg.setAttribute('viewBox', '0 0 200 200');

  const upSlice = createSVGElement('path', {
    d: upPath,
    fill: 'lightgreen',
    class: 'slice',
    'data-total': totalUp,
  });
  upSlice.innerHTML = `<title>Done: ${totalUp} kB</title>`;
  svg.appendChild(upSlice);

  const downSlice = createSVGElement('path', {
    d: downPath,
    fill: 'darkblue',
    class: 'slice',
    'data-total': totalDown,
  });
  downSlice.innerHTML = `<title>Received: ${totalDown} kB</title>`;
  svg.appendChild(downSlice);
  
const auditRatioDisplay = document.getElementById('auditRatioDisplay');
  auditRatioDisplay.innerHTML = `Audit Ratio: ${auditRatio.toFixed(2)}<br>Done: ${totalUp} kB<br>Received: ${totalDown} kB`;
 
}


function createSVGElement(tag, attributes) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const attr in attributes) {
    element.setAttribute(attr, attributes[attr]);
  }
  return element;
}


function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');

  return d;
}
