import { map, reverse } from '@dword-design/functions'
import sequential from 'promise-sequential'

export default (tests, plugins) => {
  plugins =
    plugins
    |> map(plugin =>
      typeof plugin === 'string' ? require(`./${plugin}`) : plugin
    )
  return {
    after() {
      return (
        plugins
        |> reverse
        |> map(plugin => () => plugin.after?.call(this))
        |> sequential
      )
    },
    afterEach() {
      return (
        plugins
        |> reverse
        |> map(plugin => () => plugin.afterEach?.call(this))
        |> sequential
      )
    },
    before() {
      return (
        plugins |> map(plugin => () => plugin.before?.call(this)) |> sequential
      )
    },
    beforeEach() {
      return (
        plugins
        |> map(plugin => () => plugin.beforeEach?.call(this))
        |> sequential
      )
    },
    ...tests,
  }
}
