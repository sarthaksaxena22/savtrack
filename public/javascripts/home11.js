$(document).ready(function() {
    
    var auth = {};    
	var currSongName ;
	var socket = io("http://localhost:3000/");
    socket.on("currentPausePlay",function(data){
        //console.log(data);
		
        var vid = document.getElementById("audio_src");
            
        if(data.result === "true"){
             //alert(vid.readyState);
	        if(vid.paused){
	          //console.log("playing");
			  var sgName = "/audio/" + data.currSongSrc;
			  console.log(sgName);
	          $("#audio_src").attr("src", sgName);
	          vid.play();
			  
	         }
        }else if(data.result === "false"){
            if(vid.played){
				 var sgName = "/audio/" + data.currSongSrc;
	          $("#audio_src").attr("src", sgName);
	         
	          //console.log("pause");
	          vid.pause();
	         }
        }
    });

	auth.getToken = function() {
		return localStorage.getItem("savTrack-token");
	}

	auth.isLoggedIn = function() {
		var token = auth.getToken();

		if (token) {
			var payload = JSON.parse(window.atob(token.split('.')[1]));
			//console.log(payload.exp > Date.now() / 1000);
			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	
	};

    var socket = io("http://localhost:3000/");
    //var currentPausePlay;
    $('.song').click(function() {
     currSongName = $(this).attr("value");
	 var sgName = "/audio/" + currSongName;
	 $("#audio_src").attr("src", sgName);
	 var vid = document.getElementById("audio_src");
	 vid.play();
    });
   
    if (auth.isLoggedIn()) {
				
    	var sourceUrl = "/audio/FifthHarmony.mp3";
		$("#audio_src").attr("src", sourceUrl);

		//audiojs.events.ready(function() {
		  //  var player = audiojs.createAll();
            
            $("audio").on("play",function(){
            	console.log("song played");
                currentPausePlay = "true";
				var currSongSrc =  document.getElementById("audio_src").src;
				 var str = currSongSrc.split("/");
				currSongSrc = str[4];
                
                var songData = { "currentPausePlay": "true" , "currSongSrc": currSongSrc };
                $.post("pp", songData, function (result) {
                     //console.log(result);
                });   
            });	

		    $("audio").on("pause",function(){
		    	//console.log("song paused");
		    	currentPausePlay = "false";
		    	var currSongSrc =  document.getElementById("audio_src").src;
				 var str = currSongSrc.split("/");
				currSongSrc = str[4];
                var songData = { "currentPausePlay": "true" , "currSongSrc": currSongSrc };
                $.post("pp", songData, function (result) {
                     //console.log(result);
                });
		    });	
		//});
		
		auth.currentUser = function(){
		
		if (auth.isLoggedIn()) {
		var token = auth.getToken();

		if (token) {
			var payload = JSON.parse(window.atob(token.split('.')[1]));
			return payload.username;
		} else {
			return false;
		}
	
	 }
		
	}
	//var roomNumber = 	
		
//chat beginning
  var data=[];
  $('form').submit(function(){
    socket.emit('chat message',{"message": $('#m').val(),"username":auth.currentUser()});
    $('#m').val('');
    return false;
  });
  $.get("http://localhost:3000/chats",function(element){
     //console.log(element);  
     data.push(element);
     element.forEach(function(index){
         console.log(index);
		 console.log("current username"+auth.currentUser());
   $('#messages').append($('<li>').text(index.username+":"+index.msg));       
     });
    
   } );
   
  socket.on('chat message', function(msg){
   console.log("user"+auth.currentUser());
   $('#messages').append($('<li>').text(msg.username+":"+msg.message));
  });
  
  
  
  
  
// chat ending
		$("#logout").click(function(event) {
			localStorage.removeItem("savTrack-token");
			var url = "http://localhost:3000/";
			window.location.replace(url);
		});
	
	}else{
		var url = "http://localhost:3000/";
		window.location.replace(url);
	}

	
});
