define([
    'jquery',
    'mage/template',
], function ($, mageTemplate) {
    'use strict';

    return function (widget) {

        $.widget('smileEs.rangeSlider', widget, {
            _applyRange: function () {
                if (!this.options.ajax) {
                    this._super();
                }

                let range = {
                    from : this.from * (1 / this.rate),
                    to   : this.to * (1 / this.rate)
                };
                let url = mageTemplate(this.options.urlTemplate)(range);
                $('body').elasticsuiteAjax('updateLayer', url);
            }
        });

        return $.smileEs.rangeSlider;
    }
});
