type EventCallback<T> = (payload: T) => void | Promise<void>;

class EventBus {
  private handlers: Record<string, EventCallback<any>[]> = {};

  on<T = any>(event: string, handler: EventCallback<T>) {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(handler);
  }

  async emit<T = any>(event: string, payload: T) {
    if (this.handlers[event])
      for (const h of this.handlers[event]) await h(payload);
  }
}

export const eventBus = new EventBus();