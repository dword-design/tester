import { identity, reverse } from '@dword-design/functions'

export default (tests, plugins) => {
  plugins = plugins || []
  plugins = plugins
    .map(plugin =>
      typeof plugin === 'string' ? require(`./${plugin}`) : plugin
    )
    .map(plugin => ({
      after: () => {},
      afterEach: () => {},
      before: () => {},
      beforeEach: () => {},
      transform: identity,
      ...plugin,
    }))

  return {
    async after() {
      for (const plugin of reverse(plugins)) {
        await plugin.after.call(this)
      }
    },
    async afterEach() {
      for (const plugin of reverse(plugins)) {
        await plugin.afterEach.call(this)
      }
    },
    async before() {
      for (const plugin of plugins) {
        await plugin.before.call(this)
      }
    },
    async beforeEach() {
      for (const plugin of plugins) {
        await plugin.beforeEach.call(this)
      }
    },
    ...Object.fromEntries(
      Object.entries(tests).map(entry => {
        const name = entry[0]

        const test = entry[1]

        return [
          name,
          plugins.reduce((acc, plugin) => plugin.transform(acc, name), test),
        ]
      })
    ),
  }
}
