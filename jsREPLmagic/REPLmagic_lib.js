d = document
b = d.body
h = d.head

aliases = el => {
  el.s = el.style
  el.a = el.appendChild
  el.r = el.remove
}

nel = tag => {
  let el = d.createElement(tag)
  el.s = el.style
  el.a = el.appendChild
  return el
}

TDD
HDD
SODD
EDD

