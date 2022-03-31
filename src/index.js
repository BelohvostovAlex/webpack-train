import './styles/styles.css'
import json from '@assets/json'
import webpackLogo from './assets/webpack-png.png'

function sum (a,b, c = 2) {
    return a + b - c
}

console.log('JSON: ', json)