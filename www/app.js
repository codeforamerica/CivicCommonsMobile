/*jslint browser: true */
/*global _, jQuery, $, console, Backbone */

var CivicCommons = {};

(function($){
	
	CivicCommons.App = Backbone.Model.extend();

	CivicCommons.AppCollection = Backbone.Collection.extend({
		initialize: function(param){
			this.city = param.city;
			this.state = param.state;
		},
	    model: CivicCommons.App,
		parse: function(response){
			var searchURL = 'http://marketplace.civiccommons.org/api/v1/views/organization_api.jsonp?display_id=node_view&filters[address_administrative_area_state=ca&filters[address_locality_city]=' + $('#search-term').val();
			console.log(this.state);
			console.log(this.city);
			console.log(searchURL);
			
			
			$.ajax({
				url: searchURL,
				dataType: 'jsonp',
				contentType: 'application/json',
				success: function(data, status){
					// console.log('success ');
					// console.log('status ' + status);
					console.log('data: '+ data);

					
//					CivicCommons.AppCollection.add(data);
//					CivicCommons.AppCollection.change();
					CivicCommons._appCollection = data;
					CivicCommons._searchResultView = new CivicCommons.AppListView({collection: CivicCommons._appCollection});
//					window.location = "#/search/" + $('#search-term').val();	
//					$.mobile.changePage("#search/" +  $('#search-term').val(), "slide");
					$.mobile.changePage('#search/San Francisco', "slide", false, false);
					
					console.log('AppCollection Model');
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
	CivicCommons.AppSearchFormView = Backbone.View.extend({
//	    el: $('#search-form-view'),
		initialize: function(){
			CivicCommons.getCurrentLocation();				
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
//			console.log(event);
			var appCollection = new CivicCommons.AppCollection({ city : 'San Francisco', state : 'CA'});
			appCollection.parse();	
			
			appCollection.bind('change', function(){ alert(1)});
			
//			CivicCommons._searchResultView = new CivicCommons.AppListView({collection: CivicCommons._appCollection});
			
			
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
	    el: $('#search'),
	    initialize: function() {
			console.log('AppListView  View');
			this.render();
	    },
	    events: {
	      "click .search-result":          "viewApp"
	    },		
	    render: function(eventName) {
			
//			console.log(this.events);
			// this.trigger("alert", "an event");

			
			console.log('Collection Length: ' + this.collection.length);
			$.each(this.collection, function(index, item) {
				var itemView = new CivicCommons.AppItemView({model: item}).el;
	            $('#search-results-container').append(itemView).trigger('create');
	        });	
			$("#search-results-container").trigger("create");					
	        return this;
	    },
		viewApp: function( event ){
			console.log('hello world');
			new CivicCommons.AppView();			
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
	}
	
	

	CivicCommons.AppRouter = Backbone.Router.extend({
        routes: {
            "*searchform": "searchForm", // Backbone will try match the route above first
            "search/:searchterm": "searchterm",
            "application/:id": "application"
        },	
		initialize : function(){
			this.searchForm();
			
		},
        searchForm: function(){
			console.log('AppSearchFormView Router');
			var searchFormView = new CivicCommons.AppSearchFormView();
//			$.mobile.changePage( '#');	
        },		
        search: function( searchterm ) {
			console.log('AppListView Router');
			console.log('searchterm' + searchterm);
			
			
//			CivicCommons.App.bind("change:name", function(model, name) {
				//var searchResultView = new CivicCommons.AppListView({collection: CivicCommons._appCollection});
				
				//alert("Changed name from " + CivicCommons.App.previous("name") + " to " + name);
//			});
			
			
//			var searchResultsView = new CivicCommons.AppListView();			
//			$.mobile.changePage('#search/San Francisco');				
        },
        application: function( applicationID ) {
			console.log('AppView Router');
			console.log('Application ID ' + applicationID);
			var applicationView = new CivicCommons.AppView();
        }
    });			 

 
}(jQuery));

 
$('#localapps').live('pageinit', function(event){
    // Initiate the router
    $.mobile.ajaxEnabled = false;
    $.mobile.hashListeningEnabled = false;
	
	console.log('pageinit');
    var app_router = new CivicCommons.AppRouter();
//    _.bindAll(app_router);
    //Backbone.history = Backbone.history || new Backbone.History({});
	//Backbone.history.start();
	/*
    _.bindAll(app_router);
     $("a").click(function(ev) {
         var href = $(this).attr("href");
         res = app_router.navigate(href, true);
         return false;
     });
	 */
	 
	 
//   Backbone.history.start();

//    Backbone.history.start();	
    // Start Backbone history a neccesary step for bookmarkable URL's
});
