<?php

declare(strict_types=1);

namespace Web200\ElasticsuiteAjax\Block;

use Magento\Catalog\Block\Product\ListProduct;
use Magento\Framework\View\Element\Template;
use Smile\ElasticsuiteCatalog\Model\ResourceModel\Product\Fulltext\Collection;
use Web200\ElasticsuiteAjax\Provider\Config;

/**
 * Class Catalog
 *
 * @package Web200\ElasticsuiteAjax\Block
 */
class Catalog extends Template
{
    /**
     * Product collection
     *
     * @var Collection $productCollection
     */
    protected $productCollection;
    /**
     * Config
     *
     * @var Config $config
     */
    protected $config;

    /**
     * Catalog constructor.
     *
     * @param Config           $config
     * @param Template\Context $context
     * @param array            $data
     */
    public function __construct(
        Config $config,
        Template\Context $context,
        array $data = []
    ) {
        parent::__construct($context, $data);

        $this->config = $config;
    }

    /**
     * Get product list collection
     *
     * @return Collection
     */
    public function getProductList(): Collection
    {
        if ($this->productCollection === null) {
            /** @var ListProduct $productList */
            $productList             = $this->getLayout()->getBlock('category.products.list');
            $this->productCollection = $productList->getLoadedProductCollection();
        }

        return $this->productCollection;
    }

    /**
     * Get size
     *
     * @return int
     */
    public function getSize(): int
    {
        return (int)$this->getProductList()->getSize();
    }

    /**
     * Get page size
     *
     * @return int
     */
    public function getPageSize(): int
    {
        return (int)$this->getProductList()->getPageSize();
    }

    /**
     * Get current page
     *
     * @return int
     */
    public function getCurPage(): int
    {
        return (int)$this->getProductList()->getCurPage();
    }

    /**
     * Is infinite active
     *
     * @return bool
     */
    public function isInfiniteActive(): bool
    {
        return $this->config->isInfiniteActive();
    }
}
