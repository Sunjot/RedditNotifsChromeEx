$(document).ready(function () {

	var keywordList = [];
	var idList = [];

	chrome.alarms.create("redditAlert", { // create alarm called 'redditAlert'
		delayInMinutes: 1, // alarm fires after 1 minute
		periodInMinutes: 1 // alarm fires every minute thereafter 
	});

	chrome.alarms.onAlarm.addListener(function(alarm) { // fired when an alarm has elapsed

		// get all stored keywords
		chrome.storage.sync.get('keywords', function(result){
			if (result.keywords != null) {
				keywordList = result.keywords;
			}
		});

		// get all stored reddit post IDs
		chrome.storage.sync.get('postID', function(result){
			if (result.postID != null){
				idList = result.postID;
			}
		});

		// get JSON data from the URL
		jQuery.getJSON('https://www.reddit.com/r/trap/new.json?sort=new', function(jsonData){
			
			var items = [];
			var postList = [];
			
			// get and store data of the 10 newest posts
			for (var i = 0; i < 10; i++){
				postList.push(jsonData.data.children[i]);
			}

			// check if any of the keywords exist in the titles of the 10 posts
			// and make sure that post hasn't already been checked after a previous alarm
			for (var i = 0; i < postList.length; i++){
				for (var k = 0; k < keywordList.length; k++) {
					if (postList[i].data.title.toUpperCase().indexOf(keywordList[k].toUpperCase()) >= 0 
						&& checkID(postList[i].data.id) == false){

						// create post object and add title and message properties
						var title = "";
						var post = {
							title: title,
							message: postList[i].data.title
						};

						// add the post to the list of posts waiting to be sent as a notification
						// and add the post id to show that we have checked that post 
						items.push(post);
						idList.push(postList[i].data.id);
						
					}
				}
			}

			// store the updated post id list 
			chrome.storage.sync.set({
				'postID': idList
			});

			// if there are items to be sent as notifications, call sendNotif
			if (items != null){
				if (items.length > 0) {
					sendNotif(items);
				}
			}

		});

	});

	// return true if a post we're looking at has already been checked
	// after a previous alarm and return false otherwise 
	function checkID(postID) {

		if (idList != null) {
			for (var i = 0; i < idList.length; i++){
				if (postID == idList[i]){
					return true;
				}
			}
		}

		return false;	
	}

	// go to the given URL when a user clicks on the notification window 
	chrome.notifications.onClicked.addListener(function() {

		chrome.tabs.create({url: "http://reddit.com/r/trap/new"});
	});

	// create a notification object with the required properties 
	function sendNotif(items) {

		var opt = {
			type: "list",
			title: "/R/TRAP Notification",
			message: "You have a new post!",
			iconUrl: "rlgrime.png",
			items: items
		};

		// creates and displays the notification
		chrome.notifications.create(opt);
	}

});