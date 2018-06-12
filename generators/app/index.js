const Generator = require('yeoman-generator')
const { exec } = require('child_process')

/**
 * Base Generator
 *
 * @class App
 * @extends {Generator}
 */
class App extends Generator {
  constructor (args, opts) {
    super(args, opts)

    // Set arguments: appname, repoUrl
    this.argument('appname', {
      desc: 'Project Name',
      default: 'my-project',
      required: false,
      type: String
    })
    this.argument('url', {
      desc: 'Base Template (url)',
      default: 'https://github.com/marco-souza/base-react-ts.git',
      required: false,
      type: String
    })
  }

  /** Lifecycle Yeoman **/

  initializing () {
  }

  prompting () {
    const done = this.async()
    const pipeline = [
      {
        type: 'input',
        name: 'name',
        message: 'Entre com o nome do projeto',
        default: this.options.appname
      }, {
        type: 'input',
        name: 'url',
        message: 'Entre com url do template base:',
        default: this.options.url
      }, {
        type: 'confirm',
        name: 'spa',
        message: 'O projeto é um single page app (SPA)?',
        default: true
      }
    ]

    // Get and save infos
    this
      .prompt(pipeline)
      .then(answers => {
        this.log('appname:', answers.name)
        this.log('url:', answers.url)
        this.log('spa:', answers.spa)
        done()
      })
  }

  configuring () {
    this.log('\nconfiguring -> Saving configurations and configure the project (creating .editorconfig files and other metadata files)')

    // clone template
    this.config.set('dest', 'landing')
    this._asyncLoadTemplate(this.templatePath())

    // Save configs
    this.config.save()

    // TODO: Copy files from template
    // this.c
  }

  writing () {
    this.log('\nwriting -> Where you write the generator specific files (routes, controllers, etc)')

    // TODO: Edit files from template
  }

  install () {
    this.log('\ninstall -> Where installations are run (npm, bower)')

    // TODO: Install dependencies
  }

  end () {
    this.log('\nend -> Called last, cleanup, say good bye, etc')

    // TODO: Remove template clonned
  }

  // Others

  // default () {
  //   this.log('\ndefault ->  If the method name doesn’t match a priority, it will be pushed to this group.')
  // }

  conflicts () {
    // this.log('\nconflicts -> Where conflicts are handled (used internally)')
  }

  _asyncLoadTemplate (cwd) {
    const done = this.async()
    const opts = { cwd }
    const folderName = this.config.get('dest')
    exec(
      `if [ ! -e ${folderName} ]; then git clone ${this.options.url} -b landing ${folderName}; fi `,
      opts,
      (err, stdout, stderr) => done(err)
    )
  }

  // asyncTest () {
  //   return new Promise(
  //     (resolve, reject) => {
  //       setTimeout(() => {
  //         this.log('\n\nXOXOXOXO\n\n')
  //         resolve(123)
  //       }, 2000)
  //     })
  //     .then(this.log)

  //   // const done = this.async()
  //   // return setTimeout(() => {
  //   //   this.log('\n\nXOXOXOXO\n\n')
  //   //   done()
  //   // }, 2000)
  // }
}

module.exports = App
