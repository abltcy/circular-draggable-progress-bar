import PropTypes from 'prop-types'

export interface ICircularDraggableProgressBar {
  strokeWidth?: PropTypes.number
  onChange?: (value: number) => void
  radius?: PropTypes.number
  max?: PropTypes.number
  value?: PropTypes.number
  gradientColorFrom?: PropTypes.string
  gradientColorTo?: PropTypes.string
  bgCircleColor?: PropTypes.string
  iconOutSideColor?: PropTypes.string
  draggable?: PropTypes.boolean
  symbol?: PropTypes.string
  symbolPosition?: PropTypes.string
  text?: PropTypes.string
  icon?: JSX.Element
  coins?: number
  isOverBudget?: boolean
  individualValue?: number
  handlerPanResponder?: (onMove: boolean) => void
  displayNumber?: number
}
