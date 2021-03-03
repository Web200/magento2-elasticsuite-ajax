define([
    'jquery',
    'underscore',
    'uiRegistry'
], function ($, _, uiRegistry) {
    'use strict';

    return {
        baseURL: window.location.protocol + '//' + window.location.host + window.location.pathname,
        urlParams: new URLSearchParams(decodeURI(window.location.search).replace(/\[(\d*)\]/g, '')),
        buildFilterUrl: function (currentFilterName, currentLabel) {
            let self = this;
            let params = [];
            let filterIndex = 0;
            let findCurrentValue = false;
            let multipleFilterValues = this.getMultipleFilterValues();
            $.each(self.getUrlAllFilterValues(), function (indexFilter, filterName) {
                let values = self.getFilterValues(filterName);
                $.each(values, function (index, itemLabel) {
                    if (!(currentFilterName === filterName && itemLabel === currentLabel)) {
                        if (filterName === 'p') {
                            return false;
                        }
                        if (_.contains(multipleFilterValues, filterName)) {
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
        buildSubmitUrl: function() {
            let self = this;
            let params = [];
            let multipleFilterValues = this.getMultipleFilterValues();
            uiRegistry.filter(function(uiItem){
                if (uiItem.name && uiItem.name.match(/Filter$/)) {
                    let index = 0;
                    _.each(uiItem.items, function(item) {
                        if (item.is_selected) {
                            params.push(uiItem.filterName + '[' + index + ']=' + item.label);
                            index++;
                        }
                    });
                }
            });
            
            $('.smile-es-range-slider').each(function() {
                let range = {
                    from : this.from * (1 / this.rate),
                    to   : this.to * (1 / this.rate)
                };
                let url = this.options.requestVar;

                params.push(uiItem.filterName + '=' + from + '-' + to);
            });

            return encodeURI(self.baseURL + '?' + params.join('&'));
        },
        getFilterValues: function (filterName) {
            return this.urlParams.getAll(filterName);
        },
        getUrlAllFilterValues: function () {
            return _.uniq(Array.from(this.urlParams.keys()));
        },
        getMultipleFilterValues: function () {
            let filterValue = [];
            uiRegistry.filter(function(item){
                if (item.name && item.name.match(/Filter$/)) {
                    filterValue.push(item.filterName);
                }
            });
            return filterValue;
        },
        _buildUrl: function (url, replaceParam, replaceValue) {
            if (replaceParam) {
                var href = new URL(url);
                href.searchParams.set(replaceParam, replaceValue);
                return href.toString();
            } else {
                return url;
            }
        },
        reloadAttributeFilter: function () {
            uiRegistry.filter(function(item){
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
