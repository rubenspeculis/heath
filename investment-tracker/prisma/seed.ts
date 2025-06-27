import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed metric weights based on the Excel spreadsheet configuration
  const growthWeights = [
    { category: 'GROWTH', metricName: 'LTM_REVENUE_GROWTH', weight: 0.10 },
    { category: 'GROWTH', metricName: 'LTM_FCF_GROWTH', weight: 0.10 },
    { category: 'GROWTH', metricName: 'LTM_EPS_GROWTH', weight: 0.10 },
    { category: 'GROWTH', metricName: 'FORWARD_3Y_REVENUE_GROWTH', weight: 0.25 },
    { category: 'GROWTH', metricName: 'FORWARD_3Y_EPS_GROWTH', weight: 0.45 },
  ]

  const qualityWeights = [
    { category: 'QUALITY', metricName: 'LTM_GROSS_MARGIN', weight: 0.25 },
    { category: 'QUALITY', metricName: 'LTM_ROIC', weight: 0.30 },
    { category: 'QUALITY', metricName: 'LTM_DEBT_TO_EBITDA', weight: 0.20 },
    { category: 'QUALITY', metricName: 'LTM_FCF_MARGIN', weight: 0.20 },
    { category: 'QUALITY', metricName: 'SHARE_DILUTION', weight: 0.05 },
  ]

  // Create metric weights
  await Promise.all([
    ...growthWeights.map(weight => 
      prisma.metricWeight.upsert({
        where: { category_metricName: { category: weight.category, metricName: weight.metricName } },
        update: { weight: weight.weight },
        create: weight,
      })
    ),
    ...qualityWeights.map(weight => 
      prisma.metricWeight.upsert({
        where: { category_metricName: { category: weight.category, metricName: weight.metricName } },
        update: { weight: weight.weight },
        create: weight,
      })
    ),
  ])

  // Seed some example stocks from the spreadsheet
  const exampleStocks = [
    { ticker: 'ASML', name: 'ASML Holding N.V.', currency: 'EUR', sector: 'Technology' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', currency: 'USD', sector: 'Consumer Discretionary' },
    { ticker: 'MSFT', name: 'Microsoft Corporation', currency: 'USD', sector: 'Technology' },
    { ticker: 'TYL', name: 'Tyler Technologies Inc.', currency: 'USD', sector: 'Technology' },
    { ticker: 'NU', name: 'Nu Holdings Ltd.', currency: 'USD', sector: 'Financial Services' },
    { ticker: 'NOW', name: 'ServiceNow Inc.', currency: 'USD', sector: 'Technology' },
  ]

  await Promise.all(
    exampleStocks.map(stock =>
      prisma.stock.upsert({
        where: { ticker: stock.ticker },
        update: stock,
        create: stock,
      })
    )
  )

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })