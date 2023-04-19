import { createSVGElement } from './draw.js';

export function addButton(svg, padding, callback) {
  const buttonGroup = createSVGElement("g", {
    class: "show-hide-button",
    cursor: "pointer",
  });

  const buttonRect = createSVGElement("rect", {
    x: padding + 300,
    y: padding - 30,
    width: 100,
    height: 25,
    fill: "lightgray",
    rx: 5,
    ry: 5,
  });

  const buttonText = createSVGElement("text", {
    x: padding + 350,
    y: padding - 12.5,
    "text-anchor": "middle",
    "font-size": 16,
    "font-weight": "bold",
  });

  buttonText.textContent = "Show/Hide";

  buttonGroup.appendChild(buttonRect);
  buttonGroup.appendChild(buttonText);

  // Add the click event listener
  buttonGroup.addEventListener("click", () => {
    if (callback) {
      callback();
    }
  });

  svg.appendChild(buttonGroup);
}

// log the user out of the application
// Change localStorage to sessionStorage in logout function
export function logout() {
  sessionStorage.removeItem("jwt");
  sessionStorage.removeItem("username");
  window.location.reload();
}

