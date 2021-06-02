import * as en_US from './en_US'

let defaultLocale = 'en_US'

if (window.localStorage) {
  let locale = window.localStorage.getItem('currentLocale')
  if (locale) {
    defaultLocale = locale
  }
}

export default {
  data () {
    return {
      currentLocale: defaultLocale
    }
  },
  methods: {
    // translate
    $t (key, fallback = undefined) {
      let dict = en_US
      let items = key.split('.')
      for (let i = 0; i < items.length; i++) {
        dict = dict[items[i]]
        if (!dict) break
      }
      if (dict) return dict
      console.debug('MISSING', key)
      if (fallback === undefined) return key
      return fallback
    }
  }
}
