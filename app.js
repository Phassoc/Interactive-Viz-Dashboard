// Function for plotting (Bar, bubble and an optional guage chart).

function getPlot(id) {
    
    d3.json("samples.json").then((data)=> {
        console.log(data)
        
        // filter sample values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        var metadata = data.metadata.filter(s => s.id.toString() === id)[0];
        
        console.log(samples);
        var wfreq = metadata.wfreq
        console.log(wfreq);

        // get top 10 otu ids for the plot OTU and reverse it and get the otu id's to the desired form for the plot 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        var OTU_id = OTU_top.map(d => "OTU " + d);
   
        // get the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);
  
        // trace  for the bar plot
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(142,124,195)'},
            type:"bar",
            orientation: "h",
        };
  
        // define data variable
        var data = [trace];
  
        // define layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
        // create the bar plot
        Plotly.newPlot("bar", data, layout);
      
        // The bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };
        
        var layout_b = {
            hovermode: "closest",
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
        // data variable 
        var data1 = [trace1];

        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout_b); 
  
        // The guage chart
        var guage_data = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Washing Frequency <br>Scrubs per Week`},
          type: "indicator", 
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                    bar: {color: "white"},
                   steps: [
                    { range: [0, 1], color: "yellow" },
                    { range: [1, 2], color: "orange" },
                    { range: [2, 3], color: "teal" },
                    { range: [3, 4], color: "lime" },
                    { range: [4, 5], color: "green" },
                    { range: [5, 6], color: "red" },
                    { range: [6, 7], color: "blue" },
                    { range: [7, 8], color: "grey" },
                    { range: [8, 9], color: "purple" }
                  ]}       
          }];
        var layout_g = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", guage_data, layout_g);
      });
  }  

// function to get required data
function getInfo(id) {
    // read the json file to get data
    d3.json("samples.json").then((data)=> {
        
        // get the metadata info for the demographic panel
        var metadata = data.metadata;
        console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // get demographic data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();