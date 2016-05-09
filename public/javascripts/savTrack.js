/*globals $:false , jQuery:false*/
// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
var main = function() {
    "use strict";
   
  var auth = {};    
	$("#logoutTopNav").hide();
	auth.getToken = function() {
		return localStorage.getItem("savTrack-token");
	}

	auth.isLoggedIn = function() {
		var token = auth.getToken();

		if (token) {
			var payload = JSON.parse(window.atob(token.split('.')[1]));
			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	
	};
	
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

	auth.saveToken = function(token,username) {
		localStorage.setItem("savTrack-token", token);
	$('#modal2').closeModal();
	 $("#user").text("Welcome, " +auth.currentUser() ); //adding the username to the header nav bar.
                                                $("#mySavedPosts").show();
                                                $("#logoutTopNav").show();
                                                $("#loginTopNav").hide();
                                                $("#signUp").hide();
	
	};    


    function postFunction() {
       // $("#logoutTopNav").hide();
      //  $("#loginTopNav").show();
        $("#mySavedPosts").hide();
        $.get("http://localhost:3000/posts", function(getData) {
			console.log(getData);
            $("div.container-room-list").empty();
            getData.forEach(function(reddit) {
                var imgId = reddit._id;
                    var postsList = "<section id=" + imgId + " class ='room-item'>" +
                    "<figure class = 'roomImage'>" +
                    "<img  id=" + imgId + " src='image/room.jpg'>" +
                    "<a  class ='join' href=" + reddit.room_link +"/"+imgId+ ">" +
					"</a>"+
					"</figure>"+
					"<div class='user-count'>"+"<img class = 'user_image' src='image/user.ico'>"+reddit.likes+"</div>"+
					"<header>"+"<div class='description'>"+"<span class='name'>"+reddit.room_title+"</span>"+
					"</div>"+"<div style='display: block;' class='user-info'>"+"<div class='room-user'>"+"hosted by"+"<a href='nb3' class='navigate'>"+reddit.username+"</a>"+
					"</div>"+"</div>"+"</header>"+
                    "<span class='current-song'>"+"some song"+"</span>"+
					"</section>";
                $(postsList).appendTo('div #container-room-list');
                $("#postform")[0].reset();
                $("ul.pagination").empty();
                
               
            }); //end of foreach function
            //session storage variable
				share();



            



            //facebook share
            function share() {
                $("img.facebook_Button").on("click", function() {
                    if (username) {
                        
                        var $mainlink = $("div #" + this.id + "").find('a').attr('href');

                        FB.ui({
                                method: 'share',
                                href: $mainlink,
                            },
                            // callback
                            function(response) {
                                if (response && !response.error_message) {
                                    var $toastContent = $('<span>Posted successfully</span>');
                                    Materialize.toast($toastContent, 4000);
                                } else {
                                    var $toastContenterror = $('<span>OoPs Something went wrong!Post couldnot be shared</span>');
                                    Materialize.toast($toastContenterror, 4000);
                                }
                            }
                        );
                    } else {
                        alert("Oops!! You need to login first");
						
                    }
                });
            }

            //facebook login
            $("img#fb_login").on("click", function() {
                FB.login(function(response) {
                    if (response.authResponse) {
                        FB.api('/me', function(response) {
                            
                            var x = response.name;

                            getname(x);
                        });

                        function getname(name) {
                            var us = name.toLowerCase();
                           
                            var res = us.split(" ", 1);
                            var give = res.toString();
                          
                            var pwd = "fbuser";

                            $.ajax({
                                url: "http://localhost:3000/allusers",
                                type: "GET",
                                dataType: "Json",
                                contentType: 'application/json',
                                success: function(result) {
                                    var t = result.length;

                                    var j1 = {
                                        "name": give
                                    };
                                    $.ajax({
                                        url: "http://localhost:3000/users",
                                        type: "GET",
                                        contentType: "Application/Json",
                                        data: j1,
                                        success: function(result) {
                                           
                                            if (result.length === 0) {
                                                var j2 = {
                                                    "_id": t + 1,
                                                    "name": give,
                                                    "password": pwd
                                                }; //"likes":like,"notLikes":notLike
                                                $.ajax({
                                                    type: "PUT",
                                                    data: j2,
                                                    url: "http://localhost:3000/newuser",
                                                    success: function() {
                                                        
                                                        alert("Registered successfully ,Use password: fbuser and your Username " + give + " to login next time ");
                                                        $('#modal3').closeModal();
                                                        $("div").removeClass("lean-overlay");
                                                        like = [];
                                                        notLike = [];

                                                        $.get("http://localhost:3000/allusers", function(data) {

                                                            var length = data.length;
                                                            $("#user").text("Welcome, " + give); //adding the username to the header nav bar.
                                                            $("#mySavedPosts").show();
                                                            $("#logoutTopNav").show();
                                                            $("#loginTopNav").hide();
                                                            $("#signUp").hide();
                                                            sessionStorage.setItem('id', length);
                                                            sessionStorage.setItem('user', give);
                                                            sessionStorage.setItem('password', pwd);
                                                            sessionStorage.setItem('like', like);
                                                            sessionStorage.setItem('notLike', notLike);
                                                            location.reload(true);
                                                            showUserHistory();
                                                        });
                                                    },
                                                });
                                            } else {
                                                alert("Sorry,It looks like the user already exist ,Login with your credentials or use facebook login credentials");
                                                document.getElementById("reguser").value = "";
                                                document.getElementById("regpass").value = "";
                                                document.getElementById("confirmpass").value = "";
                                                $('#modal3').closeModal();
                                                $("div").removeClass("lean-overlay");


                                            }
                                        }

                                    });
                                }
                            });
                        }
                    } else {
                        console.log('User cancelled login or did not fully authorize.');
                    }
                });
            });



            $(".button-collapse").sideNav();
            $('.modal-trigger').leanModal();
            $('.tooltipped').tooltip({
                delay: 50
            });

            

            //pages(getData.length);
        }); //end of $.get function

    } //end of my function

    
    if(auth.isLoggedIn()){
		$("#user").text("Welcome, " +auth.currentUser() ); //adding the username to the header nav bar.
                                               // $("#mySavedPosts").show();
                                                $("#logoutTopNav").show();
                                                $("#loginTopNav").hide();
                                                $("#signUp").hide();  
	
	}
    //function login
   
      

	


    
	$('#submit').click(function(event) {
        event.preventDefault();
		
		var username = $('#username').val();
		var password = $('#password').val();
	    
	    
		if (username === "" || password === "") {
			alert("Oops its empty");
			
		} else {

			var parameters = {
				username: username,
				password : password
			};

			$.ajax({
	                url: "/login",
	                data: parameters,
	                type: "POST",
	                dataType: "json",
	                success: function (data) {
	                	if(data.message === "No such user present"){
	                		alert("no such user");
	                	}else{
							//currUserName = username;
							//alert("o");
	                	    auth.saveToken(data.token,username);
							
	                	}
	                }
	         });

			 $('#modal2').closeModal();
			
		}

	});

    

    


    $('#Register').click(function(event) {
        event.preventDefault();
		
		var username = $('#reguser').val();
		var password = $('#regpass').val();
		var confirm = $("#confirmpass").val();
	    
	    
		if (username === "" || password === ""|| confirm === "") {
			alert("Oops its empty");
			
		} else if (password !== confirm) {
                alert("Sorry passwords doesnt match");
            }else {

			var parameters = {
				username: username,
				password : password
			};

			$.ajax({
	                url: "/register",
	                data: parameters,
	                type: "POST",
	                dataType: "json",
	                success: function (data) {
	                	if(data.message === "User already present"){
	                		alert("already present");
	                	}else{
							//currUserName = username;
							//alert("o");
	                	    auth.saveToken(data.token,username);
							
	                	}
	                }
	         });

			 $('#modal3').closeModal();
			
		}

	});

   
    //dynamic search function
    function search() {
        $("#search").keyup(function() {

            // Retrieve the input field text and reset the count to zero
            var filter = $(this).val(),
                count = 0;
console.log("....."+filter);
            // Loop through the comment list
            $(".room-item").each(function() {

                // If the list item does not contain the text phrase fade it out
                if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                    $(this).fadeOut();

                    // Show the list item if the phrase matches and increase the count by 1
                } else {

                    $(this).show();
                    count++;
                }
                $("ul.pagination").empty();
               
                pages(len[0]);
            });

            /*if (filter === "") {
                $('.postsContainer').empty();
                postFunction();
            }*/
        });

    } //end of search function

    

    jQuery.validator.setDefaults({
        ignore: ".ignore",
        debug: true,
        success: "valid"

    });
    $("#postform").validate({
        rules: {
            field: {
                required: false,
                url: true
            }
        }

    });
    
    //logout function
        $("#logoutTopNav").on("click", function() {
          
			localStorage.removeItem("savTrack-token");
			var url = "http://localhost:3000/";
			window.location.replace(url);
		
        });
    
    $("#homepage").on("click", function() {

        postFunction();
    });
    search();
    //login();
    
    
    postFunction();
}; //end of main function

$(document).ready(main);