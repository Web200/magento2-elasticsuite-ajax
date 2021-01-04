define([
    'jquery',
    'underscore',
    'uiRegistry'
], function ($, _, uiRegistry) {
    'use strict';

    return {
        options: {
            listFilterContainer: '#layered-filter-block',
        },
        baseURL: window.location.protocol + '//' + window.location.host + window.location.pathname,
        urlParams: new URLSearchParams(decodeURI(window.location.search).replace(/\[(\d*)\]/g, '')),
        buildFilterUrl: function (currentFilterName, currentLabel) {
            let self = this;
            let params = [];
            let filterIndex = 0;
            let findCurrentValue = false;
            let multipleFilterValues = this.getMultipleFilterValues();
            $.each(self.getAllFilterValues(), function (indexFilter, filterName) {
                let values = self.getFilterValues(filterName);
                $.each(values, function (index, itemLabel) {
                    if (!(currentFilterName === filterName && itemLabel === currentLabel)) {
                        if (filterName === 'p') {
                            return false;
                        }
                        if (filterName.includes(multipleFilterValues)) {
                            params.push(filterName + '[' + index + ']=' + itemLabel);
                        } else {
                            params.push(filterName + '=' + itemLabel);
                        }
                    } else {
                        findCurrentValue = true;
                    }
                    if (currentFilterName === filterName) {
                        filterIndex++;
                    }
                });
            });
            if (!findCurrentValue) {
                params.push(currentFilterName + '[' + filterIndex + ']=' + currentLabel);
            }
            return encodeURI(self.baseURL + '?' + params.join('&'));
        },
        getFilterValues: function (filterName) {
            return this.urlParams.getAll(filterName);
        },
        getAllFilterValues: function () {
            return _.uniq(Array.from(this.urlParams.keys()));
        },
        getMultipleFilterValues: function () {
            let filterValue = [];
            requirejs('uiRegistry').filter(function(item){
                if (item.name && item.name.match(/Filter$/)) {
                    filterValue.push(item.filterName);
                }
            });
            return filterValue;
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
                    $('body').trigger('processStart');
                },
                success: function (response) {
                    try {
                        history.pushState({ }, document.title, newUrl);
                        self.reload();
                        self._reloadAttributeFilter();

                        $(self.options.listFilterContainer).replaceWith(response.listFilterOptions);
                        $('.category-list-view').html(response.productList);
                        $(self.options.listFilterContainer).trigger('contentUpdated');
                        $(document).trigger('contentUpdated');
                        if ($.fn.applyBindings != undefined) {
                            $(self.options.listFilterContainer).applyBindings();
                        }
                        $('.swatch-attribute.swatch-layered .swatch-option').each(function(index) {
                            let swatch = $(this);
                            if (swatch.attr('data-option-type') == 1) {
                                swatch.css('background', swatch.attr('data-option-tooltip-value'));
                            }
                        });
                    } catch (e) {
                    }
                },
                complete: function () {
                    $('body').trigger('processStop');
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
        },
        reload: function() {
            this.urlParams = new URLSearchParams(decodeURI(window.location.search).replace(/\[(\d*)\]/g, ''));
        }
    };
});
