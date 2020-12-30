define([
    'jquery'
], function ($) {
    'use strict';

    return function (widget) {

        $.widget('mage.productListToolbarForm', widget, {
            _create: function () {
                if (!this.options.ajax) {
                    this._super();
                }
            }
        });

        return $.mage.productListToolbarForm;
    }
});
