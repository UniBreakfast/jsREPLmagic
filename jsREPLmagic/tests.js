
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

  testProbe = (func, args, probe_func, arg_str, res_str) => {
    args = Array.isArray(args) ? args : [args]
    log(`Test ${Tnum++}:  ${func.name}(${arg_str||rdbl(args, 1)});  ${
        probe_func.name}()    ` + (probe_func(func.apply(this, args)||args) ?
                                                          'YES!' : 'NO...')) }
  testResult = (func, args, result, arg_str, res_str) => {
    args = Array.isArray(args) ? args : [args]
    log(`Test ${Tnum++}:  ${func.name}(${arg_str||rdbl(args,1)}) = ${
        res_str||rdbl(result)}    ` +
        (func.apply(this,args)==result||
         JSON.stringify(func.apply(this,args))==JSON.stringify(result) ?
                                                          'YES!' : 'NO...')) }
  testAssert = (func, args, assert_code, arg_str, asc_str) => {
    let arg = args = Array.isArray(args) ? args : [args]
    let result = func.apply(this, args)
    log(`Test ${Tnum++}:  ${func.name}(${arg_str||rdbl(args, 1)});  ${
        asc_str||assert_code}    ` + (eval(assert_code) ? 'YES!' : 'NO...')) }
  testEval = (eval_code, eval_str) => {
    log(`Test ${Tnum++}:  ${eval_str||eval_code}    ` + (eval(eval_code) ?
                                                          'YES!' : 'NO...')) }


  //Test:  n2px(45) = '45px'
  testResult(n2px, 45, '45px')

  //Test:  n2px('45px') = '45px'
  testResult(n2px, '45px', '45px')

  //Test:  n2px({a: 45}) = {a: 45}
  testResult(n2px, {a: 45}, {a: 45})
  log('')

  //Test:  n2col(45) = '#454545'
  testResult(n2col, 45, '#454545')

  //Test:  n2col(3) = '#333'
  testResult(n2col, 3, '#333')

  //Test:  n2col('A') = '#AAA'
  testResult(n2col, 'A', '#AAA')

  //Test:  n2col('orange') = 'orange'
  testResult(n2col, 'orange', 'orange')
  log('')

  testProbe(evo, d.createElement('div'),
            function dot_s_for_style(res) { return res.s == res.style },
            "<div>")
  testProbe(evo, [d.createElement('div'), d.createElement('div')],
            function multiple_elements_at_once(res)
              { return res[0].s == res[0].style && res[1].s == res[1].style },
            "[<div>,<div>]")

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

  testIt(nel, 'pa',
         "let p = d.createElement('p'); evo(p).s.boxSizing = 'border-box'; JSON.stringify(res) == JSON.stringify(p)", _, '<p>')
  testEm(nel, ['p', 'myParagraph'],
         "let p = d.createElement('p'); evo(p).s.boxSizing = 'border-box'; JSON.stringify(res) == JSON.stringify(p)", _, '<p>')


})(`tests`)

