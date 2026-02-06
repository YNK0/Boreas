/**
 * Jest Polyfills
 * Provides browser APIs that Jest doesn't have by default
 */

// TextEncoder/TextDecoder polyfill for Node.js
const { TextEncoder, TextDecoder } = require('util')

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// URL polyfill
global.URL = require('url').URL

// Fetch polyfill (if needed)
if (!global.fetch) {
  global.fetch = require('node-fetch')
}

// Web Crypto API polyfill (basic implementation)
global.crypto = {
  randomUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  },
  getRandomValues: (array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
    return array
  }
}

// RequestIdleCallback polyfill
global.requestIdleCallback = global.requestIdleCallback || function (cb) {
  const start = Date.now()
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start))
      }
    })
  }, 1)
}

global.cancelIdleCallback = global.cancelIdleCallback || function (id) {
  clearTimeout(id)
}

// Blob polyfill for file testing
if (!global.Blob) {
  global.Blob = class Blob {
    constructor(parts = [], options = {}) {
      this.size = 0
      this.type = options.type || ''
      this.parts = parts

      if (Array.isArray(parts)) {
        this.size = parts.reduce((acc, part) => {
          if (typeof part === 'string') {
            return acc + part.length
          }
          return acc + (part.size || 0)
        }, 0)
      }
    }

    slice(start = 0, end = this.size, contentType = '') {
      return new Blob([], { type: contentType })
    }

    text() {
      return Promise.resolve(this.parts.join(''))
    }

    arrayBuffer() {
      return Promise.resolve(new ArrayBuffer(this.size))
    }
  }
}

// File polyfill
if (!global.File) {
  global.File = class File extends global.Blob {
    constructor(parts, name, options = {}) {
      super(parts, options)
      this.name = name
      this.lastModified = options.lastModified || Date.now()
    }
  }
}

// FileList polyfill
if (!global.FileList) {
  global.FileList = class FileList {
    constructor(files = []) {
      this.length = files.length
      files.forEach((file, index) => {
        this[index] = file
      })
    }

    item(index) {
      return this[index] || null
    }

    *[Symbol.iterator]() {
      for (let i = 0; i < this.length; i++) {
        yield this[i]
      }
    }
  }
}

// localStorage polyfill
if (!global.localStorage) {
  const store = {}

  global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value) },
    removeItem: (key) => { delete store[key] },
    clear: () => { Object.keys(store).forEach(key => delete store[key]) },
    get length() { return Object.keys(store).length },
    key: (index) => Object.keys(store)[index] || null
  }
}

// sessionStorage polyfill (same as localStorage for testing)
if (!global.sessionStorage) {
  global.sessionStorage = { ...global.localStorage }
}