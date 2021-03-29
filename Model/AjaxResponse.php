<?php

declare(strict_types=1);

namespace Web200\ElasticsuiteAjax\Model;

use Magento\Catalog\Block\Product\ListProduct;
use Magento\Framework\App\Http\Context;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\View\Layout;
use Smile\ElasticsuiteCatalog\Block\Navigation;
use Smile\ElasticsuiteCatalog\Model\Layer\Filter\Attribute;
use Smile\ElasticsuiteCatalog\Model\ResourceModel\Product\Fulltext\Collection;

/**
 * Class AjaxResponse
 *
 * @package   Web200\ElasticsuiteAjax\Model
 * @author    Web200 <contact@web200.fr>
 * @copyright 2021 Web200
 * @license   https://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * @link      https://www.web200.fr/
 */
class AjaxResponse
{
    /**
     * Product list block
     *
     * @var string $productListBlock
     */
    protected $productListBlock = '';
    /**
     * Left nav block
     *
     * @var string $leftNavBlock
     */
    protected $leftNavBlock = '';
    /**
     * Result json factory
     *
     * @var JsonFactory $resultJsonFactory
     */
    protected $resultJsonFactory;
    /**
     * Context
     *
     * @var Context $context
     */
    protected $context;
    /**
     * Layout
     *
     * @var Layout $layout
     */
    protected $layout;

    /**
     * AjaxResponse constructor.
     *
     * @param JsonFactory $resultJsonFactory
     * @param Layout      $layout
     * @param Context     $context
     */
    public function __construct(
        JsonFactory $resultJsonFactory,
        Layout $layout,
        Context $context
    ) {
        $this->resultJsonFactory = $resultJsonFactory;
        $this->context           = $context;
        $this->layout           = $layout;
    }

    /**
     * Execute
     *
     * @return Json
     */
    public function execute(): Json
    {
        $this->context->setValue('ajax', true, false);

        /** @var ListProduct $productList */
        $productList = $this->layout->getBlock($this->getProductListBlock());
        /** @var Collection $productList */
        $productCollection = $productList->getLoadedProductCollection();
        $resultJson        = $this->resultJsonFactory->create();
        $resultJson->setData([
            'productList'       => $productList->toHtml(),
            'listFilterOptions' => $this->layout->getBlock($this->getLeftNavBlock())->toHtml(),
            'filterItems'       => $this->getFilterItems(),
            'pageSize'          => $productCollection->getPageSize(),
            'size'              => $productCollection->getSize(),
            'curPage'           => $productCollection->getCurPage(),
        ]);

        return $resultJson;
    }

    /**
     * Get filter items
     *
     * @return string[]
     */
    protected function getFilterItems(): array
    {
        /** @var Navigation $leftNavBlock */
        $leftNavBlock = $this->layout->getBlock($this->getLeftNavBlock());

        $items = [];
        /** @var mixed[] $filters */
        $filters = $leftNavBlock->getFilters();
        foreach ($filters as $filter) {
            $datascope = $filter->getRequestVar() . 'Filter';
            if (is_a($filter, Attribute::class)) {
                $items[$datascope] = [];
                foreach ($filter->getItems() as $item) {
                    $items[$datascope][] = $item->toArray(['label', 'count', 'url', 'is_selected']);
                }
            }
        }

        return $items;
    }

    /**
     * Set product list block
     *
     * @param string $productListBlock
     *
     * @return AjaxResponse
     */
    public function setProductListBlock(string $productListBlock): AjaxResponse
    {
        $this->productListBlock = $productListBlock;

        return $this;
    }

    /**
     * Set product list block
     *
     * @param string $leftNavBlock
     *
     * @return AjaxResponse
     */
    public function setLeftNavBlock(string $leftNavBlock): AjaxResponse
    {
        $this->leftNavBlock = $leftNavBlock;

        return $this;
    }

    /**
     * Get product list block
     *
     * @return string
     */
    public function getProductListBlock(): string
    {
        return $this->productListBlock;
    }

    /**
     * Get left nav block
     *
     * @return string
     */
    public function getLeftNavBlock(): string
    {
        return $this->leftNavBlock;
    }
}
