<?php

declare(strict_types=1);

namespace Web200\ElasticsuiteAjax\Plugin;

use Smile\ElasticsuiteCatalog\Block\Navigation\Renderer\Attribute;

/**
 * Class AddValueToItem
 *
 * @package   Web200\ElasticsuiteAjax\Plugin
 * @author    Web200 <contact@web200.fr>
 * @copyright 2026 Web200
 * @license   https://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * @link      https://www.web200.fr/
 */
class AddValueToItem
{
    /**
     * @param Attribute $subject
     * @param           $result
     *
     * @return mixed
     */
    public function afterGetJsLayout(Attribute $subject, $result)
    {
        if (empty($result)) {
            return $result;
        }

        $jsLayout = json_decode($result, true);

        if (!isset($jsLayout['items']) || !is_array($jsLayout['items'])) {
            return $result;
        }

        $originalItems = $subject->getFilter()->getItems();
        $originalItems = array_values($originalItems);

        foreach ($jsLayout['items'] as $index => &$itemData) {
            if (isset($originalItems[$index])) {
                $itemData['value'] = $originalItems[$index]->getValue();
            }
        }

        return json_encode($jsLayout);
    }
}
