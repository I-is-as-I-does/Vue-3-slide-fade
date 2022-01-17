import { ref, computed, onMounted, watch, h } from 'vue'
var __defProp = Object.defineProperty
var __defProps = Object.defineProperties
var __getOwnPropDescs = Object.getOwnPropertyDescriptors
var __getOwnPropSymbols = Object.getOwnPropertySymbols
var __hasOwnProp = Object.prototype.hasOwnProperty
var __propIsEnum = Object.prototype.propertyIsEnumerable
var __defNormalProp = function (obj, key, value) {
  key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value
}
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) {
    if (__hasOwnProp.call(b, prop)) { __defNormalProp(a, prop, b[prop]) }
  }
  if (__getOwnPropSymbols) {
    for (var p of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, p)) { __defNormalProp(a, p, b[p]) }
    }
  }
  return a
}
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b))
const propsModel = {
  modelValue: {
    type: Boolean,
    default: false
  },
  fade: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 400
  },
  slideTiming: {
    type: String,
    default: 'ease-in-out'
  },
  fadeTiming: {
    type: String,
    default: 'ease-in-out'
  },
  tag: {
    type: String,
    default: 'div'
  },
  responsive: {
    type: Boolean,
    default: false
  }
}
var SlideFade = {
  emits: ['open-start', 'close-start', 'open-end', 'close-end', 'layout-shift'],
  props: __spreadValues({}, propsModel),
  setup (props, { slots, attrs, emit }) {
    const containerRef = ref(null)
    const isInit = ref(false)
    const shouldHideOverflow = ref(false)
    const contentHeight = ref(0)
    const currentHeight = ref(0)
    const contentOpacity = ref(0)
    const currentOpacity = ref(0)
    const isTransitioning = ref(false)
    const duration = computed(() => {
      return typeof props.duration === 'number' ? `${props.duration}ms` : props.duration
    })
    const opacityOn = computed(() => {
      return typeof props.fade === 'boolean' && props.fade === true
    })
    const opacityRule = computed(() => {
      return opacityOn.value ? `, opacity ${duration.value} ${props.fadeTiming}` : ''
    })
    const delayAction = (fn) => {
      setTimeout(() => {
        window.requestAnimationFrame(fn)
      }, 0)
    }
    const updateOpacity = () => {
      if (containerRef.value) {
        contentOpacity.value = 1
      } else {
        contentOpacity.value = ''
      }
    }
    const updateContainerHeight = () => {
      if (containerRef.value) {
        contentHeight.value = containerRef.value.scrollHeight
      } else {
        contentHeight.value = ''
      }
    }
    const updateDisplay = () => {
      if (isTransitioning.value === true) {
        if (props.modelValue === false) {
          if (opacityOn.value) {
            currentOpacity.value = 0
            updateOpacity()
          }
          currentHeight.value = 0
          updateContainerHeight()

          return transitionEnd({ target: containerRef.value })
        }
      }
      if (opacityOn.value) {
        currentOpacity.value = contentOpacity.value
      }
      currentHeight.value = contentHeight.value + 'px'
      if (props.modelValue === false) {
        shouldHideOverflow.value = true
        emit('close-start')
        delayAction(() => {
          if (opacityOn.value) {
            currentOpacity.value = 0
          }
          currentHeight.value = 0
        })
      } else { emit('open-start') }
      isTransitioning.value = true
    }
    const generatedBaseStyles = computed(() => ({
      transition: isInit.value ? `height ${duration.value} ${props.slideTiming}${opacityRule.value}` : null,
      height: isInit.value ? currentHeight.value : null,
      opacity: isInit.value && opacityOn.value ? currentOpacity.value : null,
      overflowY: shouldHideOverflow.value ? 'hidden' : null,
      '--content-height': contentHeight.value
    }))
    const generatedBaseAttributes = computed(() => ({
      'aria-hidden': props.modelValue === false,
      tabindex: props.modelValue === false ? '-1' : null
    }))
    const transitionEnd = (event) => {
      if (event.target !== containerRef.value) { return }
      if (props.modelValue === true) {
        if (opacityOn.value) {
          currentOpacity.value = null
        }
        currentHeight.value = null
        shouldHideOverflow.value = false
        emit('open-end')
      } else { emit('close-end') }
      isTransitioning.value = false
    }
    onMounted(() => {
      if (opacityOn.value) {
        updateOpacity()
      }
      updateContainerHeight()
      if (!props.modelValue) {
        if (opacityOn.value) {
          currentOpacity.value = 0
        }
        currentHeight.value = 0
        shouldHideOverflow.value = true
      } else {
        if (opacityOn.value) {
          currentOpacity.value = contentOpacity.value
        }
        currentHeight.value = contentHeight.value + 'px'
      }
      if (props.responsive) { setResizeListener() }
      isInit.value = true
    })
    watch(() => props.modelValue, (v) => {
      if (opacityOn.value) {
        updateOpacity()
      }
      updateContainerHeight()
      updateDisplay()
    })
    const resizeCallback = () => {
      if (props.modelValue === false) { return }
      emit('layout-shift')
      currentHeight.value = contentHeight.value + 'px'
      shouldHideOverflow.value = true

      updateContainerHeight()
      setTimeout(updateDisplay, 0)
    }
    const setResizeListener = () => {
      const observer = new MutationObserver(resizeCallback)
      const config = {
        subtree: true,
        attributes: false,
        childList: true,
        characterData: false
      }
      observer.observe(containerRef.value, config)
    }
    return () => h(props.tag, __spreadProps(__spreadValues(__spreadProps(__spreadValues({}, Object.assign({}, attrs, { style: generatedBaseStyles.value })), {
      class: 'slide-fade__container',
      onTransitionend: transitionEnd
    }), generatedBaseAttributes.value), {
      ref: containerRef
    }), slots.default())
  }
}
export { SlideFade as default }
