import {getPubSubClient, PubSubClient} from '@app/services/pubsub/client.js';

export class NotificationService {
  constructor(private readonly pubSubClient: PubSubClient) {}

  async sendNotificationUserCreated(message: string) {
    const pubSubClient = getPubSubClient();
    const topic = pubSubClient.topic('user-created');
    await topic.publishMessage({data: Buffer.from(message)});
  }

  async sendNotificationUserUpdated(message: string) {
    const pubSubClient = getPubSubClient();
    const topic = pubSubClient.topic('user-updated');
    await topic.publishMessage({data: Buffer.from(message)});
  }

  async sendNotificationProfileUpdated(message: string) {
    const pubSubClient = getPubSubClient();
    const topic = pubSubClient.topic('profile-updated');
    await topic.publishMessage({data: Buffer.from(message)});
  }

  async sendNotificationPostCreated(message: string) {
    const pubSubClient = getPubSubClient();
    const topic = pubSubClient.topic('post-created');
    await topic.publishMessage({data: Buffer.from(message)});
  }
}
