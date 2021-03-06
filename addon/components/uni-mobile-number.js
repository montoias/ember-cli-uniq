import Component from '@ember/component';
import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import {
  getAllCountryNames,
  getCountryName,
  getCountryCallingCode
} from 'ember-cli-countries/utils/countries';
import isValidPhoneNumber from 'ember-cli-uniq/utils/is-valid-phone-number';
import layout from '../templates/components/uni-mobile-number';
import KeyCodes from 'ember-cli-uniq/enums/key-codes-type';

const SEPARATOR_KEY = '__SEPARATOR__';
const SEPARATOR_VALUE = '--------------------------------';

export default Component.extend({
  classNames: ['uni-mobile-number'],
  classNameBindings: ['hasError:uni-mobile-number--error'],
  layout,
  isToShowTooltipOnlyOnInput: false,
  number: null,
  language: null,
  maxLength: '15',
  countrySelected: null,
  selectPlaceholder: null,
  isInputDisabled: false,
  isOpen: false,
  options: [],
  preferredCountries: [], // e.g. ['PT', 'GB', 'DE']

  tooltipMessage: null,
  showTooltip: false,

  onChangeSelect() {},
  onChangeInput() {},
  onFocusIn() {},
  onFocusOut() {},

  init() {
    this._super(...arguments);

    let countries = [];
    let preferredCountries = this.get('preferredCountries');

    if (preferredCountries.length > 0) {
      countries.push(...preferredCountries.map((key) => this._getOption(key)));
      countries.push({ key: SEPARATOR_KEY, value: SEPARATOR_VALUE, disabled: true });
    }

    countries.push(...getAllCountryNames().map(({ key }) => {
      if (preferredCountries.indexOf(key) < 0) {
        return this._getOption(key);
      }
    }).filter((country) => isPresent(country)).sort(this.sortByName));

    this.set('options', countries);
  },

  _getOption(key) {
    return {
      key,
      value: `${getCountryName(key)} (${getCountryCallingCode(key)})`,
      alias: getCountryCallingCode(key)
    };
  },

  sortByName(nameA, nameB) {
    let a = nameA.value.toUpperCase();
    let b = nameB.value.toUpperCase();

    if (a < b) {
      return -1;
    }

    if (a > b) {
      return 1;
    }

    return 0;
  },

  focusIn() {
    this.get('onFocusIn')();

    if (!this.get('isToShowTooltipOnlyOnInput')) {
      this._showTooltipIfExists();
    }
  },

  focusOut() {
    this.get('onFocusOut')();

    if (!this.get('isToShowTooltipOnlyOnInput')) {
      this._hideTooltipIfExists();
    }
  },

  hasError: computed('number', 'language', function() {
    return !isValidPhoneNumber(this.get('language'), this.get('number'));
  }),
  inputId: computed('elementId', function() {
    return `${this.get('elementId')}-subscriber`;
  }),

  actions: {
    onChangeSelect(option) {
      this.get('onChangeSelect')(option);
      this.set('isInputDisabled', false);
      document.getElementById(this.get('inputId')).focus();
    },

    onKeyDown(_, ev) {
      if (ev && !this._isNumericValue(ev.keyCode) && !this._isAllowedKey(ev.keyCode)) {
        ev.preventDefault();
      }
    },

    onKeyUp() {
      this.get('onChangeInput')(...arguments);
    },

    onInputFocusIn() {
      if (!this.get('isToShowTooltipOnlyOnInput')) {
        return;
      }

      this._showTooltipIfExists();
    },

    onInputFocusOut() {
      if (!this.get('isToShowTooltipOnlyOnInput')) {
        return;
      }

      this._hideTooltipIfExists();
    }
  },

  _showTooltipIfExists() {
    if (isPresent(this.get('tooltipMessage'))) {
      this.set('showTooltip', true);
    }
  },

  _hideTooltipIfExists() {
    if (isPresent(this.get('tooltipMessage'))) {
      this.set('showTooltip', false);
    }
  },

  _isNumericValue(keyCode) {
    return (keyCode >= KeyCodes.ZERO && keyCode <= KeyCodes.NINE)
        || (keyCode >= KeyCodes.NUMPAD_ZERO && keyCode <= KeyCodes.NUMPAD_NINE);
  },

  _isAllowedKey(keyCode) {
    let allowedKeys = [
      KeyCodes.TAB,
      KeyCodes.ESCAPE,
      KeyCodes.LEFT_ARROW,
      KeyCodes.UP_ARROW,
      KeyCodes.RIGHT_ARROW,
      KeyCodes.DOWN_ARROW,
      KeyCodes.BACKSPACE,
      KeyCodes.DELETE
    ];

    return allowedKeys.includes(keyCode);
  }
});
