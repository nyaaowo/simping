export interface SimpleEvent {
    on(listener: () => void): void;
    off(listener: () => void): void;
}
