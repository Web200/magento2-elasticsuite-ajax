<?php

declare(strict_types=1);

namespace Web200\ElasticsuiteAjax\Provider;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;

/**
 * Class Config
 *
 * @package   Web200\ElasticsuiteAjax\Provider
 * @author    Web200 <contact@web200.fr>
 * @copyright 2020 Web200
 * @license   https://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * @link      https://www.web200.fr/
 */
class Config
{
    /**
     * General Active
     *
     * @var string GENERAL_ACTIVE
     */
    public const GENERAL_ACTIVE = 'smile_elasticsuite_ajax_settings/general/active';
    /**
     * Infinite Active
     *
     * @var string INFINITE_ACTIVE
     */
    public const INFINITE_ACTIVE = 'smile_elasticsuite_ajax_settings/infinite/active';
    /**
     * Infinite Button label
     *
     * @var string INFINITE_BUTTON_LABEL
     */
    public const INFINITE_BUTTON_LABEL = 'smile_elasticsuite_ajax_settings/infinite/button_label';
    /**
     * Infinite Button Sentence
     *
     * @var string INFINITE_BUTTON_SENTENCE
     */
    public const INFINITE_BUTTON_SENTENCE = 'smile_elasticsuite_ajax_settings/infinite/button_sentence';
    /**
     * Infinite Button Class name
     *
     * @var string INFINITE_BUTTON_CLASS_NAME
     */
    public const INFINITE_BUTTON_CLASS_NAME = 'smile_elasticsuite_ajax_settings/infinite/button_class_name';
    /**
     * Slider direct mode active
     *
     * @var string SLIDER_DIRECT_MODE_ACTIVE
     */
    public const SLIDER_DIRECT_MODE_ACTIVE = 'smile_elasticsuite_ajax_settings/slider/direct_mode_active';
    /**
     * Scope config interface
     *
     * @var ScopeConfigInterface $scopeConfig
     */
    protected $scopeConfig;

    /**
     * Config constructor
     *
     * @param ScopeConfigInterface $scopeConfig
     *
     * @return void
     */
    public function __construct(
        ScopeConfigInterface $scopeConfig
    ) {
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * Is value
     *
     * @param string $path
     * @param mixed  $store
     *
     * @return bool
     */
    public function isValue(string $path, $store = null): bool
    {
        return (bool)$this->scopeConfig->getValue(
            $path,
            ScopeInterface::SCOPE_STORES,
            $store
        );
    }

    /**
     * Get value
     *
     * @param string $path
     * @param mixed  $store
     *
     * @return string
     */
    public function getValue(string $path, $store = null): string
    {
        return (string)$this->scopeConfig->getValue(
            $path,
            ScopeInterface::SCOPE_STORES,
            $store
        );
    }
}
