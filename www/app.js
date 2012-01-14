/*jslint browser: true */
/*global _, jQuery, $, console, Backbone */

var CivicCommons = {};

(function($){
     
     // onSuccess Callback
     //   This method accepts a `Position` object, which contains
     //   the current GPS coordinates
     //
     function onSuccess(location) {

 /*
  http://marketplace.civiccommons.org/api/v1/views/organization_api.json?display_id=field_view&filters[address_administrative_area_state=ca&filters[address_locality_city]=san+francisco
  
  Then, going through the results, we can get any Interactions of that organization. For instance, for SF Municapal Transite Authority.
  
  http://marketplace.civiccommons.org/api/v1/views/interaction_api.json?display_id=node_view&filters[organization]=13642
  
  Then, finally, we get any applications in each of those results; field name is field_interaction_application.
  
  
  http://marketplace.civiccommons.org/api/v1/node/13351.json
  
*/
// console.log(location);
        var message = document.getElementById("message"), html = [];
 
        $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng='+location.coords.latitude + ','+  location.coords.longitude + '&sensor=true', function(data) {
              alert(data.results.address_components);
//              alert(data.toString());
//              alert('Load was performed.');
        });


 //
         html.push("<img width='256' height='256' src='http://maps.google.com/maps/api/staticmap?center=", location.coords.latitude, ",", location.coords.longitude, "&markers=size:small|color:blue|", location.coords.latitude, ",", location.coords.longitude, "&zoom=14&size=256x256&sensor=false' />");
         html.push("<p>Longitude: ", location.coords.longitude, "</p>");
         html.push("<p>Latitude: ", location.coords.latitude, "</p>");
         html.push("<p>Accuracy: ", location.coords.accuracy, " meters</p>");
         message.innerHTML = html.join("");
     }

 
     // onError Callback receives a PositionError object
     //
     function onError(error) {
     alert('code: '    + error.code    + '\n' +
           'message: ' + error.message + '\n');
     }
     
     navigator.geolocation.getCurrentPosition(onSuccess, onError);
 
    /*
     * Models 
     */
 
    // get featured applications
    CivicCommons.Featured = Backbone.Collection.extend({
        model: CivicCommons.category,
         url:   "http://marketplace.civiccommons.org/api/v1/node.json"                                                         

    }); 
    // get categories of application
    CivicCommons.Categories = Backbone.Collection.extend({
        model: CivicCommons.category,
        url:   "http://marketplace.civiccommons.org/api/v1/taxonomy_term.json?parameters[vid]=15"

    });
    // get list of all applications
    CivicCommons.AllApps = Backbone.Collection.extend({
         model: CivicCommons.application,
         url:   "http://marketplace.civiccommons.org/api/v1/node.json"                                                         
    });
 
     // get single application data
    CivicCommons.SingleApp = Backbone.Collection.extend({
         model: CivicCommons.single,
         url:   "http://marketplace.civiccommons.org/api/v1/node/13373.json"
    });



 
    /*
     * List Views 
     */
 
    // get categories
    CivicCommons.CategoryListView = Backbone.View.extend({
        tagName:    'ul',
        id:         'categories-list',
        attributes: {"data-role": 'listview'},

        initialize: function() {
          this.collection.bind('add', this.render, this);
          this.template = _.template($('#category-list-item-template').html());
        },


        render: function() {
            var container  = this.options.viewContainer,
                categories = this.collection,
                template   = this.template,
                listView   = $(this.el);
            
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
                template       = this.template;
            
            categoriesList.append(template(item.toJSON()));
            categoriesList.listview('refresh');
        }
     });

 
     CivicCommons.initData = function(){
         CivicCommons.categories = new CivicCommons.Categories();
         CivicCommons.categories.fetch({async: false}); // use async false to have the app wait for data before rendering the list
     };
}(jQuery));

$('#categories').live('pageinit', function(event){
    var categoriesListContainer = $('#categories').find(":jqmData(role='listview')"),
        categoriesListView;
        CivicCommons.initData();
        categoriesListView = new CivicCommons.CategoryListView({collection: CivicCommons.categories, viewContainer: categoriesListContainer});
        categoriesListView.render();
});

$('#add-button').live('click', function(){
//    var today = new Date(), date;
//    alert('1');
//    date = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
//    CivicCommons.categories.add({id: 6, date: date, type: 'Walk', distance: '2 miles', comments: 'Wow...that was easy.'});
});