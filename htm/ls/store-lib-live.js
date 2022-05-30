/* Template [02/2019] */

var iNextPageButFC,bBuyWishlist;

/* Translate texts */
function rk(sKey){if(oResources[sKey])return oResources[sKey];else console.warn("js var not found in language resources %c"+ sKey,"color:red");}

var sFLiveStore$=(function(){
 
  var sCurrentPage=document.location.href.toUpperCase();
  if(FC$.LazyLoad==0)var sLazy="",sSrc="src";
  else var sLazy=" loading=lazy",sSrc="data-src";

  function fnGetID(id){return document.getElementById(id);}

  function fnGetConfig(configItem){return ((oStoreConfig$[configItem] instanceof Array)?oStoreConfig$[configItem][0]:oStoreConfig$[configItem]);}

  /* Function that preload images */
  function fnPreloadImages() {
    var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=fnPreloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
  }
 
  function fnFormatNumber(num){
    num=num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))num="0";
    sign=(num==(num=Math.abs(num)));
    num=Math.floor(num*100+0.50000000001);
    num=Math.floor(num/100).toString();
    for(var i=0;i<Math.floor((num.length-(1+i))/3);i++)num=num.substring(0,num.length-(4*i+3))+'.'+num.substring(num.length-(4*i+3));
    return ((sign)?'':'-')+num;
  }

  var iPL=0;
  
  function fnShowProd(Price,OriginalPrice,Cod,iMaxParcels,ProductID){
    /* Function that shows the price of the product, installment payment, cash discount and badge (home and list) */
    iPL++;
    var idPrice=fnGetID("idProdPrice"+ProductID);
    var sPrice="";
    if(Price==0 && OriginalPrice==0){
      if(idPrice)idPrice.innerHTML="<div class=\"prices\"><br><div class=\"price font-bold\"><div class=currency><a href='"+ FCLib$.uk("url-contact") +"?"+ (rk("topic-query-product-subject") +"="+ rk("topic-query-product-about") +" ("+ rk("topic-query-product-code") +" ").replace((/ /g,"%20")) + Cod +")' target='_top' >"+ rk("list-price-call-us") +"</a></div></div></div>";
      return void(0);
    }
    var iPrice=Price.toString().split(".");
    if(iPrice.length==2){
      var iPriceInt=iPrice[0];
      var PriceDecimal=iPrice[1];
      if(PriceDecimal.length==1)PriceDecimal+="0";
    }
    else{
      var iPriceInt=iPrice;
      var PriceDecimal="00";
    }    
    /* Installment */
    if(typeof ParcelsValues!="undefined" && iMaxParcels==0){
      var iPosArrayValue=0;
      for(var i=0;i<ParcelsValues.length && Price>=ParcelsValues[i];i++){iPosArrayValue=i;}
      iMaxParcels=iPosArrayValue+1;
    }
    var sInterest;
    if(typeof ParcelsInterests!="undefined"){
      if(iMaxParcels==0||iMaxParcels>ParcelsInterests.length)iMaxParcels=ParcelsInterests.length;
      if(ParcelsInterests[iMaxParcels-1]>0)sInterest=""; else sInterest=" <span class='home-price-breakline'>"+ rk("list-price-no-interest") +"</span>";
    }
    else{
      iMaxParcels=0;
    }

    if(Price!=OriginalPrice){
      sPrice+="<div class=\"prices\">";
      sPrice+="  <div class=\"old-price font-regular\">"+ rk("list-price-was") +"&nbsp; <span>"+ FCLib$.formatMoney(OriginalPrice,FC$.Currency) +"</span></div>";
      sPrice+="  <div class=\"price home-price font-bold\"><span class=\"home-price-por\">"+ rk("list-price-now") +" </span>"+ FC$.Currency + " " + FCLib$.formatMoneyInt(iPriceInt) + FCLib$.getDecimalSep() + "<span class=\"home-price-cents\">" + PriceDecimal + "</span>" +"</div>";
      if(iMaxParcels>1)sPrice+="  <div class=\"installments font-regular\"><strong><span class=\"installment-count\">"+ iMaxParcels +"</span>x</strong> <strong><span class=\"installment-price\">"+ FCLib$.formatMoney(CalculateInstallment(Price,iMaxParcels),FC$.Currency) +"</span></strong>"+ sInterest +"</div>";
      sPrice+="</div>";
    }
    else{
      sPrice+="<div class=\"prices\">";
      sPrice+="  <div class=\"price home-price font-bold\">"+ FC$.Currency + " " + FCLib$.formatMoneyInt(iPriceInt) + FCLib$.getDecimalSep() + "<span class=\"home-price-cents\">" + PriceDecimal + "</span>" +"</div>";
      if(iMaxParcels>1)sPrice+="  <div class=\"installments font-regular\"><strong><span class=\"installment-count\">"+ iMaxParcels +"</span>x</strong> <strong><span class=\"installment-price\">"+ FCLib$.formatMoney(CalculateInstallment(Price,iMaxParcels),FC$.Currency) +"</span></strong>"+ sInterest +"</div>";
      sPrice+="</div>";
    }
    if(idPrice)idPrice.innerHTML=sPrice;
    /* Discount */
    if(Price>0 && iPaymentDiscount>0){
      var oProdDesc=document.getElementById("ProdDesc"+ ProductID);
      if(oProdDesc)oProdDesc.innerHTML=""+ rk("price-in-cash") +" <b>"+ FCLib$.formatMoney(Price*((100-iPaymentDiscount)/100),FC$.Currency)+ "</b>";
    }
    /* Badge */
    var oBadge=document.getElementById("DivProd"+ProductID);
    if(oBadge){
      if(fnGetConfig("Product_Badges_Home_ProductList")){
        var sBadges="";
        if(oBadge.hasAttribute("data-sale") && OriginalPrice>Price*1.01)sBadges+="<div id='badgeProm"+ ProductID +"' class='fc-badge-product-sale' title='Oferta'><span>-" + fnGetSale() + "%</span></div>";
        /* if(oBadge.hasAttribute("data-release"))sBadges+="<div class='fc-badge-product-release' title='Lançamento'>&#10033;</div>"; */
        /* if(oBadge.hasAttribute("data-highlight"))sBadges+="<div class='fc-badge-product-highlight' title='Destaque'>&#9755;</div>"; */
        if(sBadges!="")oBadge.innerHTML+="<div class='fc-badge-product-principal'>"+ sBadges +"</div>";
      }
      function fnGetSale(){return parseInt((OriginalPrice-Price)/OriginalPrice*100);}
    }
  }

  function fnShowButtonCart(Estoque, IDProd){
    var idButton=document.querySelector('#idButtonProd'+ IDProd +' img');
    var idAviso=document.querySelector('#idAvisoProd'+ IDProd +'');
    var avisoDisp='<span class="mntext"><a href="#na" onclick="sFLiveStore$.fnShowDisp('+ IDProd +');">'+ rk("button-cart-warn-me") +'</a> '+ rk("button-cart-warn-me-when-available") +'</span>';
    if (idButton){
      if(Estoque==0){
        idButton.setAttribute('src',''+ FC$.PathImg +'botcarrinhoesgotado.svg?cccfc=1');
        idAviso.innerHTML=avisoDisp;
      }else{
        idButton.setAttribute('src',''+ FC$.PathImg +'botcarrinho.svg?cccfc=1');
      }
    } 
  }

  function fnShowDisp(IDProd){
    popup=window.open(FCLib$.uk("url-product-availability") +"?"+ (FCLib$.fnUseEHC()?"productid":"idproduto") +"="+ IDProd,"Disp","top=10,left=10,height=480,width=450,scrollbars=yes");
    popup.focus();
    return void(0);
  }

  function fnSearchSubmit(oForm){
    var oSearch=(FCLib$.fnUseEHC()?oForm.text:oForm.texto);
    if(oSearch){
      var sSearch=oSearch.value;
      if(sSearch.length<2){
        alert(""+ rk("form-submit-search-correctly") +"");
        oSearch.focus();
       }
       else{
        document.TopSearchForm.submit()
       }
    }
  }
  
  
  function fnShowCart(bShow,ItensCesta){
   oTabItensCart=document.getElementById('TabItensCart');
   if(bShow){
      oTabItensCart.className="EstTabItensCartOn";
      document.getElementById('DivItensCart').style.display="";
    }
   else{
      oTabItensCart.className="EstTabItensCart";
      document.getElementById('DivItensCart').style.display="none";
    }
  }
  
  function fnGoCart(){
    document.location.href=FCLib$.uk("url-add-product");
  }

  function fnUpdateCart(IsAdd,IsSpy){FCLib$.fnAjaxExecFC(FCLib$.uk("url-xml-cart"),"",false,fnCallbackUpdateCart,IsAdd,IsSpy);}

  function fnCallbackUpdateCart(oHTTP,IsAdd,IsSpy){
    if(oHTTP.responseXML){
      oXML=oHTTP.responseXML;
      var oCarts=oXML.getElementsByTagName("cart");
      try{currencyProdCart=(oCarts[0].getElementsByTagName("currency")[0].childNodes[0].nodeValue);}catch(e){currencyProdCart=FC$.Currency}
      try{TotalQtyProdCart=(oCarts[0].getElementsByTagName("TotalQty")[0].childNodes[0].nodeValue);}catch(e){TotalQtyProdCart="0"}
      try{subtotalProdCart=(oCarts[0].getElementsByTagName("subtotal")[0].childNodes[0].nodeValue);}catch(e){subtotalProdCart="0,00"}
      iItensCesta=TotalQtyProdCart;
      if(IsSpy){
        var oReferrer=window.parent;
        try{oReferrer.document.getElementById("idCartItemsTop").innerHTML=iItensCesta;}catch(e){}
        try{oReferrer.document.getElementById("idCartItemsToolTop").innerHTML=iItensCesta;}catch(e){}
        try{oReferrer.document.getElementById("idCartTotalTop").innerHTML=FCLib$.FormatPreco(currencyProdCart +" "+ subtotalProdCart);}catch(e){}
        try{oReferrer.document.getElementById("idCartTotalToolTop").innerHTML=FCLib$.FormatPreco(currencyProdCart +" "+ subtotalProdCart);}catch(e){}
      }
      else {
        try{document.getElementById("idCartItemsTop").innerHTML=iItensCesta;}catch(e){}
        try{document.getElementById("idCartItemsToolTop").innerHTML=iItensCesta;}catch(e){}
        try{document.getElementById("idCartTotalTop").innerHTML=FCLib$.FormatPreco(currencyProdCart +" "+ subtotalProdCart);}catch(e){}
        try{document.getElementById("idCartTotalToolTop").innerHTML=FCLib$.FormatPreco(currencyProdCart +" "+ subtotalProdCart);}catch(e){}
      }
    }
  }



  function fnInsertVideo(ProductID,CodVideo){
    var oVideo=document.getElementById("VideoProd"+ProductID);
    if(oVideo){
      oVideo.innerHTML="<iframe class=\"VideoProd\" src=\"//www.youtube.com/embed/"+ CodVideo +"?controls=1&showinfo=0&rel=0&modestbranding=1&theme=light&modestbranding=1\" frameborder=0 allowfullscreen  loading=lazy></iframe>"
    }
  }
  
  function fnAdjustsFilters(){ 
    var bTemPathQts=false;
    var oUlPathCatQt=document.getElementById("idUlPathCatQtFC");
    if(oUlPathCatQt){bTemPathQts=true;}else{document.getElementById('idListaProdCategoriasFC').style.display='none';}
    var oUlAdic1Qt=document.getElementById("idUlAdic1QtFC");
    if(oUlAdic1Qt){bTemPathQts=true;}else{document.getElementById('idListaProdAdicional1FC').style.display='none';}
    var oUlAdic2Qt=document.getElementById("idUlAdic2QtFC");
    if(oUlAdic2Qt){bTemPathQts=true;}else{document.getElementById('idListaProdAdicional2FC').style.display='none';}
    var oUlAdic3Qt=document.getElementById("idUlAdic3QtFC");
    if(oUlAdic3Qt){bTemPathQts=true;}else{document.getElementById('idListaProdAdicional3FC').style.display='none';}
    /* If don't have products in the categories, remove div */
    if(!bTemPathQts)document.getElementById("idDivPath").style.display='none';
    /* If don't have any search filters, remove div with filters */
    var oUlPathSearch=document.getElementById("idUlPathSearchFC");
    if(oUlPathSearch==null)document.getElementById("idDivSearch").style.display='none';
  }

  
  function fnMostraDescontoProdDet(PrecoProd){
    if(PrecoProd==0 || iPaymentDiscount==0)return;
    document.getElementById("idPriceAVista").innerHTML="<div id='PriceAVista'><p>"+ rk("show-for-cash-payments-text") +" <b>"+ iPaymentDiscount +""+ rk("show-for-cash-payments-discount-text") +"</b>.</p><p>"+ rk("show-discount-price") +" <b>"+ FCLib$.formatMoney(PrecoProd*((100-iPaymentDiscount)/100),FC$.Currency) +"</b></p></div>";
  }

  function fnCreateEventGA(sCategory,sAction,sLabel){
    if(typeof gtag!=='undefined'){
      gtag('event',sAction,{'send_to':FC$.GA,'event_category':sCategory,'event_label':sLabel});
    }
    else if(typeof ga!=='undefined'){
      ga('send','event',sCategory,sAction,sLabel);
    }
  }
  
  
  /* Availability warning */
  function fnLinkDisp(iStock,ProdId){
    if(iStock==0){
      document.write("<a href='javascript:MostraDisp("+ FC$.IDLoja +","+ ProdId +")'>"+ rk("notify-when-available") +"</a>");
    }
  }
  
  /* Video Filter */
  function fnShowVideo(ProductId,oProdFilters,sImagemProdPri,sNomeProd){
    var sVideo="";
    if(oProdFilters.length>0){
      var iFiltroVideo=oProdFilters[0].pFilNames["video"];
      if(iFiltroVideo!=undefined)sVideo=oProdFilters[0].pFil[iFiltroVideo].value;
    }
    fnVideoImage(ProductId,sVideo,sImagemProdPri,sNomeProd);
  }
  
  /* Video and Image Product */
  function fnVideoImage(ProductId,videoProduct,ImagemProdPri,NomeProd){
    var replaceNomeProd = NomeProd.replace(/-/g,' ');
    if (videoProduct==""){
      document.getElementById("id-video-image"+ProductId).innerHTML="<div class='ImgCapaListProd DivListproductStyleImagemZoom'><img src="+ ImagemProdPri +" alt=\""+ replaceNomeProd +"\" onerror='MostraImgOnError(this,0)'"+ sLazy +"></div>";
    }else{
     document.getElementById("id-video-image"+ProductId).innerHTML="<video id=prodVideo"+ ProductId +" class='videoProd' preload=auto loop src='https://my.mixtape.moe/"+ videoProduct +".mp4'></video>";
     function execVideoEvents(){
      var oVideo=document.getElementById("prodVideo"+ProductId);
      if(FCLib$.isOnScreen(oVideo))oVideo.play();
     }
     execVideoEvents();
     FCLib$.AddEvent(document,"scroll",execVideoEvents);
    }
  }
   
  /* Mouseover change image Home and List */
  function fnChangeImages(sImagemProdPri,sImagemProdDet,sDescUrl,sProductId,sNomeProd){
    var replaceNomeProd=sNomeProd.replace(/-/g,' ');
    var tagImgPri=sImagemProdPri;
    var sIdCampo="DivImagemProdDouble"+ sProductId;
    if(fnGetConfig("Change_Image_Hover_Home_ProductList")){   
      if (tagImgPri==""){
        document.getElementById(sIdCampo).innerHTML="<img height='200px' src='/images/nd0.gif'>";
      }
      else {
        var tagImgDet=sImagemProdDet;
        var sLenghtImg=tagImgDet;
        var nLenghtImg=sLenghtImg.search(",");
        if(nLenghtImg<0){
          document.getElementById(sIdCampo).innerHTML="<a href="+ sDescUrl +"><img height='159'"+ sSrc +"='"+ sImagemProdPri +"' alt=\""+ replaceNomeProd +"\""+ sLazy +"></a>";
        }
        else {
          var valImgDet=null;
          if(tagImgDet!=null){valImgDet = tagImgDet.split(",");}
          var imgDet0=valImgDet[0];
          var imgDet1=valImgDet[1];
          if((imgDet0.indexOf('#')>=0 && imgDet0.indexOf('/')>=0) || (imgDet1.indexOf('#')>=0 && imgDet1.indexOf('/')>=0)){
            imgDet0=valImgDet[0].replace('#', "/lojas/");
            imgDet1=valImgDet[1].replace('#', "/lojas/");
          }
          else if(imgDet0.indexOf('#')>=0 || imgDet1.indexOf('#')>=0){
            imgDet0=valImgDet[0].replace('#', FC$.PathPrdExt);
            imgDet1=valImgDet[1].replace('#', FC$.PathPrdExt);
          }
          else {
            imgDet1=FC$.PathPrd + valImgDet[1];
          }
          if(imgDet0==null){
            document.getElementById(sIdCampo).innerHTML="<a href=" + sDescUrl + "><img height='159' "+ sSrc +"='" + sImagemProdPri + "' alt=\""+ replaceNomeProd +"\""+ sLazy +"></a>";
          }
          else {
            document.getElementById(sIdCampo).innerHTML="<a href=" + sDescUrl + "><img height='159' "+ sSrc +"='" + imgDet0 + "' border=0 onmouseover=\"this.src='" + imgDet1 + "'\" onmouseout=\"this.src='" + imgDet0 + "'\" alt=\""+ replaceNomeProd +"\""+ sLazy +"></a>";
          }
        }
      }

    }else{
      document.getElementById(sIdCampo).innerHTML="<a href=" + sDescUrl + "><img height='159' "+ sSrc +"='" + sImagemProdPri + "' alt=\""+ replaceNomeProd +"\""+ sLazy +"></a>";
    }
  }
  
  /* Calculate QTY Cart */
  function fnCalculateQtyCart(){
    if(FC$.Page=="Cart"){
      var script = document.createElement('script');
      script.onload = function() {
      };
      script.src = FC$.PathHtm+'js/calculate-qty-cart.js';
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  }
  
  /* Sold out List */
  function fnGetProductSoldOutID(IDProduto,QtyStock){
    if(fnGetConfig("Product_SoldOut_Badge_ProductList")){
      var showIDProduct=IDProduto;
      var showQtyStock=QtyStock;    
      if(showQtyStock==0){
        var soldOut=document.getElementById("DivProd"+showIDProduct);
        soldOut.style.backgroundColor = "#ffffff";
        var soldOutIMG=document.getElementById("DivImagemProdDouble"+showIDProduct);
        soldOutIMG.style.opacity="0.9";
        var soldOutText=document.getElementById("zFProdSoldOut"+showIDProduct);
        soldOutText.innerHTML="<div class='zFProdSoldOut-text'>"+ rk("list-sold-out") +"</div>"  
      } 
    }
  }
  
  /* Sold out SubProduct List */
  function fnGetSubProductSoldOutID(IDProduto,QtySubStock,bTemSubsStock){
    if(fnGetConfig("Product_SoldOut_Badge_SubProduct_ProductList")){
      var showSubIDProduct=IDProduto;
      var showSubQtyStock=QtySubStock;
      var showbTemSubsStock=bTemSubsStock;    
      if(showSubQtyStock==0 && showbTemSubsStock){
        var soldOut=document.getElementById("DivProd"+showSubIDProduct);
        soldOut.style.backgroundColor="#ffffff";
        var soldOutIMG=document.getElementById("DivImagemProdDouble"+showSubIDProduct);
        soldOutIMG.style.opacity="0.9";
        var soldOutText=document.getElementById("zFProdSoldOut"+showSubIDProduct);
        soldOutText.innerHTML="<div class='zFProdSoldOut-text'>"+ rk("list-sold-out") +"</div>"
      }  
    }
  }

  function initScope(){
    iNextPageButFC=fnGetConfig("Next_page_button");
    bBuyWishlist=fnGetConfig("Show_wishlist");
  }
  initScope();
  
  
  /* Insert aria-label ecommerce badge */
  function fnAriaLabelInclude(){
    var poweredBy = document.getElementById("idBadgeFC").getElementsByTagName('a')[0].setAttribute("aria-label", "ecommerce");
  }
  
  /* Grid position thumbnails with video */  
  function fnGridVideoPosition(){  
    if(FC$.Page=="Products"){
      var getPositionThumbs = document.querySelector('#position-thumbnails');
      var changePositionThumbs = document.getElementsByClassName('multiple-thumbnails');
      var i;
      for (i = 0; i < changePositionThumbs.length; i++) {
        getPositionThumbs.appendChild(changePositionThumbs[i]);
      }
    }
  }
  
  /* Grid Video */
  /*function fnInsertVideoGridThumb(){
    if(FC$.Page=="Products"){
      var getProductsContainers= document.querySelectorAll('.zoom-gallery .selectors a');
      for (var i = 0; i < getProductsContainers.length; i++){
        getProductsContainers[i].onclick = function(event){ 
          var getIframe = document.querySelectorAll('div.active iframe[src*="youtube"]');       
          if (getIframe.length){getIframe.src;}  
          var getZoomGallerySlide = document.querySelector('.zoom-gallery .zoom-gallery-slide');
          if (getZoomGallerySlide){getZoomGallerySlide.classList.remove('active');}  
          var getSelectorsAhref = document.querySelector('.zoom-gallery .selectors a');
          if (getSelectorsAhref){getSelectorsAhref.classList.remove('active');}  
          var getDataSlide = document.querySelector('.zoom-gallery .zoom-gallery-slide[data-slide-id="'+ this.getAttribute('data-slide-id') +'"]');    
          if (getDataSlide) {getDataSlide.classList.add('active');}    
          var getDataSlideID = this.getAttribute('data-slide-id');
          var getVideoDiv = document.getElementById("get-video-display");
          var getGridVideoIframe = document.getElementById("gridYoutubeVideo");
          if(getDataSlideID == "zoom"){
            var iframes = getVideoDiv.getElementsByTagName("iframe");
            if (iframes != null) {
              for (var i = 0; i < iframes.length; i++){
                iframes[i].src = iframes[i].src;
                getVideoDiv.style.display = "none";
              }
            }      
          }else{
            getVideoDiv.style.display = "block";
            getGridVideoIframe.style.display = "block";
          }
          event.preventDefault();
        }
      }
    }    
  } */
  function fnInsertVideoGridThumb(){
    if(FC$.Page=="Products"){
      var getProductsContainers= document.querySelectorAll('.zoom-gallery .selectors a');
      function onOffVideoThumb(currenctItem){
        var getIframe = document.querySelectorAll('div.active iframe[src*="youtube"]');       
        if (getIframe.length){getIframe.src;}  
        var getZoomGallerySlide = document.querySelector('.zoom-gallery .zoom-gallery-slide');
        if (getZoomGallerySlide){getZoomGallerySlide.classList.remove('active');}  
        var getSelectorsAhref = document.querySelector('.zoom-gallery .selectors a');
        if (getSelectorsAhref){getSelectorsAhref.classList.remove('active');}  
        var getDataSlide = document.querySelector('.zoom-gallery .zoom-gallery-slide[data-slide-id="'+ currenctItem.getAttribute('data-slide-id') +'"]');    
        if (getDataSlide) {getDataSlide.classList.add('active');}    
        var getDataSlideID = currenctItem.getAttribute('data-slide-id');
        var getVideoDiv = document.getElementById("get-video-display");
        var getGridVideoIframe = document.getElementById("gridYoutubeVideo");
        if(getDataSlideID == "zoom"){
          var iframes = getVideoDiv.getElementsByTagName("iframe");
          if (iframes != null) {
            for (var i = 0; i < iframes.length; i++){
              iframes[i].src = iframes[i].src;
              getVideoDiv.style.display = "none";
            }
          }      
        }else{
          getVideoDiv.style.display = "block";
          getGridVideoIframe.style.display = "block";
        }
      }
      for (var i = 0; i < getProductsContainers.length; i++){
        if(navigator.userAgent.indexOf('Mobile')>-1){
          getProductsContainers[i].ontouchstart=function(event){
            onOffVideoThumb(this);
            event.preventDefault();
          }
        }
        if(navigator.userAgent.indexOf('Mobile')==-1){
          getProductsContainers[i].onclick=function(event){
            onOffVideoThumb(this);
            event.preventDefault();
          }
        }
      }
    }    
  }   
  
  /* Recommend This Product */
  function fnInsertRecommendProduct(){
    if(FC$.Page=="Products"){     
      var aLinks=document.getElementsByClassName("det-product-recommend"),iLinks=aLinks.length;
      if(fnGetConfig("Recommend_Product"))for(var i=0;i<iLinks;i++)aLinks[i].style.display="block";
      else for(var i=0;i<iLinks;i++)aLinks[i].innerHTML="";
    }
  }
  
  /* Insert Aria label Filters */  
  function fnInsertLabelFilters(){
    if(FC$.Page=="Products"){ 
      var insertLabelSearchFilter = document.querySelectorAll(".SearchFil")      
      for (i = 0; i < insertLabelSearchFilter.length; i++) {
        insertLabelSearchFilter[i].setAttribute("aria-label","Search Fil");
      }       
      var insertLabelInputFilter = document.getElementsByName("CatFil");
      for (i = 0; i < insertLabelInputFilter.length; i++) {
        insertLabelInputFilter[i].setAttribute("aria-label","Cat Fil");
      }             
    }
  }
  
  /* Insert Alt Breadcrumb Separtor */   
  function fnInsertAltShimImg(){
    if(FC$.Page=="Products"){ 
      var insertAltShim = document.querySelectorAll(".wid")      
      for (i = 0; i < insertAltShim.length; i++) {
        insertAltShim[i].setAttribute("alt","separator");
      }                   
    }
  }  
  
  /* Hide ZipCode Language */
  function fnHideZipcodeTab(){
    if(FC$.Page=="Products"){ 
      var sBrazilLanguage = "0";
      var sWorldLanguage = "1";
      var hideZipCodeTab = document.getElementById("det-product-tab3-label")
      if(hideZipCodeTab){
        if(FC$.Language == sBrazilLanguage){
           hideZipCodeTab.style.display = "initital";
        }else if(FC$.Language >= sWorldLanguage){
          hideZipCodeTab.style.display = "none";
        }
      }
    }
  }
  
  /*check iOS version*/
  function fniOSversion() {
    if (/iP(hone|od|ad)/.test(navigator.userAgent)) {
      var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
      return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    }
  }
  /*remove spy2 from DOM*/
  function fnRemoveSpy2From(varElement,varNewLink,idElement,urlProdTag){
    var varElement = document.getElementById(idElement);
    var varNewLink = document.createElement("a");
    if(varNewLink)varNewLink.href=urlProdTag;
    if(varElement)varElement.removeAttribute('onclick');
    if(varElement)varElement.parentNode.insertBefore(varNewLink,varElement);
    if(varNewLink)varNewLink.appendChild(varElement);
  }
  
  /* Discount Badges - Side Cart, Cart, Checkout, Track */ 
  function fnBadgeDiscount(){
    var createDivElemFree=document.createElement("div");
    createDivElemFree.className="fc-cart-discount-badge-free";
    createDivElemFree.innerHTML=rk('cart-badge-free');
    var createDivElemDiscount=document.createElement("div");
    createDivElemDiscount.className="fc-cart-discount-badge-discount";
    createDivElemDiscount.innerHTML=rk('cart-badge-discount');
    if(FC$.Page=="Cart"){ 
      var showBadgeFree=document.querySelectorAll('[rulename*="free"] .FCCartItemCont');
      var showBadgeDiscount=document.querySelectorAll('[rulename*="discount"] .FCCartItemCont');  
      for(var i=0;i<showBadgeFree.length;i++)showBadgeFree[i].appendChild(createDivElemFree);
      for(var i=0;i<showBadgeDiscount.length;i++)showBadgeDiscount[i].appendChild(createDivElemDiscount);
    }else if(FC$.Page=="Track"){ 
      var showBadgeFreeTrack=document.querySelectorAll('[rulename*="free"] td:first-child'); 
      var showBadgeDiscountTrack=document.querySelectorAll('[rulename*="discount"] td:first-child');
      for(var i=0;i<showBadgeFreeTrack.length;i++)showBadgeFreeTrack[i].appendChild(createDivElemFree);  
      for(var i=0;i<showBadgeDiscountTrack.length;i++)showBadgeDiscountTrack[i].appendChild(createDivElemDiscount);
    }  
  }

  function fnProd(prodImgMain,prodImgDet,URLProd,prodId,prodNameFU,prodPriceNum,prodPriceOri,prodRef,prodMaxInstallmentNum,prodStock){
    sFLiveStore$.fnChangeImages(prodImgMain,prodImgDet,URLProd,prodId,prodNameFU);
    sFLiveStore$.fnShowProd(prodPriceNum,prodPriceOri,prodRef,prodMaxInstallmentNum,prodId);
    /* SPY2 - Start */
    /*remove image link*/
    function removeImgLink(){
      document.getElementById("DivImagemProdDouble"+ prodId).addEventListener("click", function(event){
        event.preventDefault()
      });
    }
    if(!sFLiveStore$.fniOSversion() || sFLiveStore$.fniOSversion()[0]>=13){
      removeImgLink();
    }
    /*END-remove image link*/
    /*remove spy2 from iOS<13*/
    if(sFLiveStore$.fniOSversion() && sFLiveStore$.fniOSversion()[0]<13){
      document.getElementById("DivImagemProdDouble"+ prodId).removeAttribute("onclick");
      sFLiveStore$.fnRemoveSpy2From("getProdNome"+ prodId,"newPRODlinkNome"+ prodId,"DivProductListNomeProd"+ prodId,URLProd);
      sFLiveStore$.fnRemoveSpy2From("getProdPric"+ prodId,"newPRODlinkPrice"+ prodId,"DivProductListPriceProd"+ prodId,URLProd);
    }  
    /*END - remove spy2 from iOS<13*/
    /* SPY2 - End */

    sFLiveStore$.fnGetSubProductSoldOutID(prodId,iEstoqueSubs,bTemSubs);
    sFLiveStore$.fnGetProductSoldOutID(prodId,prodStock);
  };

  function fnProdOut(prodImgMain,prodImgDet,URLProd,prodId,prodNameFU,prodPriceNum,prodPriceOri,prodRef,prodMaxInstallmentNum){
    sFLiveStore$.fnChangeImages(prodImgMain,prodImgDet,URLProd,prodId,prodNameFU);
    sFLiveStore$.fnShowProd(prodPriceNum,prodPriceOri,prodRef,prodMaxInstallmentNum,prodId);
    /* SPY2 - Start */
    /*remove image link*/
    function removeImgLink(){
      document.getElementById("DivImagemProdDouble"+ prodId).addEventListener("click", function(event){
        event.preventDefault();
      });
    }
    if(!sFLiveStore$.fniOSversion() || sFLiveStore$.fniOSversion()[0]>=13){
      removeImgLink();
    }
    /*END-remove image link*/
    /*remove spy2 from iOS<13*/
    if(sFLiveStore$.fniOSversion() && sFLiveStore$.fniOSversion()[0]<13){
      document.getElementById("DivImagemProdDouble"+ prodId).removeAttribute('onclick');
      sFLiveStore$.fnRemoveSpy2From("getProdNome"+ prodId,"newPRODlinkNome"+ prodId,"DivHomeNomeProd"+ prodId,URLProd);
      sFLiveStore$.fnRemoveSpy2From("getProdPric"+ prodId,"newPRODlinkPrice"+ prodId,"DivHomePriceProd"+ prodId,URLProd);
    }  
    /*END - remove spy2 from iOS<13*/
    /* SPY2 - End */
  }

  return{
    sCurrentPage:sCurrentPage,
    fnGetID:fnGetID,
    fnGetConfig:fnGetConfig,
    fnPreloadImages:fnPreloadImages,
    fnShowProd:fnShowProd,
    fnShowButtonCart:fnShowButtonCart,
    fnShowDisp:fnShowDisp,
    fnSearchSubmit:fnSearchSubmit,
    fnFormatNumber:fnFormatNumber,
    fnShowCart:fnShowCart,
    fnGoCart:fnGoCart,
    fnUpdateCart:fnUpdateCart,
    fnInsertVideo:fnInsertVideo,
    fnAdjustsFilters:fnAdjustsFilters,
    fnMostraDescontoProdDet:fnMostraDescontoProdDet,
    fnCreateEventGA:fnCreateEventGA,
    fnLinkDisp:fnLinkDisp,
    fnShowVideo:fnShowVideo,
    fnChangeImages:fnChangeImages,
    fnCalculateQtyCart:fnCalculateQtyCart,
    fnGetProductSoldOutID:fnGetProductSoldOutID,
    fnGetSubProductSoldOutID:fnGetSubProductSoldOutID,
    fnAriaLabelInclude:fnAriaLabelInclude,
    fnGridVideoPosition:fnGridVideoPosition,
    fnInsertVideoGridThumb:fnInsertVideoGridThumb,
    fnInsertRecommendProduct:fnInsertRecommendProduct,
    fnInsertLabelFilters:fnInsertLabelFilters,
    fnInsertAltShimImg:fnInsertAltShimImg,
    fnHideZipcodeTab:fnHideZipcodeTab,
    fniOSversion:fniOSversion,
    fnRemoveSpy2From:fnRemoveSpy2From,
    fnBadgeDiscount:fnBadgeDiscount,
    fnProd:fnProd,
    fnProdOut:fnProdOut
  }

})();

