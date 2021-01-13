# Magento 2 Elastisuite Ajax Module

Magento 2 Module to add ajax navigation to elasticsuite module

## Installation

```
$ composer require "web200/magento-elasticsuite-ajax":"*"
```

## Features

* Ajax navigation on category pages (Categories / Swatches / List)
* Infinite navigation pages.
Override ElasticsuiteAjax/view/frontend/templates/layer/init.phtml and add infinite param

```
<script type="text/x-magento-init">
    {
        "body": {
            "elasticsuiteAjax": {
                "items": {
                    "pageSize": "<?= $this->getPageSize() ?>",
                    "size": "<?= $this->getSize() ?>",
                    "curPage": "<?= $this->getCurPage() ?>"
                },
                "infinite": true
            }
        }
    }
</script>
```



## Demo

[![IMAGE ALT TEXT](https://pic.infini.fr/rScn8xFj/c7AaXbaj.jpg)](https://www.youtube.com/watch?v=UYvmDOHwzuM "Elasticsuite Ajax Navigation")
