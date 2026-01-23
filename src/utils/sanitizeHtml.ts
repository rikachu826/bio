const allowedTags = new Set(['strong', 'span', 'br', 'a'])
const allowedAttributes: Record<string, Set<string>> = {
  a: new Set(['href', 'rel', 'target']),
  strong: new Set(['class']),
  span: new Set(['class']),
}

const isSafeHref = (value: string) => value.startsWith('https://') || value.startsWith('http://')

export const sanitizeHtml = (input: string) => {
  if (!input) {
    return ''
  }
  if (typeof window === 'undefined') {
    return input
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(`<div>${input}</div>`, 'text/html')
  const root = doc.body.firstElementChild
  if (!root) {
    return input
  }

  const sanitizeNode = (node: Element) => {
    const children = Array.from(node.children)
    children.forEach((child) => {
      const tag = child.tagName.toLowerCase()
      if (!allowedTags.has(tag)) {
        const text = doc.createTextNode(child.textContent ?? '')
        child.replaceWith(text)
        return
      }

      const allowed = allowedAttributes[tag] ?? new Set<string>()
      Array.from(child.attributes).forEach((attr) => {
        if (!allowed.has(attr.name)) {
          child.removeAttribute(attr.name)
        }
      })

      if (tag === 'a') {
        const href = child.getAttribute('href') || ''
        if (!isSafeHref(href)) {
          child.removeAttribute('href')
        }
        child.setAttribute('rel', 'noopener noreferrer')
        child.setAttribute('target', '_blank')
      }

      sanitizeNode(child)
    })
  }

  sanitizeNode(root)
  return root.innerHTML
}
