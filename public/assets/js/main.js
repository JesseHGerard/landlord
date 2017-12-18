
// To-Do: create the web pages for all of these things
const account_settings_link = "/";
const logout_link = "/api/logout";
const login_link = "/signin";
const create_account_link = "/";

$(document).ready(function() {
	$.get("/api/is-logged-in").then(loggedIn => {
		if (loggedIn) {
			//$("#account-nav").html("<li class='nav-item'><a class='nav-link' href='" + account_settings_link + "'>Account Settings</a></li><li class='nav-item'><a class='nav-link' href='" + logout_link + "'>Sign Out</a></li>");
			$("#account-nav").html("<li class='nav-item'><a class='nav-link' href='" + logout_link + "'>Sign Out</a></li>");
		} else {
			$("#account-nav").html("<li class='nav-item'><a class='nav-link' href='" + login_link + "'>Sign In</a></li><li class='nav-item'><a class='nav-link' href='" + create_account_link + "'>Create Account</a></li>");
		}
	});
});
