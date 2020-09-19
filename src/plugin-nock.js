import nock from 'nock'

export default () => ({
  afterEach: () => nock.cleanAll(),
})
