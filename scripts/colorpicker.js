var activefield;

function _$(v) {
  return(document.getElementById(v));
}

function _$S(v) {
  return(_$(v).style);
}

function agent(v) {
  return (Math.max(navigator.userAgent.toLowerCase().indexOf(v),0));
}

function closepicker(v) {
  _$S('plugin').display = 'none';
  _$S('pluginbg').display = 'none';
  //(_$S(v).display=='none'?'block':'none');
}

function within(v,a,z) {
  return((v>=a && v<=z)?true:false);
}

function XY(e,v) {
  var z = agent('msie')?[event.clientX+document.documentElement.scrollLeft,event.clientY+document.documentElement.scrollTop]:[e.pageX,e.pageY];
  return(z[zero(v)]);
}

function XYwin(v) {
  var z=agent('msie')?[document.body.clientHeight,document.body.clientWidth]:[window.innerHeight,window.innerWidth];
  return(!isNaN(v)?z[v]:z);
}

function zero(v) {
  v = parseInt(v);
  return(!isNaN(v)?v:0);
}

/* PLUGIN */
var maxValue={'h':360,'s':100,'v':100}, HSV={0:360,1:100,2:100};
var hSV=165, wSV=162, hH=163, slideHSV={0:360,1:100,2:100}, zINDEX=150, stop=1;

function HSVslide(d,o,e) {
  function tXY(e) {
    tY = XY(e,1)-top;
    tX = XY(e)-left;
  }

  function mkHSV(a,b,c) {
    return(Math.min(a,Math.max(0,Math.ceil((parseInt(c)/b)*a))));
  }
  
  function ckHSV(a,b) {
    if(within(a,0,b))
      return(a);
    else if(a>b)
      return(b);
    else if(a<0)
      return('-'+oo);
  }
  
  function drag(e) {
    if(!stop) {
      if(d!='drag') {
        tXY(e);
      }
      if(d=='SVslide') {
        ds.left = ckHSV(tX-oo,wSV)+'px';
        ds.top = ckHSV(tY-oo,wSV)+'px';
        slideHSV[1] = mkHSV(100,wSV,ds.left);
        slideHSV[2] = 100-mkHSV(100,wSV,ds.top);

        HSVupdate();
      } else if(d=='Hslide') {
        var ck = ckHSV(tY-oo,hH), j, r='hsv', z={};
        ds.top = (ck-5)+'px';
        slideHSV[0] = mkHSV(360,hH,ck);
        for(var i=0; i<=r.length-1; i++) {
          j = r.substr(i,1);
          z[i] = (j=='h')?maxValue[j]-mkHSV(maxValue[j],hH,ck):HSV[i];
        }
        HSVupdate(z);
        _$S('SV').backgroundColor='#'+hsv2hex([HSV[0],100,100]);
      } else if(d == 'drag') {
        ds.left=XY(e)+oX-eX+'px';
        ds.top=XY(e,1)+oY-eY+'px';
      }
    }
  }
  if(stop) {
    stop='';
    var ds = _$S(d != 'drag' ? d : o);
    if(d == 'drag') {
      var oX = parseInt(ds.left), oY=parseInt(ds.top), eX=XY(e), eY=XY(e,1);
      _$S(o).zIndex = zINDEX++;
    } else {
      var tX;
      var tY;
      var left=(_$(o).offsetLeft+10);
      var top=(_$(o).offsetTop+22)
      var oo=(d == 'Hslide')?2:4;
      if(d == 'SVslide') {
        slideHSV[0] = HSV[0];
      }
    }
    document.onmousemove=drag;
    document.onmouseup=function(){
      stop=1;
      document.onmousemove='';
      document.onmouseup='';
    };
    drag(e);
  }
}

function HSVupdate(v) {
  v=hsv2hex(HSV=v?v:slideHSV);
  _$('plugHEX').innerHTML=v;
  _$S('plugCUR').background='#'+v;
//	_$S('plugID').background='#'+v;
  activecolor = v;
  return(v);
}

function copycolor() {
  if (activefield) {
    activefield.value = activecolor;
    closepicker('plugin');
  }
}

function loadSV() {
  var z='';
  for(var i=hSV; i>=0; i--) {
    z+="<div class=\"colrpickr\" style=\"BACKGROUND: #"+hsv2hex([Math.round((360/hSV)*i),100,100])+";\"><br /><\/div>";
  }
  _$('Hmodel').innerHTML=z;
}

/* CONVERSIONS */
function toHex(v) {
  v=Math.round(Math.min(Math.max(0,v),255));
  return("0123456789ABCDEF".charAt((v-v%16)/16)+"0123456789ABCDEF".charAt(v%16));
}

function rgb2hex(r) {
  return(toHex(r[0])+toHex(r[1])+toHex(r[2]));
}

function hsv2hex(h) {
  return(rgb2hex(hsv2rgb(h)));
}	

function hsv2rgb(r) { // easyrgb.com/math.php?MATH=M21#text21
  var R,B,G,S=r[1]/100,V=r[2]/100,H=r[0]/360;
  if(S>0) {
    if(H>=1) {
      H=0;
    }
    H=6*H; F=H-Math.floor(H);
    A=Math.round(255*V*(1.0-S));
    B=Math.round(255*V*(1.0-(S*F)));
    C=Math.round(255*V*(1.0-(S*(1.0-F))));
    V=Math.round(255*V);
    switch(Math.floor(H)) {
      case 0: R=V; G=C; B=A; break;
      case 1: R=B; G=V; B=A; break;
      case 2: R=A; G=V; B=C; break;
      case 3: R=A; G=B; B=V; break;
      case 4: R=C; G=A; B=V; break;
      case 5: R=V; G=A; B=B; break;
    }
    return([R?R:0,G?G:0,B?B:0]);
  } else {
    return([(V=Math.round(V*255)),V,V]);
  }
}

/* LOAD */
Event.observe(window, 'load', loadSV, false);

