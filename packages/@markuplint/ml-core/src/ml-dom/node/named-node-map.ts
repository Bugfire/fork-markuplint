import type { MLAttr } from './attr';
import type { RuleConfigValue } from '@markuplint/ml-config';

import UnexpectedCallError from './unexpected-call-error';

export class MLNamedNodeMap<T extends RuleConfigValue, O = null> extends Array<MLAttr<T, O>> implements NamedNodeMap {
	getNamedItem(qualifiedName: string): MLAttr<T, O> | null {
		return this.find(attr => attr.name === qualifiedName) || null;
	}

	/**
	 * **IT THROWS AN ERROR WHEN CALLING THIS.**
	 *
	 * @unsupported
	 * @implements DOM API: `NamedNodeMap`
	 */
	getNamedItemNS(namespace: string | null, localName: string): Attr | null {
		throw new UnexpectedCallError('Not supported "getNamedItemNS" method');
	}

	item(index: number): MLAttr<T, O> | null {
		return this[index];
	}

	/**
	 * **IT THROWS AN ERROR WHEN CALLING THIS.**
	 *
	 * @unsupported
	 * @implements DOM API: `NamedNodeMap`
	 */
	removeNamedItem(qualifiedName: string): MLAttr<T, O> {
		throw new UnexpectedCallError('Not supported "removeNamedItem" method');
	}

	/**
	 * **IT THROWS AN ERROR WHEN CALLING THIS.**
	 *
	 * @unsupported
	 * @implements DOM API: `NamedNodeMap`
	 */
	removeNamedItemNS(namespace: string | null, localName: string): MLAttr<T, O> {
		throw new UnexpectedCallError('Not supported "removeNamedItemNS" method');
	}

	/**
	 * **IT THROWS AN ERROR WHEN CALLING THIS.**
	 *
	 * @unsupported
	 * @implements DOM API: `NamedNodeMap`
	 */
	setNamedItem(attr: MLAttr<T, O>): MLAttr<T, O> | null {
		throw new UnexpectedCallError('Not supported "setNamedItem" method');
	}

	/**
	 * **IT THROWS AN ERROR WHEN CALLING THIS.**
	 *
	 * @unsupported
	 * @implements DOM API: `NamedNodeMap`
	 */
	setNamedItemNS(attr: MLAttr<T, O>): MLAttr<T, O> | null {
		throw new UnexpectedCallError('Not supported "setNamedItemNS" method');
	}
}

export function toNamedNodeMap<T extends RuleConfigValue, O = null>(
	nodes: ReadonlyArray<MLAttr<T, O>>,
): MLNamedNodeMap<T, O> {
	const namedNodeMap = new MLNamedNodeMap(...nodes);
	return namedNodeMap;
}
