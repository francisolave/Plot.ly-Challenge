// Step1 Use the D3 library to read in `samples.json`.
function buildCharts(sample){

//Step 2 Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
d3.json("StarterCode/samples.json").then((importedData) => {
var data = importedData.metadata;

  // create array variables 
  var participant_ids = data.filter((row) => row.id === sample);
  var ethnicities = data.map((row) => row.ethnicitie);
  var genders = data.map((row) => row.gender);
  var ages = data.map((row) => row.age);
  var locations = data.map((row) => row.location);
  var bbtypes = data.map((row) => row.bbtype);
  var wfrequencies = data.map((row) => row.wfreq);

var selection = d3.select("#sample-metadata")
  Object.entries(participant_ids[0]).forEach(([key, value]) => { // stars forloop
    selection.append("h6").text(`${key}: ${value}`) 

  });
});
  
d3.json("StarterCode/samples.json").then((importedData) => {
  var sampleData = importedData.samples;
  var sampleValues = sampleData.map((row) => row.sample_values); 
  var otuIDs = sampleData.map((row) => row.otu_ids);
  var otuLabels = sampleData.map((row) => row.otu_labels);

  // dropdown menu using d3, 
  //filter data to start page, 
  // create listener to changes to dropdown menu, to connect to filter the function
  // filter the funtion 
  d3.select("#dropdown")
    .selectAll("option")
    .data(participant_ids)
    .enter()
    .append("option")
    .text(function(id) {
      return id;
    });

  var dropdownMenu = d3.selectAll("#dropdown");
  dropdownMenu.on("change", filter)

  function filterViz() {
     
  // need to slice out top 10 OTUs info
  // need to create ID labels with OTU following ID
  // create trace and layout for bar chart 
  Top10samepleValues = sampleValues[selectIndex].slice(0, 10);
  Top10otuIDs = otuIDs[selectIndex].slice(0, 10);
  Top10otuLabels = otuLabels[selectIndex].slice(0, 10);

  Top10otuIDs = Top10otuIDs.map(d => "OTU" + String(d));

  var barTrace = {
    x: Top10samepleValues,
    y: Top10otuIDs,
    text: Top10otuLabels,
    type: "bar",
    orientation: "h",
    marker: { color: "rgba(173, 244, 92, 0.69)" }
  };

  var barData = [barTrace];

  var barLayout = {
    title: " Biodiversitu of the Top 10 Bacteria Cultures",
    xaxis: "The Number of Bacteria Cultures Display",
    yaxis: "Taxonomic Unit ID"
  };

  // create plot with plotly     
  Plotly.netPlot("bar", barData, barlayout);

// 3.Create a bubble chart that displays each sample.
  // Need to attach OTU label to IDs
  otuIDs[selectIndex] = otuIDs[selectIndex].map(d => "OTU" + String(d));

  colorArray = [];

  for (var i = 0; i < sampleValues[selectIndex].length; i++) {
    colorArray.push("rgb(" + String(Math.floor(Math.random() * 255) + 1) + "," + String(Math.floor(Math.random() * 255) + 1) + ","
                      + String(Math.floor(Math.random() * 255) + 1) + ")");
  }

  // need to reverse the order of magnitude to ascending
  sampleValues[selectIndex] = sampleValues[selectIndex].reverse();
  otuIDs[selectIndex] = otuIDs[selectIndex].reverse();
  otuLabels[selectIndex] = otuLabels[selectIndex].reverse();

  // create trace and layout for bubble chart
  var bubbleTrace = {
    x: otuIDs[selectIndex],
    y: sampleValues[selectIndex],
    text: otuLabels[selectIndex],
    mode: 'markers',
    marker: {
      color: colorArray,
      size: sampleValues[selectIndex]
    }
  };

  var bubbleData = [bubbleTrace]

  var bubbleLayout = {
    title: "Biodiversity of Bacteria Cultures",
    showlegend: false,
    height: 600,
    width: 1000,
    xaxis: "The Number of Bacteria Cultures Display",
    yaxis: "Taxonomic Unit ID",
  };
  
  // create plot for plotly
  Plotly.netPlot("bubble", bubbleData, bubbleLayout);
  }});
}
function init(){
  var dropDown = d3.select("#selDataset");
  d3.json("StarterCode/samples.json").then((importedData) => {
  var nameData = importedData.names;
  nameData.forEach((sample) => {
  dropDown.append("option")
          .text(sample)
          .property("value", sample)
  });
  var firstSample = nameData[0]
  buildCharts(firstSample)
  
  });
}
init(); 