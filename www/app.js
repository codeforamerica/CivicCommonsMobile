/*jslint browser: true */
/*global _, jQuery, $, console, Backbone */

var CivicCommons = {};

(function($){
	
	CivicCommons.App = Backbone.Model.extend();

	CivicCommons.AppCollection = Backbone.Collection.extend({
	    model: CivicCommons.App,
		parse: function(response){
			var searchURL = 'http://marketplace.civiccommons.org/api/v1/views/organization_api.jsonp?display_id=node_view&filters[address_administrative_area_state=ca&filters[address_locality_city]=' + $('#search-term').val();
			console.log(searchURL);
			$.ajax({
				url: searchURL,
				dataType: 'jsonp',
				contentType: 'application/json',
				success: function(data, status){
					// console.log('success ');
					// console.log('status ' + status);
					// console.log('data: '+ data);
					CivicCommons._appCollection = data;
					CivicCommons._searchResultView = new CivicCommons.AppListView({collection: CivicCommons._appCollection})				
				},
				error: function(data, status){
					console.log('failure ');
					console.log('status' + status);
					console.log('data: '+ data);
				}
			});			
		}
	});

				
				

    /*
     * List Views 
     */
	CivicCommons.AppSearchView = Backbone.View.extend({
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
			window.location = '#search-results-view';		
        },
	});
	
	
	CivicCommons.AppItemView = Backbone.View.extend({
		tagName: "li",
	    className: "search-result",
	    initialize: function() {
			this.render();
	    },		
	    render: function(eventName) {
		    this.template = _.template($('#search-results-template').html()),
	        $(this.el).html(this.template(this.model));				
	        return this;				
			
	    }
	});
	 

	CivicCommons.AppListView = Backbone.View.extend({
	    initialize: function() {
			this.render();
	    },
		events: {
		    "click #search-results-container li": "viewApp"
		},
	    render: function(eventName) {
			console.log('Collection Length: ' + this.collection.length);
			$.each(this.collection, function(index, item) {
				var itemView = new CivicCommons.AppItemView({model: item}).el;
	            $('#search-results-container').append(itemView);
	        });	
			$("#search-results-container").trigger("create");					
	        return this;
	    },
		viewApp: function( event ){
			var appview = new CivicCommons.App();
			appCollection.parse();	
			window.location = '#application-view';		
			
			//console.log(event);
			// var location_url = 'http://marketplace.civiccommons.org/api/v1/node/'+ this.nodeId +  '.json';
			// var singleApp = new CivicCommons.AppCollection();
			// appCollection.url = location_url;
			// appCollection.fetch();			
			// CivicCommons._searchResultView = new CivicCommons.SearchResultView({model: appCollection});
			// this.template = _.template($('#application-template').html());                                                   
		}		
	});
	 
	CivicCommons.AppView = Backbone.View.extend({
	    el: $('#application-view'),
	    render: function(eventName) {
		    this.template = _.template($('#application-template').html()),
	        $(this.el).html(this.template(this.model));
	        return this;
	    }
	});
	
	

	
	


	CivicCommons.onSuccess = function(location) {
		var googlemapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+location.coords.latitude + ','+  location.coords.longitude + '&sensor=true';
		$.getJSON(googlemapUrl, function(data) {
			console.log(data);
			var city =  data.results[0].address_components[3].long_name;
			var state =  data.results[0].address_components[4].long_name;
			$('#search-term').val(city);
		});
	}

	CivicCommons.getCurrentLocation = function(){
		navigator.geolocation.getCurrentPosition(CivicCommons.onSuccess, CivicCommons.onError); 
	};
			 
 
}(jQuery));

$('#localapps').live('pageinit', function(event){
//    CivicCommons.getCurrentLocation();
//    CivicCommons.getJSONP();
	
    var searchFormView = new CivicCommons.AppSearchView();
	//searchFormView.render();
});
