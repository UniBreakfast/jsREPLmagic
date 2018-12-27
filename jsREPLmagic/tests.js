
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
      return unpack ? value.slice(1,-1) : value
    }
    else if (typeof value == 'string') return "'"+value+"'"
    else return value
  }

  // testIt logs if function(param) works as expected
  testIt = (func, arg, result, arg_str, result_str) => {
    if (typeof result == 'string' && result.indexOf('==')>=0) {
      let rdbl_arg = rdbl(arg)
      let res = func(arg)
      log(`Test ${Tnum++}:  ${func.name}(${arg_str||rdbl_arg});  ${result_str||
        result}   ` + (eval(result) ? ' YES!' : ' NO...'))
    }
    else log(`Test ${Tnum++}:  ${func.name}(${arg_str||rdbl(arg)}) = ${
             result_str||rdbl(result)}   ` +
      (func(arg)==result||JSON.stringify(func(arg))==JSON.stringify(result) ?
       ' YES!' : ' NO...'))
  }

  // testEm logs if function(param1, param2, ...) works as expected
  testEm = (func, args, result, args_str, result_str) => {
    if (typeof result == 'string' && result.indexOf('==')>=0) {
      let res = func.apply(this, args)
      log(`Test ${Tnum++}:  ${func.name}(${args_str||rdbl(args, 1)});  ${result_str||
          result}   ` + (eval(result) ? ' YES!' : ' NO...'))
    }
    else log(`Test ${Tnum++}:  ${func.name}(${args_str||rdbl(args, 1)}) = ${
      result_str||rdbl(result)}   `+(func.apply(this,args)==result||
      JSON.stringify(func.apply(this,args))==JSON.stringify(result) ?
                                     ' YES!' : ' NO...'))
  }

  tMethProbe = (obj, meth, args, probe_func, om_str, arg_str) => {
    args = Array.isArray(args) ? args : [args]
    log(`Test ${Tnum++}:  ${om_str}(${arg_str||rdbl(args,1)});  ${
        probe_func.name}()    ` + (probe_func(obj[meth].apply(obj,args)||
                    (typeof args=='object'?args:obj)) ?   'YES!' : 'NO...')) }
  tMethResult = (obj, meth, args, result, om_str, arg_str, res_str) => {
    args = Array.isArray(args) ? args : [args]
    log(`Test ${Tnum++}:  ${om_str}(${arg_str||rdbl(args,1)}) = ${
        res_str||rdbl(result)}    ` + (obj[meth].apply(obj,args)==result||
        JSON.stringify(obj[meth].apply(obj,args))==JSON.stringify(result) ?
                                                          'YES!' : 'NO...')) }
  tMethAssert = (obj, meth, args, assert_code, om_str, arg_str, asc_str) => {
    let arg = args = Array.isArray(args) ? args : [args]
    let result = obj[meth].apply(obj,args)
    log(`Test ${Tnum++}:  ${om_str}(${arg_str||rdbl(args,1)
        });  ${asc_str||assert_code}    ` + (eval(assert_code) ?
                                                          'YES!' : 'NO...')) }

  tFuncProbe = (func, args, probe_func, arg_str) => {
    args = Array.isArray(args) ? args : [args]
    log(`Test ${Tnum++}:  ${func.name}(${arg_str||rdbl(args,1)});  ${
        probe_func.name}()    ` + (probe_func(func.apply(this, args)||args) ?
                                                          'YES!' : 'NO...')) }
  tFuncResult = (func, args, result, arg_str, res_str) => {
    args = Array.isArray(args) ? args : [args]
    log(`Test ${Tnum++}:  ${func.name}(${arg_str||rdbl(args,1)}) = ${
        res_str||rdbl(result)}    ` +
        (func.apply(this,args)==result||
        JSON.stringify(func.apply(this,args))==JSON.stringify(result) ?
                                                          'YES!' : 'NO...')) }
  tFuncAssert = (func, args, assert_code, arg_str, asc_str) => {
    let arg = args = Array.isArray(args) ? args : [args]
    let result = func.apply(this, args)
    log(`Test ${Tnum++}:  ${func.name}(${arg_str||rdbl(args,1)});  ${
        asc_str||assert_code}    ` + (eval(assert_code) ? 'YES!' : 'NO...')) }
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

  //Test: evo([<div>, <div>]) -> works on multiple elements at once
  tFuncProbe(evo, [neld(), neld()],
            function multiple_elements_at_once(res)
              { return res[0].s == res[0].style && res[1].s == res[1].style },
            "[<div>,<div>]")
  log('')

  tMethProbe(neld('out'), 'a', neld('in'),
             function appended_a_child(res) { res.children[0].id == 'in' },
             '<div id=out>', '<div id=in>')


  testIt(evo, d.createElement('div'),
         "arg.a(d.createElement('div')) == arg && arg.children.length == 1",
         "<div>", 'arg.a as arg.appendChild')
  testIt(evo, d.createElement('div'),
         "let div = evo(d.createElement('div')); arg.a2(div) == arg && div.children.length == 1", "<div>", 'arg.a2 as arg.appendTo')

  testIt(evo, d.createElement('div'),
         'arg.a2(b).r() == arg && !b.contains(arg)', "<div>")

  testIt(evo, d.createElement('div'),
       "arg.a(d.createElement('div')); arg.e(); arg.innerHTML === ''", "<div>")
  testIt(evo, d.createElement('div'),
         "arg.innerText = 'asdf'; arg.e(); arg.innerHTML === ''", "<div>")

  testIt(evo, d.createElement('div'), "arg.s.c('red').s.c() == 'red'", "<div>")

  testIt(evo, d.createElement('div'),
         "JSON.stringify(arg.sc(10, 5, 'red', 'white').sc()) == JSON.stringify({w:'10px',h:'5px',b:'red',c:'white'}) ", "<div>")



})(`tests`)

