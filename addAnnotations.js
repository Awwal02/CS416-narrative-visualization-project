const addAnnotations = () => {
  if (window.filteredData.length < 10) return;
  const maxLifeExp = d3.max(window.filteredData, (d) => +d.lifeExp);
  const minLifeExp = d3.min(window.filteredData, (d) => +d.lifeExp);
  const maxLifeExpData = window.filteredData.filter(
    (d) => +d.lifeExp === maxLifeExp,
  )[0];
  const width =
    parseInt(window.container.style("width")) - margin.left - margin.right;
  const height =
    parseInt(window.container.style("height")) - margin.top - margin.bottom;
  const minLifeExpData = window.filteredData.filter(
    (d) => +d.lifeExp === minLifeExp,
  )[0];

  //   console.log(maxLifeExpData, minLifeExpData);

  const maxGdpPercap = d3.max(window.filteredData, (d) => +d.gdpPercap);
  const minGdpPercap = d3.min(window.filteredData, (d) => +d.gdpPercap);
  const maxGdpPercapData = window.filteredData.filter(
    (d) => +d.gdpPercap === maxGdpPercap,
  )[0];
  const minGdpPercapData = window.filteredData.filter(
    (d) => +d.gdpPercap === minGdpPercap,
  )[0];

  console.log(maxGdpPercapData, minGdpPercapData);
  const annotations = [
    // {
    //   note: {
    //     title: `1. Circle size signifies population`,
    //     wrap: 200,
    //   },
    //   x: 200,
    //   y: 0,
    //   dx: 0,
    //   color: ["#064a16"],
    //   dy: 0,
    //   width: 200,
    //   height: 200,
    //   // type: d3.annotationCalloutRect,
    //   // padding: -height / 2,
    //   wrap: 1000,
    //   padding: 20,
    //   // type: d3.,
    //   subject: {
    //     radius: 0, // Size of the highlight circle
    //     radiusPadding: 0, // Space between circle and data point
    //   },
    // },
    {
      note: {
        title:
          "Higher GDP per capita is associated with longer life expectancy",
      },
      x: window.xScale(+maxLifeExpData.lifeExp),
      y: window.yScale(+maxLifeExpData.gdpPercap),
      dx: 0,
      color: ["#064a16"],
      dy: 200,
      // padding: -height / 2,
      // wrap: 10,
      type: d3.annotationCalloutCircle,
      subject: {
        radius: 60, // Size of the highlight circle
        radiusPadding: 5, // Space between circle and data point
      },
    },
    {
      note: {
        title:
          "Many Africans and Asian nations with low GDP and life expectancy",
      },
      x: window.xScale(+minGdpPercapData.lifeExp),
      y: window.yScale(+minGdpPercapData.gdpPercap),
      dx: 0,
      color: ["#800404"],
      dy: -300,
      // padding: -height / 2,
      // wrap: 10,
      type: d3.annotationCalloutCircle,
      subject: {
        radius: 100, // Size of the highlight circle
        radiusPadding: 5, // Space between circle and data point
      },
    },
    // {
    //   note: {
    //     title: "Lower GDP per capita is associated with Lower life expectancy",
    //     label: `Cluster of `,
    //   },
    //   x: window.xScale(+minLifeExpData.lifeExp),
    //   y: window.yScale(+minLifeExpData.gdpPercap),
    //   dx: -100,
    //   color: ["#3ce764"],
    //   dy: 0,
    //   padding: 10,
    //   // wrap: 10,
    //   type: d3.annotationCalloutCircle,
    //   subject: {
    //     radius: 100, // Size of the highlight circle
    //     radiusPadding: 5, // Space between circle and data point
    //   },
    // },

    {
      note: {
        title: "Max Life Expectancy",
        label: `${maxLifeExpData.country}`,
      },
      x: window.xScale(+maxLifeExpData.lifeExp),
      y: window.yScale(+maxLifeExpData.gdpPercap),
      dx: 100,
      color: ["#3ce764"],
      dy: 0,
      wrap: 10,
      width: 10,
      type: d3.annotationCalloutCircle,
      subject: {
        radius: Math.sqrt(+maxLifeExpData.pop) / 1000 + 5, // Size of the highlight circle
        radiusPadding: 5, // Space between circle and data point
      },
    },
    {
      note: {
        title: "Min Life Expectancy",
        label: `${minLifeExpData.country}`,
      },
      x: window.xScale(+minLifeExpData.lifeExp),
      y: window.yScale(+minLifeExpData.gdpPercap),
      dx: -30,
      color: ["#e73c3c"],
      dy: 0,
      wrap: 10,
      type: d3.annotationCalloutCircle,
      subject: {
        radius: Math.sqrt(+minLifeExpData.pop) / 1000 + 5, // Size of the highlight circle
        radiusPadding: 5, // Space between circle and data point
      },
    },
    {
      note: {
        title: "Max GDP per Capita",
        label: `${maxGdpPercapData.country}`,
      },
      x: window.xScale(+maxGdpPercapData.lifeExp),
      y: window.yScale(+maxGdpPercapData.gdpPercap),
      dx: 100,
      color: ["#3ce764"],
      dy: 0,
      wrap: 10,
      type: d3.annotationCalloutCircle,
      subject: {
        radius: Math.sqrt(+maxGdpPercapData.pop) / 1000 + 5, // Size of the highlight circle
        radiusPadding: 5, // Space between circle and data point
      },
    },
    {
      note: {
        title: "Min GDP per Capita",
        label: `${minGdpPercapData.country}`,
      },
      x: window.xScale(+minGdpPercapData.lifeExp),
      y: window.yScale(+minGdpPercapData.gdpPercap),
      dx: -100,
      color: ["#e73c3c"],
      dy: 0,
      wrap: 10,
      type: d3.annotationCalloutCircle,
      subject: {
        radius: Math.sqrt(+minGdpPercapData.pop) / 1000 + 5, // Size of the highlight circle
        radiusPadding: 5, // Space between circle and data point
      },
    },
  ];

  d3.select("svg").selectAll(".annotation-group").remove();

  const makeAnnotations = d3
    .annotation()
    // .textWrap(50)
    .annotations(annotations)
    .type(d3.annotationLabel);

  window.chartGroup
    .append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations);

  console.log("annotations added");
};
