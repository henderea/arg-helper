const fs = require('fs');
const escalade = require('escalade/sync');

class ArgParser {
  constructor(arg) {
    this._arg = arg;
    this._opts = {};
    this._names = {};
    this._helpText = null;
    this._packageJsonFile = null;
  }

  flag(name, ...names) {
    let type = names.pop();
    let mainName = names.shift();
    this._opts[mainName] = type;
    this._names[mainName] = name;
    if(names.length > 0) {
      names.forEach((n) => {
        this._opts[n] = mainName;
      });
    }
    return this;
  }
  flags(name, ...names) {
    let type = names.pop();
    return this.flag(name, ...names, [type]);
  }

  string(name, ...names) { return this.flag(name, ...names, String); }
  strings(name, ...names) { return this.flags(name, ...names, String); }
  bool(name, ...names) { return this.flag(name, ...names, Boolean); }
  bools(name, ...names) { return this.flags(name, ...names, Boolean); }
  number(name, ...names) { return this.flag(name, ...names, Number); }
  numbers(name, ...names) { return this.flags(name, ...names, Number); }
  count(name, ...names) { return this.flag(name, ...names, this._arg.COUNT); }
  help(helpText, ...names) {
    this._helpText = helpText;
    return this.bool('help', ...names);
  }
  findVersion(callerPath, ...names) {
    const packageJsonFile = escalade(callerPath, (dir, fileNames) => fileNames.includes('package.json') && 'package.json');
    if(packageJsonFile && fs.existsSync(packageJsonFile)) {
      this.version(packageJsonFile, ...names);
    }
    return this;
  }
  version(packageJsonFile, ...names) {
    this._packageJsonFile = packageJsonFile;
    return this.bool('version', ...names);
  }

  parse(argv = null) {
    let config = { permissive: true };
    if(argv !== null) { config.argv = argv; }
    let options = this._arg(this._opts, config);
    let rv = {};
    Object.keys(options).forEach((k) => {
      rv[k] = options[k];
      if(Object.prototype.hasOwnProperty.call(this._names, k)) {
        rv[this._names[k]] = options[k];
      }
    });
    if(this._helpText && rv.help) {
      console.log(this._helpText);
      process.exit(0);
    }
    if(rv.version && this._packageJsonFile && fs.existsSync(this._packageJsonFile)) {
      const packageJson = JSON.parse(fs.readFileSync(this._packageJsonFile));
      const version = packageJson.version;
      if(version) {
        console.log(version);
        process.exit(0);
      }
    }
    return rv;
  }

  get argv() {
    return this.parse();
  }

  static terminalWidth(multiplier = 1) {
    const cols = process.stdout.columns;
    if(cols) {
      return Math.round(cols * multiplier);
    }
    return undefined;
  }
}

module.exports = (arg) => {
  const argParser = () => new ArgParser(arg);
  argParser.terminalWidth = ArgParser.terminalWidth;
  return { argParser };
};
