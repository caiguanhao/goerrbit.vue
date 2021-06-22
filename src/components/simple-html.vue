<script>
function makeMarkdownLinks (el) {
  let nodes = el.childNodes
  let add = []
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].nodeType !== Node.TEXT_NODE) continue
    let parts = nodes[i].nodeValue.split(/\[([^\]]*)\]\(([^)]*)\)/)
    if (parts.length <= 1) continue
    nodes[i].replaceWith(document.createTextNode(parts[0]))
    let next = nodes[i].nextSibling
    for (let j = 1; j < parts.length; j++) {
      if (j % 3 === 0) {
        let textNode = document.createTextNode(parts[j])
        add.push([ textNode, next ])
      } else if (j % 3 === 1) {
        let a = document.createElement('a')
        a.setAttribute('href', parts[j + 1].trim())
        a.setAttribute('target', '_blank')
        a.innerHTML = parts[j].trim()
        add.push([ a, next ])
      } else if (j % 3 === 2) {
        // already processed
      }
    }
  }
  add.forEach(item => {
    el.insertBefore(item[0], item[1])
  })
}

export default {
  mounted (el, binding) {
    el.innerText = binding.value
    setTimeout(() => {
      makeMarkdownLinks(el)
    })
  },
  updated (el, binding) {
    el.innerText = binding.value
    setTimeout(() => {
      makeMarkdownLinks(el)
    })
  }
}
</script>
