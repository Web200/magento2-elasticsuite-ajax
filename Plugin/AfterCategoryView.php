<?php

declare(strict_types=1);

namespace Web200\ElasticsuiteAjax\Plugin;

use Magento\Catalog\Block\Product\ListProduct;
use Magento\Catalog\Controller\Category\View;
use Magento\CatalogSearch\Controller\Result\Index;
use Magento\Framework\App\Http\Context;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\View\LayoutInterface;
use Magento\Framework\View\Result\Page;
use Smile\ElasticsuiteCatalog\Block\Navigation;
use Smile\ElasticsuiteCatalog\Model\Layer\Filter\Attribute;
use Smile\ElasticsuiteCatalog\Model\ResourceModel\Product\Fulltext\Collection;
use Web200\ElasticsuiteAjax\Model\AjaxResponse;

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
     * Ajax response
     *
     * @var AjaxResponse $ajaxResponse
     */
    protected $ajaxResponse;

    /**
     * AfterSearchView constructor.
     *
     * @param AjaxResponse $ajaxResponse
     */
    public function __construct(
        AjaxResponse $ajaxResponse
    ) {
        $this->ajaxResponse = $ajaxResponse;
    }

    /**
     * After Search View
     *
     * @param View $view
     * @param      $page
     *
     * @return mixed
     */
    public function afterExecute(View $view, $page)
    {
        $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest';
        if (!$isAjax) {
            return $page;
        }

        return $this->ajaxResponse
            ->setProductListBlock('category.products.list')
            ->setLeftNavBlock('catalog.leftnav')
            ->execute();
    }
}
