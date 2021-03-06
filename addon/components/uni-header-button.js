import Component from '@ember/component';
import layout from '../templates/components/uni-header-button';

export default Component.extend({
  tagName: 'div',
  ariaRole: 'button',
  classNameBindings: ['isBordered:uni-header__nav__button--bordered'],
  classNames: ['uni-header__nav__button'],
  layout,

  href: null,
  target: '_blank',

  action() {},

  click() {
    this.get('action')();
  }
});
