/**
 * @fileoverview Performance benchmark runner
 * Executes all performance tests and generates report
 */

import FPSBenchmark, { runFPSBenchmark } from './fps-benchmark.js'
import LoadBenchmark from './load-benchmark.js'
import MemoryBenchmark from './memory-benchmark.js'

/**
 * Run all performance benchmarks
 * @returns {Promise<Object>} Combined benchmark results
 */
async function runAllBenchmarks() {
  console.log('🚀 Starting Performance Benchmarks...\n')

  const results = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    tests: {}
  }

  console.log('📊 Running FPS Benchmark...')
  const fpsResults = await runFPSBenchmark(5)
  results.tests.fps = fpsResults
  console.log(`   Average FPS: ${fpsResults.avgFPS}`)
  console.log(`   Min FPS: ${fpsResults.minFPS}`)
  console.log(`   Max FPS: ${fpsResults.maxFPS}`)
  console.log(`   Result: ${fpsResults.passed ? '✅ PASS' : '❌ FAIL'}\n`)

  console.log('💾 Running Memory Benchmark...')
  const memoryBenchmark = new MemoryBenchmark()
  const memoryResults = memoryBenchmark.getResults()
  results.tests.memory = memoryResults
  if (memoryResults.supported) {
    console.log(`   Current Memory: ${memoryResults.current} MB`)
    console.log(`   Target: ${memoryResults.target} MB`)
    console.log(`   Result: ${memoryResults.passed ? '✅ PASS' : '❌ FAIL'}\n`)
  } else {
    console.log('   ⚠️  Memory API not supported\n')
  }

  const allPassed = fpsResults.passed && 
    (!memoryResults.supported || memoryResults.passed)

  results.overallResult = allPassed ? 'PASS' : 'FAIL'

  console.log('=' .repeat(50))
  console.log(`Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)
  console.log('='.repeat(50))

  return results
}

if (typeof window !== 'undefined') {
  window.runPerformanceBenchmarks = runAllBenchmarks
}

export { runAllBenchmarks, FPSBenchmark, LoadBenchmark, MemoryBenchmark }
