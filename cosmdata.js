/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function winddirection(value) {
//  DirTable = ["N","NNE","NE","ENE","E","ESE", "SE","SSE","S","SSW","SW","WSW", "W","WNW","NW","NNW","N"];
  DirTable = ["N","NNØ","NØ","ØNØ","Ø","ØSØ", "SØ","SSØ","S","SSV","SV","VSV", "V","VNV","NV","NNV","N"];
  return DirTable[Math.floor((parseFloat(value.current_value)+11.25)/22.5)];
}

function raincount(value, hour, interval) {
  value.datapoints.reverse()

  current_value = parseFloat(value.current_value)

  output = ''
  if (value.datapoints[2]) {
    hour = current_value - parseFloat(value.datapoints[2].value)
    output = rainvaluewrapper(hour.toFixed(1), '1 time', value)
  }
  if (value.datapoints[12]) {
    sixhours = current_value - parseFloat(value.datapoints[12].value)
    output += rainvaluewrapper(sixhours.toFixed(1), '6 timer', value)
  }
  if (value.datapoints[24]) {
    twelvehours = current_value - parseFloat(value.datapoints[24].value)
    output += rainvaluewrapper(twelvehours.toFixed(1), '12 timer', value)
  }
  if (value.datapoints[47]) {
    day = current_value - parseFloat(value.datapoints[47].value)  
    output += rainvaluewrapper(day.toFixed(1), '1 døgn', value)
  }

  return output 
}

function rainvaluewrapper(value, text, config) {
  return '<div>' + value + '<span class="label">' + text + '</span></div>'
}
function cosmRainCallback(data) {
  data.datapoints.reverse()
  interval = 86400;
  daycount = 0;
  count = 0;

  var today = new Date();
  var firstofcurrent = new Date( today.getUTCFullYear(), today.getUTCMonth(), 1 ).getTime();

    $.each(data.datapoints, function(){
      
    if (parseFloat(data.current_value) <= parseFloat(this.value)) {
      daycount ++
    }

    if (firstofcurrent/1000 < ((today.getTime() / 1000) - count * interval)) {
      count ++
    }

  })

  monthrain = data.current_value - data.datapoints[count - 1].value
  $('#rain').append('<div>' + monthrain + '<span class="label">Denne måned</span></div>')
  $('#daysnorain').html('<div><span class="head">Dage uden regn</span>' + daycount + '</div>')
  
}

function cosmDataCallback(data) {
  hour = 24
  interval = 1800
  var config = {
    "T0" : {'div' : 'indoortemp', 'plot' : true, 'axis' : 1},
    "H0" : {'div' : 'indoorhumid'},
    "T1" : {'div' : 'outdoortemp', 'plot' : true, 'axis' : 1},
    "H1" : {'div' : 'outdoorhumid'},
    "PRES" : {'div' : 'pressure', 'plot' : true, 'axis' : 2},
    "TC" : {'div' : 'windtemp'},
    "WD" : {'div' : 'winddirection', 'themefunction' : winddirection, 'minmax' : false},
    "RC" : {'div' : 'rain', 'themefunction' : raincount, 'minmax' : false},
    "WG" : {'div' : 'windgust'},
    "WS" : {'div' : 'windspeed'}
  }
  
   var plots = new Array();
  
  $.each(data.datastreams, function(key){
  if (config[this.id] !== undefined) {
    var min
    var max
    var dataarray = new Array();
    var timestamp = new Date();
    if (this.datapoints !== undefined) {
      length = this.datapoints.length
      $.each(this.datapoints, function(key){
        current_value = parseFloat(this.value)
        time = (timestamp.getTime()) - ((length-key)*interval*1000) - timestamp.getTimezoneOffset() * 60 * 1000 ;

        dataarray.push([time, current_value])
        if (min === undefined || current_value < min) {
          min = current_value
        }
        if (max === undefined || current_value > max) {
          max = current_value
        }
      });
    }
    
    if (config[this.id].plot == true) {
      plots.push({label: this.tags[0], unit: this.unit.label, data: dataarray, yaxis : config[this.id].axis})
    }
    
    if (this.current_value < min) {
      min = this.current_value;
    } 
    if (this.current_value > max) {
      max = this.current_value;
    } 

    divhtml = '<span class="head">' + this.tags[0] + '</span>';
    if (config[this.id].themefunction !== undefined) {
      divhtml += config[this.id].themefunction(this, hour, interval)
    }
    else {
      divhtml += this.current_value + ' ' + this.unit.label;
    }

    if (config[this.id].minmax !== false) {
      minmax = '<span class="minmax">Min: ' + min + this.unit.label + ' - Max: ' + max + this.unit.label + '</span>'  
    }
    else {
      minmax = ''
    }

    $('#' + [config[this.id].div]).html(divhtml + minmax);
  }
  })         
  
  var options = {
    xaxis: {
      mode: 'time'
    },
    yaxes: [
      {
        // align if we are to the right
        alignTicksWithAxis: 0,
        position: 'right'
        
      } ],
    legend: { position: 'nw' }
  };
  
  $.plot($("#placeholder"), plots, options);
}
