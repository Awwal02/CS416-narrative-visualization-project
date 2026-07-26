// const svg = d3.select("svg");
window.countrySelected = null;
window.yearSelected = "1952";
window.defaultState = "Home";
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
let isInitialLoad = true;
window.container = d3.select("#container");
let backButton = document.querySelector("#back-button");
let nextButton = document.querySelector("#next-button");
const margin = { top: 20, right: 50, bottom: 60, left: 70 };

const loadData = async () => {
  const data = await d3.csv("./gapminderDataFiveYear.csv");
  createYearDropDown(data);
  createCountriesDropdown(data);
  // createContinentsDropdown(data);
  return data;
};

const changeState = (pressed) => {
  console.log(pressed);
  if (pressed === "back" && window.defaultState === "Second") {
    window.defaultState = "Home";
  } else if (pressed === "back" && window.defaultState === "third") {
    window.defaultState = "Second";
  } else if (pressed === "next" && window.defaultState === "Home") {
    window.defaultState = "Second";
  } else if (pressed === "next" && window.defaultState === "Second") {
    window.defaultState = "third";
  }

  clearSvg();
  createSvgMain();
  createSvgBrush();
  drawResponsiveScatterChartAll(
    window.svg,
    window.chartGroup,
    window.container,
    window.xScale,
    window.yScale,
    window.xAxisGroup,
    window.yAxisGroup,
    window.countrySelected,
    "container",
  );
  drawResponsiveScatterChartAll(
    window.svg2,
    window.chartGroup2,
    window.container2,
    window.xScale2,
    window.yScale2,
    window.xAxisGroup2,
    window.yAxisGroup2,
    window.countrySelected,
    "brush-container",
  );
  drawResponsiveBarChartCommon("bar-chart-container");
  drawResponsiveBarChartCommon();
};

document
  .getElementById("back-button")
  .addEventListener("click", changeState.bind(this, "back"));
document
  .getElementById("next-button")
  .addEventListener("click", changeState.bind(this, "next"));

const createYearDropDown = (data) => {
  const years = [...new Set(data.map((d) => d.year))].sort((a, b) => a - b);
  const yearDropdown = document.querySelector("#year-select");
  const yearsEl = document.querySelector("#years");
  years.forEach((year) => {
    const option = document.createElement("option");
    const button = document.createElement("button");
    button.innerText = year;
    button.className = "style-button";
    button.setAttribute("val", year);
    option.value = year;
    if (option.value === "1952") {
      option.selected = true;
      button.className = "style-button active";
    }
    option.textContent = year;
    yearDropdown.appendChild(option);
    yearsEl.append(button);
  });
  const buttons = yearsEl.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      window.yearSelected = btn.getAttribute("val");
      buttons.forEach((z) => (z.className = "style-button"));
      console.log(window.yearSelected);
      btn.className = "style-button active";
      changeState();
    });
  });
  yearDropdown.addEventListener("change", (e) => {
    console.log(e.target.value);
    if (e.target.value === "all") {
      window.yearSelected = null;
    } else {
      window.yearSelected = e.target.value;
    }
    changeState();
  });
};

const clearSvg = () => {
  d3.select("#container").select("svg").remove();
  d3.select("#brush-container").select("svg").remove();
  d3.select("#bar-chart-container").select("svg").remove();
  d3.select("#bar-chart-container-2").select("svg").remove();
};

const createCountriesDropdown = (data) => {
  const countries = [...new Set(data.map((d) => d.country))];
  const countryDropdown = document.querySelector("#country-select");

  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countryDropdown.appendChild(option);
  });
  countryDropdown.addEventListener("change", (e) => {
    console.log(e.target.value);
    if (e.target.value === "all") {
      window.countrySelected = null;
    } else {
      window.countrySelected = e.target.value;
    }
    changeState();
  });
};

