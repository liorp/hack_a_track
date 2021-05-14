import type StageInstance from "types/StageInstance"
import type Competition from "types/Competition"

export default interface Group {
  id: number
  name: string
  current_stage_instance: StageInstance
  competition: Competition
}
