window.drawResponsiveScatterChartAll = (
  svg,
  chartGroup,
  container,
  xScale,
  yScale,
  xAxisGroup,
  yAxisGroup,
  countrySelected,
  elementId,
) => {
  const isBrush = elementId === "brush-container";
  window.filteredData = dataFilter(window.data);
  //   cons;
  const width = parseInt(container.style("width")) - margin.left - margin.right;
  const height =
    parseInt(container.style("height")) - margin.top - margin.bottom;
  // ADD TRANSITIONS TO CIRCLES AND AXES
  svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const t = d3
    .transition()
    .duration(isInitialLoad ? 0 : 1000)
    .ease(d3.easeCubicInOut);

  xScale
    .domain([
      d3.min(filteredData, (d) => +d.lifeExp - 10),
      d3.max(filteredData, (d) => +d.lifeExp + 10),
    ])
    .range([0, width]);
  yScale
    .domain([
      d3.min(filteredData, (d) => +d.gdpPercap - 100),
      d3.max(filteredData, (d) => +d.gdpPercap),
    ])
    .range([height, 0]);

  xAxisGroup
    .attr("transform", `translate(0, ${height})`)
    .transition(t)
    .call(d3.axisBottom(xScale));
  !isBrush && yAxisGroup.transition(t).call(d3.axisLeft(yScale));

  const circles = chartGroup.selectAll("circle").data(filteredData);

  // add tooltip to circles
  const tooltip = d3
    .select(`#${elementId}`)
    .append("div")
    .attr("class", "d3-tooltip");

  // fill color based on continent
  const myCircle = circles
    .enter()
    .append("circle")
    .merge(circles)
    .on("mousemove", function (event, d) {
      if (isBrush) return;
      tooltip
        .style("opacity", 1)
        .html(
          `<strong>Country:</strong> ${d.country}<br><strong>Year:</strong> ${d.year}<br><strong>Life Expectancy:</strong> ${d.lifeExp}<br><strong>GDP per Capita:</strong> ${d.gdpPercap}<br><strong>Population:</strong> ${d.pop}`,
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");

      d3.select(event.currentTarget)
        .interrupt()
        .transition()
        .duration(250)
        .ease(d3.easeCubicOut)
        .attr("r", (d) =>
          Math.sqrt(+d.pop) / 1000 < 1
            ? Math.sqrt(+d.pop) / 100
            : Math.sqrt(+d.pop) / 250,
        );
    })
    .on("mouseout", (event, d) => {
      if (isBrush) return;
      tooltip.style("opacity", 0);
      d3.select(event.currentTarget)
        .interrupt()
        .transition()
        .duration(250)
        .ease(d3.easeCubicOut)
        .attr("r", (d) => Math.sqrt(+d.pop) / 1000);
    })
    .transition(t)
    .attr("cx", (d) => xScale(+d.lifeExp))
    .attr("opacity", isBrush ? 0.5 : 1)
    .attr("cy", (d) => yScale(+d.gdpPercap))
    .attr("r", (d) => Math.sqrt(+d.pop) / 1000)
    .attr("fill", (d) => colorScale(d.continent))
    .attr("stroke", "black")
    .attr("stroke-width", 0.7)
    .attr("fill-opacity", 0.5);
  // getting error mouseover event  is not found, so added event as first parameter

  circles.exit().remove();

  // add labels to axes
  !isBrush &&
    svg
      .selectAll(".x-axis-label")
      .data([1])
      .join("text")
      .attr("class", "x-axis-label")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        `translate(${width / 2 + margin.left}, ${height + margin.top + 30})`,
      )
      .text("Life Expectancy");

  !isBrush &&
    svg
      .selectAll(".y-axis-label")
      .data([1])
      .join("text")
      .attr("class", "y-axis-label")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        `translate(${margin.left - 30}, ${height / 2 + margin.top}) rotate(-90)`,
      )
      .text("GDP per Capita(log scale)");

  if (!countrySelected && !window.continentSelected && !window.startBound) {
    !isBrush && addAnnotations();
  } else {
    d3.select("svg").selectAll(".annotation-group").remove();
  }

  const continents = [...new Set(window.data.map((z) => z.continent))];
  const legends = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width + 20}, 250)`);

  const legendItems = legends
    .selectAll(".legend-item")
    .data(continents)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legendItems
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", (d) => colorScale(d));

  legendItems
    .append("text")
    .attr("x", 18)
    .attr("y", 10)
    .text((d) => d)
    .attr("style", "cursor: pointer;")
    .attr("fill", (d) => colorScale(d))
    .attr("class", (d) =>
      window.continentSelected === d ? "opacity-1" : "opacity-5",
    )
    .on("click", function (e) {
      delete window.startBound;
      delete window.endBound;
      legendItems.selectAll("text").classed("opacity-1 opacity-5", false);
      if (window.continentSelected === e.target.textContent) {
        window.continentSelected = undefined;
      } else {
        window.continentSelected =
          e.target.textContent === "all" ? undefined : e.target.textContent;
      }
      changeState();
      // e.target.
      // e.target.classList.add("bkg-selected");
    });

  if (isBrush) {
    const brush = d3.brushX().extent([
      [0, 0],
      [width + margin.left + margin.right, height + margin.top + margin.bottom],
    ]);
    const brushGroup = chartGroup.append("g").call(
      brush.on("end", async function (event) {
        const extent = event.selection;
        if (!event.sourceEvent) return;
        if (!extent) {
          delete window.startBound;
          delete window.endBound;
          const target = event.target;
          console.log(event.target.move);
          d3.select(this).call(target.move, [0, width]);
          // if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
          // xScale.domain([4, 8]);
        } else {
          const [start, end] = extent;
          console.log(start, end);
          console.log(xScale.domain());
          console.log(xScale.range());
          window.startBound = xScale.invert(start);
          window.endBound = xScale.invert(end);
          // await
        }
        d3.select("#container").select("svg").remove();
        await new Promise((resolve) => setTimeout(resolve, 200));
        createSvgMain();
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
      }),
    );
    brushGroup.call(brush.move, [0, width]);
  }
};
