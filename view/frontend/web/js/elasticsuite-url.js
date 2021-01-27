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
            $.each(self.getAllFilterValues(), function (indexFilter, filterName) {
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
