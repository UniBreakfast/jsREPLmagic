
(( tests )=>{

  let log = console.log
  let Tnum = 1

  // 'readable'function is needed so json-ified object would look like js-object
  // like this:       {b: 1, c: [4, "def"]}
  // instead of this: {"b":1,"c":[4,"def"]}
  rdbl = (value, unpack) => {
    if (typeof value == 'object') { value = JSON.stringify(value).split(':')
      .map((item,index,arr) => (index<arr.length-1) ? item.slice(0, -1) : item)
      .map((item,index,arr) => {
        let quoteAt = item.lastIndexOf('"')
        return (index<arr.length-1) ? item.substring(0, quoteAt) +
          item.substring(quoteAt+1) : item
      })
      .join(': ').replace(/,/g, ', ')
      value = unpack ? value.slice(1,-1) : value
      return value!='null' ? value : ''
    }
    else if (typeof value == 'string') return "'"+value+"'"
    else return value
  }
  log(rdbl([undefined],1))

  tFuncResult = (func, args, result, arg_str, res_str) => {
    args = Array.isArray(args) ? args : [args]
    log(`Test ${Tnum++}:  ${func.name}(${arg_str||rdbl(args,1)}) = ${
        res_str||rdbl(result)}    ` +
        (func.apply(this,args)==result||
        JSON.stringify(func.apply(this,args))==JSON.stringify(result) ?
                                                          'YES!' : 'NO...')) }
  tFuncProbe = (func, args, probe_func, arg_str) => {
    args = Array.isArray(args) ? args : [args]
    log(`Test ${Tnum++}:  ${func.name}(${arg_str||rdbl(args,1)});  ${
        probe_func.name}()    ` + (probe_func(func.apply(this, args)||args) ?
                                                          'YES!' : 'NO...')) }
  tFuncAssert = (func, args, assert_code, arg_str, asc_str) => {
    let arg = args = Array.isArray(args) ? args : [args]
    let result = func.apply(this, args)
    log(`Test ${Tnum++}:  ${func.name}(${arg_str||rdbl(args,1)});  ${
        asc_str||assert_code}    ` + (eval(assert_code) ? 'YES!' : 'NO...')) }

  tMethResult = (obj, meth, args, result, obj_str, arg_str, res_str) => {
    if (!obj[meth]) return log(`no ${meth} method on ${obj_str} found!`)
    args = Array.isArray(args) ? args : [args]
    log(`Test ${Tnum++}:  ${obj_str}.${meth}(${arg_str||rdbl(args,1)}) = ${
        res_str||rdbl(result)}    ` + (obj[meth].apply(obj,args)==result||
        JSON.stringify(obj[meth].apply(obj,args))==JSON.stringify(result) ?
                                                          'YES!' : 'NO...')) }
  tMethProbe = (obj, meth, args, probe_func, obj_str, arg_str) => {
    if (!obj[meth]) return log(`no ${meth} method on ${obj_str} found!`)
    args = Array.isArray(args) ? args : [args]
    log(`Test ${Tnum++}:  ${obj_str}.${meth}(${arg_str||rdbl(args,1)});  ${
        probe_func.name}()    `+(probe_func(obj,args,obj[meth].apply(obj,args)||
                    (typeof args=='object'?args:obj)) ?   'YES!' : 'NO...')) }
  tMethAssert = (obj, meth, args, assert_code, obj_str, arg_str, asc_str) => {
    if (!obj[meth]) return log(`no ${meth} method on ${obj_str} found!`)
    let arg = args = Array.isArray(args) ? args : [args]
    let result = obj[meth].apply(obj,args)
    log(`Test ${Tnum++}:  ${obj_str}.${meth}(${arg_str||rdbl(args,1)
        });  ${asc_str||assert_code}    ` + (eval(assert_code) ?
                                                          'YES!' : 'NO...')) }

  tEval = (eval_code, eval_str) => {
    log(`Test ${Tnum++}:  ${eval_str||eval_code}    ` + (eval(eval_code) ?
                                                          'YES!' : 'NO...')) }

  //Test:  basic short aliases
  tEval("w == window && d == document && "+
        "b == body && b == d.body && h == head && h == d.head && " +
        "_ === undefined")
  log('')

  //Test:  n2px(45) = '45px'
  tFuncResult(n2px, 45, '45px')
  //Test:  n2px('45px') = '45px'
  tFuncResult(n2px, '45px', '45px')
  //Test:  n2px({a: 45}) = {a: 45}
  tFuncResult(n2px, {a: 45}, {a: 45})
  log('')

  //Test:  n2col(45) = '#454545'
  tFuncResult(n2col, 45, '#454545')
  //Test:  n2col(3) = '#333'
  tFuncResult(n2col, 3, '#333')
  //Test:  n2col('A') = '#AAA'
  tFuncResult(n2col, 'A', '#AAA')
  //Test:  n2col('orange') = 'orange'
  tFuncResult(n2col, 'orange', 'orange')
  log('')

  //Test: evo(<div>) assigns <div>.s == <div>.style
  tFuncProbe(evo, d.createElement('div'),
            function dot_s_for_style(res) { return res.s == res.style },
            "<div>")

  //Test: nel('div') returns <div>
  tFuncProbe(nel, 'div',
            function div_created(res) { return res.tagName == 'DIV' })
  //Test: nel('div', 'myDiv') returns <div id=myDiv>
  tFuncProbe(nel, ['div', 'myDiv'],
            function div_w_id_created(res) { return res.id == 'myDiv' })
  //Test: nel_make('div') declares neld(id)
  tFuncAssert(nel_make, 'div', "typeof w.neld == 'function'")
  //Test: neld('myDiv') returns <div>
  tFuncProbe(neld, 'myDiv', function div_w_id_created(res)
            { return res.tagName == 'DIV' && res.id == 'myDiv' })
  //Test: neldr('myDiv') returns <div> with rounded corners
  tFuncProbe(neldr, _, function div_w_rounded_corners(res)
            { return res.s.borderRadius == '15%' })

  //Test: evo([<div>, <div>]) -> works on multiple elements at once
  tFuncProbe(evo, [neld(), neld()],
            function multiple_elements_at_once(res)
              { return res[0].s == res[0].style && res[1].s == res[1].style },
            "[<div>,<div>]")
  log('')

  //Test: el1.a(el2) -> appends el2 to el1
  tMethProbe(neld('out'), 'a', neld('in'),
             function appended_a_child(obj)
             { return obj.children[0].id == 'in' },
             '<div id=out>', '<div id=in>')
  //Test: el1.a2(el2) -> appends el1 to el2
  tMethProbe(neld('in'), 'a2', neld('out'),
             function appended_as_a_child(obj, args)
               { return obj.parentElement == args[0] },
             '<div id=in>', '<div id=out>')

  //Test: el.tx('text') -> sets innerText of an element
  tMethProbe(neld(), 'tx', 'text',
             function sets_innerText_of_an_element(obj, args)
               { return obj.innerText == args[0] },
             '<div>')
  //Test: el.htm('<p>text</p>') -> sets innerHTML of an element
  tMethProbe(neld(), 'htm', '<p>text</p>',
             function sets_innerHTML_of_an_element(obj, args)
               { return obj.innerHTML == args[0] },
             '<div>')
  //Test: el.r() -> removes element from DOM
  tMethProbe(neld().a2(b), 'r', _,
             function removes_element_from_DOM(obj) { return !b.contains(obj) },
             '<div>')
  //Test: el.e() -> empties element
  tMethProbe(neld().tx('text').a(neld()), 'e', _,
             function empties_element(obj) { return !obj.htm() },
             '<div>')
  log('')

  //Test: el.s.c(color) -> sets color
  tMethProbe(neld().s, 'c', 'red',
             function sets_color(obj) { return obj.c()=='red' }, '<div>')
  //Test: el.sc(width, height, background, color) -> sets common properties
  tMethProbe(neld(), 'sc', [20, 10, 3, 'teal'],
             function sets_size_and_colors(obj, args)
               { return obj.s.c() == 'teal'}, "<div>")



})(`tests`)

