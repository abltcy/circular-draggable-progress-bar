import { CircularDraggableProgressBar } from 'circular-draggable-progress-bar'
import React from 'react'
import { View } from 'react-native'

const App = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <CircularDraggableProgressBar />
    </View>
  )
}

export default App
