// imports
const IMAP = require('imap-simple')
const dotenv = require('dotenv').config
const simpleParser = require('mailparser').simpleParser
const _ = require('lodash')
const fs = require('fs')

// load environment variables
dotenv()

// create IMAP config
let config = {
  imap: {
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASS || '',
    host: process.env.IMAP_HOST || '',
    port: Number(process.env.IMAP_PORT) || 933,
    tls: Boolean(process.env.USE_TLS) || true,
    tlsOptions: {
      rejectUnauthorized: false
    }
  }
}

module.exports = async () => {
  // connecting into IMAP server
  IMAP.connect(config).then(connection => {
    // opening inbox
    return connection.openBox('INBOX').then(() => {
      // criteria to search in inbox
      let searchCriteria = ['1:5', ['FROM', 'Filipe Deschamps Newsletter']]

      // get HEADER and body of email
      let fetchOptions = {
        bodies: ['HEADER', 'TEXT', ''],
      }

      // search for emails
      return connection.search(searchCriteria, fetchOptions).then(emails => {
        emails.forEach(email => {
          let all = _.find(email.parts, { which: '' })
          let id = email.attributes.uid
          let idHeader = `Imap-Id: ${id} \r\n`

          // parse emails and save
          simpleParser(idHeader + all.body, (err, mail) => {
            if (err) {
              throw new Error(err)
            }

            // removing unnecessary characters
            let mailSubject = mail.subject.toLowerCase().replaceAll(" ","_").replaceAll('_/_', '__')

            // create post page
            fs.writeFileSync(`public/posts/${mailSubject}.html`, mail.html)
          })
        })
      })
    })
  })
}