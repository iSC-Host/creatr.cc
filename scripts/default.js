starttimer = new Date();

LoaderJS = function(ScriptName) {
  var script;
  script = document.createElement('script');
  script.setAttribute('type','text/javascript');
  script.setAttribute('src', ScriptName);
  document.getElementsByTagName('head')[0].appendChild(script);
};

LoaderCSS = function(StyleSheetName) {
  var script;
  script = document.createElement('link');
  script.setAttribute('type','text/css');
  script.setAttribute('rel','stylesheet');
  script.setAttribute('href', StyleSheetName);
  document.getElementsByTagName('head')[0].appendChild(script);
};

LoaderLogo = function(myParam, Container, test) {
  timestamp = new Date();
  if (test == 1) {
    var url = 'http://test.creatr.cc/creatr/logo.php';
  } else {
    var url = 'http://creatr.cc/creatr/logo.php';
  }
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
//      evalScripts: true
    }
  );
//  alert(pars);
};


LoaderCreatr2 = function(myParam, Container, test) {
  timestamp = new Date();
  if (test == 1) {
    var url = 'http://test.creatr.cc/creatr/index2.php';
  } else {
    var url = 'http://creatr.cc/creatr/index2.php';
  }
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
//      evalScripts: true
    }
  );
//  alert(pars);
};


LoaderBlogButton = function(myParam, Container, test) {
  timestamp = new Date();
  if (test == 1) {
    var url = 'http://test.creatr.cc/blogbutton/blogbutton.php';
  } else {
    var url = 'http://creatr.cc/blogbutton/blogbutton.php';
  }
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
//      evalScripts: true
    }
  );
//  alert(pars);
};


doSuccess = function(request) {
//  alert('Success');
//  alert(request.status);
}

reportComplete = function(request) {
//  alert('Complete');
//  alert(request.status);
//  debug('Fertig ->' + request.status + ': ' + request.statusText, true);
}

reportError = function(request) {
  alert('Error');
  alert(request.status + '\n' + request.statusText + '\n' + request.responseText);
  
//  debug('Fehler ->' + request.status + ': ' + request.statusText, true);
//  var response = request.responseText;
//  response = response.replace(/\<h1\>/, '<h3>');
//  response = response.replace(/\<\/h1\>/, '</h3>');
//  response = response.replace(/\<hr\>/, '<br /><br />');
//  if (!gcmsGUI.showMessage('stop', 'Fehler', 'Daten können nicht geladen werden<br /><br /><br />' + response, false, 380, 260)) {
//    alert('Sorry. There was an error.');
//  }
}

// Um wildes flackern beim laden zu vermeiden, werden
// erst die Stylesheets geladen
LoaderCSS('/scripts/default.css');               // Schriftformatierung und Farben des Frameworks

Object.extend(Element, {
	getWidth: function(element) {
	   	return $(element).offsetWidth; 
	},
/*
	getHeight: function(element) {
        return $(element).offsetHeight;
	},
*/
	setWidth: function(element,w) {
	   	element = $(element);
    	element.style.width = w +"px";
	},
	setHeight: function(element,h) {
   		element = $(element);
    	element.style.height = h +"px";
	},
	getTop: function(element) {
      var y = 0;
      if (element.offsetParent) {
        while (element.offsetParent) {
          y += element.offsetTop;
          element = element.offsetParent;
        }
      }
      return y;
	},
	setTop: function(element,t) {
	   	element = $(element);
    	element.style.top = t +"px";
	},
	getLeft: function(element) {
      var x = 0;
      if (element.offsetParent) {
        while (element.offsetParent) {
          x += element.offsetLeft;
          element = element.offsetParent;
        }
      }
      return x
	},
	setLeft: function(element,l) {
	   	element = $(element);
    	element.style.left = l +"px";
	},
	setSrc: function(element,src) {
    	element = $(element);
    	element.src = src; 
	},
	setHref: function(element,href) {
    	element = $(element);
    	element.href = href; 
	},
	setInnerHTML: function(element,content) {
		element = $(element);
		element.innerHTML = content;
	}
});
