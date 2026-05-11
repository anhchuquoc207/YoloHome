import { OnModuleInit } from "@nestjs/common";
export declare class MqttService implements OnModuleInit {
    private client;
    onModuleInit(): void;
    publishFeed(feed: string, value: string): void;
}