const dataFilter = (data) => {
  // console.log(
  //   window.yearSelected,
  //   window.countrySelected,
  //   window.continentSelected,
  // );
  if (window.startBound && window.endBound) {
    data = JSON.parse(JSON.stringify(data));
    data = data.filter(
      (x) => x.lifeExp >= window.startBound && x.lifeExp <= window.endBound,
    );
  }
  data = data.map((z) => {
    z.gdpPercap = (+z.gdpPercap).toFixed(2);
    z.lifeExp = (+z.lifeExp).toFixed(2);
    return z;
  });
  if (
    window.yearSelected &&
    window.countrySelected &&
    window.continentSelected
  ) {
    return data.filter(
      (d) =>
        d.year === window.yearSelected &&
        d.country === window.countrySelected &&
        d.continent === window.continentSelected,
    );
  } else if (window.yearSelected && window.countrySelected) {
    return data.filter(
      (d) =>
        d.year === window.yearSelected && d.country === window.countrySelected,
    );
  } else if (window.yearSelected && window.continentSelected) {
    return data.filter(
      (d) =>
        d.year === window.yearSelected &&
        d.continent === window.continentSelected,
    );
  } else if (window.countrySelected && window.continentSelected) {
    return data.filter(
      (d) =>
        d.country === window.countrySelected &&
        d.continent === window.continentSelected,
    );
  } else if (window.yearSelected) {
    return data.filter((d) => d.year === window.yearSelected);
  } else if (window.countrySelected) {
    return data.filter((d) => d.country === window.countrySelected);
  } else if (window.continentSelected) {
    return data.filter((d) => d.continent === window.continentSelected);
  } else {
    return data;
  }
};

const createContinentsDropdown = (data) => {
  const continents = [...new Set(data.map((d) => d.continent))];
  const continentDropdown = document.querySelector("#continent-select");
  continents.forEach((continent) => {
    const option = document.createElement("option");
    option.value = continent;
    option.textContent = continent;
    continentDropdown.appendChild(option);
  });
  continentDropdown.addEventListener("change", (e) => {
    console.log(e.target.value);
    if (e.target.value === "all") {
      window.continentSelected = null;
    } else {
      window.continentSelected = e.target.value;
    }
    changeState();
  });
};

const createSvgMain = async () => {
  const container = d3.select("#container");
  const svg = container.append("svg");
  const chartGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  const xScale = d3.scaleLinear();
  const yScale = d3.scaleLog();

  const xAxisGroup = chartGroup.append("g").attr("class", "x-axis");
  const yAxisGroup = chartGroup.append("g").attr("class", "y-axis");

  window.container = container;
  window.svg = svg;
  window.chartGroup = chartGroup;
  window.xScale = xScale;
  window.yScale = yScale;
  window.xAxisGroup = xAxisGroup;
  window.yAxisGroup = yAxisGroup;
};

const createSvgBrush = async () => {
  const container = d3.select("#brush-container");
  const svg = container.append("svg");
  const chartGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  const xScale = d3.scaleLinear();
  const yScale = d3.scaleLog();

  const xAxisGroup = chartGroup.append("g").attr("class", "x-axis");
  const yAxisGroup = chartGroup.append("g").attr("class", "y-axis");

  window.container2 = container;
  window.svg2 = svg;
  window.chartGroup2 = chartGroup;
  window.xScale2 = xScale;
  window.yScale2 = yScale;
  window.xAxisGroup2 = xAxisGroup;
  window.yAxisGroup2 = yAxisGroup;
};

// update chart when window is resized
window.addEventListener("resize", () => {
  if (window.svg && window.chartGroup) {
    drawResponsiveScatterChartAll(
      window.svg,
      window.chartGroup,
      window.container,
      window.xScale,
      window.yScale,
      window.xAxisGroup,
      window.yAxisGroup,
      window.countrySelected,
      "container",
    );
    drawResponsiveScatterChartAll(
      window.svg2,
      window.chartGroup2,
      window.container2,
      window.xScale2,
      window.yScale2,
      window.xAxisGroup2,
      window.yAxisGroup2,
      window.countrySelected,
      "brush-container",
    );
  }
});

const start = async () => {
  isInitialLoad = false;
  const data = await loadData();
  window.data = data;
  createSvgMain();
  createSvgBrush();
  drawResponsiveScatterChartAll(
    window.svg,
    window.chartGroup,
    window.container,
    window.xScale,
    window.yScale,
    window.xAxisGroup,
    window.yAxisGroup,
    window.countrySelected,
    "container",
  );
  drawResponsiveScatterChartAll(
    window.svg2,
    window.chartGroup2,
    window.container2,
    window.xScale2,
    window.yScale2,
    window.xAxisGroup2,
    window.yAxisGroup2,
    window.countrySelected,
    "brush-container",
  );

  drawResponsiveBarChartCommon("bar-chart-container");
  drawResponsiveBarChartCommon();
};

start();
