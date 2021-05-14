import type Group from "types/Group"

export default interface Participant {
  id: number
  group: Group | number
  full_name: string
  first_name: string
  last_name: string
}
