// shortcuts for main DOM entities
const w = window, d = document, b = body = d.body, h = head = d.head
const _ = undefined

log = console.log

// if given a number returns a string with that number with 'px' added
// otherwise returns what was given
const n2px  = num => typeof num == 'number' ? num+'px' : num

// if given 1-2 digit number or a valid hex character returns a CSS grey from it
const n2col = num => typeof num == 'number' && String(num).length<3 && num>=0 ||
  ['1','2','3','4','5','6','7','8','9','0','A','B','C','D','E','F']
  .includes(num) ? '#'+num+num+num : num

// evolving the DOM element by adding usual aliases for common uses
const evo = (...els) => {
  // works with multiple elements at once
  els.forEach(el => {

    // shortcuts for commonly used methods and groups of methods of DOM element
    el.s = el.style

    // remove or empty element
    el.r = () => { el.remove();       return el }
    el.e = () => { el.innerHTML = ''; return el }

    // append child and append this to that
    el.a  = el2 => { el.appendChild(el2); return el }
    el.a2 = el2 => { el2.a(el);           return el }

    // creates set/get method for a property
    // if function given, value goes through it
    let sgm = (short, prop, func) => { el[short] = val => {
      if (val === _) return el[prop]
      el[prop] = func ? func(val) : val
      return el
    } }
    sgm('Id', 'id')
    sgm('tx', 'innerText')
    sgm('htm','innerHTML')

    // creates set/get method for a style property
    // if function given, value goes through it
    let sgsm = (short, prop, func) => { el.s[short] = val => {
      if (val === _) return el.s[prop]
      el.s[prop] = func ? func(val) : val
      return el
    } }
    sgsm('di', 'display')

    // set/get style function for color properties
    let sgsmc = (short, prop) => sgsm(short, prop, n2col)
    sgsmc('b', 'background')
    sgsmc('c', 'color')

    // set/get style function for size unit properties
    let sgsmp = (short, prop) => sgsm(short, prop, n2px)
    sgsmp('m', 'margin')
    sgsmp('h', 'height')
    sgsmp('w', 'width')

    // size/color shorthand for width, height, background, foreground
    el.sc = el.whbc = (w, h, b, c) => {
      if (w===_ && h===_ && b===_ && c===_)
        return {w: el.s.w(), h: el.s.h(), b: el.s.b(), c: el.s.c()}
      el.s.w(w); el.s.h(h); el.s.b(b); el.s.c(c); return el
    }

  })
  if (els.length==1) return els[0]
}

evo(h, b)

b.s.m(0).s.h('100vh').s.b(24).s.c('B')

nel = (tag, id) => {
  let el = evo(d.createElement(tag))
  el.s.boxSizing = 'border-box'
  if (id) el.id = id
  return el }

nel_make = tag => eval(`w['nel${tag.charAt(0)}'] = function nel${tag.charAt(0)
                       }(id) { return nel('${tag}', id) }`)
nel_make('div')
nel_make('span')
nel_make('input')
nel_make('button')

nel_make_r = tag => eval(`w['nel${tag.charAt(0)}r'] = function nel${
                         tag.charAt(0)}r(id) { let el = nel('${tag
                         }', id); el.s.borderRadius = '15%'; return el}`)
nel_make_r('div')
nel_make_r('span')
nel_make_r('input')
nel_make_r('button')


rcol = (brigh, el, t=10) => {
  if (el) {
    let i = setInterval(()=>el.s.background = rcol(brigh), t*100)
    el.onclick = () => {
      clearInterval(i)
      log(el.s.b())
    }
    return
  }
  // Six levels of brightness from 0 to 5, 0 being the darkest
  if (brigh===undefined) brigh = Math.round(Math.random() * 5)
  var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256]
  var mix = [brigh*51, brigh*51, brigh*51] //51 => 255/5
  var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]]
    .map(x => Math.round(x/2.0))
  return "rgb(" + mixedrgb.join(",") + ")" }

rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

rhue = (deg, el, t=10) => {
  if (el) {
    let i = setInterval(()=>el.s.background = rhue(deg), t*100)
    el.onclick = () => {
      clearInterval(i)
      log(el.s.b())
    }
    return
  }
  //    0 RED      120 GREEN   240 BLUE
  //   30 ORANGE   150 JADE    270 VIOLET
  //   60 YELLOW   180 CYAN    300 MAGENTA
  //   90 SALAD    210 AZURE   330 ROSE
  if (deg===undefined) deg = rand(0, 359)
  colors = {
    red:       0,   orange:   30,   yellow:   60,   salad:    90,
    green:   120,   jade:    150,   cyan:    180,   azure:   210,
    blue:    240,   violet:  270,   magenta: 300,   rose:    330 }
  if (deg in colors) deg = colors[deg]
  return "hsl("+deg+", "+ rand(10,100) +"%, "+rand(5, 95) +"%)"
}

log('shortcuts loaded')

////////////////////////////////////////////////////////////////////////////////

elp = preset => {
  switch (preset) {
    case 1:

    case 'cc':
      w.cc = el = neld()
      el.s.m('auto')
      b.e()
      b.a(el)
      return el
    default:
      el = neldr()
      el.whb(100, 65, rcol(5))
      el.s.m(2)
      el.s.border = 'solid '+rcol(0)+' 1px'
      return el } }


body_add_divs = (num, w, h) => {
  if (num > 1000) return 'too many cells, try less than 1000'
  for (let i=0; i<num; i++) {
    div = nel('div')
    div.s.display = 'inline-block'
    div.whb(w, h, rcol())
    body.a(div) } }

body_add_divs_grid = (w, h, hnum, vnum) => {
  w = w || 200; h = h || 100;
  hnum = hnum || 1; vnum = vnum || 1;
  if (hnum*vnum > 1000) return 'too many cells, try less than 1000'
  cont = nel('div')
  cont.whb(w, h, 'black')
  cont.s.display = 'grid'
  let gridTemplate = ''
  let i
  for (i=0; i<vnum; i++) gridTemplate += ' auto'
  gridTemplate += ' /'
  for (i=0; i<hnum; i++) gridTemplate += ' auto'
  cont.s.gridTemplate = gridTemplate
  body.a(cont)
  for (i=0; i<hnum*vnum; i++) {
    div = nel('div')
    div.whb('100%', '100%', rcol(5))
    cont.a(div) } }
