import {
  identity,
  map,
  mapValues,
  reduce,
  reverse,
} from '@dword-design/functions'
import sequential from 'promise-sequential'

export default (tests, plugins) => {
  plugins =
    plugins
    |> map(plugin =>
      typeof plugin === 'string' ? require(`./${plugin}`) : plugin
    )
    |> map(plugin => ({
      after: () => {},
      afterEach: () => {},
      before: () => {},
      beforeEach: () => {},
      transform: identity,
      ...plugin,
    }))

  return {
    after() {
      return (
        plugins
        |> reverse
        |> map(plugin => () => plugin.after.call(this))
        |> sequential
      )
    },
    afterEach() {
      return (
        plugins
        |> reverse
        |> map(plugin => () => plugin.afterEach.call(this))
        |> sequential
      )
    },
    before() {
      return (
        plugins |> map(plugin => () => plugin.before.call(this)) |> sequential
      )
    },
    beforeEach() {
      return (
        plugins
        |> map(plugin => () => plugin.beforeEach.call(this))
        |> sequential
      )
    },
    ...(tests
      |> mapValues(
        test => plugins |> reduce((acc, plugin) => plugin.transform(acc), test)
      )),
  }
}
