/*
 *  Project: jQuery MVC
 *  Description: MVC for ESPN Sport News.
 *  Author: Lars Nielsen <larn@tv2.dk>
 */

;(function ($, window, document, t2candidate, undefined) {

  var pluginName = 'jQueryMVC',
    defaults = {
      view: 'http://api.espn.com/v1/',
      apiKey: 'c2r8pwhm99ufremsdktspvre'
    };

  function Plugin(element, options) {
    this.element = element;

    this.options = $.extend({}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;
    this.init();
}

  Plugin.prototype = {

    init: function () {
      console.log('init');
    },

    /**
     * Render sport news from ESPN.
     * The news are refactored and appended to the DOM.
     */
    renderSportNews: function() {
      var obj = this,
        thisData,
        news = new Array(),
        getUrl = '',
        wrapper = $('<ul />', {'class': 'wrapper'});;

      // Get data fron Ajax call.
      getUrl = this.options.view + 'sports/news/?limit=10&apikey=' + this.options.apiKey;
      thisData = obj._getData(getUrl);

      // Wait for data.
      $.when(thisData).done(function(data) {

        // Refactor data.
        $.each(data.headlines, function(i, item) {
          news.push({
            'id': item.id,
            'title': item.headline
          });
        });

        // Render refactored data.
        $.each(news, function(i ,item) {

          var item = $('<li />', {'class': 'item item-'+i}).text(item.title).appendTo(wrapper);

        });

        // Append data to DOM.
        $(obj.element).append(wrapper);

      });
    },

    /**
     * Get data with Ajax call.
     * The call is returned, so you can listen for event handlers.
     *
     * @param getUrl - URL to JSOB feed.
     * @return get - Ajax call.
     */
    _getData: function(getUrl) {

      var get = $.ajax({
        url: getUrl,
        dataType: 'jsonp',
        type: 'get',
        cache: false,
        timeout: 2000
      });

      return get;

    },

  };

  $.fn[pluginName] = function (options, xtraOptions) {
    var args = options;
    if(options === undefined || typeof options === 'object') {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
        }
      });
    }else if(typeof options === 'string' && options[0] !== '_' && options !== 'init') {
      var returns,
        xtraOptions = (typeof xtraOptions !== undefined && typeof xtraOptions === 'object') ? xtraOptions : '';
      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName, new Plugin(this, xtraOptions));
        if (instance instanceof Plugin && typeof instance[options] === 'function') {
            returns = instance[options].apply(instance, Array.prototype.slice.call( args, 1 ));
        }
        if (options === 'destroy') {
          $.data(this, 'plugin_' + pluginName, null);
        }
      });
      return returns !== undefined ? returns : this;
    }
  };

}(jQuery, window, document));