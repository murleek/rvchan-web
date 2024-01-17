import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  action: "IDLE",
  notification: {}
}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    newNotification: (state, action) => {
      state = {action: "APPEND", notification: action.payload}
      console.log(state)
    },
    closeNotification: (state, action) => {
      state = {action: "APPEND", notification: action.payload}
      console.log(state)
    },
  },
})

export const { newNotification, getNotifications } = notificationSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectNotifications = (state) => state.notification

export default notificationSlice.reducer