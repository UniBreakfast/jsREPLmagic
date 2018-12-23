


(()=>{

  let log = console.log
  let Tnum = 1

  testIt = (func, args, result, args_str, result_str) => log(
    `Test ${Tnum++}:  ${func.name}(${args_str||args}) = ${result_str||result} `
    + (func(args) == result ? ' PASS' : ' FAIL'))

  testIt(n2px, 45, '45px',_, "'45px'")
  let obj = {a: 45}
  testIt(n2px, obj, obj, '{a: 45}', '{a: 45}')

  testIt(n2col, 45, '#454545',_, "'#454545'")



})()