/* Wishlist - Lista de Desejos */
function FuncButtonAddToWL(idp,bAdd){
  var sCont="";
  var bProdDet=(document.body.className.search("ProductDet")>0);
  if(bProdDet){
    if(bAdd==true)sCont="<a href=\""+ FCLib$.uk("url-account") +"?&wishlist=1#Wishlist\" target=\"_parent\"><span class=\"icon-share-wishlist-on-det-product\"></span><span class=\"icon-share-wishlist-on-det-product-text\">"+ rk("details-add-to-wishlist-on") +"</span></a>";
    else sCont="<a onclick=\"WL$.fnAddToWishlist("+idp+")\" rel=\"nofollow\"><span class=\"icon-share-wishlist-off-det-product\"></span><span class=\"icon-share-wishlist-off-det-product-text\">"+ rk("details-add-to-wishlist-off") +"</span></a>";
    return sCont;
  }else{
    if(bAdd==true)sCont="<a href=\""+ FCLib$.uk("url-account") +"?&wishlist=1#Wishlist\"><span class=\"icon-share-wishlist-on\"></span></a>";
    else sCont="<a onclick=\"WL$.fnAddToWishlist("+idp+")\" rel=\"nofollow\"><span class=\"icon-share-wishlist-off\"></span></a>";
    return sCont; 
  }
}

