<?php

declare(strict_types=1);

namespace Web200\ElasticsuiteAjax\Plugin;

use Smile\ElasticsuiteCatalog\Block\Navigation\Renderer\Slider;
use Web200\ElasticsuiteAjax\Provider\Config;
use Magento\Framework\Serialize\Serializer\Json;

/**
 * Class AddSliderToolbarOptions
 *
 * @package   Web200\ElasticsuiteAjax\Plugin
 * @author    Web200 <contact@web200.fr>
 * @copyright 2021 Web200
 * @license   https://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * @link      https://www.web200.fr/
 */
class AddSliderToolbarOptions
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
     * Add slider toolbar options
     *
     * @param Slider                                                      $subject
     * @param                                                             $result
     *
     * @return string
     */
    public function afterGetJsonConfig(Slider $subject, $result): string
    {
        /** @var string[] $jsonData */
        $jsonData = $this->json->unserialize($result);
        if ($jsonData === null) {
            return $result;
        }
        $jsonData['ajax'] = $this->config->isActive();

        return $this->json->serialize($jsonData);
    }
}
