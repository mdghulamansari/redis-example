import { RedisClientType } from "@redis/client";
import { createClient } from "redis";

class RedisExtensionMethod {
  private client: RedisClientType = createClient();

  constructor() {
    this.client.connect();
  }

  getOrSetCache = async (
    key: string,
    fetchDbData: any,
    cacheDurationInSeconds: number = 3600
  ) => {
    let result: any;
    try {
      const cachedData = await this.client.get(key);
      if (cachedData) {
        result = JSON.parse(cachedData);
      } else {
        const fetchedData = await fetchDbData();
        if (fetchedData) {
          await this.client.set(key, JSON.stringify(fetchedData));
          await this.client.expire(key, cacheDurationInSeconds);
        }
        result = fetchedData;
      }
    } catch (err) {
      result = await fetchDbData();
    }
    return result;
  };

  deleteCache = async (key: string, cacheDurationInSeconds: number = 0) => {
    const cachedData = await this.client.get(key);
    if (cachedData) {
      await this.client.expire(key, cacheDurationInSeconds);
    }
  };
}

export const redisExtensionStore = new RedisExtensionMethod();
