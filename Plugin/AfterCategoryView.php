<?php

declare(strict_types=1);

namespace Web200\ElasticsuiteAjax\Plugin;

use Magento\Catalog\Block\Product\ListProduct;
use Magento\Catalog\Controller\Category\View;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\View\LayoutInterface;
use Magento\Framework\View\Result\Page;

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
     * AfterCategoryView constructor.
     *
     * @param JsonFactory $resultJsonFactory
     */
    public function __construct(
        JsonFactory $resultJsonFactory
    ) {
        $this->resultJsonFactory = $resultJsonFactory;
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
        /** @var LayoutInterface $layout */
        $layout = $page->getLayout();
        /** @var ListProduct $productList */
        $productList = $layout->getBlock('category.products.list');
        /** @var Json $resultJson */
        $resultJson = $this->resultJsonFactory->create();
        $resultJson->setData([
            'productList'       => $productList->toHtml(),
            'listFilterOptions' => $layout->getBlock('catalog.leftnav')->toHtml()
        ]);

        return $resultJson;
    }
}
