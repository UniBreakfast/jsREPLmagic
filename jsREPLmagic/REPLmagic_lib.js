// shortcuts for main DOM entities
const w = window, d = document, b = body = d.body, h = head = d.head
const _ = undefined

log = console.log

// if given a number returns a string with that number with 'px' added
// otherwise returns what was given
let n2px = num => typeof num == 'number' ? num + 'px' : num

// if given 1-2 digit number or a valid hex character returns a CSS grey from it
let n2col = num => typeof num == 'number' && String(num).length < 3 && num >= 0 ||
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B', 'C', 'D', 'E', 'F']
    .includes(num) ? '#' + num + num + num : num

const elPro = HTMLElement.prototype

elPro.evo = function evolve() {
  this.s = this.style
  this.ch = this.children
  return this
}

elPro.r = function remove() { this.remove(); return this }
elPro.e = function empty() { this.innerHTML = ''; return this }
elPro.a = function append(that) { this.appendChild(that); return this }
elPro.a2 = function appendTo(that) { that.a(this); return this }

let gsp = function getSetProperty(alias, prop, turnf) {
  eval(`elPro['${alias}'] = function ${prop}(val) {
  if (val===_) return this['${prop}']
  this['${prop}'] = (${turnf}) ? (${turnf})(val) : val
  return this
}`)
}
gsp('Id', 'id')
gsp('tx', 'innerText')
gsp('htm', 'innerHTML')

let gssp = function getSetStyleProperty(alias, prop, turnf) {
  eval(`elPro['${alias}'] = function style${prop.charAt(0).toUpperCase() + prop.slice(1)}(val) {
  if (val===_) return this.style['${prop}']
  this.style['${prop}'] = (${turnf}) ? (${turnf})(val) : val
  return this
}`)
}
gssp('sdi', 'display')
gssp('sbrs', 'borderStyle')

let gsscp =
  function getSetStyleColorProperty(alias, prop) { gssp(alias, prop, n2col) }
gsscp('sb', 'background')
gsscp('c', 'color')
gsscp('brc', 'borderColor')

gssp('sb', 'background', n2col)

// evolving the DOM element by adding usual aliases for common uses
const evo = (...els) => {
  // works with multiple elements at once
  els.forEach(el => {

    // shortcuts for commonly used methods and groups of methods of DOM element
    el.s = el.style
    el.evo()

    // remove or empty element
    el.r = () => { el.remove();       return el }
    el.e = () => { el.innerHTML = ''; return el }

    // append child and append this to that
    el.a  = el2 => { el.appendChild(el2); return el }
    el.a2 = el2 => { el2.a(el);           return el }

    // creates set/get method for a property
    // if function given, value goes through it
    let sgm = (short, prop, func) => {
      el[short] = val => {
        if (val === _) return el[prop]
        el[prop] = func ? func(val) : val
        return el
      }
    }
    sgm('Id', 'id')
    sgm('tx', 'innerText')
    sgm('htm', 'innerHTML')

    // creates set/get method for a style property
    // if function given, value goes through it
    let sgsm = (short, prop, func) => {
      el.s[short] = val => {
        if (val === _) return el.s[prop]
        el.s[prop] = func ? func(val) : val
        return el
      }
    }
    sgsm('di', 'display')
    sgsm('brs', 'borderStyle')

    // set/get style function for color properties
    let sgsmc = (short, prop) => sgsm(short, prop, n2col)
    sgsmc('b', 'background')
    sgsmc('c', 'color')
    sgsmc('brc', 'borderColor')

    // set/get style function for size unit properties
    let sgsmp = (short, prop) => sgsm(short, prop, n2px)
    sgsmp('m', 'margin')
    sgsmp('h', 'height')
    sgsmp('w', 'width')
    sgsmp('brw', 'borderWidth')

    // size/color shorthand for width, height, background, foreground
    el.sc = el.whbc = (w, h, b, c) => {
      if (w === _ && h === _ && b === _ && c === _)
        return { w: el.s.w(), h: el.s.h(), b: el.s.b(), c: el.s.c() }
      el.s.w(w); el.s.h(h); el.s.b(b); el.s.c(c); return el
    }

    // color/width shorthand for element's border
    el.br = (c, w) => {
      if (c === _ && w === _)
        return { c: el.s.brc(), w: el.s.brw() }
      el.s.brc(c); el.s.brw(w); el.s.brs('solid'); return el
    }

  })
  if (els.length == 1) return els[0]
}

