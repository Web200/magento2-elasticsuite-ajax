<?php

declare(strict_types=1);

namespace Web200\ElasticsuiteAjax\Block;

use Magento\Catalog\Block\Product\ListProduct;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\View\Element\Template;
use Smile\ElasticsuiteCatalog\Model\ResourceModel\Product\Fulltext\Collection;
use Web200\ElasticsuiteAjax\Provider\Config;

/**
 * Class Ajax
 *
 * @package Web200\ElasticsuiteAjax\Block
 */
class Ajax extends Template
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
     * Json
     *
     * @var Json $json
     */
    protected $json;

    /**
     * Ajax constructor.
     *
     * @param Json             $json
     * @param Config           $config
     * @param Template\Context $context
     * @param array            $data
     */
    public function __construct(
        Json $json,
        Config $config,
        Template\Context $context,
        array $data = []
    ) {
        parent::__construct($context, $data);

        $this->config = $config;
        $this->json   = $json;
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
     * Get js config
     *
     * @return string
     */
    public function getJsConfig(): string
    {
        /** @var mixed[] $jsConfig */
        $jsConfig             = [];
        $jsConfig['items']    = [
            'pageSize' => $this->getPageSize(),
            'size'     => $this->getSize(),
            'curPage'  => $this->getCurPage(),
        ];
        $jsConfig['slider']   = [
            'directMode' => $this->config->isValue(Config::SLIDER_DIRECT_MODE_ACTIVE),
        ];
        $jsConfig['infinite'] = [
            'active'          => $this->config->isValue(Config::INFINITE_ACTIVE),
            'buttonLabel'     => $this->config->getValue(Config::INFINITE_BUTTON_LABEL),
            'buttonSentence'  => $this->config->getValue(Config::INFINITE_BUTTON_SENTENCE),
            'buttonClassName' => $this->config->getValue(Config::INFINITE_BUTTON_CLASS_NAME)
        ];

        return $this->json->serialize($jsConfig);
    }

    /**
     * Get size
     *
     * @return int
     */
    protected function getSize(): int
    {
        return (int)$this->getProductList()->getSize();
    }

    /**
     * Get page size
     *
     * @return int
     */
    protected function getPageSize(): int
    {
        return (int)$this->getProductList()->getPageSize();
    }

    /**
     * Get current page
     *
     * @return int
     */
    protected function getCurPage(): int
    {
        return (int)$this->getProductList()->getCurPage();
    }
}
