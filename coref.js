var contentJSON2 = {
	"string":["this","is","a","test","document","with","two","mentions"],
	"mentionStart":[0,3,7],
	"mentionEnd":[0,4,7],
	"gold":[0,0,1],
	"guess":[0,1,1]
};

var contentJSON = {"mentionEnd":[7,11,21,25,31,31,37,41,45,51,51,54,56,61,63,75,81,88,94,96,98,101,111,113,118,123,121,126,128,133,136,141,144,150,153,158,165,170,177,180,183,194,215,221],"guess":[9837,9837,9837,9837,9838,9839,9840,9837,9841,9838,9839,9837,9841,9840,9842,9843,9842,9843,9842,9837,9842,9837,9844,9837,9844,9845,9846,9844,9837,9843,9843,9840,9842,9847,9840,9848,9848,9848,9840,9842,9842,9840,9849,9849],"string":["Think","the","matter","over",".","If","you","think","that",",","you","were","wrong",",","please","apologize","to","all","Yemenis","in","your","same","subject",".","You","defend","the","girls","of","Saudi","Arabia","by","insulting","the","girls","of","Yemen",".","Why","?","You","do","n't","like","it","for","the","girls","of","Saudi","Arabia",",","but","you","like","it","for","the","girls","of","Yemen","?","I","have","been","a","follower","of","the","forum","site","for","years",".","Your","topic","is","the","first","one","I","have","replied","to",".","Because","of","your","replies","to","the","participants",",","I","respected","you","and","I","still","respect","you",".","But","the","lapse","was","uncalled","for",".","May","Allah","forgive","you","in","the","protection","of","Allah",".","-----------------------------","My","outstanding","brother",":","May","Allah","reward","you","with","good","and","elevate","your","status",".","You","seem","to","be","from","Yemen","!","Anyway","I","did","not","mean","that","that","girl","was","from","Yemen",",","but","rather","that","she","was","hired","for","cheerleading",".","Because","she","tied","the","kaffiyeh","on","her","head","the","way","the","people","of","Yemen","do",",","I","said","what","I","did","in","sarcasm",",","not","to","attack","the","women","of","Yemen","!","------------------------------","It","is","wrong","to","shift","our","disability","into","a","general","impossibility",",","to","be","a","reason","for","holding","others","back",",","and","to","smother","their","abilities","and","capabilities",".",".....","miml9@hotmail.com"],"gold":[9828,9828,9828,9828,9830,9832,9834,9828,9835,9830,9832,9828,9835,9834,9833,9828,9833,9828,9833,9828,9833,9828,9836,9828,9836,9833,9828,9836,9833,9833,9833,9834,9828,9831,9834,9831,9831,9831,9834,9828,9828,9834,9829,9829],"mentionStart":[6,10,20,24,26,29,36,40,44,46,49,53,55,60,62,74,80,87,93,95,97,100,110,112,117,120,120,125,127,132,135,140,143,148,152,157,164,169,176,179,182,193,214,220]};

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
			while (i < content.mentionEnd[mIdx]){
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
		$( ".mention" ).addClass("inactive");
		currentMentionId = mIdx;
	}
	for (var i=0; i < mentionSpans.length; i++){
		mentionSpans[i];
		if (currentContent.gold[i] != currentContent.gold[mIdx] && 
			currentContent.guess[i] != currentContent.guess[mIdx]){
			mentionSpans[i].removeClass( "mentionStyle" )
				.removeClass("guess")
				.addClass("inactive");
		} else {
			mentionSpans[i].removeClass("inactive")
				.addClass("mentionStyle");
			if (currentContent.guess[i] == currentContent.guess[mIdx]){
				mentionSpans[i].addClass("guess");
			}
		}
	}
}

function unhoverMention(mention){
	$( ".mention" ).removeClass("guess")
		.removeClass("inactive")
		.removeClass("selected")
		.addClass("mentionStyle");
	currentMentionId = -1;
	$( ".textStyle" ).removeClass("inactive");
}

function hoverMention(mention){
	var mIdx = parseInt(mention.id.substring(1));
	$( "#m"+mIdx ).addClass( "selected" );
	$( ":not(#m"+mIdx+")" ).removeClass( "selected" );
	$( ".textStyle" ).addClass("inactive");
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
/*
$( ".mention" ).hover(function( event ) {
  hoverMention(event.currentTarget);
},function( event ) {
  unhoverMention(event.currentTarget);
});
*/