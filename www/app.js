/*jslint browser: true */
/*global _, jQuery, $, console, Backbone */

var CivicCommons = {};

(function($){
 
    /*
     * List Views 
     */
    CivicCommons.SearchForm = Backbone.View.extend({
		initialize: function(){
			this.render();
            var variables = { search_label: "My Search" };
            this.template = _.template($('#search_template').html(), variables);
                                                   
//            this.template = _.template( $("#search_template").html(), variables );
		},
		render: function(){
            return this;                                                                                                  
		},
		events: {
			"click input[type=button]": "doSearch"  
		},
		doSearch: function( event ){
			// Button clicked, you can access the element that was clicked with event.currentTarget
			alert( "Search for " + $("#searchterm").val() );
		}
	});

     /*
     * List Views 
     */
    CivicCommons.SearchResults = Backbone.View.extend({
		initialize: function(){
			this.render();
		},
		render: function(){                                                   
		},
		events: {
		},
		doSearch: function( event ){
		}
	});
 
    CivicCommons.Application = Backbone.View.extend({
		initialize: function(){
			this.render();
		},
		render: function(){
                                                   
		},
		events: {
		},
		doSearch: function( event ){
		}
	});
		
     CivicCommons.onSuccess = function(location) {
        var googlemap_url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+location.coords.latitude + ','+  location.coords.longitude + '&sensor=true';

        $.getJSON(googlemap_url, function(data) {
               var city =  data.results[0].address_components[3].long_name;
               var state =  data.results[0].address_components[5].long_name;
                  $('#searchterm').val(city + ' '+ state);
        });
     
     }
     CivicCommons.onError = function (error) {
     
     }
 
     CivicCommons.initData = function(){
         navigator.geolocation.getCurrentPosition(CivicCommons.onSuccess, CivicCommons.onError); 
     };
 
 
}(jQuery));

$('#searchview').live('pageinit', function(event){
    var SearchForm;                      
    CivicCommons.initData();
    SearchForm = new CivicCommons.SearchForm();
    SearchForm.render();
});

$('#search_button').live('click', function(){
//    CivicCommons.categories = new CivicCommons.Categories();
//    CivicCommons.categories.fetch({async: false}); // use async false to have the app wait for data before rendering the list                      
});