/* Functions for the shopping cart */
var oDivShowCartOnPage=null;
var iLastCartOnPage=0;

function ShowCartOnPage(IDLoja,iErr,sMsg,sCartText,sCheckoutText,este){
  if(!IsFramePage || 1==1){
    Cart$.fnShowCartCheckout(null,iErr,sMsg);
  }
  else {
    var oPos=getPos(este);
    if(oDivShowCartOnPage==null){
      var oNewElement=document.createElement("div");
      oNewElement.setAttribute("id","DivShowCartOnPage"); 
      oDivShowCartOnPage=document.body.appendChild(oNewElement);
    }
    oDivShowCartOnPage.style.display="none";
    oDivShowCartOnPage.style.backgroundColor="#fcfcfc";
    oDivShowCartOnPage.style.borderColor="#cdcdcd";
    oDivShowCartOnPage.style.color="#555555";
    oDivShowCartOnPage.style.border="1px solid #cdcdcd";
    oDivShowCartOnPage.style.marginTop="-95px";
    oDivShowCartOnPage.style.marginLeft="0px";
    oDivShowCartOnPage.style.position="absolute";
    oDivShowCartOnPage.style.zIndex="1";
    var iW=238;
    var iH=100;
    var oPosPrice=document.getElementById('PosPrice');
    if(oPosPrice){
      iW=oPosPrice.offsetWidth;
      iH=oPosPrice.offsetHeight;
    }
    if(iErr==0){var sBackColor="3187e6";var iLH=45} else {var sBackColor="949494";var iLH=25}
    var sHTML="<table id=idTabShowCartOnPageFC width='"+iW +"' height='"+ iH +"' cellpadding=3 cellspacing=3>";
    sHTML+="<tr onclick=top.location.href='"+ FCLib$.uk("url-add-product") +"'><td id=idTDTitShowCartOnPageFC colspan=2 align=center style='background-color:#"+ sBackColor +";color:#ffffff;border-width:1px;border-color:#3b6e22;font-weight:bold;font-size:12px;cursor:pointer'><div style='padding:5px; line-height:"+ iLH +"px;'>"+ sMsg +"</div></td></tr>";
    if(iErr==0){
      sHTML+="<tr height=45>";
      sHTML+="<td valign=top align=center style=cursor:pointer onclick=top.location.href='"+ FCLib$.uk("url-add-product") +"'><a href='"+ FCLib$.uk("url-add-product") +"'><span class='fc-cart-onpage-cart-txt'>"+ rk("cart-on-page-go-to-shopping-cart") +"</span></a></td>";
      sHTML+="<td align=left><img src='"+ FC$.PathImg +"iconclose.svg?cccfc=1' width=20 height=20 hspace=5 style='cursor:pointer;margin-top:10px' onclick=oDivShowCartOnPage.style.visibility='hidden'></td>";
      sHTML+="</tr>";
    }
    else{
      sHTML+="<tr height=25>";
      sHTML+="<td colspan=2 align=center><img src='"+ FC$.PathImg +"iconclose.svg?cccfc=1' width=20 height=20 hspace=5 style='cursor:pointer;margin:10px;' onclick=oDivShowCartOnPage.style.visibility='hidden'></td>";
      sHTML+="</tr>";
    }
    sHTML+="</table>";
    oDivShowCartOnPage.style.top=(typeof(IsSpy)=="boolean"?(oPos.y+300):oPos.y)+"px";
    oDivShowCartOnPage.style.left=oPos.x+"px";
    oDivShowCartOnPage.innerHTML=sHTML;
    oDivShowCartOnPage.style.visibility="visible";
    iLastCartOnPage++;
    setTimeout("if(iLastCartOnPage=="+ iLastCartOnPage +")oDivShowCartOnPage.style.visibility='hidden';",4000);
    sFLiveStore$.fnUpdateCart(true,IsFramePage);
  }
}

/* ZipCode - CEP */
function fnShowCEP(IDProd){
  if(FC$.TypeFrt==3 || FC$.TypeFrt==4){
    var sNumCEP=fnGetCookie('CEP'+FC$.IDLoja);
    if(sNumCEP==null)sNumCEP="";
    sCEP="<div id='idDivCEPFC'>";
    sCEP+="  <div id='idDivTitCEP'><span class='font-bold'>"+ rk("details-zip-code-title") +"</span></div>";
    sCEP+="  <div id='idDivContentCEP'>";
    sCEP+="    <div id='idDivContentFieldsCEP'>";
    sCEP+="      <div id='idDivCEPCalc'>";
    sCEP+="        <div class='FieldCEP FieldCEPQty'><label>"+ rk("details-zip-code-qty") +"</label><input type='number' id='idQtdZip"+ IDProd +"' value='1' maxlength='4' aria-label='qtd'></div>";
    sCEP+="        <div class='FieldCEP FieldCEPNum'><input type='text' placeholder='CEP' id='idZip"+ IDProd +"' value='"+ sNumCEP +"' maxlength='9' aria-label='zip code'></div>";
    sCEP+="        <img src='"+ FC$.PathImg +"icon-arrow-cep.svg?cccfc=1' height='50px' width='50px' alt='Simular frete' id='idCEPButton' class='FieldCEPBtn' onclick='fnGetShippingValuesProd("+ IDProd +")'>";
    sCEP+="      </div>";
    sCEP+="    </div>";
    sCEP+="    <div id='idDivImgLoadingCEPFC'><img src='"+ FC$.PathImg +"loadingcep.gif?cccfc=1' vspace=3 style='display:none;' id=ImgLoadingCEP></div>";
    sCEP+="    <div id='idShippingValues"+ IDProd +"'></div></div>";
    sCEP+="  </div>";
    if(FC$.TypeFrt==4)sCEP+="<div class='FreightTxtOnlyBR'><img src='"+FC$.PathImg+"icexclamation.svg?cccfc=1'>"+ rk("details-zip-code-simulation-brazil") +"</div>";
    sCEP+="</div>";
    var oShowCEP=document.getElementById("ShowCEP"+IDProd);
    if(oShowCEP)oShowCEP.innerHTML=sCEP;
  }
}

function fnGetShippingValuesProd(IDProd){
  sCEP=document.getElementById("idZip"+ IDProd).value;
  fnSetCookie('CEP'+FC$.IDLoja,sCEP);
  if(sCEP==""){document.getElementById("idShippingValues"+IDProd).innerHTML="<span class='freightResult' style=color:#990000;>"+ rk("get-shipping-insert-zip-code") +"</span>";return;}
  document.getElementById("idShippingValues"+IDProd).innerHTML="";
  document.getElementById("ImgLoadingCEP").style.display='';
  var iQty=document.getElementById("idQtdZip"+IDProd).value;
  if(IDProd)var sParamProd="&"+ (FCLib$.fnUseEHC()?"productid":"idproduto") +"="+ IDProd;
  else var sParamProd="";
  AjaxExecFC(FCLib$.uk("url-xml-shipping-cep"),"qty="+ iQty +"&cep="+ sCEP + sParamProd,false,processXMLCEP,IDProd);
}

function processXMLCEP(obj,IDProd){
  var sShipping="";
  var oShippingValues=document.getElementById("idShippingValues"+IDProd);
  var iErr=ReadXMLNode(obj,"err");if(iErr==null)return;
  if(iErr!="0"){
    document.getElementById("ImgLoadingCEP").style.display='none';
    oShippingValues.innerHTML="<span class='freightResult' style=color:#990000;>"+ ReadXMLNode(obj,"msg") +"</span>";
    return;
  }
  oShippingValues.innerHTML="";
  var UseCart=ReadXMLNode(obj,"UseCart");
  if(UseCart=="False"){
    var ProdName=ReadXMLNode(obj,"ProdName");
    var ProdRef=ReadXMLNode(obj,"ProdRef");  
  }
  sShipping+="<div class='ZipOptions'>";
  var iOpt=ReadXMLNode(obj,"OptQt");
  for(var i=1;i<=iOpt;i++){
    var OptName=ReadXMLNode(obj,"Opt"+ i +"Name");
    var OptImage=ReadXMLNode(obj,"Opt"+ i +"Image");
    var OptObs=ReadXMLNode(obj,"Opt"+ i +"Obs");
    if(OptObs==null)OptObs="";
    sValorFrete=ReadXMLNode(obj,"Opt"+ i +"Value");
    if(sValorFrete==FC$.Currency+" 0,00" || sValorFrete==FC$.Currency+" 0.00")sValorFrete=""+ rk("get-shipping-insert-zip-code-free-shipping") +"";
    sShipping+="<div class='ZipOption'>";
    sShipping+="  <div class='ZipNameObs'>";
    sShipping+="    <div class='ZipName'>"+ OptName +"</div>";
    sShipping+="    <div class='ZipObsVal'>"+ OptObs +"</div>";
    sShipping+="  </div>";
    sShipping+="  <div class='ZipValue'>"+ sValorFrete +"</div>";
    sShipping+="</div>";
  }
  oShippingValues.innerHTML=sShipping;
  oShippingValues.style.display="block"; 
  sShipping+="</div>";
  document.getElementById("ImgLoadingCEP").style.display='none';
}

function fnGetCookie(name){
  var arg=name+"=";
  var alen=arg.length;
  var clen=document.cookie.length;
  var i=0;
  while (i<clen){
    var j=i+alen;
    if(document.cookie.substring(i,j)==arg)return fnGetCookieVal(j);
    i=document.cookie.indexOf(" ",i)+1;
    if(i==0)break;
  }
  return null;
}

function fnGetCookieVal(offset){
  var endstr=document.cookie.indexOf(";",offset);
  if (endstr==-1)endstr=document.cookie.length;
  return unescape(document.cookie.substring(offset,endstr));
}

function fnSetCookie(name,value){
  var argv=fnSetCookie.arguments;
  var argc=fnSetCookie.arguments.length;
  var expires=(argc>2)?argv[2]:null;
  var path=(argc>3)?argv[3]:null;
  var domain=(argc>4)?argv[4]:null;
  var secure=(argc>5)?argv[5]:false;
  document.cookie=name+"="+escape(value)+((expires==null)?"":(";expires=" + expires.toGMTString()))+((path==null)?"":(";path="+path))+((domain==null)?"":(";domain="+domain))+((secure==true)?"; secure":"");
}
/* Frete - CEP - End */

/* Functions executed in the footer */
function fnFooter(){
  sFLiveStore$.fnUpdateCart(false,false);
  
  FCLib$.onReady(function(){
    FCLib$.useLangResource(oResources);
    FCLib$.execWaveInterchange();
    sFLiveStore$.fnCalculateQtyCart();
    fnChangeDivMenuPosition();
    sFLiveStore$.fnCookieWarning();
    sFLiveStore$.fnAriaLabelInclude();
    sFLiveStore$.fnGridVideoPosition();
    sFLiveStore$.fnInsertVideoGridThumb();
    sFLiveStore$.fnInsertRecommendProduct();
    sFLiveStore$.fnInsertLabelFilters();
    sFLiveStore$.fnInsertAltShimImg();
    sFLiveStore$.fnHideZipcodeTab();
    sFLiveStore$.fnBadgeDiscount();

    if(FC$.Page=="Products"){
      if(iQtdProds>2){
        var oScript=document.createElement('script');
        oScript.type='text/javascript';
        oScript.async=true;
        oScript.src=FC$.PathHtm+'js/sort-lib.js?cccfc=10';
        var sAddScript=document.getElementsByTagName('script')[0];
        sAddScript.parentNode.insertBefore(oScript,sAddScript);
      }
    }
    else if(FC$.Page=="Track"){
      FCLib$.fnOrderTrack();
    }
    else if(FC$.Page=="Cart"){
      fnButCupom();
      SaveCart$.fnShowSaveCart();
    }
    else if(FC$.Page=="Home"){
    }
    else if(FC$.Page=="News"){ /* format news full-date with local language */
      var oDateTime=document.querySelector("#idDateNewsFC");
      if(oDateTime){
        var sDatetime=oDateTime.getAttribute("datetime"),
         oDatetime=new Date(sDatetime),
         oOptions={weekday:"long",year:"numeric",month:"long",day:"numeric"},
         sFormatted;
        try{sFormatted=oDatetime.toLocaleDateString(document.documentElement.lang,oOptions);} /* try to use the html lang attr */
        catch(e){sFormatted=oDatetime.toLocaleDateString("i-default",oOptions);} /* use the user language */
        oDateTime.innerHTML=sFormatted;
        oDateTime.style.display="inline";
      }
    }
  });
  
  fnShowYear();

  FCLib$.ShowBadgeFC();
  var ListVerify=document.querySelector('.ProductList');
  if (FC$.Page=="Products" && ListVerify){
    document.querySelector('#idFCContent').setAttribute('class','col-large-9 col-xlarge-10');
  };

}

