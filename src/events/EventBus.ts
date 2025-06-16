type EventHandler = (payload: any) => void;

class EventBus {
  private handlers: { [event: string]: EventHandler[] } = {};

  on(event: string, handler: EventHandler) {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(handler);
  }

  emit(event: string, payload: any) {
    (this.handlers[event] || []).forEach((handler) => handler(payload));
  }
}

export const eventBus = new EventBus(); 