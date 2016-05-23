'use strict'

const coreUrl = require('url')
const http = require('http')
const https = require('https')
const once = require('once')

const requestTest = ({ url = 'http://localhost', timeout = 2000 } = {}) => {

    const options = coreUrl.parse(url)

    let req = null, aborted = false

    const emit = once((type, reason) => {
        aborted = true
        req.emit(type, reason)
        req.abort()
    })

    const success = reason => emit('success', reason)
    const fail = reason => emit('fail', reason)

    const handleRes = res => {
        if (res.statusCode >= 100 && res.statusCode < 400) {
            success(res.statusCode)
        } else fail(res.statusCode)
    }

    if (options.protocol === 'http:')
        req = http.request(options, handleRes)

    if (options.protocol === 'https:')
        req = https.request(options, handleRes)

    else throw new Error(`invalid protocol ('${options.protocol}'): `
        + `only 'http' and 'https' are supported`)

    req.on('error', err => {
        // ignore all ECONRESETs caused by aborting
        if (!(err.code === 'ECONNRESET' && aborted))
            fail(err.code)
    })

    req.cancel = () => success('CANCELLED')
    req.on('timeout', () => fail('ETIMEDOUT'))
    req.setTimeout(timeout)
    req.end()

    return req

}

module.exports = requestTest
