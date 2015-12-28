var list = [];

$(document).ready(function () {

	var id = 1;

	$('#add').mouseenter(function() {
		$('#add').fadeTo('fast', 1);
	});

	$('#add').mouseleave(function() {
		$('#add').fadeTo('fast', 0.85)
	});

	$('#remove').mouseenter(function() {
		$('#remove').fadeTo('fast', 1);
	});

	$('#remove').mouseleave(function() {
		$('#remove').fadeTo('fast', 0.85)
	});

	// when the add button is clicked
	$("#add").click(function(){

		// get the value from the textbox
		var word = document.getElementById('keywordbox').value;

		// if a valid word is entered and it doesn't already exist in the 
		// list of keywords, proceed
		if (word != "" && iterate(word) == false) {

			// add the word to the list of keywords and display it on the page
			var arr = [word];
			addToList(arr);
			document.getElementById('keywordbox').value = "";
			id++;

			// store the updated list of keywords
			list.push(word);
			chrome.storage.sync.set({
				'keywords': list
			})

		}

	});

	// when the remove all button is clicked
	$("#remove").click(function(){

		list = [];

		// empty the stored keywords and ids lists
		chrome.storage.sync.set({
			'keywords': list
		});

		chrome.storage.sync.set({
			'postID': list
		});

		// clear the list on the page
		$('#list div').remove();

	});

	// Display the keyword(s) on the page 
	function addToList(arr) {
		for (var i = 0; i < arr.length; i++){
			$("#list").append('<div id="' + id.toString() + '"><span class="keyword">' + arr[i] + 
				'</span></div>');
		}
	}

	// check if the entered keyword exists in the list of 
	// keywords on the page and return true or false
	function iterate(word) {

		for (var i = 0; i < list.length; i++){
			if (list[i].toUpperCase() == word.toUpperCase()){
				return true;
			}
		}

		return false;
	}

	// display all stored keywords on the page
	function restore() {
		
		chrome.storage.sync.get('keywords', function(result){

			// add all keywords to a list one by one
			if (result.keywords != null) {
				for (var i = 0; i < result.keywords.length; i++){
					list.push(result.keywords[i]);
				}
			}

			// send the list to the function addToList to display 
			// all the keywords on the page
			if (list != null){
				addToList(list);
			}

		});

	}

	// everytime the page is loaded, call restore to display the stored keywords
	document.addEventListener('Restore', restore());

});

