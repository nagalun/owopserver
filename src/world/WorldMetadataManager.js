import { Level } from "level"
import { Cache } from "../util/dbCache.js"

export class WorldMetadataManager {
  constructor(server) {
    this.server = server
    this.db = new Level("./data/world-metadata", {
      keyEncoding: "utf8",
      valueEncoding: "utf8"
    })
    this.dbCache = new Cache(10000, this.dbGetter.bind(this), this.dbSetter.bind(this))

    this.destroyed = false
  }

  async dbGetter(key) {
    try {
      const result = await this.db.get(key)
      this.db.del
      return result ? JSON.parse(result) : null
    } catch (error) {
      return null
    }
  }

  dbSetter(key, value) {
    return value !== undefined && value !== null
      ? this.db.put(key, JSON.stringify(value))
      : this.db.del(key)
  }

  async destroy() {
    if (this.destroyed) return
    this.destroyed = true
    await this.dbCache.saveAll()
    this.db.close()
  }

  async listKeys(prefix, limit = 50, startKey = null) {
    // such a shame
    await this.dbCache.savePredicate((k, v) => k.startsWith(prefix));

    const page = [];
    const options = {
      gte: prefix,
      lte: prefix + '\xff',
      limit: limit
    };

    if (startKey) {
      options.gt = startKey;
    }

    try {
      for await (const [key, value] of this.db.iterator(options)) {
        page.push({key, value});
      }
    } catch (error) {
      console.error("Error listing keys:", error);
    }

    return page;
  }

  createWorldMetadataClosure(worldName) {
    return {
      get: (key) => this.dbCache.get(`${worldName}$${key}`),
      list: (prefix, limit = 50, startKey = null) => this.listKeys(`${worldName}$${prefix}`, limit, `${worldName}$${startKey}`),
      set: (key, value) => this.dbCache.set(`${worldName}$${key}`, value),
    }
  }
}