function fnFooterPed(){
  fnShowYear();
}
function fnShowYear(){
  /* Show year Rodape.htm */
  var footerDate = new Date();
  var footerYearDisplay = footerDate.getFullYear();
  var oFooterFullYear=document.getElementById("FooterFullYear");
  if(oFooterFullYear)oFooterFullYear.innerHTML = footerYearDisplay;
}

var bCascate=false;
function NoCascate(sURL){
  if(!bCascate){
    bCascate=true;
    location.href=sURL;
  }
  else bCascate=false;
}

/* Product Grid */
/* Function to show installment */
function fnMaxInstallmentsGrid(PrecoProd,MaxParcelas){
  var ComSem;
  if(typeof ParcelsValues!="undefined" && MaxParcelas==0){
    var iPosArrayValue=0;
    for(var i=0;i<ParcelsValues.length && PrecoProd>=ParcelsValues[i];i++){iPosArrayValue=i;}
    MaxParcelas=iPosArrayValue+1;
  }
  if(typeof ParcelsInterests!="undefined"){
    if(PrecoProd==0||MaxParcelas==1||ParcelsInterests.length==0)return "";
    if(MaxParcelas==0||MaxParcelas>ParcelsInterests.length)MaxParcelas=ParcelsInterests.length;
    if(ParcelsInterests[MaxParcelas-1]>0)ComSem=""; else ComSem="<font color=#333333> "+ rk("details-price-no-interest") +"</font>";
    return "<span class=EstParc> <br><b>"+MaxParcelas+"x</b>"+ComSem+" "+ rk("details-price-no-interest-in") +" <b>"+ FCLib$.formatMoney(CalculateInstallment(PrecoProd,MaxParcelas),FC$.Currency) +"</b></span>";
  }else{
    return "";
  }
}

/* Function to display formatted price */
function FormatNumber(num){
  var num=num.toString().replace(/\$|\,/g,'');
  if(isNaN(num))num="0";
  sign=(num==(num=Math.abs(num))); num=Math.floor(num*100+0.50000000001); num=Math.floor(num/100).toString();
  for(var i=0;i<Math.floor((num.length-(1+i))/3);i++)num=num.substring(0,num.length-(4*i+3))+'.'+num.substring(num.length-(4*i+3));
  return ((sign)?'':'-')+num;
}

/* Function to show saved price on promotional products */
function fnShowEconomyGrid(ProdPrice,ProdPriceOri){
  if(ProdPrice!=ProdPriceOri && typeof FormatNumber == 'function' && typeof FormatPrice == 'function' ){
    return "<font style='font-size:16px;display:block;margin:10px 0;' color=#33691e>"+ rk("details-price-save") +" <b>"+ FCLib$.formatMoney(ProdPriceOri-ProdPrice,FC$.Currency) +"</b> ("+ FormatNumber(((ProdPriceOri-ProdPrice)/ProdPriceOri)*100)+"%)</font>";
  }else{return "";}
}

/* ZipCode Grid FC - CEP - Begin */
function fnShowCEPGrid(IDProd){
  if(FC$.TypeFrt==3){
    var sNumCEP=fnGetCookie('CEP'+FC$.IDLoja);
    if(sNumCEP==null)sNumCEP="";
    sCEP="<div id='idDivCEPFC' class='ProductDet-cep-position'>";
    sCEP+="  <div id='idDivTitCEP'><span class='font-bold'>"+ rk("details-zip-code-title") +":</span></div>";
    sCEP+="  <div id='idDivContentCEP'>";
    sCEP+="    <div id='idDivContentFieldsCEP'>";
    sCEP+="      <div id='idDivCEPCalc'>";
    sCEP+="        <div class='FieldCEP FieldCEPQty'><label>"+ rk("details-zip-code-qty") +"</label><input type='number' id='idQtdZip"+ IDProd +"' value='1' maxlength='4' aria-label='qtd'></div>";
    sCEP+="        <div class='FieldCEP FieldCEPNum'><input type='text' placeholder='CEP' id='idZip"+ IDProd +"' value='"+ sNumCEP +"' maxlength='9' aria-label='zip code'></div>";
    sCEP+="        <img src='"+ FC$.PathImg +"icon-arrow-cep.svg?cccfc=1' height='50px' width='50px' id='idCEPButton' alt='Simular frete' class='FieldCEPBtn' onclick='fnGetShippingValuesProdGrid("+ IDProd +")'>";
    sCEP+="      </div>";
    sCEP+="    </div>";
    sCEP+="    <div id='idDivImgLoadingCEPFC'><img src='"+ FC$.PathImg +"loadingcep.gif?cccfc=1' alt=' ' vspace=3 style='display:none;' id=ImgLoadingCEP></div>";
    sCEP+="    <div id='idShippingValues"+ IDProd +"'></div></div>";
    sCEP+="  </div>";
    sCEP+="</div>";
    var oShowCEP=document.getElementById("ShowCEP"+IDProd);
    if(oShowCEP)oShowCEP.innerHTML=sCEP;
  }
}

function fnGetShippingValuesProdGrid(IDProd){
  sCEP=document.getElementById("idZip"+ IDProd).value;
  fnSetCookie('CEP'+FC$.IDLoja,sCEP);
  if(sCEP==""){document.getElementById("idShippingValues"+IDProd).innerHTML="<span class='freightResult'>"+ rk("get-shipping-insert-zip-code") +"</span>";return;}
  document.getElementById("idShippingValues"+IDProd).innerHTML="";
  document.getElementById("ImgLoadingCEP").style.display='';
  var iQty=document.getElementById("idQtdZip"+IDProd).value;
  if(IDProd)var sParamProd="&"+ (FCLib$.fnUseEHC()?"productid":"idproduto") +"="+ IDProd;
  else var sParamProd="";
  AjaxExecFC(FCLib$.uk("url-xml-shipping-cep"),"qty="+ iQty +"&cep="+ sCEP + sParamProd,false,processXMLCEPGrid,IDProd);
}

function processXMLCEPGrid(obj,IDProd){
  var sShipping="";
  var oShippingValues=document.getElementById("idShippingValues"+IDProd);
  var iErr=ReadXMLNode(obj,"err");if(iErr==null)return;
  if(iErr!="0"){
    document.getElementById("ImgLoadingCEP").style.display='none';
    oShippingValues.innerHTML="<span class='freightResult' style=color:#990000;>"+ ReadXMLNode(obj,"msg") +"</span>";
    return;
  }
  oShippingValues.innerHTML="";
  var UseCart=ReadXMLNode(obj,"UseCart");
  if(UseCart=="False"){
    var ProdName=ReadXMLNode(obj,"ProdName");
    var ProdRef=ReadXMLNode(obj,"ProdRef");  
  }
  sShipping+="<div class='ZipOptions'>";
  var iOpt=ReadXMLNode(obj,"OptQt");
  for(var i=1;i<=iOpt;i++){
    var OptName=ReadXMLNode(obj,"Opt"+ i +"Name");
    var OptImage=ReadXMLNode(obj,"Opt"+ i +"Image");
    var OptObs=ReadXMLNode(obj,"Opt"+ i +"Obs");
    if(OptObs==null)OptObs="";
    sValorFrete=ReadXMLNode(obj,"Opt"+ i +"Value");
    if(sValorFrete==FC$.Currency+" 0,00" || sValorFrete==FC$.Currency+" 0.00")sValorFrete=""+ rk("get-shipping-insert-zip-code-free-shipping") +"";
    sShipping+="<div class='ZipOption'>";
    sShipping+="  <div class='ZipNameObs'>";
    sShipping+="    <div class='ZipName'>"+ OptName +"</div>";
    sShipping+="    <div class='ZipObsVal'>"+ OptObs +"</div>";
    sShipping+="  </div>";
    sShipping+="  <div class='ZipValue'>"+ sValorFrete +"</div>";
    sShipping+="</div>";
  }
  oShippingValues.innerHTML=sShipping;
  oShippingValues.style.display="block"; 
  sShipping+="</div>";
  document.getElementById("ImgLoadingCEP").style.display='none';
}
/* ZipCode Grid FC - CEP - End */

FCLib$.onReady(FCLib$.showPwdViewer);
function FuncChkRegisterBegin(){FCLib$.showPwdViewer();}

/* Global Signin */
if(FC$.ClientID==0)FCLib$.onReady(fnShowGlobalSignin);

function fnShowGlobalSignin(){
  var oImgGlobalSign=sFLiveStore$.fnGetID("idImgGlobalSignFC");
  if(oImgGlobalSign){
    var bFacebookLogin=false;
    var bGoogleLogin=false;
    var sImgs="";
    if(typeof FC$.FacebookSigninID!="undefined"){
      sImgs+="<img src='"+ FC$.PathImg +"facebooklogin.svg?cccfc=1' class='FacebookSigninClass' data-loginsuccess='fnLoginShowUserName'>";
      bFacebookLogin=true;
    } 
    if(typeof FC$.GoogleSigninID!="undefined"){
      sImgs+="<img src='"+ FC$.PathImg +"googlelogin.svg?cccfc=1' class='GoogleSigninClass' data-loginsuccess='fnLoginShowUserName'>";
      bGoogleLogin=true;
    }
    if(bFacebookLogin||bGoogleLogin)oImgGlobalSign.innerHTML=sImgs;
    if(bFacebookLogin)FCLib$.signinFacebook();
    if(bGoogleLogin)FCLib$.signinGoogle();
  }
}


/* Popup Don't Go */
if(sFLiveStore$.fnGetConfig("Popup_Dont_Go")){
  if(FC$.Page=="Home" || FC$.Page=="Products"){
    FCLib$.onReady(function(){
      if(FCLib$.GetID("overlay")){
        /* Dynamic Don't Go Container */
        var dynamicDontGoContainer = document.createElement('div');
        dynamicDontGoContainer.id = 'ShowDontGoPopup';
        dynamicDontGoContainer.className = 'DontGoPopup';
        document.getElementsByTagName('body')[0].appendChild(dynamicDontGoContainer);
      
        /* Dynamic Don't Go Container Elements */
        var dynamicDontGoContainerElements = document.createElement('div');
        dynamicDontGoContainerElements.className = 'DontGoPopupContent';
        dynamicDontGoContainer.appendChild(dynamicDontGoContainerElements);
      
        /* Dynamic Don't Go Elements Close Button */
        var dynamicDontGoElementsCloseButton = document.createElement('div');
        dynamicDontGoElementsCloseButton.className = 'DontGoPopupCloseButton';
        dynamicDontGoContainerElements.appendChild(dynamicDontGoElementsCloseButton);
        dynamicDontGoElementsCloseButton.innerHTML = "<img id='idBtnDontGoClose' alt='Close popup' border='0' onclick='sFLiveStore$.fnCreateEventGA(\"DontGo\",\"Clique\",\"Close\");'>";
      
        /* Dynamic Don't Go Elements Banner */
        var dynamicDontGoElementsBanner = document.createElement('div');
        dynamicDontGoElementsBanner.className = 'DontGoBanner';
        dynamicDontGoContainerElements.appendChild(dynamicDontGoElementsBanner);
        dynamicDontGoElementsBanner.innerHTML = "<a id='idLinkDontGo' target='_self'><img id='idImgDontGo' src='' border='0' onclick='sFLiveStore$.fnCreateEventGA(\"DontGo\",\"Clique\",\"Banner\");'></a>"; 
      
        /* PreLoading Image Banner */
        var preLoadingDontGoBanner = new Image();
        preLoadingDontGoBanner.onload = function () {
          document.getElementById('idImgDontGo').src = preLoadingDontGoBanner.src;
        };
        preLoadingDontGoBanner.src = FC$.PathImg +"bannerpopupdontgo.jpg?cccfc=1";
      
        /* Show Don't Go Popup */
        FCLib$.fnDontGo(userDontGo,{
        DontGoBtnClose:FC$.PathImg +"botdontgoclose.svg?cccfc=1", /* Close button */
        DontGoBanner:FC$.PathImg +"bannerpopupdontgo.jpg?cccfc=1", /* Banner */
        DontGoLink:FCLib$.uk("url-sale"), /* Link */
        DontGoAltParam:""}, /* Alt Param */
        "DontGoCookie"); /* Cookie name */
      }
    });
  }
  function userDontGo(oParam){
    var OpenDontGoPopup=document.getElementById('ShowDontGoPopup');
    if(OpenDontGoPopup){
      document.getElementById("idBtnDontGoClose").src=oParam.DontGoBtnClose; /* Close button */
      document.getElementById("idImgDontGo").src=oParam.DontGoBanner; /* Banner */
      document.getElementById("idImgDontGo").alt=oParam.DontGoAltParam; /* Alt Param */
      document.getElementById("idLinkDontGo").href=oParam.DontGoLink; /* Link */
      sFLiveStore$.fnCreateEventGA("DontGo","Open","Window");
      window.onload=OpenDontGoPopup.style.display="block";
      var CloseDontGoPopup=document.getElementsByClassName("DontGoPopupCloseButton")[0];
      CloseDontGoPopup.onclick=function(){OpenDontGoPopup.style.display="none";}
    }
  }
  function fnDontGoActions() {
    var oDontGo = document.getElementById('ShowDontGoPopup');
    if (oDontGo) {
      window.addEventListener("keydown", (function (e) {
        if (oDontGo && e.keyCode == 27) {
          oDontGo.style.display = "none";
        }
      }), false);
      oDontGo.addEventListener("click", (function (e) {
        e.stopPropagation();
        if (e.target.id != 'DontGoPopupContent' && e.target.id == 'ShowDontGoPopup') {
          oDontGo.style.display = "none";
        }
      }), false);
    }else{
      return;
    }
  }
  document.addEventListener('DOMContentLoaded', fnDontGoActions, false);
}

/* Header Off-Canvas menu */
function headerOpenNav(){
  document.getElementById("headerSidenav").style.left="0px";
  document.getElementById("offcanvas-overlay").style.display = "block";
  document.onkeyup=function(e){
    e=e||window.event;
    if(e.keyCode==27){
      document.getElementById("headerSidenav").style.left="-250px";
      document.getElementById("offcanvas-overlay").style.display = "none";
    }
  };
}
function headerCloseNav(){
  document.getElementById("headerSidenav").style.left="-250px";
  document.getElementById("offcanvas-overlay").style.display = "none";
}


