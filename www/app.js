/*jslint browser: true */
/*global _, jQuery, $, console, Backbone */

var CivicCommons = {};

$(document).bind('pageinit', function(event){
    // Initiate the router	
	console.log('pageinit');
	$.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;	
	$.mobile.hashListeningEnabled = false;

    $.mobile.pushStateEnabled = false;
    $.mobile.changePage.defaults.changeHash = false;


	(function(){	
		console.log('BackboneJS');
		CivicCommons.App = Backbone.Model.extend();

		CivicCommons.AppCollection = Backbone.Collection.extend({
			initialize: function(param){
				this.city = param.city;
				this.state = param.state;
			},
		    model: CivicCommons.App,
			parse: function(response){
				var searchURL = 'http://marketplace.civiccommons.org/api/v1/views/organization_api.jsonp?display_id=node_view&filters[address_administrative_area_state=' + this.state +  '&filters[address_locality_city]=' + this.city;
				console.log(this.state);
				console.log(this.city);
				console.log(searchURL);
			
			
				$.ajax({
					url: searchURL,
					dataType: 'jsonp',
					contentType: 'application/json',
					success: function(data, status){
						console.log('Data: '+ data);					
						CivicCommons._appCollection = data;
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
				console.log('doSearch');
				var appCollection = new CivicCommons.AppCollection({ city : 'San Francisco', state : 'CA'});
				appCollection.parse();	
			
				appCollection.bind('change', function(){ alert(1)});
//				$.mobile.changePage("#search/" + CivicCommons.AppCollection.city  + ',' + CivicCommons.AppCollection.state, "slide", false, false );
//				console.log(CivicCommons.AppCollection.city);
				
			
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
				new CivicCommons.g();			
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
	            "": "searchForm", // Backbone will try match the route above first
	            "search/:searchterm": "searchterm",
	            "application/:id": "application"
	        },	
	        searchForm: function(){
				console.log('AppSearchFormView Router');
				var searchFormView = new CivicCommons.AppSearchFormView();
				$.mobile.changePage("", "slide", false, false );
	        },		
	        search: function( searchterm ) {
				console.log('AppListView Router');
				console.log('searchterm' + searchterm);			
				CivicCommons._searchResultView = new CivicCommons.AppListView({collection: CivicCommons._appCollection});
				$.mobile.changePage("#search/" + CivicCommons.AppCollection.city  + ',' + CivicCommons.AppCollection.state, "slide", false, false );
			
	        },
	        application: function( applicationID ) {
				console.log('AppView Router');
				console.log('Application ID ' + applicationID);
				var applicationView = new CivicCommons.AppView();
				$.mobile.changePage("#application/" + applicationID, "slide", false, false );
	        }
	    });			 



	
	    var app_router = new CivicCommons.AppRouter();
	    Backbone.history.start();
	}(this));

});


 
