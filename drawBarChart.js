const drawResponsiveBarChartCommon = (type = "bar-chart-container-2") => {
  const t = d3
    .transition()
    .duration(isInitialLoad ? 0 : 1000)
    .ease(d3.easeCubicInOut);
  const barChartContainer = d3.select("#" + type);
  window.yearSelected = window.yearSelected || 1952;
  const width =
    parseInt(barChartContainer.style("width")) - margin.left - margin.right;
  const height =
    parseInt(barChartContainer.style("height")) - margin.top - margin.bottom;
  // const averageGdpByContinents =
  let dataByContinent = dataFilter(window.data);
  console.log("dataByContinent");
  console.log(dataByContinent);
  const fetchCondition =
    type === "bar-chart-container-2" ? "gdpPercap" : "lifeExp";
  let dataAggregated = dataByContinent.reduce((acc, curr) => {
    if (!acc[curr["continent"]]) {
      acc[curr["continent"]] = {
        sum: +curr[fetchCondition],
        count: 1,
        avg: +curr[fetchCondition],
      };
    } else {
      acc[curr["continent"]]["sum"] += +curr[fetchCondition];
      acc[curr["continent"]]["count"] += 1;
      acc[curr["continent"]]["avg"] =
        acc[curr["continent"]]["sum"] / acc[curr["continent"]]["count"];
    }
    return acc;
  }, {});
  console.log(dataAggregated);

  let data = [];
  for (let x in dataAggregated) {
    data.push({ continent: x, gdp: dataAggregated[x].avg });
  }

  data.sort((x, y) => x.gdp - y.gdp);

  console.log(data);

  // const tooltip =
  const tooltip = d3
    .select("#" + type)
    .append("div")
    .attr("class", "d3-tooltip");

  // 3. Create SVG bar-chart-container
  const svg = d3
    .select("#" + type)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 4. Set up Scales
  // X axis scale (GDP numerical values)
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.gdp)])
    .range([0, width]);

  const y = d3
    .scaleBand()
    .range([0, height])
    .domain(data.map((d) => d.continent))
    .padding(0.2); // Spacing between bars

  // const colorBand = d3.scaleOrdinal(d3.schemeCategory10);

  // 5. Draw Axes
  // X Axis (Bottom)
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .transition(t)
    .call(
      d3
        .axisBottom(x)
        .ticks(6)
        .tickFormat((d) => `${d}`),
    )
    .attr("class", "axis-label")
    .selectAll("text")
    .attr("color", "#4b5563");

  // Y Axis (Left)
  svg
    .append("g")
    .transition(t)
    .call(d3.axisLeft(y).tickSize(0))
    // .attr("transform", "translate(-90)")
    .attr("class", "axis-label")
    .selectAll("text")
    .style("font-size", "13px")
    .attr("transform", "rotate(-90),translate(0,-20)")
    .attr("text-anchor", "middle")
    .attr("color", "#1f2937");

  // 6. Draw Bars
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .on("mouseover", function () {
      tooltip.style("opacity", "1");
    })
    .on("mousemove", function (event, d) {
      tooltip
        .html(
          `Continent: <strong>${d.continent}</strong><br>${type.includes("-2") ? "Avg GDP" : "Avg Life expectancy"}: <strong>${d.gdp.toFixed(2)}</strong>`,
        )
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function () {
      tooltip.style("opacity", "0");
    })
    .transition(t)
    .attr("x", x(0))
    .attr("y", (d) => y(d.continent))
    .attr("width", (d) => x(d.gdp))
    .attr("height", y.bandwidth())
    .attr("fill", (d) => colorScale(d.continent));

  // 7. Add Data Labels inside the bars
  svg
    .selectAll(".value-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "value-label")
    .attr("x", (d) => x(d.gdp / 2)) // Margin from the end of the bar
    .attr("y", (d) => y(d.continent) + y.bandwidth() / 2 + 4) // Center vertically
    .text((d) => `${d.gdp.toFixed(2)}`)
    .attr("fill", "white");

  svg
    .selectAll(".y-axis-label")
    .data([1])
    .join("text")
    .transition(t)
    .attr("class", "y-axis-label")
    .attr("text-anchor", "middle")
    .attr(
      "transform",
      `translate(${margin.left - 100}, ${height / 2 + margin.top}) rotate(-90)`,
    )
    .text("Continents");

  svg
    .selectAll(".x-axis-label")
    .data([1])
    .join("text")
    .transition(t)
    .attr("class", "x-axis-label")
    .attr("text-anchor", "middle")
    .attr(
      "transform",
      `translate(${width / 2 + margin.left}, ${height + margin.top + 30})`,
    )
    .text(
      type.includes("-2") ? "Average GDP per cap" : "Average Life Expectancy",
    );
};