/* Shipping Calculation in shopping cart */
function fnCustomizeCart(){
  /* Inserts field requesting ZIP code for calculating left side */
  var oFCCartSubtotals=document.getElementById("FCCartSubtotals");
  if(document.getElementById("idColPesoFC"))var sColspan=3; else var sColspan=2;
  if(oFCCartSubtotals){
    var oNewElement=document.createElement("tr");
    oNewElement.setAttribute("id","FCCartFreightCalc"); 
    oNewElement.setAttribute("class","not-on-small"); 
    var oTRFreightCalc=oFCCartSubtotals.parentNode.insertBefore(oNewElement,oFCCartSubtotals);
    var sCEPCont="<td>"+ rk("cart-zip-code-title") +": ";
       sCEPCont+="<input type=text id=idZipC1 size=10 maxlength=9 class=InputText>&nbsp;";
       //sCEPCont+="<button id='idZipC1button' class='idBut' onclick='fnGetShippingValue(1)'>"+ rk("cart-zip-code-button") +"</button>";
       sCEPCont+="<input id='idZipC1button' type=button value='"+ rk("cart-zip-code-button") +"' class=idBut class=InputButton onclick='fnGetShippingValue(1)'>";
       sCEPCont+="<span id=idShippingOptions1></span>";
       sCEPCont+="</td>";
       sCEPCont+="<td align=right colspan="+ sColspan +">";
       sCEPCont+="<span id=idShippingObs1></span>";
       sCEPCont+="</td>";
       sCEPCont+="<td align=right><span id=idShippingValue1></span><img src='/images/loading.gif' vspace=3 style='display:none' id=idImgLoadingCEP1></td>";
    oTRFreightCalc.innerHTML=sCEPCont;
  }
  /* Inserts field requesting ZIP code for calculating right side */
  var oFCCartRight=document.getElementById("FCCartSmallSubtotalPrice");
  if(!oFCCartRight)oFCCartRight=document.getElementById("FCCartSmallSubtotals");
  if(oFCCartRight){
    var oNewElement=document.createElement("div");
    oNewElement.setAttribute("id","FCCartSmallFreightCalc"); 
    var oTRFreightCalc=oFCCartRight.parentNode.insertBefore(oNewElement,oFCCartRight);    
    var sCEPCont="<div id='FCCartSmallFreight'>";
       sCEPCont+="  <div id='FCCartSmallFreight-title'>";
       sCEPCont+="    <span class='FCCartFreightLabel'>"+ rk("cart-zip-code-title") +"</span>";
       sCEPCont+="  </div>";
       sCEPCont+="  <div class='FCCartSmallFreight-field' id='FCCartSmallFreight-input'>";
       sCEPCont+="     <input type=text id=idZipC2 size=10 maxlength=9 class=InputText>";
       sCEPCont+="     <input type=button value='OK' class=idBut class=InputButton onclick='fnGetShippingValue(2)'>";
       sCEPCont+="  </div>";
       sCEPCont+="  <span id=idShippingOptions2></span>";
       sCEPCont+="  <img src='/images/loading.gif' vspace=3 style='display:none' id=idImgLoadingCEP2>";
       sCEPCont+="  </div>";
       sCEPCont+="</div>";
       sCEPCont+="<div id='FCCartSmallFreightPrice'>";
       sCEPCont+="  <ul>";
       sCEPCont+="    <li class='FCCartFreightPriceLabel' id=idShippingObs2>"+ rk("cart-zip-code-shipping-title") +":</li>";
       sCEPCont+="    <li class='FCCartFreightPriceValue' id=idShippingValue2>"+ rk("cart-zip-code-to-calculate") +"</li>";
       sCEPCont+="  </ul>";
       sCEPCont+="</div>";       
    oTRFreightCalc.innerHTML=sCEPCont;
    fnGetCEP();
  }
}

function fnGetCEP(){
  /* Zipcode in cookie */
  var sNumCEP=FCLib$.GetCookie("CEP"+FC$.IDLoja);
  if(sNumCEP && sNumCEP!=""){
    document.getElementById("idZipC1").value=sNumCEP;
    document.getElementById("idZipC2").value=sNumCEP;
    fnGetShippingValue(0);
  }
}

function fnGetShippingValue(iField){
  var oShippingOptions1=document.getElementById("idShippingOptions1");
  var oShippingOptions2=document.getElementById("idShippingOptions2");
  if(oShippingOptions1)oShippingOptions1.innerHTML="";
  if(oShippingOptions2)oShippingOptions2.innerHTML="";
  if(iField==0){
    var sCEP=document.getElementById("idZipC1").value;
    if(sCEP=="")sCEP=document.getElementById("idZipC2").value;
  }
  else{
    var sCEP=document.getElementById("idZipC"+iField).value;
  }
  document.getElementById("idZipC1").value=sCEP;
  document.getElementById("idZipC2").value=sCEP;   
  FCLib$.SetCookie("CEP"+FC$.IDLoja,sCEP);
  if(sCEP==""){
    document.getElementById("idShippingValue1").innerHTML="<span style=color:#990000;>"+ rk("get-shipping-insert-zip-code") +"</span>";
    document.getElementById("idShippingValue2").innerHTML="<span style=color:#990000;>"+ rk("get-shipping-insert-zip-code") +"</span>";
  }
  else{
    document.getElementById("idShippingValue1").innerHTML="";
    document.getElementById("idShippingValue2").innerHTML="";
    var oImgLoadingCEP1=document.getElementById("idImgLoadingCEP1");
    if(oImgLoadingCEP1){oImgLoadingCEP1.style.display="";}
    var oImgLoadingCEP2=document.getElementById("idImgLoadingCEP2");
    if(oImgLoadingCEP2){oImgLoadingCEP2.style.display="";}
    AjaxExecFC(FCLib$.uk("url-xml-shipping-cep"),"cep="+ sCEP,false,fnprocessXMLCEPC);
  }
}

function fnprocessXMLCEPC(obj){
  var oShippingObs1=document.getElementById("idShippingObs1");
  var oShippingObs2=document.getElementById("idShippingObs2");
  var oShippingValue1=document.getElementById("idShippingValue1");
  var oShippingValue2=document.getElementById("idShippingValue2");
  var iErr=ReadXMLNode(obj,"err");if(iErr==null)return;
  if(iErr!="0"){
    var oImgLoadingCEP1=document.getElementById("idImgLoadingCEP1");
    if(oImgLoadingCEP1){oImgLoadingCEP1.style.display="none";}
    var oImgLoadingCEP2=document.getElementById("idImgLoadingCEP2");
    if(oImgLoadingCEP2){oImgLoadingCEP2.style.display="none";}
    oShippingValue1.innerHTML="<span id=idErrXMLCEPFC style=color:#990000;>"+ ReadXMLNode(obj,"msg") +"</span>";
    oShippingValue2.innerHTML="<span id=idErrXMLCEPFC style=color:#990000;>"+ ReadXMLNode(obj,"msg") +"</span>";
    return;
  }
  oShippingObs1.innerHTML="";oShippingObs2.innerHTML="";oShippingValue1.innerHTML="";oShippingValue2.innerHTML="";

  var sValFreteAtual="";
  var sOpFreteSelected="";
  var iOpt=ReadXMLNode(obj,"OptQt");
  if(iOpt>1){
    var bAlredySelectedOption=false;
    sOpFreteSelected=FCLib$.GetCookie("OPFrete"+FC$.IDLoja);
    if(sOpFreteSelected==null)sOpFreteSelected="";
    var oShippingOptions1=document.getElementById("idShippingOptions1");
    var oShippingOptions2=document.getElementById("idShippingOptions2");
    var sShipping="<div class='ZipOptionsCart'><select onchange=\"fnChangeFreteCart(this,'"+iValorCesta+"')\"><option>"+ rk("shipping-options") +"</option>";
    var dAgora=new Date();
    console.log("===== Regular cart [ "+ (dAgora.getDate() +"/"+(dAgora.getMonth()+1)+"/"+dAgora.getFullYear()+" "+ dAgora.getHours()+":"+dAgora.getMinutes()+":"+dAgora.getSeconds()) +" ] =====");
    console.log("Qtd de opções: "+ iOpt);
    for(var i=1;i<=iOpt;i++){
      var OptName=ReadXMLNode(obj,"Opt"+ i +"Name");
      var OptImage=ReadXMLNode(obj,"Opt"+ i +"Image");
      var OptObs=ReadXMLNode(obj,"Opt"+ i +"Obs");if(OptObs==null)OptObs="";
      var sValorFrete=ReadXMLNode(obj,"Opt"+ i +"Value");
      var bCurrentOptionSelected=((OptName==sOpFreteSelected) || (sOpFreteSelected=="" && i==1));
      //regular cart
      console.log("1) i="+i+" bCurrentOptionSelected="+ bCurrentOptionSelected+" OptName="+ OptName+" sOpFreteSelected="+ sOpFreteSelected +" iOpt="+iOpt +" bAlredySelectedOption="+ bAlredySelectedOption);
      if(sFLiveStore$.fnGetConfig("Cart_ZipCode_Price_Side_Cart")){
        if(sValorFrete==FCLib$.formatMoney(0,FC$.Currency).replace(/&nbsp;/," ") && sOpFreteSelected=="" && i==1){
          bCurrentOptionSelected=false;
        }
        else if(sOpFreteSelected=="" && i==2 && !bAlredySelectedOption){
          bCurrentOptionSelected=true;
        }
      };
      console.log("2) i="+i+" bCurrentOptionSelected="+ bCurrentOptionSelected +" bAlredySelectedOption="+ bAlredySelectedOption);
      if(bCurrentOptionSelected){sValFreteAtual=sValorFrete;bAlredySelectedOption=true;}
      sShipping+="<option value='"+ sValorFrete +"'"+ (bCurrentOptionSelected?" selected":"") +">"+ OptName +" ["+ sValorFrete +"]</option>";
      console.log("Opção "+ i +": ["+ OptName +"] "+ sValorFrete +" Atual:"+ bCurrentOptionSelected);
    }
    sShipping+="</select></div>";
    oShippingOptions1.innerHTML=sShipping;
    oShippingOptions2.innerHTML=sShipping;
    oShippingOptions1.style.display="block";
    oShippingOptions2.style.display="block";
  }
  if(sValFreteAtual==""){
    sValFreteAtual=ReadXMLNode(obj,"Opt1Value");
    FCLib$.SetCookie("OPFrete"+FC$.IDLoja,"");
  }  
  console.log("Nome da última opção de frete selecionada: ["+ sOpFreteSelected +"]");
  console.log("Valor do frete atual: "+ sValFreteAtual);
  fnShowFreteCart(sValFreteAtual,iValorCesta);
}

  function fnChangeFreteCart(obj,iValorCesta){
    var iOpFrete=obj.selectedIndex;
    if(iOpFrete>0){
      var sOpFrete=obj.options[obj.selectedIndex].text;
      var iPos=sOpFrete.indexOf(" [");
      if(iPos>0)sOpFrete=sOpFrete.substring(0,iPos);
      FCLib$.SetCookie("OPFrete"+FC$.IDLoja,sOpFrete);
      console.log("Nova opção de frete: ["+ sOpFrete +"] Valor de "+ obj.options[obj.selectedIndex].value);
      fnShowFreteCart(obj.options[obj.selectedIndex].value,iValorCesta);
    }
  }
  
function fnShowFreteCart(OptValue,iValorCesta){
  var oShippingObs1=document.getElementById("idShippingObs1");
  var oShippingObs2=document.getElementById("idShippingObs2");
  var oShippingValue1=document.getElementById("idShippingValue1");
  var oShippingValue2=document.getElementById("idShippingValue2");

  /* oShippingObs1.innerHTML="<b>"+ OptName +"</b><br><span class=ObsFreightCalc>"+ OptObs +"</span>"; */
  /* oShippingObs2.innerHTML="<b>"+ OptName +"</b><br><span class=ObsFreightCalc>"+ OptObs +"</span>"; */
  oShippingObs1.innerHTML="<b>"+ rk("process-xml-cep-shipping") +"</b>";
  oShippingObs2.innerHTML="<b>"+ rk("process-xml-cep-shipping") +"</b>";

  oShippingValue1.innerHTML=OptValue;oShippingValue1.style.display="block";
  oShippingValue2.innerHTML=OptValue;oShippingValue2.style.display="block";
  var oImgLoadingCEP1=document.getElementById("idImgLoadingCEP1");
  if(oImgLoadingCEP1){oImgLoadingCEP1.style.display="none";}
  var oImgLoadingCEP2=document.getElementById("idImgLoadingCEP2");
  if(oImgLoadingCEP2){oImgLoadingCEP2.style.display="none";}
  /* Remove elements */
  var oFCCartTotalCalc=document.getElementById("FCCartTotalCalc");
  if(oFCCartTotalCalc){oFCCartTotalCalc.parentNode.removeChild(oFCCartTotalCalc);}
  var oFCCartSmallTotalPrice=document.getElementById("FCCartSmallTotalPrice");
  if(oFCCartSmallTotalPrice){oFCCartSmallTotalPrice.parentNode.removeChild(oFCCartSmallTotalPrice);}
  /* Total displays with shipping */
  if(FC$.Language==1)var iValFrete=OptValue.replace(FC$.Currency +" ","").replace(",","");
  else var iValFrete=OptValue.replace(FC$.Currency +" ","").replace(",",".");
  var iTotalCesta=parseFloat(iValorCesta)+parseFloat(iValFrete);
  /* Inserts totals in main table */
  var oLocalInsert=document.getElementById("FCCartWrapTotal"); /* If you have packaging, try to use this position first */
  if(!oLocalInsert)oLocalInsert=document.getElementById("FCCartSubtotalPrice");
  if(!oLocalInsert)oLocalInsert=document.getElementById("FCCartSubtotals");
  if(oLocalInsert){
    var oNewElement=document.createElement("tr");
    oNewElement.setAttribute("id","FCCartTotalCalc");
    oNewElement.setAttribute("class","not-on-small");
    if(document.getElementById("idColPesoFC"))var sColspan=" colspan=2"; else var sColspan="";
    oNewElement.innerHTML="<td colspan=3 align=right><b>Total:</b></td><td align=right"+ sColspan +"><b>"+ FCLib$.formatMoney(iTotalCesta,FC$.Currency) +"</b></td>";
    fnInsertAfter(oNewElement,oLocalInsert);
  }
  /* Insert totals in small table */
  var oLocalInsert=document.getElementById("FCCartSmallWrapTotal");
  if(!oLocalInsert)oLocalInsert=document.getElementById("FCCartSmallSubtotalPrice");
  if(!oLocalInsert)oLocalInsert=document.getElementById("FCCartSmallSubtotals");
  if(oLocalInsert){
    var oNewElement=document.createElement("div");
    oNewElement.setAttribute("id","FCCartSmallTotalPrice");
    oNewElement.innerHTML="<ul><li class='FCCartSubtotalPriceLabel'>Total:</li><li class='FCCartSubtotalPriceValue'><b>"+ FCLib$.formatMoney(iTotalCesta,FC$.Currency) +"</b></li></ul>";
    fnInsertAfter(oNewElement,oLocalInsert);
  }
}

function fnInsertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/* Shipping Calculation in shopping cart */
function fnButCupom(){
  var oCupom=document.getElementById("Cupom");
  if(oCupom){
    var oNewElement=document.createElement("span");
    oNewElement.innerHTML="&nbsp;<button id='FCCartCupomBut' type='submit' onclick=\"document.Lista.Buy.value='';\">"+ rk("cart-enter-coupon-button") +"</button>";
    fnInsertAfter(oNewElement,oCupom);
  }
}

