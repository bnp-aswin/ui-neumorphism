import React from 'react'

import styles from './Progress.module.css'
import { uid, setCSSVariable, getModuleClasses } from '../../util'
import {
  G_NUM,
  G_BOOL,
  G_STRING,
  DEFAULT_PROPS,
  DEFAULT_PROPS_TYPE
} from '../../assets/index'

class ProgressCircular extends React.Component {
  static displayName = 'NuProgressCircular'

  static defaultProps = {
    size: 36,
    width: 2,
    value: 0,
    ...DEFAULT_PROPS
  }

  static propTypes = {
    value: G_NUM,
    size: G_NUM,
    width: G_NUM,
    color: G_STRING,
    rotate: G_STRING,
    elevated: G_BOOL,
    indeterminate: G_BOOL,
    ...DEFAULT_PROPS_TYPE
  }

  constructor(props) {
    super(props)
    this.state = {
      id: uid()
    }
  }

  get radius() {
    return Number(this.props.size / 2)
  }

  get circumference() {
    return 2 * Math.PI * this.radius
  }

  get strokeDashArray() {
    return Math.round(this.circumference * 1000) / 1000
  }

  get strokeDashArrayOffset() {
    return ((100 - this.props.value) / 100) * this.circumference
  }

  get viewBox() {
    return `${this.viewBoxSize} ${this.viewBoxSize} ${2 * this.viewBoxSize} ${
      2 * this.viewBoxSize
    }`
  }

  get viewBoxSize() {
    const { width, size } = this.props
    return this.radius / (1 - Number(width) / Number(size))
  }

  get normalizedValue() {
    const { value } = this.props
    return value > 100 ? 100 : value < 0 ? 0 : value
  }

  componentDidMount() {
    const { color, disabled } = this.props
    const elem = document.getElementById(this.state.id)
    if (!disabled) {
      setCSSVariable(elem, '--selector-bg', color)
    }
  }

  getClasses(classType) {
    const { dark, elevated } = this.props
    if (classType === 'progress') {
      return getModuleClasses(
        styles,
        ` nu-progress-circular
          nu-progress-circular--${dark ? 'dark' : 'light'}
          nu-progress-circular--${elevated ? 'elevated' : 'not-elevated'}
        `
      )
    } else {
      return getModuleClasses(styles, `nu-progress-circular--${classType}`)
    }
  }

  render() {
    const { size, width, style, className } = this.props
    return (
      <div
        id={this.state.id}
        aria-valuemin='0'
        role='progressbar'
        aria-valuemax='100'
        aria-valuenow={this.normalizedValue}
        className={`${this.getClasses('progress')} ${className}`}
        style={{
          ...style,
          width: `${size + 9}px`,
          height: `${size + 9}px`
        }}
      >
        <div
          className={`${this.getClasses('svg')}`}
          style={{
            width: `${size}px`,
            height: `${size}px`
          }}
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox={this.viewBox}>
            <circle
              r={this.radius}
              cx={2 * this.viewBoxSize}
              cy={2 * this.viewBoxSize}
              className={`${this.getClasses('circle')}`}
              style={{
                strokeWidth: `${width}`,
                strokeDasharray: this.strokeDashArray,
                strokeDashoffset: this.strokeDashArrayOffset
              }}
            />
          </svg>
        </div>
        <div
          className={`${this.getClasses('outer')}`}
          style={{
            width: `${size + 5}px`,
            height: `${size + 5}px`
          }}
        />
        <div
          className={`${this.getClasses('inner')}`}
          style={{
            width: `${size - width * 2 - 6}px`,
            height: `${size - width * 2 - 6}px`
          }}
        />
        <label
          className={`${this.getClasses('label')}`}
          style={{ fontSize: `${this.radius * 0.6}px` }}
        >
          {this.normalizedValue}
        </label>
      </div>
    )
  }
}

export default ProgressCircular
