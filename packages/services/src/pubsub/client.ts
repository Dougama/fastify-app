import {PubSub} from '@google-cloud/pubsub';

let pubSubClient: PubSub;

class MockPubSub {
  topic(name: string) {
    return {
      publishMessage: async () => {
        console.log(`Mock publish to topic ${name}`);
        return '';
      },
    };
  }
}

export const getPubSubClient = () => {
  if (process.env.NODE_ENV === 'staging') {
    return new MockPubSub() as unknown as PubSub;
  }

  if (!pubSubClient) {
    pubSubClient = new PubSub();
  }
  return pubSubClient;
};

export type PubSubClient = PubSub;
