function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("../data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("../data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("../data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var newSample = samples.filter(obj => obj.id == sample)
    //  5. Create a variable that holds the first sample in the array.
    var resultSample = newSample[0];
    console.log(newSample)
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = resultSample.otu_ids
    var labels = resultSample.otu_labels
    var values = resultSample.sample_values
    console.log(otuIds)
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks = otuIds.slice(0, 10).map((otuIds) => (`OTU ${otuIds}`)).reverse()
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: values.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      text: labels.slice(0,10).reverse()
    }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {
        text: "Top 10 Bacteria Cultures Found",
        font: { 
          size: 15,
          color: "#ffffff"
        },
      },
      paper_bgcolor: "#000000",
      plot_bgcolor: "#000000",
      font: {color: "#ffffff"} ,
      xaxis: {gridcolor: "#808080"},
      yaxis: {gridcolor: "#808080"},
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)


    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: values,
      mode: "markers",
      marker: {
        size: values,
        color: otuIds,
        colorscale: "Rainbow" 
      },
      text: labels
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Culters per Sample",
      hovermode: 'closest',
      xaxis: {title: "OTU ID", gridcolor: "#808080"},
      yaxis: {gridcolor: "#808080"},
      paper_bgcolor: "#000000",
      plot_bgcolor: "#000000",
      font: {color: "#ffffff"},
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    
    // 4. Create the trace for the gauge chart.

    var metadata = data.metadata;
    var results2Sample = metadata.filter(obj => obj.id == sample)
    var results2 = results2Sample[0];
    var washFrequency = results2.wfreq;
    console.log(washFrequency)

    var gaugeData = [{
      value: washFrequency,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
      gauge: {
        axis: { range: [0, 10], tickwidth: 2, tickcolor: "white" },
        bar: { color: "white" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      paper_bgcolor: "#000000",
      plot_bgcolor: "#000000",
      font: {color: "#ffffff"},
      width: 500,
      height: 425,
      margin: { t: 0, b: 0 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });

 
}

