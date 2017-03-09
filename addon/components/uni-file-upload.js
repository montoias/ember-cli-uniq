import Ember from 'ember';
import layout from '../templates/components/uni-file-upload';

const { Component } = Ember;

export default Component.extend({
  layout,
  accept: null,
  renderFile: false,
  label: '',
  filename: '',

  handleFile() {},

  actions: {
    triggerInputFile() {
      this.$('.uni-file-upload').click();
    },

    handleFile(event) {
      let reader = new FileReader();
      let [file] = event.target.files;

      reader.onload = () => {
        this.set('filename', file.name);
        this.get('handleFile')(file, reader.result);
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }
});