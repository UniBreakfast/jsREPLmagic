
(()=>{

  let log = console.log
  let Tnum = 1

  // 'readable'function is needed so json-ified object would look like js-object
  // like this:     {b: 1, c: [4, "def"]}
  // not like this: {"b":1,"c":[4,"def"]}
  rdbl = (value, unpack) => {
    if (typeof value == 'object') { value = JSON.stringify(value).split(':')
      .map((item,index,arr) => (index<arr.length-1) ? item.slice(0, -1) : item)
      .map((item,index,arr) => {
        let quoteAt = item.lastIndexOf('"')
        return (index<arr.length-1) ? item.substring(0, quoteAt) + item.substring(quoteAt+1) : item
      })
      .join(': ').replace(/,/g, ', ')
      return unpack ? value.slice(1,-1) : value
    }
    else if (typeof value == 'string')
      return "'"+value+"'"
    else return value
  }

  // testIt logs if function(param) works as expected
  testIt = (func, arg, result, arg_str, result_str) => {
    if (typeof result == 'string' && result.indexOf('==')>=0) {
      let rdbl_arg = rdbl(arg)
      func(arg)
      log(`Test ${Tnum++}:  ${func.name}(${arg_str||rdbl_arg}); ${result_str||
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
      let rdbl_args = rdbl(args, 1)
      func.apply(this, args)
      log(`Test ${Tnum++}:  ${func.name}(${args_str||rdbl_args}); ${result_str||
          result}   ` + (eval(result) ? ' YES!' : ' NO...'))
    }
    else log(`Test ${Tnum++}:  ${func.name}(${args_str||rdbl(args, 1)}) = ${
      result_str||rdbl(result)}   `+(func.apply(this,args)==result||
      JSON.stringify(func.apply(this,args))==JSON.stringify(result) ?
                                     ' YES!' : ' NO...'))
  }

  //Test:  n2px(45) = '45px'
  testIt(n2px, 45, '45px')

  //Test:  n2px('45px') = '45px'
  testIt(n2px, '45px', '45px')

  //Test:  n2px({a: 45}) = {a: 45}
  testIt(n2px, {a: 45}, {a: 45})
  log('')

  //Test:  n2col(45) = '#454545'
  testIt(n2col, 45, '#454545')

  //Test:  n2col(3) = '#333'
  testIt(n2col, 3, '#333')

  //Test:  n2col('A') = '#AAA'
  testIt(n2col, 'A', '#AAA')

  //Test:  n2col('orange') = 'orange'
  testIt(n2col, 'orange', 'orange')
  log('')

  testIt(aliases, d.createElement('div'), 'arg.s == arg.style', "<div>")
  testIt(aliases, d.createElement('div'), 'arg.a == arg.appendChild', "<div>")
  testIt(aliases, d.createElement('div'), 'arg.r == arg.remove', "<div>")
  testEm(aliases, [d.createElement('div'), d.createElement('div')],
         'args[1].r == args[1].remove', "[<div>,<div>]")
  testIt(aliases, d.createElement('div'),
       "arg.a(d.createElement('div')); arg.e(); arg.innerHTML === ''", "<div>")
  testIt(aliases, d.createElement('div'),
         "arg.innerText = 'asdf'; arg.e(); arg.innerHTML === ''", "<div>")


})()

