/*jslint browser: true */
/*global _, jQuery, $, console, Backbone */

var CivicCommons = {};

(function($){
 
 
    /*
     * Models 
     */
    // get categories
    CivicCommons.Categories = Backbone.Collection.extend({
        model: CivicCommons.category,
        url:   "http://marketplace.civiccommons.org/api/v1/taxonomy_term.json?parameters[vid]=15"

    });
    // get list of applications
    CivicCommons.Applications = Backbone.Collection.extend({
         model: CivicCommons.application,
         url:   "http://marketplace.civiccommons.org/api/v1/node.json"                                                         
    });
 
     // get single application
    CivicCommons.Apps = Backbone.Collection.extend({
         model: CivicCommons.apps,
         url:   "http://marketplace.civiccommons.org/api/v1/node.json"                                                         
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
 
     // get list of applications
     CivicCommons.ApplicationListView = Backbone.View.extend({
        tagName:    'ul',
        id:         'application-list',
        attributes: {"data-role": 'listview'},

        initialize: function() {
          this.collection.bind('add', this.render, this);
          this.template = _.template($('#application-list-item-template').html());
        },


        render: function() {
            var container  = this.options.viewContainer,
                applications = this.collection,
                template   = this.template,
                listView   = $(this.el);
            
            listView.empty();
            applications.each(function(application){
              listView.append(template(application.toJSON()));
            });
            container.html(listView);
            container.trigger('create');
            return this;
        },
        
        add: function(item) {
            var categoriesList = $('#applications-list'),
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