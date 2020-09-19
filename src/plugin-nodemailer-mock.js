import nodemailerMock from 'nodemailer-mock'

export default () => ({
  afterEach: () => nodemailerMock.mock.reset(),
})
