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
    // If already have a name, go foward
    if (this.options.appname) {
      // Define destination
      this.destinationRoot(this.options.appname)
      return
    }

    const done = this.async()
    const pipeline = [
      {
        type: 'input',
        name: 'name',
        message: 'Entre com o nome do projeto',
        required: true,
        default: 'my-project'
      }
    ]

    // Get and save infos
    this
      .prompt(pipeline)
      .then(data => {
        // Define destination
        this.destinationRoot(data.name)

        done()
      })
  }

  configuring () {
    // this.log('\nconfiguring -> Saving configurations and configure the project (creating .editorconfig files and other metadata files)')

    // clone template
    this.config.set('dest', 'landing')
    this._asyncLoadTemplate(this.templatePath())

    // Save configs
    this.config.save()

    // Copy files from template
    this.fs.copy(
      this.templatePath('landing'),
      this.destinationRoot()
    )

    // Copy hidden files
    const hiddenFiles = [
      'gitignore',
      'babelrc'
    ]
    hiddenFiles.map(item => {
      this.fs.copy(
        this.templatePath(`landing/.${item}`),
        this.destinationPath(`.${item}`)
      )
    })
  }

  writing () {
    this.log('\nwriting -> Where you write the generator specific files (routes, controllers, etc)')

    // TODO: Edit files from template
    // TODO:  - package.json
  }

  install () {
    // Install dependencies
    this
      .installDependencies({
        yarn: true,
        npm: false,
        bower: false
      })
      .then(() => this._gitInit())
  }

  end () {
    // this.log('\nend -> Called last, cleanup, say good bye, etc')

    // TODO: Remove template clonned
  }

  // Private functions

  _asyncLoadTemplate (cwd) {
    const done = this.async()
    const opts = { cwd }
    const folderName = this.config.get('dest')
    const cmd = `
    if [ ! -e ${this.templatePath(folderName)} ]; then
      git clone ${this.options.url} -b landing ${folderName};
    fi`

    exec(cmd, opts, (err, stdout, stderr) => done(err))
  }

  _gitInit () {
    const done = this.async()
    const cmd = `
      git init && git add . && git commit -m "Initial Commit"
    `

    exec(
      cmd,
      { cwd: this.destinationPath() },
      (err, stdout, stderr) => done(err)
    )
  }
}

module.exports = App
