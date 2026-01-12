<?php

declare(strict_types=1);

namespace Web200\ElasticsuiteAjax\Model\Layer\Filter;

use Magento\Eav\Model\Entity\Attribute\Source\AbstractSource;
use Smile\ElasticsuiteCatalog\Model\Layer\Filter\Attribute as BaseAttribute;

/**
 * Class Attribute
 *
 * @package   Web200\ElasticsuiteAjax\Model\Layer\Filter
 * @author    Web200 <contact@web200.fr>
 * @copyright 2026 Web200
 * @license   https://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * @link      https://www.web200.fr/
 */
class Attribute extends BaseAttribute
{
    /**
     * @return array
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    protected function _getItemsData()
    {
        $items = parent::_getItemsData();
        $attribute = $this->getAttributeModel();
        $source = $attribute->getSource();
        if ($source instanceof AbstractSource) {
            foreach ($items as &$item) {
                if (isset($item['label'])) {
                    $item['label'] = __($item['label']);
                }
            }
        }

        return $items;
    }
}
