var sthings;
var SimpleThings = Class.create();

SimpleThings.prototype = {

  initialize: function() {
    this.lastdate = "";
    this.lastpost = "";
    this.timeoffset = Math.round(new Date().getTime() / 1000);
    this.nextClassName = 'rowcolor0';
    this.autorefresh = true;
  },

  update: function() {
    var rows = document.getElementsByClassName("sthingsrow");
    var measure;
    var date2 = Math.round(new Date().getTime() / 1000);
    for (var i=(rows.length-1); i>=0;i--) {
      var rid = rows[i].id;
      rid = rid.replace(/sthingsrow/, '');
      
      $('sthingsdiff' + rid).style.display = 'none';
      $('sthingsdate' + rid).style.display = 'none';

      if ($('sthingsdate' + rid).innerHTML > this.lastdate) {
        this.lastdate = $('sthingsdate' + rid).innerHTML;
      }

      this.lastpost = Math.max(this.lastpost, rid);
      var diff = Math.round(date2 - this.timeoffset + parseInt($('sthingsdiff' + rid).innerHTML));
      measure = 'sec. ago, ';
      if (diff > 60) {
        measure = 'min. ago, ';
        diff = parseInt(diff/60);
      }
      if (diff > 60) {
        measure = 'hrs. ago, ';
        diff = parseInt(diff/60);
        if (diff > 24) {
          measure = "";
          diff = $('sthingsdate' + rid).innerHTML;
          diff = diff.replace(/\w+,\s+?/i, '');
          diff = diff.replace(/\s+?\+\d+\s+?/, '');
        }
      }

      $('sthingsago' + rid).innerHTML = diff + '&nbsp;' + measure + ' ';

      var hasClassName = false;
      if (Element.hasClassName($('sthingsrow' + rid), 'rowcolor0')) {
        this.nextClassName = 'rowcolor1';
        hasClassName = true;
      }
      if (Element.hasClassName($('sthingsrow' + rid), 'rowcolor1')) {
        this.nextClassName = 'rowcolor0';
        hasClassName = true;
      }
      if (hasClassName == false) {
        Element.addClassName($('sthingsrow' + rid), this.nextClassName);
        if (this.nextClassName == 'rowcolor0') {
          this.nextClassName = 'rowcolor1';
        } else {
          this.nextClassName = 'rowcolor0';
        }
        var oldColor = Element.getStyle($('sthingsrow' + rid), 'backgroundColor')
        doBGFade($('sthingsrow' + rid),[192,192,205],[245,245,245],oldColor,20,20,1);
      }
    }
  },
  
  refresh: function() {
    if (this.autorefresh && $('simplethingsactual')) {
      this.findlast();
      this.getdata();
      this.update();
    }
    setTimeout("sthings.refresh()", 180000);
  },

  removeoldest: function() {
    var rows = document.getElementsByClassName("sthingsrow");
    if (rows.length >= 10) {
      var rowid = this.findfirst();
      var row = $('sthingsrow' + rowid);
      if (row) {
        var oldColor = Element.getStyle($(row), 'backgroundColor')
        doBGFade($(row),[192,192,205],[245,245,245],oldColor,20,20,1);
        row.parentNode.removeChild(row);
      }
    }
  },

  findlast: function() {
    var rows = document.getElementsByClassName("sthingsrow");
    for (var i=0; i<rows.length;i++) {
      var rid = rows[i].id;
      rid = rid.replace(/sthingsrow/, '');
      if ($('sthingsdate' + rid).innerHTML > this.lastdate) {
        this.lastdate = $('sthingsdate' + rid).innerHTML;
      }
      this.lastpost = Math.max(this.lastpost, rid);
    }
  },

  findfirst: function() {
    var firstpost;
    var rows = document.getElementsByClassName("sthingsrow");
    for (var i=0; i<rows.length;i++) {
      var rid = rows[i].id;
      rid = rid.replace(/sthingsrow/, '');
      if ((rid < this.lastpost) || (!this.lastpost)) {
        firstpost = rid;
      }
      firstpost = Math.min(firstpost, rid);
    }
    return firstpost;
  },

  add: function(val) {
    var line = '';
    line += '<tr id="sthingsrow' + val['id'] + '" class="sthingsrow">';
    line += '';
    line += '<td valign=top align=left charset=utf8>';
    line += '<p style="margin: 4px;">';
    line += '<span style="font-size:10px;color:#666666;">';
    line += '<span id="sthingsago' + val['id'] + '"></span> ';
    line += ' ';
    line += ' ' + val['channel'] + ' ';
    line += '</span><br>';
    line += '<b>' + val['username'] + '</b>, ' + val['text'] + ' ';
    line += '<span id="sthingsdate' + val['id'] + '">' + val['pubdate'] + '</span>';
    line += '<span id="sthingsdiff' + val['id'] + '" class="sthingsdiff">' + val['timediff'] + '</span>';
    line += '</p>';
    line += '</td></tr>';
    new Insertion.Before($('sthingsrow' + this.lastpost), line);
  },

  loader: function(fdate, tdate, start) {
    timestamp = new Date();
    var pars = "";
    pars += 'action=static';
    pars += '&fdate=' + encodeURIComponent(fdate);
    pars += '&tdate=' + encodeURIComponent(tdate);
    pars += '&start=' + start;
    pars += '&t=' + timestamp.getTime();
    Container = $('sthingscontainer');
    url = "http://" + window.location.hostname + "/talk.php";
    var myAjax = new Ajax.Updater(
      {success: Container}, 
      url, 
      {
        method: 'get', 
        parameters: pars,
        onSuccess: function(resp) {
          //sthings.update();
        },
        onComplete: function(resp) {
          sthings.update();
          if (start > 0) {
            sthings.autorefresh = false;
          } else {
            sthings.autorefresh = true;
          }
        },
        evalScripts: true
//        onFailure: reportError
      }
    );
/*
    new Ajax.Request("http://" + window.location.hostname + "/talk.php", {
      onSuccess : function(resp) {
        sthings.parserss(resp.responseText);
      },
      onFailure : function(resp) {
        alert("Oops, there's been an error." + resp.responseText);
      },
      method: 'get',
      parameters : pars
    });
*/
  },

  getdata: function() {
    timestamp = new Date();
    var pars = "";
    pars += 'action=refresh';
    pars += '&lastpost=' + encodeURIComponent(this.lastpost);
    pars += '&t=' + timestamp.getTime();
    new Ajax.Request("http://" + window.location.hostname + "/talk.php", {
      onSuccess : function(resp) {
        sthings.parserss(resp.responseText);
      },
      onFailure : function(resp) {
        alert("Oops, there's been an error." + resp.responseText);
      },
      method: 'get',
      parameters : pars
    });
  },

  parserss: function(xml) {
    var xmldoc = parsexml(xml);
    var channel = xmldoc.getElementsByTagName('channel').item(0);
    if (channel) {
      var items = channel.getElementsByTagName('item');
      for (var i=0; items.length>i;i++) {
        var item = items[i];
        var values = this.parseitem(item);
        var date2 = Math.round(new Date().getTime() / 1000);
        var offset = Math.round(date2 - this.timeoffset);
        values['timediff'] = values['timediff'] - offset;
        this.removeoldest();
        this.add(values);
      }
      this.findlast();
      this.update();
    }
  },

  parseitem: function(item) {
    var val = new Array();
    val['id'] = this.parseelement(item, 'id');
    val['channel'] = this.parseelement(item, 'channel');
    val['pubdate'] = this.parseelement(item, 'pubDate');
    val['timediff'] = this.parseelement(item, 'timediff');
    val['userid'] = this.parseelement(item, 'userid');
    val['username'] = this.parseelement(item, 'username');
    val['text'] = this.parseelement(item, 'text');
    return val;
  },

  parseelement: function(item, name) {
    var elem = item.getElementsByTagName(name);
    if (elem.item(0)) {
      if (elem.item(0).firstChild) {
        return elem.item(0).firstChild.data;
      }
    }
    return '';
  }
};

