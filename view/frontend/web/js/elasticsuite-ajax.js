define([
    'jquery',
    'elasticsuiteUrl',
    'uiRegistry',
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
            linkPageNumber: '.pages-items a',
            loaderContext: 'body'
        },
        _create: function () {
            this._bind();
            this.current_href = window.location.href;
        },
        _bind: function () {
            let self = this;

            $(document).on('click', self.options.limitControl, function (e) {
                self._updateLayer(self.current_href, 'product_list_limit', e.currentTarget.options[e.currentTarget.selectedIndex].value);
                e.preventDefault();
            });

            $(document).on('click', self.options.directionControl, function (e) {
                self._updateLayer(self.current_href, 'product_list_dir', $(e.currentTarget).data('value'));
                e.preventDefault();
            });

            $(document).on('click', self.options.orderControl, function (e) {
                self._updateLayer(self.current_href, 'product_list_order', e.currentTarget.options[e.currentTarget.selectedIndex].value);
                e.preventDefault();
            });

            $(document).on('click', self.options.linkSwatchOption, function (e) {
                self._updateLayer(this.href);
                e.preventDefault();
            });

            $(document).on('click', self.options.linkFilterRemove, function (e) {
                self._updateLayer(this.href);
                e.preventDefault();
            });

            $(document).on('click', self.options.linkFilterItem, function (e) {
                self._updateLayer(this.href);
                e.preventDefault();
            });

            $(document).on('click', self.options.linkPageNumber, function (e) {
                self._updateLayer(this.href);
                e.preventDefault();
            });
        },
        _updateLayer: function (url, replaceParam, replaceValue) {
            let self = this;
            let newUrl = self._buildUrl(url, replaceParam, replaceValue);
            $.ajax({
                url: newUrl,
                type: 'get',
                dataType: 'json',
                cache: false,
                beforeSend: function () {
                    $(self.options.loaderContext).trigger('processStart');
                },
                success: function (response) {
                    try {
                        history.pushState({ }, document.title, newUrl);
                        elasticsuiteUrl.reload();
                        self._reloadAttributeFilter();

                        $(self.options.listFilterContainer).replaceWith(response.listFilterOptions);
                        $('.category-list-view').html(response.productList);
                        $(self.options.listFilterContainer).trigger('contentUpdated');
                        $(document).trigger('contentUpdated');
                        if ($.fn.applyBindings != undefined) {
                            $(self.options.listFilterContainer).applyBindings();
                        }
                    } catch (e) {
                    }
                },
                complete: function () {
                    $(self.options.loaderContext).trigger('processStop');
                }
            });
        },
        _buildUrl: function (url, replaceParam, replaceValue) {
            if (replaceParam) {
                let queryParams = new URLSearchParams(window.location.search)
                queryParams.set(replaceParam, replaceValue);
                let urlParts = url.split('?'),
                    baseUrl = urlParts[0];

                return baseUrl + '?' + queryParams.toString();
            } else {
                return url;
            }
        },
        _reloadAttributeFilter: function () {
            requirejs('uiRegistry').filter(function(item){
                if (item.name && item.name.match(/Filter$/)) {
                    uiRegistry.get(item).reload();
                }
            });
        }
    });
    return $.mage.elasticsuiteAjax;
});
