define(
    [
        'jquery',
        'ko',
        'elasticsuiteUrl'
    ], function ($, ko, elasticsuiteUrl) {
        'use strict';

        let mixin = {
            getDisplayedItems: function () {
                let self = this;
                let items = self._super();
                self.filterName = self.index.replace(/Filter/, '');
                let values = elasticsuiteUrl.getFilterValues(self.filterName);
                let finalItems = [];

                $.each(items, function( index, item ) {
                    if (values.includes(item.label)) {
                        item.is_selected = true;
                    } else {
                        item.is_selected = false;
                    }
                    item.url = elasticsuiteUrl.buildFilterUrl(self.filterName, item.label);

                    finalItems.push(item);
                });
                return finalItems;
            },
            selectItem: function(label) {
                let self = this;
                $.each(self.items, function( index, item ) {
                    if (item.label == label) {
                        item.is_selected = true;
                        return;
                    }
                });
            },
            unSelectItem: function(label) {
                let self = this;
                $.each(self.items, function( index, item ) {
                    if (item.label == label) {
                        item.is_selected = false;
                        return;
                    }
                });
            },
            reload: function () {
                this.fulltextSearch(null);
                this.onShowLess();
            }
        };

        return function (target) {
            return target.extend(mixin);
        };
    }
);
