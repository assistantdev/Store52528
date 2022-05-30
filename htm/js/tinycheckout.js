/*Tiny Checkout 2021-10-15 FSA*/
var fcTinyCheckout$=(function(){
  "use strict";
  var checkIdDeliveryDataFC,checkNivel7,checkNivel1,idChkTabRegisterFC,contactsIDsArr,addressIDsArr,contactInputsArr,addressInputsArr,deliveryIDsArr,deliveryInputsArr,checkButtonDelivery,contactsPJIDsArr,contactPJInputsArr,fieldsPTBRonly;
  function prepareNewDIVchkt(newDIVName,IDsArray,childrenNumber,nameInputArray,typeOfData){
    var createNewDIV=document.createElement("DIV");
    createNewDIV.setAttribute("id",newDIVName);
    function createAlertDiv(){
      var createNewDIVAlert=document.createElement("DIV");
      createNewDIVAlert.setAttribute("id",newDIVName+"Alert");
      createNewDIVAlert.innerHTML="<b>"+rk("tiny-checkout-box-message-previous-item")+"</b>";
      createNewDIV.appendChild(createNewDIVAlert);
    }
    function createNewTrTitle(newIdName,newClassName,titleText){
      var createNewTRtitle=document.createElement("TR");
      createNewTRtitle.setAttribute("id",newIdName);
      createNewTRtitle.appendChild(document.createElement("TD"));
      createNewTRtitle.firstElementChild.setAttribute("class",newClassName);
      createNewTRtitle.firstElementChild.innerText=titleText;
      createNewDIV.appendChild(createNewTRtitle);
    }
    if(typeOfData=="address"){
      if(!document.getElementById("idShippingFC"))createNewTrTitle("idShippingFC","EstChkTabTopo",rk("register-checkout-shipping-information"));
      createAlertDiv();
    }
    if(typeOfData=="delivery"){
      if(checkNivel7)createNewDIV.setAttribute("style","display:none;");
      createNewTrTitle("idDeliveryTitleFC","EstChkTabTopo",rk("tiny-checkout-delivery-address"));
      if(checkNivel1)createAlertDiv();
    }
    var createNewDIVSub1=document.createElement("DIV");
    createNewDIVSub1.setAttribute("id",newDIVName+"Sub1");
    var createNewDIVSub2=document.createElement("DIV");
    createNewDIVSub2.setAttribute("id",newDIVName+"Sub2");
    createNewDIV.appendChild(createNewDIVSub1);
    createNewDIV.appendChild(createNewDIVSub2);
    function hideSubs1and2(){
      createNewDIVSub1.setAttribute("style","height:0");
      createNewDIVSub2.setAttribute("style","height:0");
    }
    if(typeOfData=="address"){
      hideSubs1and2();
      if(checkNivel7||checkNivel1)checkIdDeliveryDataFC.setAttribute("style","display:none");
    }
    if(typeOfData=="delivery" && checkNivel1)hideSubs1and2();
    idChkTabRegisterFC.children[0].insertBefore(createNewDIV,idChkTabRegisterFC.children[0].children[childrenNumber]);
    IDsArray.forEach(function(item,index){
      if(!document.getElementById(item))return;
      if(index==0 && typeOfData!="delivery")createNewDIV.insertBefore(document.getElementById(item),createNewDIV.children[0]);
      else if(FC$.Language!=0 && fieldsPTBRonly.indexOf(item)>-1)return;
      else createNewDIVSub1.appendChild(document.getElementById(item));
    });
    var createNewButton=document.createElement("BUTTON");
    createNewButton.appendChild(document.createTextNode(rk("tiny-checkout-save-button")));
    createNewButton.setAttribute("onclick","fcTinyCheckout$.showContactInfosResume('button','"+createNewDIVSub2.id+"',fcTinyCheckout$."+nameInputArray+",'"+createNewDIVSub1.id+"','"+typeOfData+"')");
    createNewDIVSub1.appendChild(createNewButton);
  }
  function checkInputInfos(inputArray){
    var result=true;
    var notMandatory=["P2EnderecoCompl","P2NomeLocal","P2Para","P2PEmail","P2PEnderecoCompl"];
    if(FC$.Language!=0)notMandatory.push("P2EnderecoNum");
    inputArray.forEach(function(item){
      if(document.getElementById(item))if(document.getElementById(item).value=="" && notMandatory.indexOf(item)==-1)result=false;
    });
    return result;
  }
  function showContactInfosResume(loadORbutton,divID,nameInputArray,divToHide,typeOfData){
    if(checkInputInfos(nameInputArray)){
      var divToInsert=document.getElementById(divID);
      divToInsert.innerHTML="";
      nameInputArray.forEach(function(item){
        if(FC$.Language!=0 && fieldsPTBRonly.indexOf(item)>-1)return;
        else if(item!=="P2SenhaCli" && item!=="P2SenhaCliConfirma")divToInsert.innerHTML+="<p>"+document.getElementById(item).value+"</p>";
      });
      divToInsert.innerHTML+='<button onclick="fcTinyCheckout$.enableEditing(\''+divToHide+'\',\''+divID+'\',\''+typeOfData+'\')">'+rk("tiny-checkout-edit-button")+'</button>';
      document.getElementById(divToHide).setAttribute("style","display:none;");
      document.getElementById(divID).removeAttribute("style");
      function hideAlertShowSubs1and2(DIVtypeName){
        document.getElementById("new"+DIVtypeName+"DataDIVSub1").style.height="";
        document.getElementById("new"+DIVtypeName+"DataDIVSub2").style.height="";
        document.getElementById("new"+DIVtypeName+"DataDIVAlert").style.display="none";          
      }
      if(typeOfData=="contact"){
        hideAlertShowSubs1and2("Address");
        if(document.getElementById("newAddressDataDIVSub1").style.display=="none" && checkNivel7||checkNivel1)checkIdDeliveryDataFC.removeAttribute("style");
      }
      if(typeOfData=="address"){
        if(checkNivel7||checkNivel1)checkIdDeliveryDataFC.removeAttribute("style");
        if(checkNivel1)hideAlertShowSubs1and2("Delivery");
      }
    }
    else{
      if(loadORbutton=="load")return;
      else alert(rk("tiny-checkout-alert-fill-fields"));
    }
  }
  function enableEditing(divInputs,divResume,typeOfData){
    document.getElementById(divInputs).removeAttribute("style");
    document.getElementById(divResume).setAttribute("style","display:none;");
    function hideSubsShowAlert(DIVtypeName){
      document.getElementById("new"+DIVtypeName+"DataDIVSub1").style.height="0";
      document.getElementById("new"+DIVtypeName+"DataDIVSub2").style.height="0";
      document.getElementById("new"+DIVtypeName+"DataDIVAlert").removeAttribute("style");
    }
    if(typeOfData=="contact"){
      hideSubsShowAlert("Address");
      if(checkNivel7||checkNivel1)checkIdDeliveryDataFC.setAttribute("style","display:none");
    }
    if(typeOfData=="address"){
      if(checkNivel7||checkNivel1)checkIdDeliveryDataFC.setAttribute("style","display:none");
      if(checkNivel1)hideSubsShowAlert("Delivery");
    }
  }
  function hideOptionalInputs(PForPJ){
    var checkInpuntsOnConfig=[oStoreConfig$.Show_idCountryFC,oStoreConfig$.Show_idBirthdayFC,oStoreConfig$.Show_idPassRemFC,oStoreConfig$.Show_idCellPhoneFC,oStoreConfig$.Show_idGenderFC,oStoreConfig$.Show_idAccInfoFC,oStoreConfig$.Show_idTxtCEP1FC,oStoreConfig$.Show_idLocalFC,oStoreConfig$.Show_idParaFC,oStoreConfig$.Show_idPEmailFC,oStoreConfig$.Show_idPPaisFC,oStoreConfig$.Show_idTxtCEP2FC];
    if(PForPJ=="PF") checkInpuntsOnConfig.push(oStoreConfig$.Show_idTxtCPFFC,oStoreConfig$.Show_idOccupationFC);
    else if(PForPJ=="PJ")checkInpuntsOnConfig.push(oStoreConfig$.Show_idTxtCPFFC_PJ,oStoreConfig$.Show_idOccupationFC_PJ,oStoreConfig$.Show_idFAXFC_PJ);
    checkInpuntsOnConfig.forEach(function(item){
      var idItem=item[1].match(/id[^end]\S*\w/);
      if(!item[0] && idItem)if(document.getElementById(idItem[0]))document.getElementById(idItem[0]).setAttribute("class","hideFieldsConfig");
    });
  }
  function anotherAddress(){
    function enableEdition(){
      document.getElementById("newDeliveryDataDIV").style.display='';
      document.getElementById("newDeliveryDataDIVSub1").style.display='';
      document.getElementById("newDeliveryDataDIVSub2").style.display='none';
    }
    function hideNewDeliveryDataDIV(){document.getElementById("newDeliveryDataDIV").style.display='none';}
    if(checkNivel7){
      if(checkButtonDelivery && checkButtonDelivery.checked)enableEdition();
      if(checkButtonDelivery && !checkButtonDelivery.checked)hideNewDeliveryDataDIV();
    }
    if(checkNivel1){
      if(checkButtonDelivery && checkButtonDelivery.checked)hideNewDeliveryDataDIV();
      if(checkButtonDelivery && !checkButtonDelivery.checked)enableEdition();
    }
  }
  function checkForm(){
    var aErrContact,aErrAddress,aErrDelivery;
    function getErrDivs(){
      aErrContact=document.querySelectorAll('#newContactDataDIV .EstErrField:not([style*="none"])');
      aErrAddress=document.querySelectorAll('#newAddressDataDIV .EstErrField:not([style*="none"])');
      aErrDelivery=document.querySelectorAll('#newDeliveryDataDIV .EstErrField:not([style*="none"])');
    }
    getErrDivs();
    if(aErrContact.length>0 || aErrAddress.length>0 || aErrDelivery.length>0)F$.bValidForm=false;
    setInterval(function(){
      if(!F$.bValidForm){
        getErrDivs();
        if(aErrContact.length>0)enableEditing('newContactDataDIVSub1','newContactDataDIVSub2','contact');
        if(aErrAddress.length>0)enableEditing('newAddressDataDIVSub1','newAddressDataDIVSub2','address');
        if(aErrDelivery.length>0)enableEditing('newDeliveryDataDIVSub1','newDeliveryDataDIVSub2','delivery');
        F$.bValidForm=true;
      }
    },200);
  }
  function main(){
    if(oStoreConfig$.Show_TinyCheckout[0]){
      checkForm();
      checkIdDeliveryDataFC=document.getElementById("idDeliveryDataFC");
      checkNivel7=F$.IsCheckEntregaInverso&&checkIdDeliveryDataFC?true:false;
      checkNivel1=!F$.IsCheckEntregaInverso&&checkIdDeliveryDataFC?true:false;
      idChkTabRegisterFC=document.getElementById("idChkTabRegisterFC");
      contactsIDsArr=["idBillingInfoFC","idNameFC","idCPFFC","idRGFC","idBirthdayFC","idGenderFC","idOccupationFC","idPhoneFC","idCellPhoneFC","idEmailFC","idPasswordFC","idPasswordCFC","idPassRemFC","idEmMktFC"];
      addressIDsArr=["idShippingFC","idZipCodeFC","idAddressFC","idAddress2FC","idAddress3FC","idNeighborhoodFC","idCityFC","idStateFC","idCountryFC"];
      contactInputsArr=["P2Nome","P2CPF","P2Telefone","P2Email","P2SenhaCli","P2SenhaCliConfirma"];
      addressInputsArr=["P2CEP","P2Endereco","P2EnderecoNum","P2EnderecoCompl","P2Bairro","P2Cidade","P2Estado"];
      fieldsPTBRonly=["idCPFFC","idAddress3FC","idNeighborhoodFC","idtrPEnderecoComplFC","idPBairroFC","P2CPF","P2EnderecoCompl","P2Bairro","idIEFC","P2RG","P2PEnderecoCompl","P2PBairro"];
      if(checkNivel7||checkNivel1){
        deliveryIDsArr=["idLocalFC","idParaFC","idPEmailFC","idPPaisFC","idPCEPFC","idPEnderecoFC","idtrPEnderecoNumFC","idtrPEnderecoComplFC","idPBairroFC","idPCidadeFC","idPEstadoFC","idPTelefoneFC"];
        deliveryInputsArr=["P2NomeLocal","P2Para","P2PEmail","P2PCEP","P2PEndereco","P2PEnderecoNum","P2PEnderecoCompl","P2PBairro","P2PCidade","P2PEstado","P2PTelefone"];
        checkButtonDelivery=document.getElementById("P2DadosEntrega");
        if(checkButtonDelivery)checkButtonDelivery.setAttribute("onchange","fcTinyCheckout$.anotherAddress();");
      }
      prepareNewDIVchkt("newAddressDataDIV",addressIDsArr,2,"addressInputsArr","address");
      if(!document.getElementById("idCompanyNameFC")){
        prepareNewDIVchkt("newContactDataDIV",contactsIDsArr,0,"contactInputsArr","contact");
        if(checkNivel7||checkNivel1)prepareNewDIVchkt("newDeliveryDataDIV",deliveryIDsArr,12,"deliveryInputsArr","delivery");
        hideOptionalInputs("PF");
        showContactInfosResume("load","newContactDataDIVSub2",contactInputsArr,"newContactDataDIVSub1","contact");
      } else {
        contactsPJIDsArr=["idBillingInfoFC","idCompanyNameFC","idCPFFC","idIEFC","idNameFC","idPhoneFC","idCellPhoneFC","idFAXFC","idOccupationFC","idEmailFC","idPasswordFC","idPasswordCFC","idPassRemFC","idEmMktFC"];
        contactPJInputsArr=["P2NomeEmpresa","P2CPF","P2RG","P2Nome","P2Telefone","P2Email","P2SenhaCli","P2SenhaCliConfirma"];
        prepareNewDIVchkt("newContactPJDataDIV",contactsPJIDsArr,0,"contactPJInputsArr","contact");
        if(checkNivel7||checkNivel1)prepareNewDIVchkt("newDeliveryDataDIV",deliveryIDsArr,10,"deliveryInputsArr","delivery");
        hideOptionalInputs("PJ");
        showContactInfosResume("load","newContactPJDataDIVSub2",contactPJInputsArr,"newContactPJDataDIVSub1","contact");
      }
      showContactInfosResume("load","newAddressDataDIVSub2",addressInputsArr,"newAddressDataDIVSub1","address");
    }
  }
  main();
  return{
    anotherAddress:anotherAddress,
    showContactInfosResume:showContactInfosResume,
    enableEditing:enableEditing,
    contactInputsArr:contactInputsArr,
    addressInputsArr:addressInputsArr,
    deliveryInputsArr:deliveryInputsArr,
    contactPJInputsArr:contactPJInputsArr
  }
})();