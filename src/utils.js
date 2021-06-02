function pad0 (n) {
  return n < 10 ? '0' + n : n
}

export default {
  methods: {
    formatTime (time) {
      if (!time) return '-'
      let d = new Date(time)
      let ds = d.getFullYear() + '-' + pad0(d.getMonth() + 1) + '-' + pad0(d.getDate())
      let ts = pad0(d.getHours()) + ':' + pad0(d.getMinutes()) + ':' + pad0(d.getSeconds())
      return ds + ' ' + ts
    },

    processErrors (err) {
      for (let key in this.$refs) {
        let elem = this.$refs[key]
        if (!(elem instanceof Array)) elem = [ elem ]
        elem.forEach((e) => {
          if (e && e.classList) e.classList.remove('is-invalid')
        })
      }
      if (!err || !err.response || !err.response.data) return false
      let errors = err.response.data.Errors
      if (!errors || !errors.length) return false
      let format = this.$t('validations.format')
      let msgs = []
      errors.forEach(error => {
        let field = this.$t(`validations.fields.${error.FullName}`, null)
        if (!field) field = this.$t(`validations.fields.${error.Name}`, error.Name)
        let msg = this.$t(`validations.${error.Kind}_${error.Type}_${error.Name}`, null)
        if (!msg) msg = this.$t(`validations.${error.Kind}_${error.Type}`, null)
        if (!msg) msg = this.$t(`validations.${error.Type}`, error.Type)
        if (typeof(msg) === 'function') {
          msg = msg(error.Param)
        }
        let message = format(field, msg)
        msgs.push(message)
        let key = error.Name
        let elem = this.$refs[key] || this.$refs['input-' + key]
        if (elem) {
          if (elem instanceof Array) elem = elem[0]
          let div = elem.nextElementSibling
          if (!div || !div.classList || !div.classList.contains('invalid-feedback')) {
            let newDiv = document.createElement('div')
            newDiv.classList.add('invalid-feedback')
            elem.parentNode.insertBefore(newDiv, div)
            div = newDiv
          }
          div.innerText = message
          elem.classList.add('is-invalid')
        }
      })
      let firstErrorElem = document.querySelector('.is-invalid')
      if (firstErrorElem) firstErrorElem.focus()
      return true
    }
  }
}
