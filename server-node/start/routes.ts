import router from '@adonisjs/core/services/router'
const HealthController = () => import('../app/controller/health_controller.js')

router.get('/health', [HealthController, 'index'])
