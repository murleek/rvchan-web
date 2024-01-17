import { configureStore } from '@reduxjs/toolkit'
import notificationsReducer from '../controllers/Notifications/notificationsSlice'

export function makeStore() {
  return configureStore({
    reducer: { notifications: notificationsReducer },
  })
}

const store = makeStore()

export default store