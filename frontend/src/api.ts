import axios from 'axios'
import User from 'types/User'
import Group from 'types/Group'
import Participant from "types/Participant"
import StageInstance from "types/StageInstance"

class CustomAPI {
  private _api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  constructor() {
    this._api.interceptors.response.use((response) => response, (error) => {
      if (error.response.status_code === 401) {
        this.removeToken()
      }
      return Promise.reject(error)
    })
  }

  removeToken = (): void => {
    delete this._api.defaults.headers.common.Authorization
  }

  setToken = (token: string): void => {
    this._api.defaults.headers.common.Authorization = `Token ${token}`
  }

  getToken = async (username: string, password: string): Promise<string> => {
    const data = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/token/login/`, { username, password })
    return data.data.auth_token
  }

  getUser = async (): Promise<User> => {
    const data = await this._api.get('auth/users/me/' )
    return data.data
  }

  register = async (username: string, password: string, participant: Pick<Participant, "group" | "first_name" | "last_name">): Promise<User> => {
    const data = await this._api.post('auth/users/', { username, password, participant })
    return data.data
  }

  logout = async (username: string, password: string) => {
    await this._api.post('auth/token/logout/', { username, password })
  }

  getGroups = async (): Promise<Group[]> => {
    const data = await this._api.get(`groups/`)
    return data.data.results
  }

  changeGroup = async (user: number, group: number): Promise<User> => {
    const data = await this._api.post(`participants/${user}/change_group/`, { group })
    return data.data
  }

  getCurrentStageInstance = async (user: number): Promise<StageInstance> => {
    const data = await this._api.get(`participants/${user}/current_stage_instance/`)
    return data.data
  }

  submitPasswordForStage = async (password: string): Promise<StageInstance> => {
    const data = await this._api.post(`stageinstances/unlock/`, {password})
    return data.data
  }
}

const api = new CustomAPI()
export default api
