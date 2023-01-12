# Magento 2 Elastisuite Ajax Module

Magento 2 Module to add ajax navigation to elasticsuite module

## Installation

```
$ composer require "web200/magento-elasticsuite-ajax":"*"
```

## Features

* Ajax navigation on category pages (Categories / Swatches / List)
* Infinite navigation pages. (Can be enable / disable in Store > Configuration > Elasticsuite > Ajax Settings)

## Varnish

In order to cache classic page and xhr request you need to set different cache in varnish. Thanks @mfickers

```
sub vcl_hash {
    ...

    # Sort AJAX requests distinct from regular requests
    if (req.http.X-Requested-With == "XMLHttpRequest"){
        hash_data(req.http.X-Requested-With);
    }

    ...
}
```
