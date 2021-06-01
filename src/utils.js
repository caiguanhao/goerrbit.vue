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
    }
  }
}
