/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function winddirection(value) {
//  DirTable = ["N","NNE","NE","ENE","E","ESE", "SE","SSE","S","SSW","SW","WSW", "W","WNW","NW","NNW","N"];
  DirTable = ["N","NNØ","NØ","ØNØ","Ø","ØSØ", "SØ","SSØ","S","SSV","SV","VSV", "V","VNV","NV","NNV","N"];
  return DirTable[Math.floor((parseFloat(value.current_value)+11.25)/22.5)];
}

function raincount(value) {
  current_value = parseFloat(value.current_value)
  console.log(value)
  array_offset = 24
  hour = parseFloat(value.datapoints[array_offset - 1].value) - current_value
  sixhours = parseFloat(value.datapoints[array_offset - 6].value) - current_value
  twelvehours = parseFloat(value.datapoints[array_offset - 12].value) - current_value
  day = parseFloat(value.datapoints[array_offset - 24].value) - current_value

  output = rainvaluewrapper(hour, '1 time', value)
  output += rainvaluewrapper(sixhours, '6 timer', value)
  output += rainvaluewrapper(twelvehours, '12 timer', value)
  output += rainvaluewrapper(day, '1 døgn', value)

  return output 
}

function rainvaluewrapper(value, text, config) {
  return '<div>' + value + config.unit.label + '<span class="label">' + text + '</span></div>'
}

$(document).ready(function(){
  key = {'key' : 'o5SuhRYID45Pko9SN2qtlVNVuN6SAKxVOHVSdWoxcFZYND0g'}
  $.getJSON("http://api.cosm.com/v2/feeds/44233.json?duration=24hour&interval=3600&per_page=1000", key, function (data) {
    var config = {
      "T0" : {'div' : 'indoortemp'},
      "H0" : {'div' : 'indoorhumid'},
      "T1" : {'div' : 'outdoortemp'},
      "H1" : {'div' : 'outdoorhumid'},
      "PRES" : {'div' : 'pressure'},
      "TC" : {'div' : 'windtemp'},
      "WD" : {'div' : 'winddirection', 'themefunction' : winddirection, 'minmax' : false},
      "RC" : {'div' : 'rain', 'themefunction' : raincount, 'minmax' : false},
      "WG" : {'div' : 'windgust'},
      "WS" : {'div' : 'windspeed'}
    }
    $.each(data.datastreams, function(){
      if (config[this.id] !== undefined) {
        var min
        var max
        $.each(this.datapoints, function(){
          current_value = parseFloat(this.value)
          if (min === undefined || current_value < min) {
            min = current_value
          }
          if (max === undefined || current_value > max) {
            max = current_value
          }
        });

        if (this.current_value < min) {
          min = this.current_value;
        } 
        if (this.current_value > max) {
          max = this.current_value;
        } 

        divhtml = '<span class="head">' + this.tags[0] + '</span>';
        if (config[this.id].themefunction !== undefined) {
          divhtml += config[this.id].themefunction(this)
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
  });
});