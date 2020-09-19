import { map, zipObject } from '@dword-design/functions'
import sequential from 'promise-sequential'

const hooks = ['beforeEach', 'afterEach', 'before', 'after']

export default (tests, plugins) => {
  plugins =
    plugins
    |> map(plugin =>
      typeof plugin === 'string' ? require(`./${plugin}`) : plugin
    )
  return {
    ...zipObject(
      hooks,
      hooks
        |> map(hook => () =>
          plugins |> map(plugin => () => plugin[hook]?.()) |> sequential
        )
    ),
    ...tests,
  }
}
