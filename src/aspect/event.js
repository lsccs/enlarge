export default class Event {

  static startAnimationend = 'startAnimationend';
  static startEnd = 'startEnd';
  static closeAnimationend = 'closeAnimationend';
  static closeEnd = 'closeEnd';

  static pool = {};

  static addEvent(name, cb) {
    if (!Event.pool[name]) {
      Event.pool[name] = [];
    }
    Event.pool[name].push(cb);
  }

  static removeEvent(name, cb) {
    const events = Event.pool[name] || [];
    const index = events.findIndex(fn => fn === cb);
    if (index !== -1) {
      events.splice(index, 1);
    }
  }

  static touchEvent(name) {
    const events = Event.pool[name] || [];
    events.forEach(fn => fn());
  }

  static touchEventByCssName(e) {
    const { propertyName, target } = e;
    switch (propertyName) {
      case 'background-color':
        const isStart = target.className.includes('show');
        Event.touchEvent(isStart ? Event.startAnimationend : Event.closeAnimationend);
        return
    }
  }
}
