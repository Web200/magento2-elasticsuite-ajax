define([
    'jquery',
    'elasticsuiteUrl',
    'jquery/ui',
], function ($, elasticsuiteUrl, uiRegistry) {
    'use strict';

    $.widget('mage.elasticsuiteAjax', {
        options: {
            modeControl: '[data-role="mode-switcher"]',
            directionControl: '[data-role="direction-switcher"]',
            orderControl: '[data-role="sorter"]',
            limitControl: '[data-role="limiter"]',
            listFilterContainer: '#layered-filter-block',
            linkSwatchOption: 'a.swatch-option-link-layered',
            linkFilterRemove: '.filter-current a.remove',
            linkFilterItem: '.filter-options-item .item a',
            linkPageNumber: '.pages-items a'
        },
        _create: function () {
            elasticsuiteUrl.options.listFilterContainer = this.options.listFilterContainer;
            this._bind();
            this.current_href = window.location.href;
        },
        _bind: function () {
            let self = this;

            $(document).on('click', self.options.modeControl, function (e) {
                elasticsuiteUrl._updateLayer(self.current_href, 'product_list_mode', $(e.currentTarget).data('value'));
                e.preventDefault();
            });

            $(document).on('click', self.options.limitControl, function (e) {
                elasticsuiteUrl._updateLayer(self.current_href, 'product_list_limit', e.currentTarget.options[e.currentTarget.selectedIndex].value);
                e.preventDefault();
            });

            $(document).on('click', self.options.directionControl, function (e) {
                elasticsuiteUrl._updateLayer(self.current_href, 'product_list_dir', $(e.currentTarget).data('value'));
                e.preventDefault();
            });

            $(document).on('click', self.options.orderControl, function (e) {
                elasticsuiteUrl._updateLayer(self.current_href, 'product_list_order', e.currentTarget.options[e.currentTarget.selectedIndex].value);
                e.preventDefault();
            });

            $(document).on('click', self.options.linkSwatchOption, function (e) {
                elasticsuiteUrl._updateLayer(this.href);
                e.preventDefault();
            });

            $(document).on('click', self.options.linkFilterRemove, function (e) {
                elasticsuiteUrl._updateLayer(this.href);
                e.preventDefault();
            });

            $(document).on('click', self.options.linkFilterItem, function (e) {
                if (e.target.tagName !== 'A') {
                    elasticsuiteUrl._updateLayer(this.href);
                }
                e.preventDefault();
            });

            $(document).on('click', self.options.linkPageNumber, function (e) {
                elasticsuiteUrl._updateLayer(this.href);
                e.preventDefault();
            });
        }
    });
    return $.mage.elasticsuiteAjax;
});
