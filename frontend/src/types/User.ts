import type Participant from 'types/Participant'

export default interface User {
  id: number
  fullname: string
  auth_token: string
  participant: Participant
}
