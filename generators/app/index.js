const Generator = require('yeoman-generator')

/**
 * Base Generator
 *
 * @class App
 * @extends {Generator}
 */
class App extends Generator {
  /**
   * Creates an instance of App.
   *
   * @param {*} args
   * @param {*} opts
   * @memberof App
   */
  constructor (args, opts) {
    super(args, opts)

    // Set options
    this.argument('appname', {
      desc: 'Project Name',
      // default: 'bussola-project'
      required: false,
      type: String
    })

    this.log(this.options.appname)

    // Save configs
    this.config.save()
  }

  /** Lifecycle Yeoman **/

  initializing () {
    // this.log('\ninitializing -> Your initialization methods (checking current project state, getting configs, etc)')
  }

  prompting () {
    const pipeline = [
      {
        type: 'input',
        name: 'name',
        message: 'Entre com o nome do projeto',
        default: this.options.appname
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
        this.log('app name', answers.name)
        this.log('spa', answers.spa)
      })
  }

  configuring () {
    // this.log('\nconfiguring -> Saving configurations and configure the project (creating .editorconfig files and other metadata files)')
  }

  writing () {
    // this.log('\nwriting -> Where you write the generator specific files (routes, controllers, etc)')
  }

  install () {
    // this.log('\ninstall -> Where installations are run (npm, bower)')
  }

  end () {
    // this.log('\nend -> Called last, cleanup, say good bye, etc')
  }

  // Others

  // default () {
  //   this.log('\ndefault ->  If the method name doesn’t match a priority, it will be pushed to this group.')
  // }

  conflicts () {
    // this.log('\nconflicts -> Where conflicts are handled (used internally)')
  }

  asyncTest () {
    return new Promise(
      (resolve, reject) => {
        setTimeout(() => {
          this.log('\n\nXOXOXOXO\n\n')
          resolve(123)
        }, 2000)
      })
      .then(this.log)

    // const done = this.async()
    // return setTimeout(() => {
    //   this.log('\n\nXOXOXOXO\n\n')
    //   done()
    // }, 2000)
  }
}

module.exports = App
