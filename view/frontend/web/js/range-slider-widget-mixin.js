define([
    'jquery',
    'mage/template',
], function ($, mageTemplate) {
    'use strict';

    return function (widget) {

        $.widget('smileEs.rangeSlider', widget, {
            _createSlider: function() {
                this.element.find(this.options.sliderBar).slider({
                    range: true,
                    min: this.minValue,
                    max: this.maxValue,
                    values: [ this.from, this.to ],
                    slide: this._onSliderChange.bind(this),
                    step: this.options.step,
                    stop: this._onStopChange.bind(this)
                });
            },
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
            },
            _onStopChange : function () {
                let range = {
                    from: this.from * (1 / this.rate),
                    to: this.to * (1 / this.rate)
                };
                let url = mageTemplate(this.options.urlTemplate)(range);
                $('body').elasticsuiteAjax('sliderChange', url);
            }
        });

        return $.smileEs.rangeSlider;
    }
});
