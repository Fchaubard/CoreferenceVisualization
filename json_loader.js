var main = document.getElementById('main');
var dropbox = document.getElementById('dropbox');
var container = document.getElementById('container');
var thejsonfile = document.getElementById('thejsonfile');
var state = document.getElementById('status');
var docList = document.getElementById('doclist');
var thejsonobject;

var stateStr = 'Drag JSON output file here';
var dropStr = 'Drop JSON file!';

if (typeof window.FileReader === 'undefined') {
  state.className = 'File API & FileReader unavailable';
} else {
  state.className = 'success';
  state.innerHTML = stateStr;
}
 
dropbox.ondragover = function () { this.className = 'hover'; state.innerHTML = dropStr; return false; };
dropbox.ondragend = function () { this.className = 'nohover'; state.innerHTML = stateStr; return false; };
dropbox.ondragleave = function (){ this.className = 'nohover'; state.innerHTML = stateStr; return false; };
container.ondragover = function() {main.className = 'hover'; return false; };
container.ondragleave = function() {main.className = 'nohover'; return false; };

//Create search box
var mi = document.createElement("input");
mi.setAttribute('type', 'text');
mi.setAttribute('value', '');
mi.setAttribute('onkeydown','checkForEmptyInput()');
mi.setAttribute('onkeyup','searchDoc()');
mi.setAttribute('className','rounded');
mi.setAttribute('id','searchBox');
document.getElementById('leftBar').appendChild(mi);

//Create doc list
var ul = document.createElement("ul");
ul.setAttribute('className', 'top-level');
ul.setAttribute('id', 'doclist');

main.ondrop = function (e) {

  //enable container
  $( "#container" ).show();
  $( "#key" ).show();
  //hide dropbox
  $( "#dropbox" ).hide();
    
  this.className = 'drop';
  state.innerHTML = stateStr;
  e.preventDefault();

  var file = e.dataTransfer.files[0],
      reader = new FileReader();


  reader.onload = function (event) {
    console.log(event.target);
    dropbox.style.background = 'url(' + event.target.result + ') no-repeat center';
  };

  console.log(file);
  reader.readAsText( file, "UTF-8" ) 

  reader.onload = function(e){
    try {
      jsonArray = JSON.parse(reader.result);
	//Empty the list
	while(ul.firstChild) {
	    ul.removeChild( ul.firstChild );
	}
	//Clear the doc display
      $( "#docDisplay" ).text("");
      
      for (var i =0  ; i < jsonArray.length; i++) {
        var doc = jsonArray[i];
        var li = document.createElement("li");
        li.setAttribute("id", "li_"+i);
        li.innerHTML=doc.id;
        ul.appendChild(li);
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

  document.getElementById('doclist').innerHTML='';
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
    var query = document.getElementById('searchBox').value.toLowerCase();
    var firstIndex=-1;
    for (var i =0  ; i < jsonArray.length; i++) {
        
        var doc = jsonArray[i];
        //var ul = document.getElementById('doclist');
        if ((doc.id.toLowerCase().indexOf(query) !== -1)||(doc.content.string.join(" ").toLowerCase().indexOf(query) !== -1)){
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
      if(firstIndex>-1){
          display(jsonArray[firstIndex].content);
      }
      else{
        $( "#docDisplay" ).text("");
      }
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


