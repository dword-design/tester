import { forIn } from '@dword-design/functions'
import mockery from 'mockery'

export default mocks => ({
  after: () => {
    mockery.deregisterAll()
    mockery.disable()
  },
  before: () => {
    mockery.enable({ warnOnUnregistered: false })
    forIn((mock, name) => mockery.registerMock(name, mock))(mocks)
  },
})
