import { gql } from '@apollo/client'

export const LIST_TRANSACTIONS = gql`
  query ListTransactions {
    listTransactions {
      id
      title
      value
      type
      categoryId
      category {
        id
        name
        color
        icon
      }
      userId
      createdAt
      updatedAt
    }
  }
`

export const FIND_TRANSACTION = gql`
  query FindTransaction($id: String!) {
    findTransaction(id: $id) {
      id
      title
      value
      type
      categoryId
      category {
        id
        name
        color
        icon
      }
      userId
      createdAt
      updatedAt
    }
  }
`
