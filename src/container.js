import { isEmpty } from './utils'

const properties = type => ({
  left: `${type}Left`,
  right: `${type}Right`,
})

const getSpacingFromArray = ({ values, left, right }) => {
  if (!Array.isArray(values)) return
  const [valueLeft, valueRight] = values
  return { [left]: valueLeft, [right]: valueRight }
}

const getSpacingStyle = (type, values, key) => {
  if (Array.isArray(values) || typeof values !== 'object') return

  const propertyValue = values[key] || {}
  if (isEmpty(propertyValue)) return

  const objectArraySpacing = getSpacingFromArray({
    values: propertyValue,
    ...properties(type),
  })
  if (objectArraySpacing) return objectArraySpacing

  return {
    [properties(type).left]: propertyValue,
    [properties(type).right]: propertyValue,
  }
}

const getContainerStyles = ({ screens, padding, margin, center }) => {
  const mediaScreens = Object.entries(screens).reduce(
    (accumulator, [key, value]) => ({
      ...accumulator,
      [`@media (min-width: ${value})`]: {
        maxWidth: value,
        ...getSpacingStyle('padding', padding, key),
        ...(!center && getSpacingStyle('margin', margin, key)),
      },
    }),
    {}
  )

  const paddingStyles = Array.isArray(padding)
    ? getSpacingFromArray({
        values: padding,
        ...properties('padding'),
      })
    : typeof padding === 'object'
    ? getSpacingStyle('padding', padding, 'default')
    : { paddingLeft: padding, paddingRight: padding }

  let marginStyles = Array.isArray(margin)
    ? getSpacingFromArray({
        values: margin,
        ...properties('margin'),
      })
    : typeof margin === 'object'
    ? getSpacingStyle('margin', margin, 'default')
    : { marginLeft: margin, marginRight: margin }

  // { center: true } overrides any margin styles
  if (center) marginStyles = { marginLeft: 'auto', marginRight: 'auto' }

  return {
    width: '100%',
    ...paddingStyles,
    ...marginStyles,
    ...mediaScreens,
  }
}

export { getContainerStyles }
