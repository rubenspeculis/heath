interface FinancialMetrics {
  // Growth metrics
  ltmRevenueGrowth?: number
  ltmFcfGrowth?: number
  ltmEpsGrowth?: number
  forward3yRevenueGrowth?: number
  forward3yEpsGrowth?: number
  
  // Quality metrics
  ltmGrossMargin?: number
  ltmRoic?: number
  ltmDebtToEbitda?: number
  ltmFcfMargin?: number
  shareDilution?: number
}

interface MetricWeight {
  category: string
  metricName: string
  weight: number
}

export class InvestmentScoringEngine {
  private growthWeights: Record<string, number> = {
    LTM_REVENUE_GROWTH: 0.10,
    LTM_FCF_GROWTH: 0.10,
    LTM_EPS_GROWTH: 0.10,
    FORWARD_3Y_REVENUE_GROWTH: 0.25,
    FORWARD_3Y_EPS_GROWTH: 0.45,
  }

  private qualityWeights: Record<string, number> = {
    LTM_GROSS_MARGIN: 0.25,
    LTM_ROIC: 0.30,
    LTM_DEBT_TO_EBITDA: 0.20,
    LTM_FCF_MARGIN: 0.20,
    SHARE_DILUTION: 0.05,
  }

  constructor(customWeights?: MetricWeight[]) {
    if (customWeights) {
      this.updateWeights(customWeights)
    }
  }

  updateWeights(weights: MetricWeight[]) {
    weights.forEach(weight => {
      if (weight.category === 'GROWTH') {
        this.growthWeights[weight.metricName] = weight.weight
      } else if (weight.category === 'QUALITY') {
        this.qualityWeights[weight.metricName] = weight.weight
      }
    })
  }

  calculateGrowthScore(metrics: FinancialMetrics): number {
    const scores: number[] = []

    // LTM Revenue Growth (10%)
    if (metrics.ltmRevenueGrowth !== undefined) {
      const normalizedScore = this.normalizeGrowthMetric(metrics.ltmRevenueGrowth)
      const weightedScore = normalizedScore * this.growthWeights.LTM_REVENUE_GROWTH
      scores.push(weightedScore)
      console.log(`Revenue Growth: ${(metrics.ltmRevenueGrowth * 100).toFixed(1)}% -> normalized: ${normalizedScore.toFixed(3)} -> weighted: ${weightedScore.toFixed(3)}`)
    }

    // LTM FCF Growth (10%)
    if (metrics.ltmFcfGrowth !== undefined) {
      scores.push(this.normalizeGrowthMetric(metrics.ltmFcfGrowth) * this.growthWeights.LTM_FCF_GROWTH)
    }

    // LTM EPS Growth (10%)
    if (metrics.ltmEpsGrowth !== undefined) {
      scores.push(this.normalizeGrowthMetric(metrics.ltmEpsGrowth) * this.growthWeights.LTM_EPS_GROWTH)
    }

    // Forward 3Y Revenue Growth (25%)
    if (metrics.forward3yRevenueGrowth !== undefined) {
      scores.push(this.normalizeGrowthMetric(metrics.forward3yRevenueGrowth) * this.growthWeights.FORWARD_3Y_REVENUE_GROWTH)
    }

    // Forward 3Y EPS Growth (45%)
    if (metrics.forward3yEpsGrowth !== undefined) {
      scores.push(this.normalizeGrowthMetric(metrics.forward3yEpsGrowth) * this.growthWeights.FORWARD_3Y_EPS_GROWTH)
    }

    // If no growth metrics available, return null to indicate insufficient data
    if (scores.length === 0) {
      return 0
    }

    return scores.reduce((sum, score) => sum + score, 0)
  }

