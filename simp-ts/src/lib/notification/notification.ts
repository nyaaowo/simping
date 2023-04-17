export type NotificationType = 'Success' | 'Failure' | 'Default';

export interface SimpleNotification {
    title: string;
    message: string;
    notificationType: NotificationType;
}

export interface KeyedSimpleNotification extends SimpleNotification {
    id: number;
}