Loader = function(Container, path, myParam) {
  timestamp = new Date();
  var url = 'http://' + window.location.hostname + '/' + path;
  var pars = myParam + '&t=' + timestamp.getTime();
  var myAjax = new Ajax.Updater(
    {
      success: Container
    }, 
    url,
    {
      method: 'get', 
      parameters: pars, 
      onSuccess: doSuccess,
      onComplete: reportComplete,
      onFailure: reportError
    }
  );
};

sendsmtext = function() {
  var pars = "";
  pars += 'action=new';
  pars += '&text=' + encodeURIComponent($('text').value);
  pars += '&username=' + encodeURIComponent($('username').value);
  Loader($('container'), '/talk.php', pars);
  $('text').value = "";
  $('username').value = "";
//  location.reload();
  return false;
//  return true;
}

sthings_popup = function() {
  var url = "http://" + window.location.hostname + "/talk.php?popup=1";
  var options = '';
  options += 'width=360,';
  options += 'height=640,';
  options += 'resizable=yes,';
  options += 'scrollbars=yes';
  options += '';
  window.open(url, '_simplethings_', options);
}

LoadSimpleThings = function() {
  if ($("SimpleThingsLoaded")) {
    sthings = new SimpleThings();
    sthings.update();
    sthings.refresh();
  } else {
    if (!$('footer')) {
      setTimeout("LoadSimpleThings()", 500);
    }
  }
}

parsexml = function(xml) {
  var xmldoc = Try.these(
    function() {
      return new DOMParser().parseFromString(xml, 'text/xml');
    },
    function() {
      var xmldom = new ActiveXObject('Microsoft.XMLDOM');
      xmldom.loadXML(xml);
      return xmldom;
    }
  );
  return xmldoc;
}

function easeInOut(minValue,maxValue,totalSteps,actualStep,powr) {
  //Generic Animation Step Value Generator By www.hesido.com
  var delta = maxValue - minValue;
  var stepp = minValue+(Math.pow(((1 / totalSteps)*actualStep),powr)*delta);
  return Math.ceil(stepp)
}

function doBGFade(elem,startRGB,endRGB,finalColor,steps,intervals,powr) {
//BG Fader by www.hesido.com
  if (elem.bgFadeInt) window.clearInterval(elem.bgFadeInt);
  var actStep = 0;
  elem.bgFadeInt = window.setInterval (
    function() {
      elem.style.backgroundColor = "rgb("+
        easeInOut(startRGB[0],endRGB[0],steps,actStep,powr)+","+
        easeInOut(startRGB[1],endRGB[1],steps,actStep,powr)+","+
        easeInOut(startRGB[2],endRGB[2],steps,actStep,powr)+")";
      actStep++;
      if (actStep > steps) {
        elem.style.backgroundColor = finalColor;
        window.clearInterval(elem.bgFadeInt);
      }
    },
    intervals)
}

Event.observe(window, 'load', LoadSimpleThings, false);

