'use strict'

const ava = require('ava')
const reqTest = require('.')

ava.cb('fails on timeout on slow connection', test => {
    const req = reqTest({ url: 'https://httpbin.org/delay/5' })
    req.once('fail', reason => {
        test.is(reason, 'ETIMEDOUT')
        test.end()
    })
})

ava.cb('succeeds on cancel on slow connection', test => {
    const req = reqTest({ url: 'https://httpbin.org/delay/5' })
    setTimeout(() => {
        req.cancel()
    }, 1000)
    req.once('success', reason => {
        test.is(reason, 'CANCELLED')
        test.end()
    })
})

ava.cb('fails on non-existent domain', test => {
    const req = reqTest({ url: 'https://this-domain-does-not-exist.com' })
    req.once('fail', reason => {
        test.is(reason, 'ENOTFOUND')
        test.end()
    })
})

ava.cb('success on HTTP 200', test => {
    const req = reqTest({ url: 'https://httpbin.org/status/200' })
    req.once('success', reason => {
        test.is(reason, 200)
        test.end()
    })
})

ava.cb('fails on HTTP 400', test => {
    const req = reqTest({ url: 'https://httpbin.org/status/400' })
    req.once('fail', reason => {
        test.is(reason, 400)
        test.end()
    })
})
