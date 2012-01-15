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
			 $("#search_container").html(this.el).trigger("create");
	         return this;                                                                                                  
			},
			events: {
				"click #searchbutton": "doSearch"  
			},
			doSearch: function( event ){
               var location_url = 'http://marketplace.civiccommons.org/api/v1/views/organization_api.json?display_id=field_view&filters[address_administrative_area_state=ca&filters[address_locality_city]=' + $('#searchterm').val();
                                                   alert(location_url);
                                                   /*
                CivicCommons.SearchResults = Backbone.Collection.extend({
                    model: CivicCommons.searchresults,
                     url: location_url
                });
                var resultsresultscontainer = $('#searchresults').find(":jqmData(role='listview')"),                                                   
                searchListView = new CivicCommons.SearchResultsView({collection: CivicCommons.searchresults, viewContainer: resultsresultscontainer});
                searchListView.render();   
                                                   */
                                                   
                                                   
           }
		});

     /*
     * List Views 
     */
    CivicCommons.SearchResultsView = Backbone.View.extend({
        tagName: 'ul',
        id: 'searchresults-list',
        attributes: {"data-role": 'listview'},

        initialize: function() {
          this.collection.bind('add', this.render, this);
          this.template = _.template($('#search-results-template').html());
        },


        render: function() {
            var container = this.options.viewContainer,
                categories = this.collection,
                template = this.template,
                listView = $(this.el);
            
            listView.empty();
            categories.each(function(category){
              listView.append(template(category.toJSON()));
            });
            container.html(listView);
            container.trigger('create');
            return this;
        },
        
        add: function(item) {
            var categoriesList = $('#categories-list'),
                template = this.template;
            
            categoriesList.append(template(item.toJSON()));
            categoriesList.listview('refresh');
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