  calculateQualityScore(metrics: FinancialMetrics): number {
    const scores: number[] = []

    // LTM Gross Margin (25%)
    if (metrics.ltmGrossMargin !== undefined) {
      scores.push(this.normalizeMarginMetric(metrics.ltmGrossMargin) * this.qualityWeights.LTM_GROSS_MARGIN)
    }

    // LTM ROIC (30%)
    if (metrics.ltmRoic !== undefined) {
      scores.push(this.normalizeRoicMetric(metrics.ltmRoic) * this.qualityWeights.LTM_ROIC)
    }

    // LTM Debt to EBITDA (20%) - lower is better
    if (metrics.ltmDebtToEbitda !== undefined) {
      scores.push(this.normalizeDebtMetric(metrics.ltmDebtToEbitda) * this.qualityWeights.LTM_DEBT_TO_EBITDA)
    }

    // LTM FCF Margin (20%)
    if (metrics.ltmFcfMargin !== undefined) {
      scores.push(this.normalizeMarginMetric(metrics.ltmFcfMargin) * this.qualityWeights.LTM_FCF_MARGIN)
    }

    // Share Dilution (5%) - lower is better
    if (metrics.shareDilution !== undefined) {
      scores.push(this.normalizeDilutionMetric(metrics.shareDilution) * this.qualityWeights.SHARE_DILUTION)
    }

    // If no quality metrics available, return 0 to indicate insufficient data
    if (scores.length === 0) {
      return 0
    }

    return scores.reduce((sum, score) => sum + score, 0)
  }

  calculateOverallScore(metrics: FinancialMetrics, growthWeight: number = 0.6, qualityWeight: number = 0.4): {
    growthScore: number
    qualityScore: number
    overallScore: number
  } {
    const growthScore = this.calculateGrowthScore(metrics)
    const qualityScore = this.calculateQualityScore(metrics)
    const overallScore = (growthScore * growthWeight) + (qualityScore * qualityWeight)

    return {
      growthScore: Math.round(growthScore * 100) / 100,
      qualityScore: Math.round(qualityScore * 100) / 100,
      overallScore: Math.round(overallScore * 100) / 100,
    }
  }

  // Normalization functions to convert metrics to 0-1 scale
  private normalizeGrowthMetric(growth: number): number {
    // Growth rate normalization: 0% = 0.5, 20%+ = 1.0, negative = 0-0.5
    // growth is in decimal format (0.2 = 20%)
    if (growth >= 0.2) return 1.0
    if (growth >= 0) return 0.5 + (growth / 0.4) // 0-20% maps to 0.5-1.0
    return Math.max(0, 0.5 + (growth / 0.4)) // Negative growth maps to 0-0.5
  }

  private normalizeMarginMetric(margin: number): number {
    // Margin normalization: assume 0-50% is reasonable range
    // margin is in decimal format (0.5 = 50%)
    return Math.min(1.0, Math.max(0, margin / 0.5))
  }

  private normalizeRoicMetric(roic: number): number {
    // ROIC normalization: 15%+ is excellent, 0% is poor
    // roic is in decimal format (0.15 = 15%)
    return Math.min(1.0, Math.max(0, roic / 0.15))
  }

  private normalizeDebtMetric(debtToEbitda: number): number {
    // Debt/EBITDA normalization: 0 is best (1.0), 3+ is poor (0.0)
    if (debtToEbitda <= 0) return 1.0
    if (debtToEbitda >= 3) return 0.0
    return 1.0 - (debtToEbitda / 3)
  }

  private normalizeDilutionMetric(dilution: number): number {
    // Share dilution normalization: 0% is best (1.0), -10%+ is poor (0.0)
    if (dilution >= 0) return 1.0
    if (dilution <= -10) return 0.0
    return 1.0 + (dilution / 10) // -10% to 0% maps to 0-1
  }

  // Ranking functions
  static rankStocks(stocksWithScores: Array<{ ticker: string, scores: ReturnType<InvestmentScoringEngine['calculateOverallScore']> }>) {
    return {
      topOverall: [...stocksWithScores]
        .sort((a, b) => b.scores.overallScore - a.scores.overallScore)
        .slice(0, 10),
      
      topGrowth: [...stocksWithScores]
        .sort((a, b) => b.scores.growthScore - a.scores.growthScore)
        .slice(0, 10),
      
      topQuality: [...stocksWithScores]
        .sort((a, b) => b.scores.qualityScore - a.scores.qualityScore)
        .slice(0, 10),
    }
  }

  // Percentile calculations for relative scoring
  static calculatePercentiles(values: number[]): Record<number, number> {
    const sorted = [...values].sort((a, b) => a - b)
    const percentiles: Record<number, number> = {}
    
    const percentilePoints = [10, 25, 50, 75, 90]
    percentilePoints.forEach(p => {
      const index = Math.floor((p / 100) * (sorted.length - 1))
      percentiles[p] = sorted[index]
    })
    
    return percentiles
  }
}

export const scoringEngine = new InvestmentScoringEngine()