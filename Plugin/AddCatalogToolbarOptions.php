<?php

declare(strict_types=1);

namespace Web200\ElasticsuiteAjax\Plugin;

use Magento\Catalog\Block\Product\ProductList\Toolbar;
use Magento\Framework\Serialize\Serializer\Json;
use Web200\ElasticsuiteAjax\Provider\Config;

/**
 * Class AddCatalogToolbarOptions
 *
 * @package   Web200\ElasticsuiteAjax\Plugin
 * @author    Web200 <contact@web200.fr>
 * @copyright 2020 Web200
 * @license   https://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * @link      https://www.web200.fr/
 */
class AddCatalogToolbarOptions
{
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
     * AddCatalogToolbarOptions constructor.
     *
     * @param Config $config
     * @param Json   $json
     */
    public function __construct(
        Config $config,
        Json $json
    ) {
        $this->config = $config;
        $this->json   = $json;
    }

    /**
     * Add catalog toolbar options
     *
     * @param Toolbar $subject
     * @param         $result
     * @param mixed[] $customOptions
     *
     * @return string
     */
    public function afterGetWidgetOptionsJson(
        Toolbar $subject,
        $result,
        array $customOptions = []
    ): string {
        /** @var string[] $jsonData */
        $jsonData = $this->json->unserialize($result);
        if (!isset($jsonData['productListToolbarForm'])) {
            return $result;
        }
        $jsonData['productListToolbarForm']['ajax'] = $this->config->isValue(Config::GENERAL_ACTIVE);

        return $this->json->serialize($jsonData);
    }
}
