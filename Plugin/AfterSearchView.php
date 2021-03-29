<?php

declare(strict_types=1);

namespace Web200\ElasticsuiteAjax\Plugin;

use Magento\CatalogSearch\Controller\Result\Index;
use Magento\Framework\View\Result\Page;
use Web200\ElasticsuiteAjax\Model\AjaxResponse;

/**
 * Class AfterSearchView
 *
 * @package   Web200\ElasticsuiteAjax\Plugin\Controller\Category
 * @author    Web200 <contact@web200.fr>
 * @copyright 2020 Web200
 * @license   https://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * @link      https://www.web200.fr/
 */
class AfterSearchView
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
     * @param Index $view
     * @param Page  $page
     *
     * @return mixed
     */
    public function afterExecute(Index $view, $page)
    {
        $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest';
        if (!$isAjax) {
            return $page;
        }

        return $this->ajaxResponse
            ->setProductListBlock('search_result_list')
            ->setLeftNavBlock('catalogsearch.leftnav')
            ->execute();
    }
}
