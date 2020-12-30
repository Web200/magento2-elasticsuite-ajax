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
     * Active
     *
     * @var string GENERAL_ACTIVE
     */
    public const GENERAL_ACTIVE = 'smile_elasticsuite_ajax_settings/general/active';
    /**
     * Description $scopeConfig field
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
     * Is active
     *
     * @param mixed $store
     *
     * @return bool
     */
    public function isActive($store = null): bool
    {
        return (bool)$this->scopeConfig->getValue(
            self::GENERAL_ACTIVE,
            ScopeInterface::SCOPE_STORES,
            $store
        );
    }
}
