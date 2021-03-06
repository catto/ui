import Ember from 'ember';
import ModelReloaderMixin from 'screwdriver-ui/mixins/model-reloader';
import ENV from 'screwdriver-ui/config/environment';

export default Ember.Component.extend(ModelReloaderMixin, {
  tagName: 'span',
  classNames: ['build-bubble'],
  classNameBindings: ['build.id', 'small'],
  modelToReload: 'build',
  reloadTimeout: ENV.APP.BUILD_RELOAD_TIMER,
  shouldReload(build) {
    if (build) {
      const s = build.get('status');

      return s === 'RUNNING' || s === 'QUEUED';
    }

    return false;
  },

  icon: Ember.computed('jobIsDisabled', 'build', 'build.status', {
    get() {
      if (this.get('jobIsDisabled')) {
        return 'pause';
      }

      const build = this.get('build');

      if (!build) {
        return '';
      }

      switch (build.get('status')) {
      case 'SUCCESS':
        return 'check';
      case 'FAILURE':
        return 'times';
      case 'ABORTED':
        return 'stop';
      case 'RUNNING':
        return 'fa-spinner fa-spin';
      case 'QUEUED':
        return 'clock-o';
      default:
        return 'question';
      }
    }
  }),

  linkTitle: Ember.computed('small', {
    get() {
      if (this.get('small')) {
        return this.get('jobName');
      }

      return this.get('build.sha');
    }
  }),

  mouseEnter() {
    Ember.$(`.${this.get('build.id')}`).addClass('highlight');
  },
  mouseLeave() {
    Ember.$('.build-bubble').removeClass('highlight');
  },
  willRender() {
    this.startReloading();
  },
  willDestroy() {
    this.stopReloading();
  }
});
