define([
    'jquery',
    'elasticsuiteUrl',
    'uiRegistry',
    'jquery-ui-modules/widget'
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
            slider: {
                directMode: false
            },
            infinite: {
                active: false,
                buttonLabel: 'Next',
                buttonSentence: '%current / %size',
                buttonClassName: ''
            },
            items: {
                size: 0,
                pageSize: 0,
                curPage: 0
            },
        },
        _create: function () {
            this._bindFilter();
            this._bindFacet();
            this._bindToolbar();
            this._bindInfinite();
            this.current_href = window.location.href;
            this.infiniteLoad();
            this.sliderLoad();
        },
        sliderLoad: function() {
            if (this.options.slider.directMode) {
                $('.smile-es-range-slider .actions-toolbar').hide();
            }
        },
        sliderChange: function(url) {
            if (this.options.slider.directMode) {
                this.updateLayer(url);
            }
        },
        _bindFilter: function() {
            let self = this;
            $(document).off('click', self.options.linkFilterRemove);
            $(document).off('click', self.options.linkFilterItem);
            $(document).on('click', self.options.linkFilterRemove, function (e) {
                self.updateLayer(this.href);
                e.preventDefault();
            });
            $(document).on('click', self.options.linkFilterItem, function (e) {
                if (e.target.tagName !== 'A') {
                    self.updateLayer(this.href);
                }
                e.preventDefault();
            });
        },
        _bindFacet: function () {
            let self = this;
            $(document).off('click', self.options.linkSwatchOption);
            $(document).on('click', self.options.linkSwatchOption, function (e) {
                self.updateLayer(this.href);
                e.preventDefault();
            });
        },
        _unbindFacet: function() {
            let self = this;
            $(document).off('click', self.options.linkSwatchOption);
            $(document).off('click', self.options.linkFilterRemove);
            $(document).off('click', self.options.linkFilterItem);
            $(document).on('click', self.options.linkSwatchOption, function (e) {
                e.preventDefault();
            });
            $(document).on('click', self.options.linkFilterRemove, function (e) {
                e.preventDefault();
            });
            $(document).on('click', self.options.linkFilterItem, function (e) {
                if (e.target.tagName !== 'INPUT') {
                    let filterName = $(this).find('input').attr('id').split('_')[0];
                    let filter = uiRegistry.get(filterName);
                    let checkbox = $(this).find('input');
                    if (checkbox.is(':checked')) {
                        checkbox.prop("checked", false);
                        filter.unSelectItem($(this).find('span:first').html());
                    } else {
                        checkbox.prop("checked", true);
                        filter.selectItem($(this).find('span:first').html());
                    }
                }
                e.preventDefault();
            });
        },
        _bindToolbar: function () {
            let self = this;

            $(document).on('click', self.options.modeControl, function (e) {
                self.updateLayer(window.location.href, 'product_list_mode', $(e.currentTarget).data('value'));
                e.preventDefault();
            });

            $(document).on('click', self.options.limitControl, function (e) {
                self.updateLayer(window.location.href, 'product_list_limit', e.currentTarget.options[e.currentTarget.selectedIndex].value);
                e.preventDefault();
            });

            $(document).on('click', self.options.directionControl, function (e) {
                self.updateLayer(window.location.href, 'product_list_dir', $(e.currentTarget).data('value'));
                e.preventDefault();
            });

            $(document).on('change', self.options.orderControl, function (e) {
                self.updateLayer(window.location.href, 'product_list_order', e.currentTarget.options[e.currentTarget.selectedIndex].value);
                e.preventDefault();
            });

            $(document).on('click', self.options.linkPageNumber, function (e) {
                self.updateLayer(this.href);
                e.preventDefault();
            });
        },
        _bindInfinite: function() {
            let self = this;
            $(document).on('click', 'div.infinite a', function (e) {
                self._loadPage($(this).attr('href'));
                e.preventDefault();
            });
        },
        infiniteLoad: function() {
            if (!this.options.infinite.active) {
                return;
            }
            $('.infinite').remove();
            if (this.options.items.size > this.options.items.curPage * this.options.items.pageSize) {
                let newUrl = elasticsuiteUrl._buildUrl(this.current_href, 'p', parseInt(this.options.items.curPage) + 1);
                $('.products.wrapper').append(this._infiniteText(newUrl));
            }
        },
        _infiniteText: function(newUrl) {
            let html = '<div class="infinite">';
            let sentence = this.options.infinite.buttonSentence
            .replace(/%current/, this.options.items.pageSize * this.options.items.curPage)
            .replace(/%size/, this.options.items.size);

            html += '<div class="content"></div>';
            if (sentence!== '') {
                html += '<div class="sentence">' + sentence + '</div>';
            }

            html += '<a href="' + newUrl + '" class="' + this.options.infinite.buttonClassName + '">' + this.options.infinite.buttonLabel + '</a>';
            html += '</div>';
            return html;
        },
        updateLayer: function (url, replaceParam, replaceValue) {
            let self = this;
            let newUrl = elasticsuiteUrl._buildUrl(url, replaceParam, replaceValue);
            $.ajax({
                url: newUrl,
                type: 'get',
                dataType: 'json',
                cache: true,
                beforeSend: function () {
                    $('body').trigger('processStart');
                },
                success: function (response) {
                    self._afterUpdateLayer(response, newUrl);
                },
                complete: function () {
                    $('body').trigger('processStop');
                }
            });
        },
        _afterUpdateLayer: function(response, newUrl) {
            let self = this;
            history.pushState({ }, document.title, newUrl);
            elasticsuiteUrl.reload();
            elasticsuiteUrl.reloadAttributeFilter();
            self.options.items.size = response.size;
            self.options.items.pageSize = response.pageSize;
            self.options.items.curPage = response.curPage;
            $(self.options.listFilterContainer).replaceWith(response.listFilterOptions);
            $('.category-list-view').html(response.productList);
            $(self.options.listFilterContainer).trigger('contentUpdated');
            _.each(response.filterItems, function(items, filterName) {
                uiRegistry.filter(function(component){
                    if (component.name === filterName) {
                        uiRegistry.get(component).reloadItems(items)
                    }
                });
            });
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
            self.infiniteLoad();
            self.sliderLoad();
        },
        _loadPage: function (url) {
            let self = this;
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                cache: false,
                beforeSend: function () {
                    $('body').trigger('processStart');
                },
                success: function (response) {
                    self._afterPageLoad(response, url);
                },
                complete: function () {
                    $('body').trigger('processStop');
                }
            });
        },
        _afterPageLoad: function(response, newUrl) {
            let self = this;
            history.pushState({ }, document.title, newUrl);
            let responseDom = $($.parseHTML(response.productList));
            $('.products.list.items').append(responseDom.find('.products.list.items').html());

            self.options.items.size = response.size;
            self.options.items.pageSize = response.pageSize;
            self.options.items.curPage = response.curPage;
            $(self.options.listFilterContainer).trigger('contentUpdated');
            $(document).trigger('contentUpdated');
            self.infiniteLoad();
            self.sliderLoad();
        }
    });
    return $.mage.elasticsuiteAjax;
});