/* Save Cart/Checkout Design */
var SaveCart$=(function(){

  var iErr=0;
  var sMsg="";

  function fnShowSaveCart(){
    var oSaveCartDesign=document.getElementById("SaveCartDesign");
    if(!oSaveCartDesign)FCLib$.fnAjaxExecFC(FCLib$.uk("url-cart-list"),"format=1&n=20",false,fnProcessSaveCart,iErr,sMsg);
  }

  function fnProcessSaveCart(oHTTP,iErr,sMsg){
    var sHTTP=oHTTP.responseText;
    if(sHTTP!=""){
      var oJSON=null;
      try{oJSON=JSON.parse(sHTTP);}
      catch(e){console.log("invalid JSON from /cartlist");}
      if(oJSON)fnShowSaveCartDesign(oJSON,iErr,sMsg);
    }
    else{console.log("blank response from /cartlist");}
  }

  function fnShowSaveCartDesign(oJSON,iErr,sMsg){
    if(oJSON.msg!=undefined){
      if(oJSON.msg!=""){console.log("msg "+oJSON.msg)};
    }
    else{  
      var sCont="";
      var currencyProdCart=oJSON.currency;
      var totalProds=oJSON.totalProds;
      var totalProdsOri=oJSON.totalProdsOri;
      var ValProds=oJSON.totalProdsNum;
      var ValProdsOri=oJSON.totalProdsOriNum;
      /* Displays total saved */
      if(ValProdsOri!=ValProds){ /* if the value of the products without promotion is different from the value that is in the basket displays value saved */
        sCont+="<div class=SaveProdCart style='background:#2d9621;padding:10px;text-align:center;'><span style='font-weight:bold;color:#fcfcfc;font-size:13px;'>"+ rk("side-cart-shopping-save") +" "+ FCLib$.formatMoney((ValProdsOri-ValProds),currencyProdCart) +"</span></div>";
        if(FC$.Page="Checkout"){var oInsert=document.getElementById("idCartItemsFC");}
        if(FC$.Page="Cart"){var oInsert=document.getElementById("TabItens");}
        if(oInsert){
          var oNewElement=document.createElement("div");
          oNewElement.setAttribute("id","SaveCartDesign");
          oNewElement.setAttribute("class","save-cart-design");
          var oSaveCartDesign=oInsert.parentNode.insertBefore(oNewElement,oInsert);
          oSaveCartDesign.innerHTML=sCont;
        }
      }
    }
  }
  
  return{
    fnShowSaveCart:fnShowSaveCart
  }
})();

