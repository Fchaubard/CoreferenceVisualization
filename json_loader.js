var main = document.getElementById('main');
var dropbox = document.getElementById('dropbox');
var container = document.getElementById('container');
var thejsonfile = document.getElementById('thejsonfile');
var state = document.getElementById('status');
var docList = document.getElementById('doclist');
var thejsonobject;
var showOnlyTest = true; //if false then show only train

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


//create and add toggle button for train and test
var toggleDiv = document.createElement("div");
toggleDiv.setAttribute('id','train_test_toggle');
toggleDiv.setAttribute('class','toggle-modern');
document.getElementById('leftBar').appendChild(toggleDiv);
$('#train_test_toggle').toggles({
    drag: true, // can the toggle be dragged
    click: true, // can it be clicked to toggle
    text: {
      on: 'Test Docs Only', // text for the ON position
      off: 'Train Docs Only' // and off
    },
    on: true, // is the toggle ON on init
    animate: 250, // animation time
    transition: 'ease-in-out', // animation transition,
    checkbox: null, // the checkbox to toggle (for use in forms)
    clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
    width: 150, // width used if not set in css
    height: 20, // height if not set in css

    type: 'compact' // if this is set to 'select' then the select style toggle will be used
  });

$('#train_test_toggle').on('toggle', function (e, active) {
    if (active) {
        showOnlyTest=true;

    } else {
        showOnlyTest=false;
    }
    addBackAllDocs();
});




// Create the segment for the sorting 
var toggleDiv = document.createElement("div");
toggleDiv.setAttribute('id','sort_segment');
toggleDiv.setAttribute('class','toggle-modern');
document.getElementById('leftBar').appendChild(toggleDiv);
$('#sort_segment').toggles({
    drag: true, // can the toggle be dragged
    click: true, // can it be clicked to toggle
    text: {
      on: 'MUC F1', // text for the ON position
      off: 'B3 F1' // and off
    },
    on: true, // is the toggle ON on init
    animate: 250, // animation time
    transition: 'ease-in-out', // animation transition,
    checkbox: null, // the checkbox to toggle (for use in forms)
    clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
    width: 150, // width used if not set in css
    height: 20, // height if not set in css

    type: 'compact' // if this is set to 'select' then the select style toggle will be used
  });

$('#sort_segment').on('toggle', function (e, active) {
    if (active) {
        jsonArray=jsonArray.sort(dynamicSort("MUC_F1"));

    } else {
        jsonArray=jsonArray.sort(dynamicSort("B3_F1"));
    }
    addBackAllDocs();
});



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
      jsonArray = jsonArray.sort(dynamicSort("MUC_F1"));
  	  //Empty the list
	    while(ul.firstChild) {
	     ul.removeChild( ul.firstChild );
	    }
	    //Clear the doc display
      $( "#docDisplay" ).text("");
      $( "#docScores" ).text("");
      
      for (var i =0  ; i < jsonArray.length; i++) {
        var doc = jsonArray[i];
        if((showOnlyTest && doc.type=='test')||(!showOnlyTest && doc.type=='train') ){
          var li = document.createElement("li");
          li.setAttribute("id", "li_"+i);
  	      //Flag element as docitem
  	      li.className = "docItem";
  	      li.innerHTML=doc.id;

          ul.appendChild(li);
        }
      };

      ul.addEventListener("click",function(e) {
            // e.target is our targetted element.
            // try doing console.log(e.target.nodeName), it will result LI

            if(e.target && e.target.nodeName == "LI") {

                console.log(e.target.id + " was clicked");
                var re = /li_/gi;
                var docNumClicked = e.target.id.replace(re, "");
		            //unselect all docitems
		            $( ".docItem" ).removeClass("selected");
		            $( "#"+e.target.id ).addClass("selected");
                //var contentSpan = document.getElementById('contentSpan');
                display(jsonArray[parseInt(docNumClicked)].content);
                changeScoreBox(jsonArray[parseInt(docNumClicked)]);
                //contentSpan.innerHTML = jsonArray[parseInt(docNumClicked)].content.string.join(" ");
            }
        });

      document.getElementById('leftBar').appendChild(ul);
      //var contentSpan = document.getElementById('contentSpan');
      //contentSpan.innerHTML = jsonArray[0].content.string.join(" ");
      display(jsonArray[0].content);
      changeScoreBox(jsonArray[0]);

    }catch(e){
     console.error("Parsing error!!!:", e); 
    }

  };

  return false;
};


function addBackAllDocs(){

  document.getElementById('doclist').innerHTML='';
  var firstIndex=-1;
  for (var i =0  ; i < jsonArray.length; i++) {
        
        var doc = jsonArray[i];

        if((showOnlyTest && doc.type=='test')||(!showOnlyTest && doc.type=='train') ){
          //var ul = document.getElementById('doclist');
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
      //contentSpan.innerHTML = jsonArray[0].content.string.join(" ");
      if(firstIndex>-1){
          display(jsonArray[firstIndex].content);
          changeScoreBox(jsonArray[firstIndex]);
      }
      else{
        display(jsonArray[0].content);
        changeScoreBox(jsonArray[0]);
      }
      
}


function searchDoc(){
    document.getElementById('doclist').innerHTML='';
    var query = document.getElementById('searchBox').value.toLowerCase();
    var firstIndex=-1;
    for (var i =0  ; i < jsonArray.length; i++) {
        
        var doc = jsonArray[i];
        //var ul = document.getElementById('doclist');
        if ((doc.id.toLowerCase().indexOf(query) !== -1)||(doc.content.string.join(" ").toLowerCase().indexOf(query) !== -1)){
          

          if((showOnlyTest && doc.type=='test')||(!showOnlyTest && doc.type=='train') ){
            if (firstIndex==-1){
              firstIndex=i;
            }
            var li = document.createElement("li");
            li.setAttribute("id", "li_"+i);
            //li.innerHTML= "<span>"+doc.id+"</span>";
            li.innerHTML=doc.id;
            document.getElementById('doclist').appendChild(li);
          }
        }
        //$('#doclist').append('<li>Document: '+ doc.id +'</li>');
      };
      //var contentSpan = document.getElementById('contentSpan');
      //contentSpan.innerHTML = jsonArray[firstIndex].content.string.join(" ");
      if(firstIndex>-1){
          display(jsonArray[firstIndex].content);
          changeScoreBox(jsonArray[firstIndex]);
      }
      else{
        $( "#docDisplay" ).text("");
        $( "#docScores" ).text("");
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

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property]> b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}


function changeScoreBox(score){
  var string = "<br/><b>MUC_P: </b>"+score.MUC_P+" <br/><b>MUC_R: </b>"+score.MUC_R+" <br/><b>MUC_F1: </b>"+score.MUC_F1+" <br/><b>B3_P: </b>"+score.B3_P+" <br/><b>B3_R: </b>"+score.B3_R+" <br/><b>B3_F1: </b>"+score.B3_F1;

  $( "#docScores" ).text("");
  $( "#docScores" ).append($(document.createElement('span')).append(string).append(" "));

}



