/*
   来自 taotao 的 promise 😁😁😁
*/

function createPromise(window, undefined) {
    'use strict';

    const PENDING = 'pending'
    const RESOLVE = 'resolved'
    const REJECT  = 'rejected'
	const ANPRO   = 'another_promise'

    let SAVE_ERROR = null
    let IS_ERROR = {}

    function tryCall(fn, resolve, reject) {
        try {
            return fn(resolve, reject)
        } catch (err) {
            SAVE_ERROR = err
            return IS_ERROR
        }
    }

    function deferred(onResolve, onReject) {
        this.onResolve = isFn(onResolve) ? onResolve : null
        this.onReject = isFn(onReject) ? onReject : null
    }

    function deferredHandle (self) {
        if (!self._CBQueue || !self._CBQueue.length) return
        const attr = self._status === RESOLVE ? 'onResolve' : 'onReject'
        const callback = getCB(self, attr, true)
        if (!callback) {
            if (self._status === REJECT) {
                throw new Error(self._value)
            }
        }
        callback.call(self, self._value) 
    }

    // 得到相应的回调，并且跟踪子 promise，做出相应调整
    function getCB(self, attr, pure) {
        if (!pure) {
            while (self._status === ANPRO) {
                const CBQueue = self._CBQueue
                self = self._value
                if (CBQueue) {
                    self._CBQueue = CBQueue.slice()
                }
            }
            // 如果子 promise 状态已经改变了，其内部的调用已经完成，后续继续捕捉参数
            if (self._status === RESOLVE || self._status === REJECT) {
                deferredHandle(self)
                return null
            }
        }

        let deferred = self._CBQueue.shift()
        if (!deferred) return null
        while (deferred[attr] === null) {
            deferred = self._CBQueue.shift()
            if (!deferred) return null
        }
        return deferred[attr]
    }

    function isArr(arr) {
        return Object.prototype.toString.call(arr) === '[object Array]'
    }

    function isFn(fn) {
        return Object.prototype.toString.call(fn) === '[object Function]'
    }

    function getFnBody(fn) {
        if (fn === undefined) return
        if (!fn || typeof fn !== 'function') {
            throw new TypeError('Parameter must be a function.')
        }
        const fnStr = fn + ''
        const regOne = /{([^{|^}])*(.|\s)*}/g
        const regTwo = /[>|)].*/g
        const regThr = /[)].*[>]/g

        const complate = fnStr.match(regOne)
        const omitted = fnStr.match(regTwo)

        if (!complate && !omitted) return ''
        if (complate) {
            return complate[0].slice(1, complate[0].length - 1).trim()
        }

        if (omitted[0].match(regThr)) {
            return omitted[0].replace(regThr, '').trim()
        }
        return omitted[0].replace(/>|\)g/, '').trim()
    }

    class _Promise {
        constructor(fn) {
            if (!getFnBody(fn))
                return console.warn(
                    'Please do not pass in an empty function.'
                )
            this._status  = PENDING
            this._value   = null
            this._CBQueue = []

            doResolve(fn, this)
        }

        then(s, f) {
            if (!isFn(s)) s = null
            if (!isFn(f)) f = null
            if (this._status === RESOLVE) {
                s && s.call(this, this._value)
                return this
            }
            if (this._status === REJECT) {
                f && f.call(this, this._value)
                return this
            }

            this._CBQueue.push(new deferred(s, f))
            return this
        }

        catch(fail) {
            return this.then(null, fail)
        }

        finally(fn) {
            return this.then(fn, fn)
        }

        toString () {
            return '[object _Promise]'
        }
    }

    _Promise.all = function (arr) {
        if (!arr) return console.warn('Parameter can not be empty.')
        if (arr.length == null) {
            throw new Error('Parameter must be array or array-like objects.')
        }
        if (!isArr(arr)) {
            arr = Array.from(arr)
        }

        const length = arr.length
        const result = []
        let remaining = length
        let i = 0
        return new _Promise((resolve, reject) => {
            if (length === 0) return resolve([])
            function res(i, val) {
                // 判断实例
                if (val instanceof _Promise) {
                    // 如果状态是 reject
                    if (val._status === REJECT) {
                        return reject(val._value)
                    }

                    val.then(function(value) {
                        result[i] = value
                        --remaining === 0 && resolve(result)
                        return value
                    }, reject)
                    return
                }
                result[i] = val
                --remaining === 0 && resolve(result)
            }

            for (let i = 0; i < length; i++) {
                res(i, arr[i])
            }
        })
    }

    _Promise.race = function (arr) {
        return new _Promise((resolve, reject) => {
            arr.forEach(value => {
                _Promise.resolve(value).then(resolve, reject)
            })
        })
    }

    _Promise.resolve = function (value) {
        if (value instanceof _Promise) return value

        try {
            return new _Promise(resolve => resolve(value))
        } catch (error) {
            return new _Promise((resolve, reject) => {
                reject(error)
            })
        }

    }

    _Promise.reject = function (value) {
        return new _Promise((resolve, reject) => {
            reject(value)
        })
    }

    function resolve(self, value) {
        // 不能传入当前上下文
        if (value === self) {
            return reject(
                self,
                new TypeError('A promise cannot be resolved with itself.')
            )
        }
        const callback = getCB(self, 'onResolve')
        if (
            !callback || 
            self._status == RESOLVE || 
            self._status === REJECT
        ) return

        let ret
        let createErr
        try {
            ret = callback.call(self, value || self._value)
        } catch (error) {
            ret = error
            createErr = true
        }

        self._status = RESOLVE
        transferCB(ret, self, createErr)
    }

    function reject(self, error) {
        let callback = getCB(self, 'onReject')

        if (self._status == RESOLVE || self._status === REJECT) return
        // 如果没有错误回调来接盘
        if (!callback) {
            self._status = REJECT
            throw new Error(error)
        }

        let ret
        let createErr
        try {
            ret = callback.call(self, error || self._value)
        } catch (error) {
            ret = error
            createErr = true
        }
        self._status = REJECT
        transferCB(ret, self, createErr)
    }

    function transferCB(instance, self, createErr) {
        // 判断当前回调是不是返回了一个 promise 实例
        if (!(instance instanceof _Promise)) {
            const _ret = instance
            instance = new _Promise((resolve, reject) => {
                if (!createErr) {
                    self._status === RESOLVE && resolve(_ret)
                    return
                }
                reject(_ret)
            })
        }

        instance._CBQueue = self._CBQueue.slice()
    }

    /*
        * 通过一个开关，确保 resolve 和 reject 只被调用一次
    */

    function doResolve(fn, promise) {
        let done = false
        const res = tryCall(fn,
            // 允许传多个参数
            args => {
                if (done) return
                done = true
                if (args instanceof _Promise) {
                    promise._status = ANPRO
                }
                promise._value = args
                setTimeout(_ => resolve(promise, args))
            },
            error => {
                if (done) return
                if (error === promise) {
                    error = new TypeError('A promise cannot be rejected with itself.')
                }
                done = true
                if (error instanceof _Promise) {
                    promise._status = ANPRO
                }
                promise._value = error
                setTimeout(_ => reject(promise, error))
            }
        )

        // 如果有错误
        if (!done && res === IS_ERROR) {
            done = true
            promise._value = SAVE_ERROR
            setTimeout(_ => reject(promise, SAVE_ERROR))
        }
    }
    if (window) window.getFnBody = getFnBody
    return _Promise
}

typeof module !== 'undefined' && typeof module.exports === 'object' ?
    module.exports = createPromise() :
	this._Promise  = createPromise(this)