/* Cart Design Right bar */
var iMaxParcelsCart=0;
var Cart$=(function(){

  var iQtdTotalProd=0;

  if(FC$.LazyLoad==0)var sLazy="",sSrc="src";
  else var sLazy=" loading=lazy",sSrc="data-src";

  function fnShowCartCheckout(oRet,iErr,sMsg){
    if(FC$.Page=="Cart")
      var oObj=document.getElementById("idTitTextoFC");
      if(oObj)oObj.scrollIntoView();
    else{
      FCLib$.fnAjaxExecFC(FCLib$.uk("url-cart-list"),"format=1&n=20&d=1",false,fnProcessShowCart,iErr,sMsg);
    }
  }

  function fnProcessShowCart(oHTTP,iErr,sMsg){
    var sHTTP=oHTTP.responseText;
    if(sHTTP!=""){
      var oJSON=null;
      try{oJSON=JSON.parse(sHTTP);}
      catch(e){console.log("invalid JSON from /cartlist");}
      if(oJSON)fnShowCartDesign(oJSON,iErr,sMsg);
    }
    else{console.log("blank response from /cartlist");}
  }

  function fnShowCartDesign(oJSON,iErr,sMsg){
    iQtdTotalProd=0;
    var sProdutosNaCesta=""
    var sFinalCart="";
    iItensCesta=0;
    if(oJSON.msg!=undefined){
      if(oJSON.msg!=""){console.log("msg "+oJSON.msg)}
    }
    else{
      var currencyProdCart=oJSON.currency;
      var TotalQtyProdCart=oJSON.TotalQty;
      var subtotalProdCart=oJSON.subtotal;
      var ValCesta=oJSON.subtotalNum;
      var totalProds=oJSON.totalProds;
      var totalProdsOri=oJSON.totalProdsOri;
      var ValProds=oJSON.totalProdsNum;
      var ValProdsOri=oJSON.totalProdsOriNum;
      var totalWrapValue=oJSON.totalWrapValue;
      iItensCesta=TotalQtyProdCart;
      var oItems=oJSON.items;
      var iQtdProdsXML=oItems.length;
      iMaxParcelsCart=0;
      
      for(i=0;i<iQtdProdsXML;i++){
        //console.log("oItems",i,oItems[i]);
        var sProdAtual="";
        var ImgProdCart=oItems[i].image;
        var NomeProdCart=oItems[i].prod;
        var qtyProdCart=oItems[i].qty;
        var priceProdCart=oItems[i].price;
        var priceOriProdCart=oItems[i].priceOri;
        var ValPriceProdCart=oItems[i].priceNum;
        var ValPriceOriProdCart=oItems[i].priceOriNum;
        var saleProdCart=oItems[i].sale;
        var idProdCart=oItems[i].id;
        var idProdPed=oItems[i].iditem;
        var cor=oItems[i].cor; if(cor==undefined)cor="";
        var fil=oItems[i].fil; if(fil==undefined)fil="";
        var d1=oItems[i].d1; if(d1==undefined)d1="";
        var d2=oItems[i].d2; if(d2==undefined)d2="";
        var d3=oItems[i].d3; if(d3==undefined)d3="";
        var s1=oItems[i].s1; if(s1==undefined)s1="";
        var s2=oItems[i].s2; if(s2==undefined)s2="";
        var s3=oItems[i].s3; if(s3==undefined)s3="";
        var maxparcelsprod=oItems[i].maxparcels;
        if(maxparcelsprod>0){
          if(iMaxParcelsCart==0)iMaxParcelsCart=maxparcelsprod;
          else if(maxparcelsprod<iMaxParcelsCart)iMaxParcelsCart=maxparcelsprod;
        }
        var wrap=oItems[i].wrap; if(wrap==undefined)wrap=false;
        var wrapValue=oItems[i].wrapValue; if(wrapValue==undefined)wrapValue=0;
        var ruleName=oItems[i].ruleName;
        if(ruleName==""){var sAtrRuleNameItem=""} else {var sAtrRuleNameItem=" rulename='"+ ruleName +"'"};

        /* Product information */
        sProdAtual+="<div id='DivItem"+ idProdPed +"' class='CartDesign-product-container'"+ sAtrRuleNameItem +">";
        sProdAtual+="  <div class='CartDesign-product-img'>";
        sProdAtual+="    <div class='ImgProdCart'><a href='"+ FCLib$.uk("url-prod") +"?"+ (FCLib$.fnUseEHC()?"productid":"idproduto") +"="+ idProdCart +"'><img src='"+ ImgProdCart +"' border='0' "+ sLazy +"></a></div>";
        sProdAtual+="  </div>";
        sProdAtual+="  <div class='CartDesign-product-info-container'>";
        sProdAtual+="    <div class='CartDesign-product-info-name-delete'>";
        sProdAtual+="      <div class='CartDesign-product-info-name'>";
        sProdAtual+="        <a href='"+ FCLib$.uk("url-prod") +"?"+ (FCLib$.fnUseEHC()?"productid":"idproduto") +"="+ idProdCart +"'>"+ NomeProdCart +"</a>";
        sProdAtual+="      </div>";
        sProdAtual+="      <div class='CartDesign-product-info-delete'>";
        sProdAtual+="        <img title='Remover item da cesta' src='"+ FC$.PathImg +"delete_off.svg?cccfc=1' onmouseover='this.src=FC$.PathImg+\"delete.svg\"' onmouseout='this.src=FC$.PathImg+\"delete_off.svg\"' width=16 onclick='Cart$.fnRemoveProd("+ idProdPed +");'>";
        sProdAtual+="      </div>";
        sProdAtual+="    </div>";        
        sProdAtual+="    <div class='CartDesign-product-info-desc'>";
        sProdAtual+="     "+ cor +" "+ fil +" "+ d1 +" "+ d2 +" "+ d3 +" "+ s1 +" "+ s2 +" "+ s3 +"";
        sProdAtual+="    </div>";
        sProdAtual+="    <div class='CartDesign-product-info-qty-price'>";
        sProdAtual+="      <div class='CartDesign-product-info-qty QtdProdCart'>";
        sProdAtual+="        <div class=QtdMenos onclick='Cart$.fnChangeQtdProd("+ idProdCart +","+ idProdPed +",false);'>-</div>";
        sProdAtual+="        <div class=QtdVal data-id-prod='"+ idProdCart +"' id=QtdVal"+ idProdPed +">"+ qtyProdCart +"</div>";
        sProdAtual+="        <div class=QtdMais onclick='Cart$.fnChangeQtdProd("+ idProdCart +","+ idProdPed +",true);'>+</div>";
        sProdAtual+="      </div>";
        sProdAtual+="      <div class='CartDesign-product-info-price'>";
        sProdAtual+="        "+ currencyProdCart +" "+ priceProdCart;   
        if(priceProdCart!=priceOriProdCart)sProdAtual+="<br><span style='color:#2d9621;font-size:12px;'>"+ rk("side-cart-shopping-save") +" "+ FCLib$.formatMoney((ValPriceOriProdCart-ValPriceProdCart),currencyProdCart) +"</span>";
        var showBadgeFreeSideCartFree=sAtrRuleNameItem.indexOf("free");
        var showBadgeFreeSideCartDiscount=sAtrRuleNameItem.indexOf("discount");       
        if(showBadgeFreeSideCartFree>-1)sProdAtual+="<div class='fc-cart-discount-badge-free'>"+ rk('cart-badge-free') +"</div>";
        else if(showBadgeFreeSideCartDiscount>-1)sProdAtual+="<div class='fc-cart-discount-badge-discount'>"+ rk('cart-badge-discount') +"</div>";
        sProdAtual+="      </div>"; 
        sProdAtual+="    </div>";
        sProdAtual+="  </div>";
        sProdAtual+="</div>";
        sProdutosNaCesta=sProdAtual+sProdutosNaCesta;    
      }
      
      if(iQtdProdsXML>=20)sProdutosNaCesta="<div class='CartDesign-20-products'>"+ rk("side-cart-shopping-listing-20") +" <a href='111"+ FCLib$.uk("url-add-product") +"'>"+ rk("side-cart-shopping-listing-20-cart") +"</a>:</div>"+sProdutosNaCesta;

      if(sProdutosNaCesta!=""){
        sFinalCart=""; 

        /* Displays total saved */
        if(ValProdsOri!=ValProds){ /* if the value of the products without promotion is different from the value that is in the basket displays value saved */
          sFinalCart+="<div class='CartDesign-totalitens-container'>";
          sFinalCart+="<div class=TotItProdCart><span style='color:#2d9621;font-size:13px;'>"+ rk("side-cart-shopping-save") +" "+ FCLib$.formatMoney((ValProdsOri-ValProds),currencyProdCart) +"</span></div>";
          sFinalCart+="</div>";
        }

        if(totalWrapValue>0)ValCesta=ValCesta-totalWrapValue; /* if it has a gift price */
        /* If total product value is different from the calculated subtotal displays discounts */
        if(totalProds!=subtotalProdCart){
          var ValorDesconto=(ValProds-ValCesta);
          var PercDesconto=(100*(1-(ValCesta/ValProds)))+0.001;
          PercDesconto=fnArredonda(PercDesconto,2);

          /* Displays total without discounts */
          sFinalCart+="<div class='CartDesign-totalitens-container'>";
          sFinalCart+="<div class=TotItProdCart>"+ rk("side-cart-shopping-total-itens") +":</div>";
          sFinalCart+="<div class=TotItProdCartValor>&nbsp;&nbsp;"+ FCLib$.formatMoney(ValProds,currencyProdCart) +"</div>";
          sFinalCart+="</div>";
          /* Displays discounts */
          if(ValorDesconto>0){
            sFinalCart+="<div class='CartDesign-descontos-container'>";
            sFinalCart+="<div class=DescProdCart>"+ rk("side-cart-shopping-discount") +" ("+ PercDesconto +"%):</div>";
            sFinalCart+="<div class=DescProdCartValor>&nbsp;-&nbsp;"+ FCLib$.formatMoney(ValorDesconto,currencyProdCart) +"</div>";
            sFinalCart+="</div>";
          }
        }       
        /* Displays packaging */
        if(totalWrapValue>0){
          sFinalCart+="<tr>";
          sFinalCart+="<td colspan=3 align=right class=TotItProdCart>"+ rk("side-cart-shopping-gift") +":</td>";
          sFinalCart+="<td colspan=2 align=right class=TotItProdCartValor>&nbsp;&nbsp;"+ FCLib$.formatMoney(totalWrapValue,currencyProdCart) +"</td>";
          sFinalCart+="</tr>";
        }
        /* Displays Subtotal */
        sFinalCart+="<div class='CartDesign-product-subtotal-container-separator'><div class='CartDesign-product-subtotal-container'>";
        sFinalCart+="  <div class='CupomProdCart'>";
        sFinalCart+="    <button id='idButCup' type='submit' class='InputButton' onclick='Cart$.fnGoCupom();'>"+ rk("side-cart-shopping-enter-coupon-button") +"</button>";
        sFinalCart+="  </div>";
        sFinalCart+="  <div class='CartDesign-product-subtotal-price'>";
        sFinalCart+=rk("side-cart-shopping-subtotal");
        sFinalCart+="    &nbsp;"+ FCLib$.FormatPreco(currencyProdCart +" "+ subtotalProdCart) +"";
        sFinalCart+="  </div>";
        sFinalCart+="</div></div>";        
        /* Enter shipping calculation if store has configured by zip code */
        if(FC$.TypeFrt==3 || FC$.TypeFrt==4){           
          sFinalCart+="<div id='FCCartTotalFreight' class='CartDesign-product-zipcode-container'>";
          sFinalCart+="  <div class='CartDesign-product-zipcode-field'>";
          sFinalCart+="    <span>"+ rk("side-cart-shopping-zip-code") +"</span> <input type=text id=idZipC size=10 maxlength=9 class=InputText><button id='idButC' type='submit' class=InputButton onclick='Cart$.fnGetShippingValueCart(\""+subtotalProdCart+"\")'>"+ rk("side-cart-shopping-zip-code-button") +"</button>";
          sFinalCart+="    <span id=idShippingObs></span><span id=idShippingOptions></span>";
          sFinalCart+="  </div>";
          sFinalCart+="  <div class='CartDesign-product-zipcode-price'>";
          sFinalCart+="    <span id=idShippingValue>"+ rk("side-cart-shopping-zip-code-to-calculate") +"</span><img src='/images/loading.gif' vspace=3 style='display:none' id=idImgLoadingCEP>";
          sFinalCart+="  </div>";
          sFinalCart+="</div>";
        }
        /* Installment */
        /*sFinalCart+="<div id='FCCartTotalParcCalc' class='ParcProdCart'>"+ fnShowMaxParcelsCart(ValCesta) +"</div>";*/
        
        /* Shopping cart button */
        /* sFinalCart+="<div class=ProdCartGo><a href='"+ FCLib$.uk("url-add-product") +"'>IR PARA O CARRINHO</a></div>"; */
        /* Botao Continuar Comprando */
        sFinalCart+="<div class='ProdCartCont'><a onclick='Cart$.fnCloseCartDesign();'><&nbsp; "+ rk("side-cart-shopping-continue-shopping") +"</a></div>"; 
        /* Shopping cart payment */
        sFinalCart+="<div class='ProdCartPagto'><a href='"+ FCLib$.uk("url-checkout") +"'>"+ rk("side-cart-shopping-proceed-checkout") +"</a></div>";
      }
    }
    if (typeof IsFramePage !== 'undefined') {var oCartDesign=window.parent.document.getElementById("CartDesign");}
    else{var oCartDesign=document.getElementById("CartDesign");}
    /* Inserts element (cart) if it does not exist */
    if(!oCartDesign){
      if (typeof IsFramePage !== 'undefined'){var oInsert=window.parent.document.getElementById("idFCLeftContentRight");}
      else{var oInsert=document.getElementById("idFCLeftContentRight");}
      if(oInsert){
        var oNewElement=document.createElement("div");
        oNewElement.setAttribute("id","CartDesign");
        oNewElement.setAttribute("class","cart-design");
        oCartDesign=oInsert.parentNode.insertBefore(oNewElement,oInsert);
      }
    }

    if (typeof IsFramePage !== 'undefined'){var oBlocker=window.parent.document.getElementById("Blocker");}
    else{var oBlocker=document.getElementById("Blocker");}
    /* Inserts element (screen locked) if it does not exist */
    if(oBlocker){
      oBlocker.style.display="block";
    }
    else{
      var oNewElement=document.createElement("div");
      oNewElement.setAttribute("id","Blocker"); 
      if (typeof IsFramePage !== 'undefined'){oBlocker=window.parent.document.body.appendChild(oNewElement);}
      else{oBlocker=document.body.appendChild(oNewElement);}
      oBlocker.style.position="fixed";
      oBlocker.style.top="0";
      oBlocker.style.left="0";
      oBlocker.style.width="100%";
      oBlocker.style.height="100%";
      oBlocker.style.zIndex ="1109";  /* #CartDesign has 1110 zIndex // Vex alert has 1111 */
      oBlocker.style.cursor="pointer";
      oBlocker.style.backgroundColor="rgba(51, 51, 51, 0.50)";
      oBlocker.onclick=fnCloseBloker;
    }
    oBlocker.setAttribute('onclick','Cart$.fnCloseCartDesign();');

    document.onkeyup=function(e){
      e=e||window.event;
      if(e.keyCode==27)Cart$.fnCloseCartDesign();
      if(window.parent){
        document.onkeyup=function(e){
          e=e||window.event;
          if(e.keyCode==27)window.parent.fcSpy$.removeLastSmartModal();
        };
      }
    };

    var bTemProds=true;
    if(sProdutosNaCesta==""){bTemProds=false;sProdutosNaCesta+="<div class='CartDesign-empty'>"+ rk("side-cart-shopping-empty") +".</div>";}
    
    /* If error occurred while including error message displays. If no error occurs it does not show the message */
    if(iErr>0 && sMsg!=""){sProdutosNaCesta="<div id=DivMsgCart><div style='color:"+(iErr>0?"#ffffff":"#ffffff") +";background:"+(iErr>0?"#b61f24":"#1a75d7") +";'>"+ sMsg +"</div></div>"+sProdutosNaCesta;}

    var sTopo="<div class='CartDesign-header'>";
          sTopo+="<div class='CartDesign-header-title'>";
            sTopo+="<a style='color:#fff;' href='"+ FCLib$.uk("url-add-product") +"'>"+ rk("side-cart-shopping-cart-title") +"";
            if(iItensCesta>0)sTopo+="&nbsp; [ <span>"+ iItensCesta +" "+ ((iItensCesta>1)?""+ rk("side-cart-shopping-items") +"":""+ rk("side-cart-shopping-item") +"") +"</span> ]";
            sTopo+="</a>";
          sTopo+="</div>";
          sTopo+="<div class='CartDesign-header-close'>";
            sTopo+="<img src='"+ FC$.PathImg +"icon-bot-close-cart.svg?cccfc=1' alt='close cart' onclick='Cart$.fnCloseCartDesign();' style='cursor:pointer;'>";   
          sTopo+="</div>";
        sTopo+="</div>";    
    
    /* Cart */
    var sContCart=sTopo;
    sContCart+="<div id=idContentItensCart class=ContentItensCart>"+ sProdutosNaCesta +"</div>";
    if(sFinalCart!="")sContCart+="<div id='TabFinalCart' class='EstTabFinalCart'>"+ sFinalCart +"</div>";
    
    /* Inserts the cart element */
    oCartDesign.innerHTML=sContCart;

    /* Show cart (option with animation) */
    if(oCartDesign){
      oCartDesign.style.WebkitAnimation = "cartSlideOpen 1s forwards";
      oCartDesign.style.animation = "cartSlideOpen 1s forwards";          
    }

    /* Changes size and position depending on width */
    /* var iClientWidth=document.documentElement.clientWidth;
    if(iClientWidth<350){oCartDesign.style.width="320px";}
    if(iClientWidth<440){oCartDesign.style.top="0px";}
    var iClientHeight=document.documentElement.clientHeight;
    if(iClientHeight<590){
      var oContentItensCart=document.getElementById("idContentItensCart");
      if(oContentItensCart)oContentItensCart.style.maxHeight="215px";
    }*/

    /* If it is not empty, it carries shipping calculation function */
    if((FC$.TypeFrt==3 || FC$.TypeFrt==4) && bTemProds)fnGetCEP(subtotalProdCart); 

    /* Update cart top */
    fnUpdateCartTop(iItensCesta,currencyProdCart,subtotalProdCart);

    /* Remove product message added to cart or product not added */
    setTimeout(function(){
      if(document.getElementById('DivMsgCart')){
        oCartDesign.style.WebkitAnimation = "cartSlideCloseAuto 1s forwards";
        oCartDesign.style.animation = "cartSlideCloseAuto 1s forwards";          
      }
    },2000);
    
  }

  function fnUpdateCartTop(iItensCesta,currencyProdCart,subtotalProdCart){
    if(currencyProdCart==undefined)currencyProdCart=FC$.Currency;
    if(subtotalProdCart==undefined)subtotalProdCart="0,00";
    var oCartItemsTop=document.getElementById("idCartItemsTop");if(oCartItemsTop)oCartItemsTop.innerHTML=iItensCesta;
    var oCartItemsToolTop=document.getElementById("idCartItemsToolTop");if(oCartItemsToolTop)oCartItemsToolTop.innerHTML=iItensCesta;
    var oCartTotalTop=document.getElementById("idCartTotalTop");if(oCartTotalTop)oCartTotalTop.innerHTML=FCLib$.FormatPreco(currencyProdCart +" "+ subtotalProdCart);
    var oCartTotalToolTop=document.getElementById("idCartTotalToolTop");if(oCartTotalToolTop)oCartTotalToolTop.innerHTML=FCLib$.FormatPreco(currencyProdCart +" "+ subtotalProdCart);   
  }

  function fnCloseBloker(){
    var oBlocker=document.getElementById("Blocker");
    if(oBlocker)oBlocker.style.display="none";
    fnCloseCartDesign();
  }
  
  function fnCloseCartDesign(){
    var oCartDesign=window.top.document.getElementById("CartDesign");   
    if(oCartDesign){
      /* Hide cart (option with animation) */
      oCartDesign.style.WebkitAnimation = "cartSlideCloseBtn 1s forwards";
      oCartDesign.style.animation = "cartSlideCloseBtn 1s forwards";   
    }
    var oBlocker=window.top.document.getElementById("Blocker");
    if(oBlocker)oBlocker.style.display="none";
    if(window.parent){
      document.onkeyup=function(e){
        e=e||window.event;
        if(e.keyCode==27){
          window.parent.fcSpy$.removeLastSmartModal();
        }
      };
    }
  }

  function fnArredonda(Val,iCasas) {
    iCasas=typeof iCasas!=='undefined'?iCasas:2;
    return +(Math.floor(Val+('e+'+iCasas))+('e-'+iCasas));
  };

  function fnGoCupom(){
    if(confirm(""+ rk("checkout-enter-discount-coupon-text") +"\n\n"+ rk("checkout-enter-discount-coupon-redirected-text") +"")){top.location.href=FCLib$.uk("url-add-product")+"?#acupom";}
  }

  function fnChangeQtdProd(idProdCart,idProdPed,bMais){
    iQtdTotalProd=fnGetQtdProd(idProdCart);
    var oQtdValOri=document.getElementById("QtdVal"+idProdPed);
    if(oQtdValOri){
      var iQtdOri=parseInt(oQtdValOri.innerHTML);
      if(bMais){var iQtd=iQtdOri+1;iQtdTotalProd=iQtdTotalProd+1}
      else{var iQtd=iQtdOri-1;}
      /* If inventory controls check how many you have in the product, otherwise change the direct quantity */
      if(FC$.StockControl)FCLib$.fnAjaxExecFC(FCLib$.uk("url-product-info"),"idprod="+ idProdCart +"&format=1",false,fnChangeQtdProdStock,idProdPed,iQtd,iQtdOri);
      else fnChangeQtdProdExec(idProdPed,iQtd);
    }
  }

  function fnGetQtdProd(idProdCart){
    var oQtdVal=document.getElementsByClassName("QtdVal");
    var iQtd=0;
    for(var i=0;i<oQtdVal.length;i++){
      var oIDProd=oQtdVal[i].getAttribute("data-id-prod");
      if(oIDProd==idProdCart)iQtd=iQtd+parseInt(oQtdVal[i].innerHTML);
    }
    return iQtd;
  }

  function fnChangeQtdProdStock(oHTTP,idProdPed,iQtdSolic,iQtdOri){
    var sMsgErr="";
    var iQtdProd=null;
    var sHTTP=oHTTP.responseText;
    var bLeuEstoque=false;
    if(sHTTP!=""){
      var oJSON=null;
      try{oJSON=JSON.parse(sHTTP);}
      catch(e){console.log("invalid JSON from /infoprod");}
      if(oJSON){iQtdProd=oJSON.qtd;bLeuEstoque=(iQtdProd!=undefined);}
    }
    else{console.log("blank response from /infoprod");}
    /* console.log("bLeuEstoque:"+bLeuEstoque); */
    if(bLeuEstoque){
      //console.log("iQtdSolic:"+ iQtdSolic +" iQtdProd:"+ iQtdProd +" iQtdTotalProd:"+ iQtdTotalProd);
      if(iQtdSolic!=iQtdTotalProd){if(iQtdProd<iQtdTotalProd){alert(rk("grid-stock-higher-available"));return;}}
      if(iQtdProd<iQtdOri){
        iQtdSolic=iQtdProd; /* if the original quantity is greater than the quantity in stock, the quantity requested is the quantity of the product */
        if(iQtdSolic==0){sMsgErr=""+ rk("product-has-been-removed-from-cart") +"";}
        else {sMsgErr=""+ rk("quantity-changed-quantity-stock") +" "+ iQtdProd;}
      }
    }
    else{
      iQtdProd=iQtdSolic; /* If you can not read product stock, use the requested stock */
    }
    if(iQtdSolic<=iQtdProd)fnChangeQtdProdExec(idProdPed,iQtdSolic); else sMsgErr=""+ rk("unfortunately-not-have") +" "+ iQtdSolic +" "+ rk("unfortunately-not-have-units-stock") +"";
    if(sMsgErr!="")alert(sMsgErr);
  }

  function fnChangeQtdProdExec(idProdPed,iQtdSolic){
    fnInsertLoading(idProdPed);
    if(iQtdSolic==0)var sMsg=""+ rk("change-qty-product-removed") +""; else var sMsg=""+ rk("change-qty-amount-changed") +"";
    AjaxExecFC(FCLib$.uk("url-recalculate"),"q"+ idProdPed +"="+iQtdSolic,false,fnShowCartCheckout,0,sMsg); 
  }

  function fnRemoveProd(idProdPed){
    fnInsertLoading(idProdPed);
    AjaxExecFC(FCLib$.uk("url-recalculate"),"q"+ idProdPed +"=0",false,Cart$.fnShowCartCheckout,0,""+ rk("change-qty-cart-product-removed") +"");
  }

  function fnInsertLoading(idProdPed){
    var oObj=document.getElementById("DivItem"+idProdPed);
    var sH="112";/* Default height */
    var sM="28";/* Standard margin top */
    var iHeight=oObj.offsetHeight;
    if(iHeight && iHeight>0){sH=iHeight-1;sM=((iHeight-50)/2);}
    if(oObj)oObj.innerHTML="<div style='width:100%;height:"+ sH +"px;text-align:center;'><img style='margin-top:"+ sM +"px;' src=/images/loading_ajax.gif></div>"
  }

  function fnGetCEP(iValorCesta){
    /* Zip code in cookie */
    var sNumCEP=FCLib$.GetCookie("CEP"+FC$.IDLoja);
    if(sNumCEP && sNumCEP!=""){
      window.top.document.getElementById("idZipC").value=sNumCEP;
      fnGetShippingValueCart(iValorCesta);
    }
  }
   
  function fnGetShippingValueCart(iValorCesta){
    var oShippingOptions=window.top.document.getElementById("idShippingOptions");
    if(oShippingOptions)oShippingOptions.innerHTML="";
    var sCEP=window.top.document.getElementById("idZipC").value;
    FCLib$.SetCookie("CEP"+FC$.IDLoja,sCEP);
    if(sCEP==""){window.top.document.getElementById("idShippingValue").innerHTML="<span style=color:#d61a2d;>"+ rk("side-cart-shopping-zip-code-invalid") +"</span>";}
    else{
      window.top.document.getElementById("idShippingValue").innerHTML="";
      var oImgLoadingCEP=window.top.document.getElementById("idImgLoadingCEP");
      if(oImgLoadingCEP){oImgLoadingCEP.style.display="";}
      AjaxExecFC(FCLib$.uk("url-xml-shipping-cep"),"cep="+ sCEP,false,fnProcessXMLCEPCart,iValorCesta);
    }
  }
  
  function fnProcessXMLCEPCart(obj,iValorCesta){
    var oShippingObs=window.top.document.getElementById("idShippingObs");
    var oShippingValue=window.top.document.getElementById("idShippingValue");
    oShippingObs.innerHTML="";
    oShippingValue.innerHTML="";
    var iErr=ReadXMLNode(obj,"err");if(iErr==null)return;
    if(iErr!="0"){
      var oImgLoadingCEP=window.top.document.getElementById("idImgLoadingCEP");
      if(oImgLoadingCEP){oImgLoadingCEP.style.display="none";}
      oShippingValue.innerHTML="<span id=idErrXMLCEPFC style=color:#990000;>"+ ReadXMLNode(obj,"msg") +"</span>";
      return;
    }
    var sValFreteAtual="";
    var sOpFreteSelected="";
    var iOpt=ReadXMLNode(obj,"OptQt");
    if(iOpt>1){
      var bAlredySelectedOption=false;
      sOpFreteSelected=FCLib$.GetCookie("OPFrete"+FC$.IDLoja);
      if(sOpFreteSelected==null)sOpFreteSelected="";
      var oShippingOptions=window.top.document.getElementById("idShippingOptions");
      var sShipping="<div class='ZipOptionsCart'><select onchange=\"Cart$.fnChangeFrete(this,'"+iValorCesta+"')\"><option>"+ rk("shipping-options") +"</option>";
      var dAgora=new Date();
      console.log("===== Side cart [ "+ (dAgora.getDate() +"/"+(dAgora.getMonth()+1)+"/"+dAgora.getFullYear()+" "+ dAgora.getHours()+":"+dAgora.getMinutes()+":"+dAgora.getSeconds()) +" ] =====");
      console.log("Qtd de opções: "+ iOpt);
      for(var i=1;i<=iOpt;i++){
        var OptName=ReadXMLNode(obj,"Opt"+ i +"Name");
        var OptImage=ReadXMLNode(obj,"Opt"+ i +"Image");
        var OptObs=ReadXMLNode(obj,"Opt"+ i +"Obs");if(OptObs==null)OptObs="";
        var sValorFrete=ReadXMLNode(obj,"Opt"+ i +"Value");
        var bCurrentOptionSelected=((OptName==sOpFreteSelected) || (sOpFreteSelected=="" && i==1));
        //side cart
        console.log("1) i="+i+" bCurrentOptionSelected="+ bCurrentOptionSelected+" OptName="+ OptName+" sOpFreteSelected="+ sOpFreteSelected +" iOpt="+iOpt +" bAlredySelectedOption="+ bAlredySelectedOption);
        if(sFLiveStore$.fnGetConfig("Cart_ZipCode_Price_Side_Cart")){
          if(sValorFrete==FCLib$.formatMoney(0,FC$.Currency).replace(/&nbsp;/," ") && sOpFreteSelected=="" && i==1){
            bCurrentOptionSelected=false;
          }
          else if(sOpFreteSelected=="" && i==2 && !bAlredySelectedOption){
            bCurrentOptionSelected=true;
          }
        };
        console.log("2) i="+i+" bCurrentOptionSelected="+ bCurrentOptionSelected +" bAlredySelectedOption="+ bAlredySelectedOption);
        if(bCurrentOptionSelected){sValFreteAtual=sValorFrete;bAlredySelectedOption=true;}
        sShipping+="<option value='"+ sValorFrete +"'"+ (bCurrentOptionSelected?" selected":"") +">"+ OptName +" ["+ sValorFrete +"]</option>";
        console.log("Opção "+ i +": ["+ OptName +"] "+ sValorFrete +" Atual:"+ bCurrentOptionSelected);
        console.log("=======================");
      }
      sShipping+="</select></div>";
      oShippingOptions.innerHTML=sShipping;
      oShippingOptions.style.display="block";
    }
    if(sValFreteAtual==""){
      sValFreteAtual=ReadXMLNode(obj,"Opt1Value");
      FCLib$.SetCookie("OPFrete"+FC$.IDLoja,"");
    }  
    console.log("Nome da última opção de frete selecionada: ["+ sOpFreteSelected +"]");
    console.log("Valor do frete atual: "+ sValFreteAtual);
    fnShowFrete(sValFreteAtual,iValorCesta);
  }

  function fnChangeFrete(obj,iValorCesta){
    var iOpFrete=obj.selectedIndex;
    if(iOpFrete>0){
      var sOpFrete=obj.options[obj.selectedIndex].text;
      var iPos=sOpFrete.indexOf(" [");
      if(iPos>0)sOpFrete=sOpFrete.substring(0,iPos);
      FCLib$.SetCookie("OPFrete"+FC$.IDLoja,sOpFrete);
      console.log("Nova opção de frete: ["+ sOpFrete +"] Valor de "+ obj.options[obj.selectedIndex].value);
      fnShowFrete(obj.options[obj.selectedIndex].value,iValorCesta);
    }
  }

  function fnShowFrete(OptValue,iValorCesta){
    console.log("Calculando com o valor "+OptValue);
    var oShippingObs=window.top.document.getElementById("idShippingObs");
    var oShippingValue=window.top.document.getElementById("idShippingValue");
    oShippingObs.innerHTML="";
    oShippingValue.innerHTML="";
    /* oShippingObs.innerHTML="<b>"+ OptName +"</b><br><span class=ObsFreightCalc>"+ OptObs +"</span>"; */
    oShippingValue.innerHTML=OptValue;
    oShippingValue.style.display="block";
    var oImgLoadingCEP=window.top.document.getElementById("idImgLoadingCEP");
    if(oImgLoadingCEP){oImgLoadingCEP.style.display="none";}
    /* Removes elements */
    var oFCCartTotalCalc=window.top.document.getElementById("FCCartTotalCalc");
    if(oFCCartTotalCalc){oFCCartTotalCalc.parentNode.removeChild(oFCCartTotalCalc);}
    var oFCCartTotalParcCalc=window.top.document.getElementById("FCCartTotalParcCalc");
    if(oFCCartTotalParcCalc){oFCCartTotalParcCalc.parentNode.removeChild(oFCCartTotalParcCalc);}
    /* Displays total with shipping */
    if(FC$.Language==1){
      var iValFrete=OptValue.replace(FC$.Currency +" ","").replace(",","");
      iValorCesta=iValorCesta.replace(",","");
    }
    else{
      var iValFrete=OptValue.replace(FC$.Currency +" ","").replace(",",".");
      iValorCesta=iValorCesta.replace(".","").replace(",",".");
    }
    var iTotalCesta=parseFloat(iValorCesta)+parseFloat(iValFrete);
    /* Enter totals in the main table */
    var oLocalInsert=window.top.document.getElementById("FCCartTotalFreight");
    if(oLocalInsert){
      var oNewElement=document.createElement("div");
      oNewElement.setAttribute("id","FCCartTotalCalc");
      oNewElement.innerHTML="<div class='CartDesign-totalcart-container'><div class='TotalFProdCart'>"+ rk("side-cart-shopping-zip-code-total-pay") +":</div><div class='TotalFProdCartValor'>&nbsp;&nbsp;"+ FCLib$.formatMoney(iTotalCesta,FC$.Currency) +"</div></div>";
      fnInsertAfter(oNewElement,oLocalInsert);
    }
    /* Inserts installment in main table */
    var oLocalInsert=window.top.document.getElementById("FCCartTotalCalc");
    /*if(oLocalInsert){
      var oNewElement=document.createElement("tr");
      oNewElement.setAttribute("id","FCCartTotalParcCalc");
      if(document.getElementById("idColPesoFC"))var sColspan="5"; else var sColspan="4";
      oNewElement.innerHTML="<td colspan=5 align=right class=ParcProdCart>"+ fnShowMaxParcelsCart(iTotalCesta) +"</td>";
      fnInsertAfter(oNewElement,oLocalInsert);
    }*/
  }

  function fnShowMaxParcelsCart(CartValue){
    if(typeof ParcelsInterests!="undefined"){
      var iMaxParcels=ParcelsInterests.length;
      if(typeof ParcelsValues!="undefined"){
        var iPosArrayValue=0;
        for(var i=0;i<ParcelsValues.length && CartValue>=ParcelsValues[i];i++){iPosArrayValue=i;}
        iMaxParcels=iPosArrayValue+1;
      }
      if(iMaxParcelsCart>0 && iMaxParcels>iMaxParcelsCart)iMaxParcels=iMaxParcelsCart;
      if(iMaxParcels>1){
        return rk("side-cart-shopping-interest-1") + iMaxParcels + rk("side-cart-shopping-interest-2") +" "+ FCLib$.formatMoney(CalculateInstallment(CartValue,iMaxParcels),FC$.Currency);
      }
      else {return "";}
    }
    else {return "";}
  }
  
  return{
    fnShowCartCheckout:fnShowCartCheckout,
    fnRemoveProd:fnRemoveProd,
    fnGetShippingValueCart:fnGetShippingValueCart,
    fnCloseCartDesign:fnCloseCartDesign,
    fnChangeQtdProd:fnChangeQtdProd,
    fnChangeFrete:fnChangeFrete,
    fnGoCupom:fnGoCupom
  }

})();


