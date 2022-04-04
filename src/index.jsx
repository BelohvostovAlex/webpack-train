import React from 'react'
import ReactDom from 'react-dom/client'

import { App } from './App.jsx'

import './styles/styles.css'
import json from '@assets/json'
import webpackLogo from './assets/webpack-png.png'
import './styles/styleSass.scss'


// function sum (a,b, c = 2) {
//     return a + b - c
// };
// async function start() {
//     return await Promise.resolve('working Promise')
// };

// start().then(console.log);
// console.log('JSON: ', json);

// class Util {
//     static id = Date.now()
// }
// console.log(Util.id)

const root = ReactDom.createRoot(document.getElementById('root'))
root.render(<App />)