import type Group from 'types/Group'
import type Competition from 'types/Competition'

export default interface User {
  id: number
  fullname: string
  auth_token: string
  group: Group
  competition: Competition
}
