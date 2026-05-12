import { gql } from '@apollo/client'

export const GET_STATS = gql`
  query Stats {
    stats {
      totalCategoriesCount
      totalTransactionsCount
      mostUsedCategory {
        id
        name
        icon
        color
      }
      totalBalance
      monthlyIncome
      monthlyExpense
    }
  }
`
