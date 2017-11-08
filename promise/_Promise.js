'use strict';

~function (window, undefined) {
	const PENDING = 'pending'
	const RESOLVE = 'fulfilled'
	const REJECT  = 'rejected'

	let SAVE_ERROR = null
	let IS_ERROR   = {}

	// 避免在函数内部写 try catch
	function tryCall (fn, resolve, reject) {
		try {
			return fn(resolve, reject)
		} catch (err) {
			SAVE_ERROR = err
			return IS_ERROR
		}
	}

	function isArr (arr) {
		return Object.prototype.toString.call(arr) === '[object Array]'
	}

	function isFn (fn) {
		return Object.prototype.toString.call(fn) === '[object Function]'
	}

	function getFnBpdy (fn) {
		if (fn === undefined) return
		if (!fn || typeof fn !== 'function') {
			throw new TypeError('Parameter must be a function.')
		}
		const fnStr  = fn + ''
		const regOne = /{([^{|^}])*(.|\s)*}/g
		const regTwo = /[>|)].*/g
		const regThr = /[)].*[>]/g

		const complate = fnStr.match(regOne)
		const omitted  = fnStr.match(regTwo)

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
		constructor (fn) {
			this._status  = PENDING
			this._success = []
			this._failure = []
			this.S_VALUE  = null
			this.F_VALUE  = null

			if (!getFnBpdy(fn)) 
				return console.warn(
					'Please do not pass in an empty function.'
				)
			doResolve(fn, this)
		}

		then (s, f) {
			if (!isFn(s)) s = null
			if (!isFn(f)) f = null
			if (this._status === RESOLVE) {
				s && s.call(this, ...this.S_VALUE)
				return this
			}
			if (this._status === REJECT) {
				f && f.call(this, ...this.F_VALUE)
				return this
			}

			this._success.push(s)
			this._failure.push(f)
			return this
		}

		catch (fail) {
			return this.then(null, fail)
		}

		finally (fn) {
			return this.then(fn, fn)
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

		const length  = arr.length
		const result  = []
		let remaining = length
		let i         = 0
		return new _Promise((resolve, reject) => {
			if (length === 0) return resolve([])
			function res (i, val) {
				// 判断实例
				if (val instanceof _Promise) {
					// 如果状态是 reject
					if (val._status === REJECT) {
						return reject(val._value)
					}
					
					val.then(value => {
						result[i] = value
						--remaining === 0 && resolve(result)
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

	function resolve (self, value) {
		// 不能传入当前上下文
		if (value === self) {
			return reject(
				self,
				new TypeError('A promise cannot be resolved with itself.')
			)
		}
		const callback = self._success.shift()
		while (self._failure[0] === null) {
			self._failure.shift()
		}
		if (!callback || self._status !== PENDING) return
		let ret
		let createErr
		try {
			ret = callback.call(self, ...value)
		} catch (error) {
			ret = error
			createErr = true
		}
		
		self._status = RESOLVE
		transferCB(ret, self, createErr)
	}

	function reject (self, error) {
		const callback = self._failure.shift()
		self._success.shift()
		if (!callback || self._status !== PENDING) return
		let ret
		let createErr
		try {
			ret = callback.call(self, error)
		} catch (error) {
			ret = error
			createErr = true
		}
		self._status = REJECT
		transferCB(ret, self, createErr)
	}

	function transferCB (instance, self, createErr) {
		// 判断当前回调是不是返回了一个 promise 实例
		if (!(instance instanceof _Promise)) {
			const _ret = instance
			instance = new _Promise((resolve, reject) => {
				!createErr ? resolve(_ret) : reject(_ret)
			})
		}

		instance._success = self._success.slice()
		instance._failure = self._failure.slice()
	}

	function doResolve (fn, promise) {
		let done = false
		const res = tryCall(fn,
			// 允许传多个参数
			(...args) => {
				if (done) return
				done = true
				promise.S_VALUE = args
				setTimeout(_ => resolve(promise, args))
			},
			error => {
				if (done) return
				if (error === promise) {
					error = new TypeError('A promise cannot be rejected with itself.')
				}
				done = true
				promise.F_VALUE = error
				setTimeout(_ => reject(promise, error))
			}
		)

		// 如果有错误
		if (!done && res === IS_ERROR) {
			done = true
			promise.F_VALUE = SAVE_ERROR
			setTimeout(_ => reject(promise, SAVE_ERROR))
		}
	}

	window._Promise = _Promise
}(this)