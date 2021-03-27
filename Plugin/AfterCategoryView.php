<?php

declare(strict_types=1);

namespace Web200\ElasticsuiteAjax\Plugin;

use Magento\Catalog\Block\Product\ListProduct;
use Magento\Catalog\Controller\Category\View;
use Magento\Framework\App\Http\Context;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\View\LayoutInterface;
use Magento\Framework\View\Result\Page;
use Smile\ElasticsuiteCatalog\Block\Navigation;
use Smile\ElasticsuiteCatalog\Model\Layer\Filter\Attribute;
use Smile\ElasticsuiteCatalog\Model\ResourceModel\Product\Fulltext\Collection;

/**
 * Class AfterCategoryView
 *
 * @package   Web200\ElasticsuiteAjax\Plugin\Controller\Category
 * @author    Web200 <contact@web200.fr>
 * @copyright 2020 Web200
 * @license   https://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * @link      https://www.web200.fr/
 */
class AfterCategoryView
{
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
     * AfterCategoryView constructor.
     *
     * @param JsonFactory $resultJsonFactory
     * @param Context     $context
     */
    public function __construct(
        JsonFactory $resultJsonFactory,
        Context $context
    ) {
        $this->resultJsonFactory = $resultJsonFactory;
        $this->context           = $context;
    }

    /**
     * After Category View
     *
     * @param View $view
     * @param Page $page
     *
     * @return mixed
     */
    public function afterExecute(View $view, $page)
    {
        /** @var bool $isAjax */
        $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest';
        if (!$isAjax) {
            return $page;
        }

        $this->context->setValue('ajax', true, false);
        /** @var LayoutInterface $layout */
        $layout = $page->getLayout();
        /** @var ListProduct $productList */
        $productList = $layout->getBlock('category.products.list');
        /** @var Collection $productList */
        $productCollection = $productList->getLoadedProductCollection();
        /** @var Json $resultJson */
        $resultJson = $this->resultJsonFactory->create();
        $resultJson->setData([
            'productList'       => $productList->toHtml(),
            'listFilterOptions' => $layout->getBlock('catalog.leftnav')->toHtml(),
            'filterItems'       => $this->getFilterItems($layout),
            'pageSize'          => $productCollection->getPageSize(),
            'size'              => $productCollection->getSize(),
            'curPage'           => $productCollection->getCurPage(),
        ]);

        return $resultJson;
    }


    /**
     * Get filter items
     * @return string[]
     */
    protected function getFilterItems(LayoutInterface $layout): array
    {
        /** @var Navigation $leftNavBlock */
        $leftNavBlock = $layout->getBlock('catalog.leftnav');

        /** @var string[] $items */
        $items = [];
        /** @var mixed[] $filters */
        $filters = $leftNavBlock->getFilters();
        /** @var mixed $filter */
        foreach ($filters as $filter) {
            /** @var string $datascope */
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
}
