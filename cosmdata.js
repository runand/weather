/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function winddirection(value) {
//  DirTable = ["N","NNE","NE","ENE","E","ESE", "SE","SSE","S","SSW","SW","WSW", "W","WNW","NW","NNW","N"];
  DirTable = ["N","NNØ","NØ","ØNØ","Ø","ØSØ", "SØ","SSØ","S","SSV","SV","VSV", "V","VNV","NV","NNV","N"];
  return DirTable[Math.floor((parseFloat(value)+11.25)/22.5)];
}

$(document).ready(function(){
  key = {'key' : 'o5SuhRYID45Pko9SN2qtlVNVuN6SAKxVOHVSdWoxcFZYND0g'}
  $.getJSON("http://api.cosm.com/v2/feeds/44233.json", key, function (data) {
    var config = {
      "T0" : {'div' : 'indoortemp'},
      "H0" : {'div' : 'indoorhumid'},
      "T1" : {'div' : 'outdoortemp'},
      "H1" : {'div' : 'outdoorhumid'},
      "PRES" : {'div' : 'pressure'},
      "TC" : {'div' : 'windtemp'},
      "WD" : {'div' : 'winddirection', 'themefunction' : winddirection},
      "WG" : {'div' : 'windgust'},
      "WS" : {'div' : 'windspeed'}
    }
    $.each(eval(data.datastreams), function(){
      if (config[this.id] !== undefined) {
        divhtml = '<span class="head">' + this.tags[0] + '</span>';
        if (config[this.id].themefunction !== undefined) {
          divhtml += config[this.id].themefunction(this.current_value)
        }
        else {
          divhtml += this.current_value + ' ' + this.unit.label;
        }
          $('#' + [config[this.id].div]).html(divhtml);
      }
    })
  });
});