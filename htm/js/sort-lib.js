/*Ordem*/
var sPag=document.location.href.toUpperCase();
if(sPag.indexOf("/PROD,")==-1){sConcat="&";sCharSep="=";} else {sConcat=",";sCharSep=",";}
if(iQtdProds>2){
  sOrdenacao="<table width='100%' cellspacing='0' cellpadding='0'><tr><td>";
  sOrdenacao+="<div class='fc-order-mobile'>"+ rk("list-sort-by-title") +"</div> <select id=OrderProd class=smSelect onchange=NewOrder()>";
  sOrdenacao+="<option value=-1>"+ rk("list-sort-by-title-select") +"</option>";
  sOrdenacao+="<option value=0>"+ rk("list-sort-by-title-default") +"</option>";
  sOrdenacao+="<option value=1>"+ rk("list-sort-by-title-releases") +"</option>";
  sOrdenacao+="<option value=2>"+ rk("list-sort-by-title-highlights") +"</option>";
  sOrdenacao+="<option value=3>"+ rk("list-sort-by-title-cat-names") +"</option>";
  sOrdenacao+="<option value=4>"+ rk("list-sort-by-title-product-names") +"</option>";
  sOrdenacao+="<option value=5>"+ rk("list-sort-by-title-reviews") +"</option>";
  sOrdenacao+="<option value=7>"+ rk("list-sort-by-title-price-low") +"</option>";
  sOrdenacao+="<option value=8>"+ rk("list-sort-by-title-price-high") +"</option>";
  sOrdenacao+="</select>";
  sOrdenacao+="</td></tr></table>"; 
}

if(document.getElementById('idPagProdTop'))document.getElementById('idPagProdTop').innerHTML="<div id='idDivPagProd'><table width='100%'><tr><td>"+ sOrdenacao +"</td></tr></table></div>";

var oOrder=document.getElementById('OrderProd');
var posOrder=sPag.indexOf("ORDER"+sCharSep);
if(posOrder!=-1){
  var iOrderCurrent=sPag.substr(posOrder+6,1);
  if(!isNaN(iOrderCurrent))if(iOrderCurrent>=0){
    var i=0;
    while(i<oOrder.length && oOrder.options[i].value!=iOrderCurrent)i++;
    if(i<oOrder.length)oOrder.selectedIndex=i;
  }
}

function NewOrder(){
  var iOrder=oOrder.options[oOrder.selectedIndex].value;
  if(iOrder>=0){
    if(posOrder!=-1){ /*Found order in URL, replace*/
      var sLoc=document.location.href.replace(new RegExp('order'+sCharSep+iOrderCurrent),'order'+sCharSep+iOrder);
    }
    else{
      var sLastFive=sPag.substr(sPag.length-5);
      if(sPag.indexOf("/PROD,")>0){var sLoc=document.location.href.replace(new RegExp('/prod,','gi'),'/prod,order,'+iOrder+",");}
      else if(sLastFive=="/PROD"){var sLoc=document.location.href.replace(new RegExp('/prod','gi'),'/prod,order,'+iOrder);}
      else if(sPag.indexOf(".ASP?")>0){var sLoc=document.location.href.replace(new RegExp('.asp\\?','gi'),'.asp?order='+iOrder+'&');}
      else if(sPag.indexOf(".EHC?")>0){var sLoc=document.location.href.replace(new RegExp('.ehc\\?','gi'),'.ehc?order='+iOrder+'&');}
      else if(sPag.indexOf(".ASP")>0){var sLoc=document.location.href.replace(new RegExp('.asp','gi'),'.asp?order='+iOrder);}
      else if(sPag.indexOf(".EHC")>0){var sLoc=document.location.href.replace(new RegExp('.ehc','gi'),'.ehc?order='+iOrder);}
      else{
        if(sPag.indexOf("?")>0){var sLoc=document.location.href+sConcat+'order'+sCharSep+iOrder;}
        else{var sLoc=document.location.href+'?order='+iOrder;}
      }
    }
    /*console.log('loc='+sLoc);*/
    document.location.href=sLoc;
  }
}