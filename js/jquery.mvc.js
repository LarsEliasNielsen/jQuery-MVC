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
     * Get and render racing news from ESPN Sport News.
     * Getting data with async call and wait for data, then render it to DOM or
     * returned as objects.
     *
     * TODO: Return object, and test returned data in another plugin.
     */
    renderNews: function() {
      var obj = this,
        wrapper = $('<ul />', {'class': 'wrapper'});

      console.log('renderNews');

      // JSON call to ESPN Developer API.
      var jsonCall = $.ajax({
        dataType: 'json',
        type: 'get',
        cache: false,
        url: this.options.view + 'sports/racing/news/?limit=10&apikey=' + this.options.apiKey
      }).done(function(data) {
        return data;
      }).fail(function(msg) {
        return false;
      });

      // Perform call and loop through data.
      $.when(jsonCall).done(function(data) {
        $.each(data.headlines, function(i, element) {
          // Append headlines into DOM.
          var item = $('<li />', {'class': 'item'}).text(element.headline).appendTo(wrapper);
        });
      });

      // Append list to DOM.
      $(obj.element).append(wrapper);
    }

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