evo(h, b)


b.s.m(0).s.h('100vh').s.b(24).s.c('B')

nel = (tag, id) => {
  let el = d.createElement(tag).evo()
  el.s.boxSizing = 'border-box'
  if (id) el.id = id
  return el
}

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

nel_make_r = tag => eval(`w['nel${tag.charAt(0)}r'] = function nel${tag.charAt(0)}r(id) { let el = nel('${tag
  }', id); el.s.borderRadius = '15%'; return el}`)
nel_make_r('div')
nel_make_r('span')
nel_make_r('input')
nel_make_r('button')

let NAMED_COLORS =
  ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque",
    "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue",
    "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson",
    "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey",
    "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "DarkOrange",
    "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink",
    "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite",
    "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray",
    "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo",
    "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon",
    "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray",
    "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen",
    "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue",
    "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon",
    "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple",
    "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise",
    "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin",
    "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed",
    "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed",
    "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple",
    "RebeccaPurple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon",
    "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue",
    "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal",
    "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke",
    "Yellow", "YellowGreen"]

rcol = (brigh, el, t = 10) => {
  if (el) {
    let i = setInterval(() => el.s.background = rcol(brigh), t * 100)
    el.onclick = () => {
      clearInterval(i)
      log(el.s.b())
    }
    return el
  }
  // Six levels of brightness from 0 to 5, 0 being the darkest
  if (brigh === undefined) brigh = Math.round(Math.random() * 5)
  var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256]
  var mix = [brigh * 51, brigh * 51, brigh * 51] //51 => 255/5
  var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]]
    .map(x => Math.round(x / 2.0))
  return "rgb(" + mixedrgb.join(",") + ")"
}

rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

rncol = (el, t = 10) => {
  if (el) {
    let i = setInterval(() => el.s.b(rncol()), t * 100)
    el.onclick = () => {
      clearInterval(i)
      log(el.s.b())
    }
    return el
  }
  return NAMED_COLORS[rand(0, NAMED_COLORS.length - 1)]
}

rhue = (deg, el, t = 10) => {
  if (el) {
    let i = setInterval(() => el.s.background = rhue(deg), t * 100)
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
  if (deg === undefined) deg = rand(0, 359)
  colors = {
    red: 0, orange: 30, yellow: 60, salad: 90,
    green: 120, jade: 150, cyan: 180, azure: 210,
    blue: 240, violet: 270, magenta: 300, rose: 330
  }
  if (deg in colors) deg = colors[deg]
  return "hsl(" + deg + ", " + rand(10, 100) + "%, " + rand(5, 95) + "%)"
}

log('shortcuts loaded')

////////////////////////////////////////////////////////////////////////////////

elp = preset => {
  switch (preset) {
    case 1:

    case 'cc': return w.cc = neld().s.m('auto').a2(b.e())
    default:
      el = neldr().sc(100, 100, rcol(5)).s.m(2)
      el.s.border = 'solid ' + rcol(0) + ' 1px'
      return el
  }
}


body_add_divs = (num, w, h) => {
  if (num > 1000) return 'too many cells, try less than 1000'
  for (let i = 0; i < num; i++) {
    div = nel('div')
    div.s.display = 'inline-block'
    div.whb(w, h, rcol())
    body.a(div)
  }
}

body_add_divs_grid = (w, h, hnum, vnum) => {
  w = w || 200; h = h || 100;
  hnum = hnum || 1; vnum = vnum || 1;
  if (hnum * vnum > 1000) return 'too many cells, try less than 1000'
  cont = nel('div')
  cont.whb(w, h, 'black')
  cont.s.display = 'grid'
  let gridTemplate = ''
  let i
  for (i = 0; i < vnum; i++) gridTemplate += ' auto'
  gridTemplate += ' /'
  for (i = 0; i < hnum; i++) gridTemplate += ' auto'
  cont.s.gridTemplate = gridTemplate
  body.a(cont)
  for (i = 0; i < hnum * vnum; i++) {
    div = nel('div')
    div.whb('100%', '100%', rcol(5))
    cont.a(div)
  }
}
