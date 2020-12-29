define([
    'jquery',
    'underscore'
], function ($, _) {
    'use strict';

    return {
        baseURL: window.location.protocol + '//' + window.location.host + window.location.pathname,
        urlParams: new URLSearchParams(decodeURI(window.location.search).replace(/\[(\d*)\]/g, '')),
        buildUrl: function (currentFilterName, currentLabel) {
            let self = this;
            let params = [];
            let filterIndex = 0;
            let findCurrentValue = false;
            $.each(self.getAllFilterValues(), function (indexFilter, filterName) {
                let values = self.getFilterValues(filterName);
                $.each(values, function (index, itemLabel) {
                    if (!(currentFilterName === filterName && itemLabel === currentLabel)) {
                        params.push(filterName + '[' + index + ']=' + itemLabel);
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
        reload: function() {
            this.urlParams = new URLSearchParams(decodeURI(window.location.search).replace(/\[(\d*)\]/g, ''));
        }
    };
});
