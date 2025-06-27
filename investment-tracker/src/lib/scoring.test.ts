import { describe, it, expect } from 'vitest'
import { InvestmentScoringEngine, scoringEngine } from './scoring'

describe('InvestmentScoringEngine', () => {
  describe('calculateGrowthScore', () => {
    it('should calculate growth score with all metrics', () => {
      const metrics = {
        ltmRevenueGrowth: 15,
        ltmFcfGrowth: 12,
        ltmEpsGrowth: 18,
        forward3yRevenueGrowth: 20,
        forward3yEpsGrowth: 25
      }

      const score = scoringEngine.calculateGrowthScore(metrics)
      
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(1)
    })

    it('should handle missing growth metrics', () => {
      const metrics = {
        ltmRevenueGrowth: 15
      }

      const score = scoringEngine.calculateGrowthScore(metrics)
      
      expect(score).toBeGreaterThan(0)
    })

    it('should return 0 for no growth metrics', () => {
      const metrics = {}

      const score = scoringEngine.calculateGrowthScore(metrics)
      
      expect(score).toBe(0)
    })
  })

  describe('calculateQualityScore', () => {
    it('should calculate quality score with all metrics', () => {
      const metrics = {
        ltmGrossMargin: 45,
        ltmRoic: 18,
        ltmDebtToEbitda: 1.5,
        ltmFcfMargin: 25,
        shareDilution: -2
      }

      const score = scoringEngine.calculateQualityScore(metrics)
      
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(1)
    })

    it('should handle missing quality metrics', () => {
      const metrics = {
        ltmRoic: 18
      }

      const score = scoringEngine.calculateQualityScore(metrics)
      
      expect(score).toBeGreaterThan(0)
    })

    it('should return 0 for no quality metrics', () => {
      const metrics = {}

      const score = scoringEngine.calculateQualityScore(metrics)
      
      expect(score).toBe(0)
    })
  })

  describe('calculateOverallScore', () => {
    it('should calculate overall score with default weights', () => {
      const metrics = {
        ltmRevenueGrowth: 15,
        ltmEpsGrowth: 18,
        forward3yEpsGrowth: 25,
        ltmGrossMargin: 45,
        ltmRoic: 18,
        ltmDebtToEbitda: 1.5
      }

      const result = scoringEngine.calculateOverallScore(metrics)
      
      expect(result.growthScore).toBeGreaterThan(0)
      expect(result.qualityScore).toBeGreaterThan(0)
      expect(result.overallScore).toBeGreaterThan(0)
      expect(typeof result.overallScore).toBe('number')
    })

    it('should use custom weights', () => {
      const metrics = {
        ltmRevenueGrowth: 15,
        ltmRoic: 18
      }

      const result = scoringEngine.calculateOverallScore(metrics, 0.8, 0.2)
      
      expect(result.overallScore).toBeGreaterThan(0)
    })

    it('should handle zero scores', () => {
      const metrics = {}

      const result = scoringEngine.calculateOverallScore(metrics)
      
      expect(result.growthScore).toBe(0)
      expect(result.qualityScore).toBe(0)
      expect(result.overallScore).toBe(0)
    })
  })

  describe('custom weights', () => {
    it('should update weights correctly', () => {
      const engine = new InvestmentScoringEngine([
        { category: 'GROWTH', metricName: 'LTM_REVENUE_GROWTH', weight: 0.5 },
        { category: 'QUALITY', metricName: 'LTM_ROIC', weight: 0.8 }
      ])

      const metrics = {
        ltmRevenueGrowth: 15,
        ltmRoic: 18
      }

      const result = engine.calculateOverallScore(metrics)
      
      expect(result.overallScore).toBeGreaterThan(0)
    })
  })

  describe('static methods', () => {
    it('should rank stocks correctly', () => {
      const stocksWithScores = [
        { ticker: 'AAPL', scores: { overallScore: 85, growthScore: 80, qualityScore: 90 } },
        { ticker: 'MSFT', scores: { overallScore: 90, growthScore: 85, qualityScore: 95 } },
        { ticker: 'GOOGL', scores: { overallScore: 75, growthScore: 90, qualityScore: 60 } }
      ]

      const rankings = InvestmentScoringEngine.rankStocks(stocksWithScores)
      
      expect(rankings.topOverall[0].ticker).toBe('MSFT')
      expect(rankings.topGrowth[0].ticker).toBe('GOOGL')
      expect(rankings.topQuality[0].ticker).toBe('MSFT')
    })

    it('should calculate percentiles correctly', () => {
      const values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
      
      const percentiles = InvestmentScoringEngine.calculatePercentiles(values)
      
      expect(percentiles[50]).toBe(50)
      expect(percentiles[90]).toBe(90)
      expect(percentiles[10]).toBe(10)
    })
  })
})