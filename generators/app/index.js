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
      this.config.set('appname', this.options.appname)
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

    // Get and save prompt's infos
    this
      .prompt(pipeline)
      .then(data => {
        // Define destination
        this.destinationRoot(data.name)
        this.config.set('appname', data.name)

        done()
      })
  }

  configuring () {
    // clone template
    this._loadTemplate('landing')

    // Copy files from template
    this.fs.copy(
      this.templatePath('landing'),
      this.destinationRoot()
    )

    // Copy hidden files
    this._loadHiddenFiles([
      'gitignore',
      'babelrc'
    ])
  }

  writing () {
    const pkgJson = require(this.templatePath('landing/package.json'))

    // overwrite package.json
    this.fs.extendJSON(this.destinationPath('package.json'), {
      ...pkgJson,
      name: this.config.get('appname'),
      version: '1.0.0',
      description: '',
      author: ''
    })
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

  // Private functions

  _loadTemplate (folder) {
    const done = this.async()
    const opts = {
      cwd: this.templatePath()
    }

    // Clone if template isn't there
    const cmd = `
    if [ ! -e ${folder} ]; then
      git clone ${this.options.url} -b landing ${folder};
    fi`

    this.config.set('dest', folder)
    exec(cmd, opts, (err, stdout, stderr) => done(err))
  }

  _gitInit () {
    const done = this.async()
    const cmd = `
      git init && git add . && git commit -m 'Initial Commit'
    `

    exec(
      cmd,
      { cwd: this.destinationPath() },
      (err, stdout, stderr) => done(err)
    )
  }

  _loadHiddenFiles (list) {
    list.map(item => {
      this.fs.copy(
        this.templatePath(`landing/.${item}`),
        this.destinationPath(`.${item}`)
      )
    })
  }
}

module.exports = App