/* Mobile ProductList Filters */
function fnChangeDivMenuPosition(){ 
  if(FC$.Page=="Products"){
    var mediaQuery = window.matchMedia('(max-width: 1023px)');
    document.getElementById("fc-mobile-dynamic-filter").style.display=(FCLib$.pQuery?"block":"none");
    mediaQuery.addListener(mediaContentResolution);
    function mediaContentResolution(mediaQuery) {    
      if (mediaQuery.matches) {
        document.getElementById("ProductsFilterFC").style.display="none";
        setTimeout(function(){ 
          document.getElementById("ProductsFilterFC").style.display="block";
          document.getElementById('ProductsFilterFCMobile').innerHTML = document.getElementById("ProductsFilterFC").innerHTML;
          document.getElementById("ProductsFilterFC").innerHTML = "";
        },900);
      } else {
        setTimeout(function(){ 
          if(document.getElementById('ProductsFilterFCMobile').innerHTML!=""){
            document.getElementById('ProductsFilterFC').innerHTML = document.getElementById('ProductsFilterFCMobile').innerHTML;
            document.getElementById('ProductsFilterFCMobile').innerHTML = "";
          }
        },600);
      }
    }
    mediaContentResolution(mediaQuery);
  }
}
function filterOpenNav(){
  document.getElementById("filterSidenav").style.left="0px";
  document.getElementById("filter-offcanvas-overlay").style.display = "block";
  document.onkeyup=function(ekey){
    ekey=ekey||window.event;
    if(ekey.keyCode==27){
      document.getElementById("headerSidenav").style.left="-300px";
      document.getElementById("filter-offcanvas-overlay").style.display = "none";
    }
  };
}
function filterCloseNav(){
  document.getElementById("filterSidenav").style.left="-300px";
  document.getElementById("filter-offcanvas-overlay").style.display = "none";
}

/* Product Stock */
function fnGetStockProduct(sStockProduct){
  if(sFLiveStore$.fnGetConfig("Product_Details_Show_Stock")){
    var productStock=document.getElementById("product-details-show-stock");
    if(sStockProduct==0){productStock.innerHTML=""}
    else if(sStockProduct<=6){
      productStock.innerHTML="<span>"+ rk("details-stock-only-text") +" <span class='product-details-show-stock-lastoff'>"+ sStockProduct +"</span> "+ rk("details-stock-in-stock-text") +" </span><br><div class='product-details-progress-bar product-details-color1 product-details-stripes'><span class='product-details-stripes-size'></span></div>"
    }
    else if(sStockProduct<=10){
      productStock.innerHTML="<span>"+ rk("details-stock-only-text") +" <span class='product-details-show-stock-lastoff'>"+ sStockProduct +"</span> "+ rk("details-stock-in-stock-text") +" </span><br><div class='product-details-progress-bar2 product-details-color2 product-details-stripes2'><span class='product-details-stripes-size2'></span></div>"
    }
    else if(sStockProduct>=11){productStock.innerHTML=""}
    else{productStock.innerHTML=""}
  }
}

/* Show Date Prom */
function fnGetDate(sDateTime,IsMMDD){
    var IsDate=false;
    var oDate=null;
    var aDateTime=sDateTime.split(' ');
    if(aDateTime.length<=2){
      var oMatchesDate=/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})$/.exec(aDateTime[0]);
      if(oMatchesDate!=null){
        if(IsMMDD){
          var m=parseInt(oMatchesDate[1]-1,10);
          var d=parseInt(oMatchesDate[2],10);
        }
        else{
          var d=parseInt(oMatchesDate[1],10);
          var m=parseInt(oMatchesDate[2]-1,10);
        }
        var y=parseInt(oMatchesDate[3],10);
        if(y<30)y+=2000;
        else if(y<100)y+=1900;
        if(aDateTime.length==2){
          var oMatchesTime=/^(\d{1,2})[:](\d{1,2})$/.exec(aDateTime[1]);
          if(oMatchesTime!=null){
            var hh=parseInt(oMatchesTime[1],10);
            var mm=parseInt(oMatchesTime[2],10);
            var oNewDate=new Date(y,m,d,hh,mm);
            IsDate=(oNewDate.getMinutes()==mm && oNewDate.getHours()==hh && oNewDate.getDate()==d && oNewDate.getMonth()==m && oNewDate.getFullYear()==y);
          }
        }
        else{
          var oNewDate=new Date(y,m,d,2);
          IsDate=(oNewDate.getDate()==d && oNewDate.getMonth()==m && oNewDate.getFullYear()==y);
        }
        if(IsDate)oDate=oNewDate;
      }
    }
    return {IsDate:IsDate, oDate:oDate};
}

function fnFormatN(n){
  n=""+n;
  if(n.length==1)n="0"+n;
  return n;
}

function fnShowDateProm(sDateTime){
  if(sFLiveStore$.fnGetConfig("Product_Details_Show_Date_Promotion")){
    var oOut=document.getElementById("DataProm");
    if(oOut){
      var IsMMDD=false;
      var oGetDate=fnGetDate(sDateTime,IsMMDD);
      if(oGetDate.IsDate){
      setInterval(function() {
        var dDataPromFim=oGetDate.oDate;
        var dAgora=new Date();
        var dFaltam=(dDataPromFim-dAgora); /* retorna em milissegundos */
        var iHoras=new Date(dFaltam+10800000).getHours(); /* horas > diferença de 3 horas (+10800000) */
        var iMinutos=new Date(dFaltam+10800000).getMinutes(); /* minutos > diferença de 3 horas (+10800000) */
        var iSeconds=new Date(dFaltam+10800000).getSeconds(); /* segundos > diferença de 3 horas (+10800000) */
        dFaltam=parseInt(dFaltam/1000/60/60/24); /* quantos dias restam para acabar a promoção */
        if(dDataPromFim>dAgora && dFaltam<10){ /* só exibe informação quando faltarem 10 dias para acabar a promoção */
          var sCont="<div class='product-details-data-prom-date-container'>"+ rk("details-promotion-valid-until-text") +" <b class='product-details-data-prom-date'>"+ fnFormatN(dDataPromFim.getDate()) +"/"+ fnFormatN(1+dDataPromFim.getMonth()) +"/"+ dDataPromFim.getFullYear() +" "+ rk("details-promotion-valid-until-at-text") +" "+ fnFormatN(dDataPromFim.getHours()) +":"+ fnFormatN(dDataPromFim.getMinutes()) +".</b></div><div class='product-details-lats-hours'>"+ rk("details-promotion-left-text") +"</div>";
          if(dFaltam<1){
            sCont+="<div class='product-details-data-prom-container'>";
            if(iHoras>=2){
               sCont+="<div class='product-details-data-prom-time'><div class='product-details-data-prom-time-title'>"+ iHoras +"</div><div class='product-details-data-prom-time-txt'>"+ rk("details-promotion-left-hour-text") +""+ (iHoras>=1?"s</div></div>":"");
             }else if(iHoras==1){
               sCont+="<div class='product-details-data-prom-time'><div class='product-details-data-prom-time-title'>"+ iHoras +"</div><div class='product-details-data-prom-time-txt'>"+ rk("details-promotion-left-hour-text") +""+ (iHoras>=1?"</div></div>":"");
            }
            if(iMinutos>0)sCont+="<div class='product-details-data-prom-time'><div class='product-details-data-prom-time-title'>"+iMinutos+"</div><div class='product-details-data-prom-time-txt'>"+ rk("details-promotion-left-min-text") +""+(iMinutos>=1?"</div></div>":"");
            if(iSeconds>0)sCont+="<div class='product-details-data-prom-time'><div class='product-details-data-prom-time-title'>"+iSeconds+"</div><div class='product-details-data-prom-time-txt'>"+ rk("details-promotion-left-sec-text") +""+(iSeconds>=1?"</div></div>":"");
            sCont+="</div>";}
            else if(dFaltam==1){
              sCont+="<div class='product-details-data-prom-container'><div class='product-details-data-prom-time'><div class='product-details-data-prom-time-title'>"+ dFaltam +"</div><div class='product-details-data-prom-time-txt'>"+ rk("details-promotion-left-day-text") +"</div></div>";
            if(iHoras>=2){
             sCont+="<div class='product-details-data-prom-time'><div class='product-details-data-prom-time-title'>"+ iHoras +"</div><div class='product-details-data-prom-time-txt'>"+ rk("details-promotion-left-hour-text") +""+ (iHoras>=1?"s</div></div>":"");
             }else if(iHoras==1){
               sCont+="<div class='product-details-data-prom-time'><div class='product-details-data-prom-time-title'>"+ iHoras +"</div><div class='product-details-data-prom-time-txt'>"+ rk("details-promotion-left-hour-text") +""+ (iHoras>=1?"</div></div>":"");
            }
            if(iMinutos>0)sCont+="<div class='product-details-data-prom-time'><div class='product-details-data-prom-time-title'>"+iMinutos+"</div><div class='product-details-data-prom-time-txt'>"+ rk("details-promotion-left-min-text") +""+(iMinutos>=1?"</div></div>":"");
            if(iSeconds>0)sCont+="<div class='product-details-data-prom-time'><div class='product-details-data-prom-time-title'>"+iSeconds+"</div><div class='product-details-data-prom-time-txt'>"+ rk("details-promotion-left-sec-text") +""+(iSeconds>=1?"</div></div>":"");
              sCont+="</div>";
            }
        else if(dFaltam>1){sCont+="<div class='product-details-data-prom-time'><div class='product-details-data-prom-time-title'>"+ dFaltam +"</div><div class='product-details-data-prom-time-txt'>"+ rk("details-promotion-left-day-text") +"s</div></div>";}
          oOut.innerHTML=sCont;
        }
        },1000);
      }
    }
  }
}