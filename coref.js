var contentJSON = {
	"string":["this","is","a","test","document","with","two","mentions"],
	"mentionStart":[0,3,7],
	"mentionEnd":[0,4,7],
	"gold":[0,0,1],
	"guess":[0,1,1]
};

//CODE STARTS HERE
var colorIdx=0;
var colorMap = [];
var colors =["#1f77b4", "#ff7f0e", "#aec7e8", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];
var currentMentionId = -1;
var mentionSpans=[];
var currentContent;

//Return a color from the colors array for the given clusterId
function getColor(clusterId){
	//Check that you don't go past the end of colors array
	colorIdx = colorIdx == colors.length ? colors.length - 1 : colorIdx;
	//If clusterId hasnt been mapped to a color yet
	if (!colorMap[clusterId])
		colorMap[clusterId] = colors[colorIdx++];
	return colorMap[clusterId];
}

//Display data from the content object
function display(content) {
	currentContent = content;
	//Clear the doc div
	$( "#docDisplay" ).text("");
	//Add the document text
	var i=0;
	while (i < content.string.length){
		var mIdx = $.inArray(i,content.mentionStart);
		//If string is part of a mention
		if (mIdx >= 0){
			mentionSpans[mIdx] = $(document.createElement('span'))
				.addClass( "mention" )
				.addClass( "mentionStyle" )
				.attr("id","m"+mIdx)
				.css("color",getColor(content.gold[mIdx]));
			$( "#docDisplay" ).append(mentionSpans[mIdx]);
			while (i <= content.mentionEnd[mIdx]){
				mentionSpans[mIdx].append(content.string[i] + " ");
				i++;
			}
			//If guess cluster is incorrect
			if (content.gold[mIdx] != content.guess[mIdx]){
				mentionSpans[mIdx].addClass( "incorrect" );
			}
		} else {
			//Add the plain text
			$( "#docDisplay" ).append(
				$(document.createElement('span'))
				.addClass( "textStyle" )
				.append(content.string[i] + " "));
			i++;
		}
	}
}

function toggleMention(mention){
	var mIdx = parseInt(mention.id.substring(1));
	//Same mention was selected, toggle off
	if (mIdx == currentMentionId){
		$( ".mention" ).removeClass("guess")
			.removeClass("inactive")
			.removeClass("selected")
			.addClass("mentionStyle");
		currentMentionId = -1;
		$( ".textStyle" ).removeClass("inactive");
		return;
	} else {
		$( "#m"+mIdx ).addClass( "selected" );
		$( ":not(#m"+mIdx+")" ).removeClass( "selected" );
		$( ".textStyle" ).addClass("inactive");
		currentMentionId = mIdx;
	}
	for (var i=0; i < mentionSpans.length; i++){
		if (currentContent.gold[i] != currentContent.gold[mIdx] && 
			currentContent.guess[i] != currentContent.guess[mIdx]){
			mentionSpans[i].removeClass("mentionStyle")
				.removeClass("guess")
				.addClass("inactive")
		} else {
			mentionSpans[i].removeClass("inactive")
				.addClass("mentionStyle");
			if (currentContent.guess[i] == currentContent.guess[mIdx]){
				mentionSpans[i].addClass("guess");
			}
		}
	}
}

display(contentJSON);
$( ".mention" ).click(function( event ) {
  toggleMention(event.currentTarget);
});