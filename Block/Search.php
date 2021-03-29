<?php

declare(strict_types=1);

namespace Web200\ElasticsuiteAjax\Block;

use Magento\Catalog\Block\Product\ListProduct;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\View\Element\Template;
use Smile\ElasticsuiteCatalog\Model\ResourceModel\Product\Fulltext\Collection;
use Web200\ElasticsuiteAjax\Provider\Config;

/**
 * Class Search
 *
 * @package Web200\ElasticsuiteAjax\Block
 */
class Search extends Ajax
{
    /**
     * Get product list collection
     *
     * @return Collection
     */
    public function getProductList(): Collection
    {
        if ($this->productCollection === null) {
            /** @var ListProduct $productList */
            $productList             = $this->getLayout()->getBlock('search_result_list');
            $this->productCollection = $productList->getLoadedProductCollection();
        }

        return $this->productCollection;
    }
}
