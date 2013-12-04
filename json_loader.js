var holder = document.getElementById('holder'),
    thejsonfile = document.getElementById('thejsonfile'),
    state = document.getElementById('status'),
    docList = document.getElementById('doclist');

var thejsonobject;

//docList.style.visibility="hidden";

if (typeof window.FileReader === 'undefined') {
  state.className = 'fail';
} else {
  state.className = 'success';
  state.innerHTML = 'File API & FileReader available';
}
 
holder.ondragover = function () { this.className = 'hover'; document.getElementById('feedMe').innerHTML = 'drop it like its hot!'; return false; };
holder.ondragend = function () { this.className = 'nohover';document.getElementById('feedMe').innerHTML = 'Feed me JSON file!'; return false; };
holder.ondragleave = function (){ this.className = 'nohover'; document.getElementById('feedMe').innerHTML = 'Feed me JSON file!'; return false; };

holder.ondrop = function (e) {

 //enable container
 $( "#container" ).toggle();


  this.className = 'nohover';
  document.getElementById('feedMe').innerHTML = 'Feed me JSON file!';
  e.preventDefault();

  var file = e.dataTransfer.files[0],
      reader = new FileReader();


  reader.onload = function (event) {
    console.log(event.target);
    holder.style.background = 'url(' + event.target.result + ') no-repeat center';
  };

  console.log(file);
  reader.readAsText( file, "UTF-8" ) 
  state.innerHTML = 'GOTCHURFILE';
  reader.onload = function(e){

    //thejsonfile.innerHTML = reader.result;
    try {

      jsonArray = JSON.parse(reader.result);
      if(document.getElementById('searchBox')){
          document.getElementById('leftBar').innerHTML='';
          document.getElementById('doclist').innerHTML = '';

      }
      //docList.style.visibility="visible";
      
      //var contentSpan = document.getElementById('contentSpan');
      //contentSpan.innerHTML = '';
      $( "#docDisplay" ).text("");

      var mi = document.createElement("input");
      mi.setAttribute('type', 'text');
      mi.setAttribute('value', '');
      mi.setAttribute('onkeydown','checkForEmptyInput()');
      mi.setAttribute('onkeyup','searchDoc()');
      mi.setAttribute('className','rounded');
      mi.setAttribute('id','searchBox');

      document.getElementById('leftBar').appendChild(mi);
      
      var ul = document.createElement("ul");
      ul.setAttribute('className', 'top-level');
      ul.setAttribute('id', 'doclist');

      for (var i =0  ; i < jsonArray.length; i++) {
        
        var doc = jsonArray[i];
        //var ul = document.getElementById('doclist');

        var li = document.createElement("li");
        li.setAttribute("id", "li_"+i);
        //li.innerHTML= "<span>"+doc.id+"</span>";
        li.innerHTML=doc.id;

        

        ul.appendChild(li);

        
        //$('#doclist').append('<li>Document: '+ doc.id +'</li>');
      };
      ul.addEventListener("click",function(e) {
            // e.target is our targetted element.
            // try doing console.log(e.target.nodeName), it will result LI

            if(e.target && e.target.nodeName == "LI") {

                console.log(e.target.id + " was clicked");
                var re = /li_/gi;
                var docNumClicked = e.target.id.replace(re, "");
                //var contentSpan = document.getElementById('contentSpan');
                display(jsonArray[parseInt(docNumClicked)].content);
                //contentSpan.innerHTML = jsonArray[parseInt(docNumClicked)].content.string.join(" ");
            }
        });

      document.getElementById('leftBar').appendChild(ul);
      //var contentSpan = document.getElementById('contentSpan');
      //contentSpan.innerHTML = jsonArray[0].content.string.join(" ");
      display(jsonArray[0].content);

    }catch(e){
     console.error("Parsing error!!!:", e); 
    }

  };

  return false;
};


function addBackAllDocs(){
  for (var i =0  ; i < jsonArray.length; i++) {
        
        var doc = jsonArray[i];
        //var ul = document.getElementById('doclist');

        var li = document.createElement("li");
        li.setAttribute("id", "li_"+i);
        //li.innerHTML= "<span>"+doc.id+"</span>";
        li.innerHTML=doc.id;

        

        document.getElementById('doclist').appendChild(li);

        
        //$('#doclist').append('<li>Document: '+ doc.id +'</li>');
      };
      //var contentSpan = document.getElementById('contentSpan');
      //contentSpan.innerHTML = jsonArray[0].content.string.join(" ");
    
      display(jsonArray[0].content);
}


function searchDoc(){

    document.getElementById('doclist').innerHTML='';
    var query = document.getElementById('searchBox').value;
    var firstIndex=-1;
    for (var i =0  ; i < jsonArray.length; i++) {
        
        var doc = jsonArray[i];
        //var ul = document.getElementById('doclist');

        if ((doc.id.indexOf(query) !== -1)||(doc.content.string.join(" ").indexOf(query) !== -1)){
          if (firstIndex==-1){
            firstIndex=i;
          }
          var li = document.createElement("li");
          li.setAttribute("id", "li_"+i);
          //li.innerHTML= "<span>"+doc.id+"</span>";
          li.innerHTML=doc.id;

          

          document.getElementById('doclist').appendChild(li);
        }

        
        //$('#doclist').append('<li>Document: '+ doc.id +'</li>');
      };
      //var contentSpan = document.getElementById('contentSpan');
      //contentSpan.innerHTML = jsonArray[firstIndex].content.string.join(" ");
      
      display(jsonArray[0].content);
  

  
  //alert(document.getElementById('searchBox').value);

}

function checkForEmptyInput(){

   var KeyID = event.keyCode;
   if(document.getElementById('searchBox').value.length < 2 ){
     switch(KeyID)
     {
        case 8:
        addBackAllDocs();
        break; 
        case 46:
        addBackAllDocs();
        break;
        default:
        break;
     }
   }else{
    searchDoc();
   }


}


