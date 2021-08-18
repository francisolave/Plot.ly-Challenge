//need to get json data from samples.json
d3.json("./static/data/samples.json").then((importedData) => {
  var data = importedData;

  //need to get required variables 
  var participant_ids = data.metadata.map((row) => row.id);
  var ethnicities = data.metadata.map((row) => row.ethnicity);
  var genders = data.metadata.map((row) => row.gender);
  var ages = data.metadata.map((row) => row.age);
  var locations = data.metadata.map((row) => row.location);
  var bbtypes = data.metadata.map((row) => row.bbtype);
  var wfrequencies = data.metadata.map((row) => row.wfreq);

  var otuIDs = data.samples.map((row) => row.otu_ids);
  var sampleValues = data.samples.map((row) => row.sample_values);
  var otuLabels = data.samples.map((row) => row.otu_labels);

  //dropdown menu using d3
  d3.select("#dropdown")
    .selectAll("option")
    .data(participant_ids)
    .enter()
    .append("option")
    .text(function (id) {
      return id;
    });

  //initialize the page
  filterViz();

  //create listener for changes to dropdown menu
  var dropdownMenu = d3.selectAll("#dropdown");
  dropdownMenu.on("change", filterViz);

  //create function
  function filterViz() {

    //want to prevent the deafult from happening  
    if (d3.event != null) {
      d3.event.preventDefault();
    }

    //get user selection from dropdown, extract index number from array of IDs
    userSelect = d3.select('#dropdown option:checked').text();
    for (var i = 0; i < participant_ids.length; i++) {
      if (parseInt(userSelect) === parseInt(participant_ids[i]))
        var selectIndex = i;
    }

    //populate panel data 
    d3.select("#sample-metadata")
      .selectAll("p")
      .remove();
    d3.select("#sample-metadata")
      .append("p")
      .text(`Participant Ethnicity: ${ethnicities[selectIndex]}`)
      .append("p")
      .text(`Participant Gender: ${genders[selectIndex]}`)
      .append("p")
      .text(`Participant Age: ${ages[selectIndex]}`)
      .append("p")
      .text(`Participant Location: ${locations[selectIndex]}`)
      .append("p")
      .text(`Participant Navel Type: ${bbtypes[selectIndex]}`)
      .append("p")
      .text(`Participant Navel Wash Frequency: ${wfrequencies[selectIndex]}`);

    //create bar chart
    //isolate top 10 OTUs
    Top10otuIDs = otuIDs[selectIndex].slice(0, 10);
    Top10sampleValues = sampleValues[selectIndex].slice(0, 10);
    Top10otuLabels = otuLabels[selectIndex].slice(0, 10);

    //create ID labels with OTU preceding ID
    Top10otuIDs = Top10otuIDs.map(d => "OTU" + String(d));

    //create data and layout for horizontal bar chart 
    var barTrace = {
      y: Top10otuIDs,
      x: Top10sampleValues,
      text: Top10otuLabels,
      type: "bar",
      orientation: "h",
      marker: { color: "rgba(224, 202, 223, 0.97)" }
    };

    var barData = [barTrace];

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {title: "Operational Taxonomic Unit ID"},
      xaxis: {title: "Number of Bacteria Cultures Present"}
    };

    //plot to bar tag id
    Plotly.newPlot("bar", barData, barLayout);

    //create bubble chart
    //attach OTU label to IDs
    otuIDs[selectIndex] = otuIDs[selectIndex].map(d => "OTU" + String(d));

    //list of random colors
    colorArray = [];

    //populate color array
    for (var i = 0; i < sampleValues[selectIndex].length; i++) {
      colorArray.push("rgb(" + String(Math.floor(Math.random() * 255) + 1) + "," + String(Math.floor(Math.random() * 255) + 1) + ","
                       + String(Math.floor(Math.random() * 255) + 1) + ")");
    }

    //reverse order to ascending right
    otuIDs[selectIndex] = otuIDs[selectIndex].reverse();
    sampleValues[selectIndex] = sampleValues[selectIndex].reverse(); 
    otuLabels[selectIndex] = otuLabels[selectIndex].reverse();

    //create data and layout for bubble chart 
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

    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
      title: "Belly Button Biodiversity",
      showlegend: false,
      height: 600,
      width: 1000,
      xaxis: {title: "Operational Taxonomic Unit ID"},
      yaxis: {title: "Number of Bacteria Cultures Present"}  
    };

    //plot to bubble tag id
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

  }

});