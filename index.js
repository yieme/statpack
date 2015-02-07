// statpack - Process Statistic Package - Copyright (C) 2015 by yieme - All Rights Reserved - License: MIT

;(function() {
  'use strict';

  var os              = require('os')
    , ss              = require('simple-statistics')

  var Statpack = function(timeFunction) {
    timeFunction = timeFunction || (new Date()).valueOf
    var self = this
      , stats = {
        use  : [],
        tim  : [],
        tmem : [],
        fmem : [],
        load : []
      }
      , MAX_STATS       = 100
      , statAreas       = ['use', 'tim', 'tmem', 'fmem', 'load']
      , iterations      = 0
      , duration        = 0
      , timerBegin      = 0
    ;

    self.shiftStats = function shiftStats() {
      for (var i = 0; i < statAreas.length; i++) {
        var area = statAreas[i]
        stats[area].shift()
      }
    }

    self.getStats = function getStats() {
      var result = {}
      for (var i = 0; i < statAreas.length; i++) {
        var area = statAreas[i]
        var stat = stats[area]
        result[area] = {
          min: ss.min(stat),
          max: ss.max(stat),
          ave: Math.round(ss.average(stat))
        }
      }
      return result
    }

    self.addStats = function addStats() {
      if (stats.use.length >= MAX_STATS) self.shiftStats()
      stats.use.push(iterations)
      var averageDuration = (duration) ? Math.round(duration / iterations) : 0
      stats.tim.push(averageDuration)
      iterations = 0
      duration   = 0
      stats.tmem.push(os.totalmem())
      stats.fmem.push(os.freemem())
      var load = Math.round(os.loadavg()[0])
      stats.load.push(load)
    }

    self.addIteration = function addIteration(time) {
      iterations++
      duration += time
    }

    self.beginOp = function beginOp() {
      timerBegin = timeFunction()
    }

    self.endOp = function endOp() {
      self.addIteration(timeFunction() - timerBegin)
    }

    return self
  }



  if (typeof exports === 'object') module.exports = Statpack // support CommonJS
  // else if (typeof define === 'function' && define.amd) define(function() { return Statpack }) // support AMD
  // else this.Statpack = Statpack // support browser
})();
