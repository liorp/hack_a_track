import { Store } from 'pullstate'
import User from 'types/User'

interface LoginStoreType {
  user: User | null
}

export const LoginStore = new Store<LoginStoreType>({
  user: null
})
