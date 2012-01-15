/*jslint browser: true */
/*global _, jQuery, $, console, Backbone */

var CivicCommons = {};

(function($){
 
    /*
     * List Views 
     */
	CivicCommons.SearchForm = Backbone.View.extend({
			initialize: function(){
	         var variables = { search_label: "My Search" };
	         this.template = _.template($('#search_template').html(), variables);                                                   
			},
			render: function(){
	         $(this.el).html(this.template);  
				$("#search_container").html(this.el);
	         return this;                                                                                                  
			},
			events: {
				"click input[type=button]": "doSearch"  
			},
			doSearch: function( event ){
               var location_url = 'http://marketplace.civiccommons.org/api/v1/views/organization_api.json?display_id=field_view&filters[address_administrative_area_state=ca&filters[address_locality_city]=' + $('#searchterm').val();
               CivicCommons.SearchResults = Backbone.Collection.extend({
                    model: CivicCommons.searchresults,
                     url: location_url
               });
                                            
               SearchResults = new CivicCommons.SearchResults();
               SearchResults.render();
                                                   
                                                   
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
               var state =  data.results[0].address_components[4].long_name;
               $('#searchterm').val(city);
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