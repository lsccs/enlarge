export default class Event {

  static startAnimationend = 'startAnimationend';
  static startEnd = 'startEnd';
  static closeAnimationend = 'closeAnimationend';
  static closeEnd = 'closeEnd';

  eventPool = {};

   addEvent(name, cb) {
    if (!this.eventPool[name]) {
      this.eventPool[name] = [];
    }
     this.eventPool[name].push(cb);
  }

   removeEvent(name, cb) {
    const events = this.eventPool[name] || [];
    const index = events.findIndex(fn => fn === cb);
    if (index !== -1) {
      events.splice(index, 1);
    }
  }


   touchEvent(name) {
    const events = this.eventPool[name] || [];
    events.forEach(fn => fn());
  }

  touchEventByIsStart(isStart) {
    this.touchEvent(isStart ? Event.startAnimationend : Event.closeAnimationend);
  }
}
