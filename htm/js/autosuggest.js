/* Parameters */
var g1='5'; /* Number of items in group g1(Terms), Default 5, Maximum 9, 0 Does not display */
var g2='5'; /* Number of items in group g2(Pages), Default 3, Maximum 9, 0 Does not display */
var g3='5'; /* Number of items in group g3(Products), Default 5, Maximum 9, 0 Does not display */
var g4='5'; /* Number of items in group g4(News), Default 3, Maximum 9, 0 Does not display */
var GoogleMaxTerms=5; /* Maximum amount of suggested terms from Google. 0 does not display */
var aGoogleTerms;

function getGoogleTerms(sTerm){
  "use strict";
  aGoogleTerms=[];
  FCLib$.fnGetSuggestions(sTerm,false,fnCallbackGetGoogleTerms);
}

function fnCallbackGetGoogleTerms(aTerms){
  "use strict";
  aGoogleTerms=aTerms;
}

function injectGoogleTerms(oSuggest,aTerms){
  "use strict";
  var iTerms=aTerms.length;
  if(iTerms>0){
    if(iTerms>GoogleMaxTerms)iTerms=GoogleMaxTerms;
    if(!oSuggest["SearchTerms"])oSuggest["SearchTerms"]=[];
    var iExistentes=oSuggest["SearchTerms"].length,aExistentes=[];
    for(var i=0;i<iExistentes;i++)aExistentes[oSuggest.SearchTerms[i].label]=true;
    for(var i=0;i<iTerms;i++)if(!aExistentes[aTerms[i]])oSuggest["SearchTerms"].push({"label":aTerms[i],"q":"?","category":rk("auto-suggest-suggested-searches-title")});
  }
}

