import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class HealthController {
  private displayNameEnv: string
  private displayNameAppKey: string
  private displayNameDb: string

  constructor() {
    this.displayNameEnv = 'Node Env Check'
    this.displayNameAppKey = 'App Key Check'
    this.displayNameDb = 'DB Connection Check'
  }

  async index({ response }: HttpContext) {
    const isNodeEnvSet = !!env.get('NODE_ENV')
    const isAppKeySet = !!env.get('APP_KEY')
    let isDbConnected = true
    try {
      await db.rawQuery('SELECT 1')
      isDbConnected = true
    } catch (error) {
      isDbConnected = false
    }
    const healthy = isNodeEnvSet && isAppKeySet && isDbConnected

    if (healthy) {
      return {
        healthy,
        report: {
          env: {
            displayName: this.displayNameEnv,
            health: {
              healthy: isNodeEnvSet,
            },
          },
          appKey: {
            displayName: this.displayNameAppKey,
            health: {
              healthy: isAppKeySet,
            },
          },
          db: {
            displayName: this.displayNameDb,
            health: {
              healthy: isDbConnected,
            },
          },
        },
      }
    } else {
      return response.status(503)
    }
  }
}
