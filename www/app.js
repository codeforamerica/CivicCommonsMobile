/*jslint browser: true */
/*global _, jQuery, $, console, Backbone */

var CivicCommons = {};

(function($){
	
	CivicCommons.App = Backbone.Model.extend();

	CivicCommons.AppCollection = Backbone.Collection.extend({
	    model: CivicCommons.App,
		parse : function () { 
			return CivicCommons.searchApps(); 
		}
	});
				

    /*
     * List Views 
     */
	CivicCommons.SearchFormView = Backbone.View.extend({
		initialize: function(){
			this.template = _.template($('#search-form-template').html()); 
            this.render();			
		},
		render: function(){			
			$(this.el).html(this.template);
			$("#search-form-view").html(this.el).trigger("create");
	        return this;								
		},
		events: {
			"click #search-button": "doSearch",  
		},
	    parse: function(response) {
	      return response;
	    },
		doSearch: function( event ){
			var appCollection = new CivicCommons.AppCollection();
			appCollection.parse();
			//console.log('length: '+appCollection.length);
			CivicCommons._searchResultView = new CivicCommons.SearchResultView({collection: appCollection});
			//window.location = '#search-results-view';
        },
	});
	
	
	CivicCommons.SearchResultView = Backbone.View.extend({
		initialize: function(){
			// console.log('Collection: '+this.collection);
			// console.log('Model Length: '+this.model);
			// 
			console.log('Collection Length: '+this.collection.length);
			console.log('SearchResultView collection');
			
			$(CivicCommons._searchResultView).each(function(item) {
				console.log('SearchResultView loop' + item);
			});
			
			this.collection.bind("add", function(ship) {

			});

			this.template = _.template($('#search-results-template').html());
		    this.render();			
		},
		render: function(){
			
			$(this.model).each(function(item) {
//				console.log('SearchResultView render');
//				$(this.el).html(this.template(item.toJSON()));				
//			  this.$('ul.donuts').append(dv.render().el);
			});
			
		    return this;								
		},
		events: {
		    "click #search-results-container li": "viewApp"
		},
		viewApp: function( event ){
			//console.log(event);
			var location_url = 'http://marketplace.civiccommons.org/api/v1/node/'+ this.nodeId +  '.json';
			var singleApp = new CivicCommons.AppCollection();
			singleApp.url = location_url;
			singleApp.fetch();			
			CivicCommons._searchResultView = new CivicCommons.AppView({model: singleApp});
			// this.template = _.template($('#application-template').html());                                                 
		}
	});


	CivicCommons.AppView = Backbone.View.extend({
		initialize: function(){
			this.template = _.template($('#application-template').html()); 
		            this.render();			
		},
		render: function(){
	        $(this.el).html(this.template(this.model.toJSON()));
	        return this;								
		},
		events: {
			"click #search-button": "doSearch",  
            "click #search-results-container li": "viewApp"
		},
		doSearch: function( event ){
			var location_url = 'http://marketplace.civiccommons.org/api/v1/views/organization_api.json?display_id=field_view&filters[address_administrative_area_state=ca&filters[address_locality_city]=' + $('#search-term').val();
			AppCollection.url = location_url;
			AppCollection.fetch();
            this.template = _.template($('#search-results-template').html());                                                   			
			
        },
        viewApp: function( event ){
			var location_url = 'http://marketplace.civiccommons.org/api/v1/node/'+ this.nodeId +  '.json';
			AppCollection.url = location_url;
			AppCollection.fetch();          
            this.template = _.template($('#application-template').html());                                                   
        }
	});
	

	CivicCommons.onSuccess = function(location) {
		var googlemap_url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+location.coords.latitude + ','+  location.coords.longitude + '&sensor=true';
		$.getJSON(googlemap_url, function(data) {
		   var city =  data.results[0].address_components[3].long_name;
		   var state =  data.results[0].address_components[4].long_name;
		   $('#search-term').val(city);
		});
	}
	CivicCommons.onError = function (error) {
     	//alert(error);
	}
 
	CivicCommons.getCurrentLocation = function(){
		navigator.geolocation.getCurrentPosition(CivicCommons.onSuccess, CivicCommons.onError); 
	};
 
	CivicCommons.searchApps = function(){
		var searchURL = 'http://marketplace.civiccommons.org/api/v1/views/organization_api.jsonp?display_id=field_view&filters[address_administrative_area_state=ca&filters[address_locality_city]=' + $('#search-term').val();
		console.log(searchURL);
		$.ajax({
			url: searchURL,
			dataType: 'jsonp',
			contentType: 'application/json',
			success: function(data, status){
				CivicCommons._searchResults = data;
				// console.log('success ');
				// console.log('status ' + status);
				// console.log('data: '+ data);
				//data loaded
			},
			error: function(data, status){
				console.error('failure loading apps: '+status);
				// console.log('status' + status);
				// console.log('data: '+ data);
				//error loading data
			}
		});			
	};
	

					 
 
}(jQuery));

$('#localapps').live('pageinit', function(event){
    CivicCommons.getCurrentLocation();
//    CivicCommons.getJSONP();
	
    var searchFormView = new CivicCommons.SearchFormView();
	//searchFormView.render();
});
