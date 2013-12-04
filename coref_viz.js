var colorIdx=0;
var colorMap = [];
var colors = ["#E41A1C","#377EB8","#4DAF4A","#984EA3","#FF7F00","#A65628","#F781BF","#999999","#A6CEE3","#1F78B4","#B2DF8A","#33A02C","#FB9A99","#E31A1C","#FDBF6F","#FF7F00","#CAB2D6","#6A3D9A","#FFFF99"];
var currentMentionId = -1;
var mentionSpans=[];
var currentContent;
var interiorMentionClick = false;

function resetGlobals(){
	colorIdx=0;
	colorMap = [];
	currentMentionId = -1;
	mentionSpans=[];
	interiorMentionClick = false;
}


//Return a color from the colors array for the given clusterId
function getColor(clusterId){
	//Check that you don't go past the end of colors array
	colorIdx = colorIdx == colors.length ? colors.length - 1 : colorIdx;
	//If clusterId hasnt been mapped to a color yet
	if (!colorMap[clusterId])
		colorMap[clusterId] = colors[colorIdx++];
	return colorMap[clusterId];
}

//Build a mention span
function getMentionSpan(mIdx){

	var span =  $(document.createElement('span'))
				.addClass( "mention" )
				.addClass( "mentionStyle" )
				.addClass( "gold"+currentContent.gold[mIdx] )
				.addClass( "guess"+currentContent.guess[mIdx] )
				.attr("id","m"+mIdx)
				.css("color",getColor(currentContent.gold[mIdx]));
	//mark incorrect
	if (currentContent.gold[mIdx] != currentContent.guess[mIdx])
		span.addClass("incorrect");
	return span;
}

function getIntersect(arr1,arr2) {
	var temp = new Array();
	for(var i = 0; i < arr1.length; i++){
		for(var k = 0; k < arr2.length; k++){
			if(arr1[i] == arr2[k]){
				temp[temp.length] = arr1[i];
			}
		}
	}
	return temp;
}

function clusterIndexArray(array){
	var idxArray = new Array();
	for (var i=0;i<array.length;i++){
		if (!idxArray[array[i]]){
			var id = array[i];
			//Build an array of the indices of the gold cluster
			idxArray[id] = new Array();
			idxArray[id][0] = jQuery.inArray(id,array);
			while (jQuery.inArray(id,array,idxArray[id][idxArray[id].length-1]+1)!=-1){
				idxArray[id].push(jQuery.inArray(id,array,idxArray[id][idxArray[id].length-1]+1));
			}
		}
	}
	return idxArray;
}

function updateEntityIds(){
	//For each gold cluster find the max overlap (greedy)
	var goldToGuessMap = [];
	//For each gold cluster build an array of its indices
	var goldIdxArray = clusterIndexArray(currentContent.gold);
	//For each guess cluster build an array of its indices
	var guessIdxArray = clusterIndexArray(currentContent.guess);
	//Build an array of the indices of the
	//Find maximum overlap for each cluster
	for (var i=0;i<goldIdxArray.length;i++){
		if (goldIdxArray[i]){
			var overlap=0;
			var guessClusterId=-1;
			for (var j=0;j<guessIdxArray.length;j++){
				if (guessIdxArray[j]){
					//Get overlap
					var curr = getIntersect(goldIdxArray[i],guessIdxArray[j]).length;
					if (curr > overlap){
						overlap = curr;
						guessClusterId = currentContent.guess[guessIdxArray[j][0]];
					}
				}
			}
			//Update all entity ids for given cluster
			if (guessClusterId>=0) {
				for (var j=0;j<currentContent.guess.length;j++){
					currentContent.guess[j] = (currentContent.guess[j] == guessClusterId) ? currentContent.gold[goldIdxArray[i][0]] : currentContent.guess[j];
				}
			}
		}
	}
}

//Display data from the content object
function display(content) {	
	currentContent = content;
	resetGlobals();
	updateEntityIds();
	//Clear the doc div
	$( "#docDisplay" ).text("");
	var idx=0;	
	for (var i=0;i<content.mentionStart.length;i++){
		//Add text in front of mention
		$( "#docDisplay" ).append($(document.createElement('span'))
			.addClass( "textStyle" )
			.append(content.string.slice(idx,content.mentionStart[i]).join(" "))).append(" ");
		idx = content.mentionStart[i];
		//Add mention
		mentionSpans[i] = getMentionSpan(i);
		$( "#docDisplay" ).append(mentionSpans[i]);
		//Check for interior mentions
		while (i < content.gold.length-1 && content.mentionEnd[i+1]<=content.mentionEnd[i]){
			mentionSpans[i].append(content.string.slice(idx,content.mentionStart[i+1]).join(" ")).append(" ");
			mentionSpans[i+1]=getMentionSpan(i+1);
			mentionSpans[i].append(mentionSpans[i+1]);
			//Mark as interior/exterior mention
			mentionSpans[i].addClass("exterior");
			mentionSpans[i+1].addClass("interior");
			i++;
			idx = content.mentionStart[i];
		}
		//Finish building mention
		mentionSpans[i].append(content.string.slice(idx,content.mentionEnd[i]).join(" ")).append(" ");
		idx = content.mentionEnd[i];
	}
	$( ".mention" ).click(function( event ) {
	  toggleMention(event.currentTarget);
	});
}

//Toggle on/off mentions
function toggleMention(mention){
	var mIdx = parseInt(mention.id.substring(1));
	$( ".exterior" ).removeClass("on");
	if ($( "#m"+mIdx ).hasClass("interior")){
		interiorMentionClick = true;
	} else if (interiorMentionClick){
		//Turn on other exterior mentions
		$( ".gold"+currentContent.gold[mIdx] ).addClass("on");
		interiorMentionClick = false;
		return;
	}
	//Same mention was selected, reset display
	if (mIdx == currentMentionId){
		$( ".mention" ).removeClass("guess")
			.removeClass("inactive")
			.removeClass("guess")
			.removeClass("selected")
			.addClass("mentionStyle");
		currentMentionId = -1;
		$( ".textStyle" ).removeClass("inactive");
		return;
	} else {
		//Set mention to selected, make all mentions inactive
		$( "#m"+mIdx ).addClass( "selected" );
		$( ":not(#m"+mIdx+")" ).removeClass( "selected" );
		$( ".textStyle" ).addClass("inactive");
		$( ".mention" ).addClass("inactive")
					.removeClass("guess");
		currentMentionId = mIdx;
	}
	//Mark gold clusters
	$( ".gold"+currentContent.gold[mIdx]).removeClass( "inactive" )
				.addClass("mentionStyle");
	//Mark guess clusters
	$( ".guess"+currentContent.guess[mIdx]).removeClass( "inactive" )
				.addClass("guess");
}