jQuery.noConflict();
jQuery(function (jQuery) {

jQuery.widget( "custom.autocomplete", jQuery.ui.autocomplete, {
    _create: function() {
      this._super();
      this.widget().menu("option", "items", "> li:not(.ui-autocomplete-category)");
    },
    _renderMenu: function( ul, items ) {
        var self = this,
            currentCategory = "";
        jQuery.each( items, function( index, item ) {
            if ( item.category != currentCategory ) {
                ul.append( "<li class='ui-autocomplete-category'><span class='as-categoria'>" + fnrk(item.category) + "</span></li>" );
                currentCategory = item.category;
            }
            self._renderItemData( ul, item );
        });
    }
});

jQuery("#autocomplete").autocomplete({
  select: function( event, ui ) { 
    if (ui.item.q){
      jQuery('#autocomplete-form').submit();
      return false;           
    }
    if (ui.item.c){
      var idProducts = ui.item.id;
      window.location.href = "/prod,"+ (FCLib$.fnUseEHC()?"productid":"idproduto") +","+idProducts;
      return false;           
    }
    if (ui.item.u){
      window.location.href = ui.item.u.replace("&amp;","&");
      return false;           
    }
    if(ui.item.s){
      var idNews = ui.item.id;
      window.location.href = "/news,"+ (FCLib$.fnUseEHC()?"newsid":"idnoticia") +","+idNews;
      return false;           
    }
  },
  focus: function(event,ui) {  
      var sValInputText = ui.item.value
        .replace(/&quot;/g,'"')
        .replace(/&apos;/g,"'")
        .replace(/&amp;/g,"&")
        .replace(/&lt;/g,"<")
        .replace(/&gt;/g,">")
        .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(n); });
      jQuery('input#autocomplete').val(sValInputText);
      return false;
  },                                          
  source: function (request, response) {
      getGoogleTerms(request.term);
      jQuery.ajax({
          url: "/autosuggest.asp?idloja="+ FC$.IDLoja +"&format=1&q="+ request.term +"&g1="+g1+"&g2="+g2+"&g3="+g3+"&g4="+g4,
          dataType: "json",
          type: "GET",                     
          success: function (data) {
            var iGoogleWait=0;
            successAjax(request.term,data,response,iGoogleWait);
          },
          error: function (a, b, c) {
              debugger;
          }
      });
  },
  minLength: 3
})
  
  .autocomplete("instance")._renderItem = function( ul, item ) {

    jQuery('li.active:even').css('background-color', '#f6f6f6');

    /* Terms */
    if(item.q){      
      if(item.q>1)var sProdLabel=rk("auto-suggest-product-plural");
      else var sProdLabel=rk("auto-suggest-product") +"&nbsp;&nbsp;";
      var t = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + jQuery.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
      var sQtdProduto=(item.q=="?")?"":"<span>" + item.q + "&nbsp;"+ sProdLabel +"&nbsp;</span>";
      return jQuery("<li class='active'></li>")                
      .data("ui-autocomplete-item", item)
      .append("<a><table width='100%'><tr><td width='90%' id='as-nome-termos'><span>"+t+"</span></td><td align='right' id='as-qtd-termos'>"+ sQtdProduto +"</td></tr></table></a>")
      .appendTo(ul);                    
    }

    /* Products */
    if (item.c){
      if (item.fp == 0){
        valor=rk("auto-suggest-call-us");
      }else{
        valor = FCLib$.formatMoney(item.fp,FC$.Currency);
      }
      if(item.fp!=item.op && item.op!=0.00){
        sSale="<span style='background-color:#65984d;color:#ffffff;padding:3px;' class='SearchSaleFC'>&nbsp;"+sF$.fnFormatNumber(((item.op-item.fp)/item.op)*100)+"%&nbsp;"+ rk("auto-suggest-price-off") +"&nbsp;</span>&nbsp;&nbsp;";}
      else{
        sSale=""
      }
      var nm = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + jQuery.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
      return jQuery("<li class='active'></li>")
      .data("ui-autocomplete-item", item)
      .append("<a><table width='100%'><tr height='75px'><td align=center class='SearchIMGFC'><span><img src='"+ (item.im.slice(0,1)=="#"?FC$.PathPrdExt+item.im.slice(1):FC$.PathPrd+item.im) + "' id='as-img-prod' style='vertical-align:middle;'></span></td><td width='55%'><div id='as-nomecat-prod'><span id='as-nome-prod'>" + nm + "</span><br/><span id='as-cat-prod'>" + item.c + "</span></div></td><td width=25 class='as-sale'>"+ sSale +"</td><td align='right' id='as-valor-prod' nowrap='nowrap'><span>" + valor +"</span></td></tr></table></a>")
      .appendTo(ul);
    }   

    /* Pages */
    if (item.u){           
      var p = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + jQuery.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");           
      return jQuery("<li class='active'></li>")
      .data("ui-autocomplete-item", item)
      .append("<a><table width='100%'><tr valign='0'><td id='as-nome-pag'><a href='" + item.u + "'>" + p + "</td></tr></table></a>")
      .appendTo(ul);                    
    }

    /* News */
    if (item.s){        
      var t = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + jQuery.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");           
      return jQuery("<li class='active'></li>")
      .data("ui-autocomplete-item", item)
      .append("<a><table width='100%'><tr valign='0'><td width='65%' id='as-nome-not'>" + t + "</td><td align='right' id='as-data-not'>" + item.d + "</td></tr></table></a>")
      .appendTo(ul);                    
    }
  };

  function successAjax(sTerm,data,response,iGoogleWait){
    if(!FCLib$.bDoneSuggestions && iGoogleWait<5){setTimeout(function(){successAjax(sTerm,data,response,++iGoogleWait);},100);return void(0);}
    if(GoogleMaxTerms>0)injectGoogleTerms(data,aGoogleTerms);
    var json0 = data.SearchTerms;
    var json1 = data.Products;
    var json2 = data.RelatedPages;
    var json3 = data.News;
    if(jQuery.isArray(json0)) {
        json0 = json0;
    }else{
      json0 = [  ];
    };                          
    if(jQuery.isArray(json1)) {
        json1 = json1;
    }else{
      json1 = [  ];
    };                          
    if(jQuery.isArray(json2)) {
        json2 = json2;
    }else{
      json2 = [  ];
    };                          
    if(jQuery.isArray(json3)) {
        json3 = json3;
    }else{
      json3 = [  ];
    };
    var json = [].concat(json0,json1,json2,json3);
    response(jQuery.map(json, function (item) {
        return {
            category: item.category,
            /* Terms */
            t: item.label,
            q: item.q,
            /* Products */
            nm: item.label,
            id: item.id,
            c: item.c,
            im: item.im,
            op: item.op,
            fp: item.fp,
            v: item.v,
            /* Pages */
            p: item.label,
            u: item.u,
            /* News */
            id: item.id,
            t:item.label,
            s: item.s,
            d: item.d,
            label: item.label
            }
    }));
  }
});

function fnrk(sItem){
  var oKeys={
    "Buscas sugeridas":"auto-suggest-suggested-search-label",
    "Suggested Terms":"auto-suggest-suggested-search-label",
    "B&#250;squedas sugeridas":"auto-suggest-suggested-search-label",
    "Buscas sugeridas":"auto-suggest-suggested-search-label",

    "Produtos sugeridos":"auto-suggest-suggested-products-label",
    "Suggested products":"auto-suggest-suggested-products-label",
    "Productos sugeridos":"auto-suggest-suggested-products-label",
    "Produtos sugeridos":"auto-suggest-suggested-products-label",

    "P&#225;ginas relacionadas":"auto-suggest-related-pages-label",
    "Related pages":"auto-suggest-related-pages-label",
    "P&#225;ginas relacionadas":"auto-suggest-related-pages-label",
    "P&#225;ginas relacionadas":"auto-suggest-related-pages-label",

    "Not&#237;cias":"auto-suggest-news-label",
    "News":"auto-suggest-news-label",
    "Noticias":"auto-suggest-news-label",
    "Not&#237;cias":"auto-suggest-news-label"
  };
  if(oKeys[sItem])return rk(oKeys[sItem]);
  else return sItem;
}