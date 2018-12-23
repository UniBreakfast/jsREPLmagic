w = window
d = document
b = body = d.body
h = head = d.head
_ = undefined

log = console.log

n2px = num => {
  if (typeof num == 'number') return num+'px'
  else return num
}
n2col = num => {
  if (typeof num == 'number' && String(num).length<3 && num>=0 ||
      ['1','2','3','4','5','6','7','8','9','0','A','B','C','D','E','F']
      .includes(num)) return '#'+num+num+num
  else return num
}


aliases = (...els) => {
  els.forEach(el=>{
    el.s = el.style
    el.a = el.appendChild
    el.r = el.remove
    el.e = () => el.innerHTML = ''
    alf = (al, prop) => { el.s[al] = val => {
      if (val !== undefined) el.s[prop] = val
      else return el.s[prop]
      log(prop)
      return el
    } }
    alf('di', 'display')
    alfc = (al, prop) => { el.s[al] = val => {
      if (val !== undefined) el.s[prop] = n2col(val)
      else return el.s[prop]
      return el
    } }
    alfc('b', 'background')
    alfp = (al, prop) => { el.s[al] = val => {
      if (val !== undefined) el.s[prop] = n2px(val)
      else return el.s[prop]
      return el
    } }
    alfp('m', 'margin')
    alfp('h', 'height')
    alfp('w', 'width')
    el.whb = (w, h, b) => { el.s.w(w); el.s.h(h); el.s.b(b); return el }
    el.a2 = el2 => { el2.a(el); return el }
  })
}

aliases(h, b)

b.s.m(0)
b.s.h('100vh')
b.s.background = 'rgb(36, 36, 36)'

nel = tag => {
  let el = d.createElement(tag)
  aliases(el)
  el.s.boxSizing = 'border-box'
  return el }

nel_make = tag => w['nel'+tag.charAt(0)] = () => nel(tag)
nel_make('div')
nel_make('span')
nel_make('input')
nel_make('button')

nel_make_r = tag => w['nel'+tag.charAt(0)+'r'] = () => {
  el = nel(tag)
  el.s.borderRadius = '15%'
  return el
}
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
