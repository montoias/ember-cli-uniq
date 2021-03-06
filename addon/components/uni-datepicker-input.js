import Component from '@ember/component';
import { computed } from '@ember/object';
import { isPresent, isNone } from '@ember/utils';
import layout from '../templates/components/uni-datepicker-input';
import ClickOutsideMixin from 'ember-cli-uniq/mixins/click-outside';
import moment from 'moment';

export default Component.extend(ClickOutsideMixin, {
  classNames: ['uni-datepicker-input'],
  layout,
  showDatepicker: false,
  selected: moment(),
  center: moment(),
  format: 'll',
  minDate: moment(),
  maxDate: moment().add(2, 'years'),
  placeholder: null,
  label: null,
  isReadOnly: true,
  disabledDates: [],

  formattedDate: computed('selected', function() {
    let selected = this.get('selected');

    if (isNone(selected) && isPresent(this.get('placeholder'))) {
      return '';
    }

    return isNone(selected)
      ? moment().format(this.get('format'))
      : moment(selected).format(this.get('format'));
  }),

  onSelected() {},

  onOutsideClick() {
    if (this.isComponentDestroyed()) {
      return;
    }

    this.set('showDatepicker', false);
  },

  isComponentDestroyed() {
    return this.get('isDestroyed') || this.get('isDestroying');
  },

  actions: {
    onSelect(date) {
      this.get('onSelected')(date);

      this.toggleProperty('showDatepicker');
    },

    toggleDatepicker() {
      this.toggleProperty('showDatepicker');
    }
  }
});
