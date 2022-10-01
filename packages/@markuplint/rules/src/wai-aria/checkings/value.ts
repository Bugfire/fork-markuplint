import type { Options } from '../types';
import type { AttrChecker } from '@markuplint/ml-core';
import type { ARIAProperty, ARIARole } from '@markuplint/ml-spec';

export const checkingValue: AttrChecker<
	boolean,
	Options,
	{
		role?: ARIARole | null;
		propSpecs: ARIAProperty[];
	}
> =
	({ attr, role, propSpecs }) =>
	t => {
		if (attr.isDynamicValue) {
			return;
		}
		const propSpec = propSpecs.find(p => p.name === attr.name);

		const result = checkAria(propSpec, attr.value, role?.name);
		if (result.isValid) {
			return;
		}
		return {
			scope: attr,
			message:
				t(
					'{0:c} on {1}',
					t('{0} is {1:c}', t('the "{0}"', attr.value), 'disallowed'),
					t('the "{0*}" {1}', attr.name, `ARIA ${propSpec?.type ?? 'property'}`),
				) +
				('enum' in result && result.enum.length ? t('. ') + t('Allowed values are: {0}', t(result.enum)) : ''),
		};
	};

function checkAria(propSpec: ARIAProperty | undefined, currentValue: string, role?: string) {
	if (!propSpec) {
		return {
			currentValue,
			// For skipping checking
			isValid: true,
		};
	}

	let valueType = propSpec.value;
	if (role && propSpec.conditionalValue) {
		for (const cond of propSpec.conditionalValue) {
			if (cond.role.includes(role)) {
				valueType = cond.value;
				break;
			}
		}
	}
	const isValid = checkAriaValue(valueType, currentValue, propSpec.enum);
	return {
		...propSpec,
		currentValue,
		isValid,
	};
}

/**
 *
 * @see https://www.w3.org/TR/wai-aria-1.2/#propcharacteristic_value
 */
export function checkAriaValue(type: string, value: string, tokenEnum: string[]) {
	switch (type) {
		case 'token': {
			return tokenEnum.includes(value);
		}
		case 'token list': {
			const list = value.split(/\s+/g).map(s => s.trim());
			return list.every(token => tokenEnum.includes(token));
		}
		case 'string':
		case 'ID reference':
		case 'ID reference list': {
			return true;
		}
		case 'true/false': {
			return ['true', 'false'].includes(value);
		}
		case 'tristate': {
			return ['mixed', 'true', 'false', 'undefined'].includes(value);
		}
		case 'true/false/undefined': {
			return ['true', 'false', 'undefined'].includes(value);
		}
		case 'integer': {
			return parseInt(value).toString() === value;
		}
		case 'number': {
			return parseFloat(value).toString() === value;
		}
	}
	// For skipping checking
	return true;
}
