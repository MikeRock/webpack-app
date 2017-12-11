import 'babel-polyfill'
import(/*webpackChunkName: "dynamic"*/'ramda').then(r => {
    console.log('Ramda is on')
})
console.log('HA')
console.log('HAHA')