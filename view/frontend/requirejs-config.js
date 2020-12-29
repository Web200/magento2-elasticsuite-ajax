let config = {
    map: {
        '*': {
            elasticsuiteAjax: 'Web200_ElasticsuiteAjax/js/elasticsuite-ajax',
            elasticsuiteUrl: 'Web200_ElasticsuiteAjax/js/elasticsuite-url',
            productListToolbarForm: 'Web200_ElasticsuiteAjax/js/product/list/toolbar'
        }
    },
    config: {
        mixins: {
            'Smile_ElasticsuiteCatalog/js/attribute-filter': {
                'Web200_ElasticsuiteAjax/js/attribute-filter-mixin': true
            }
        }
    }
};
