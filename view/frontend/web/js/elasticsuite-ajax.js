define([
    'jquery',
    'elasticsuiteUrl',
    'jquery-ui-modules/widget'
], function ($, elasticsuiteUrl) {
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
            infinite: false,
            next: {
              cta: 'Next',
              sentence:  '%current / %size'
            },
            items: {
                size: 0,
                pageSize: 0,
                curPage: 0
            },
        },
        _create: function () {
            this._bind();
            this.current_href = window.location.href;
            this.infiniteLoad();
        },
        _bind: function () {
            let self = this;

            $(document).on('click', self.options.modeControl, function (e) {
                self.updateLayer(self.current_href, 'product_list_mode', $(e.currentTarget).data('value'));
                e.preventDefault();
            });

            $(document).on('click', self.options.limitControl, function (e) {
                self.updateLayer(self.current_href, 'product_list_limit', e.currentTarget.options[e.currentTarget.selectedIndex].value);
                e.preventDefault();
            });

            $(document).on('click', self.options.directionControl, function (e) {
                self.updateLayer(self.current_href, 'product_list_dir', $(e.currentTarget).data('value'));
                e.preventDefault();
            });

            $(document).on('click', self.options.orderControl, function (e) {
                self.updateLayer(self.current_href, 'product_list_order', e.currentTarget.options[e.currentTarget.selectedIndex].value);
                e.preventDefault();
            });

            $(document).on('click', self.options.linkSwatchOption, function (e) {
                self.updateLayer(this.href);
                e.preventDefault();
            });

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

            $(document).on('click', self.options.linkPageNumber, function (e) {
                self.updateLayer(this.href);
                e.preventDefault();
            });

            $(document).on('click', 'div.infinite a.link', function (e) {
                self._loadPage($(this).attr('href'));
                e.preventDefault();
            });
        },
        infiniteLoad: function() {
            if (!this.options.infinite) {
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
            let sentence = this.options.next.sentence
            .replace(/%current/, this.options.items.pageSize * this.options.items.curPage)
            .replace(/%size/, this.options.items.size);

            html += '<div class="content"></div>';
            if (sentence!== '') {
                html += '<div class="sentence">' + sentence + '</div>';
            }

            html += '<a href="' + newUrl + '" class="link">' + this.options.next.cta + '</a>';
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
                cache: false,
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
        }
    });
    return $.mage.elasticsuiteAjax;
});
