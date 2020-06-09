import { Ioptions, Idatabasetype } from "./interface";
const fse = require("fs-extra");
const chalk = require("chalk");
export const inject = (options: Ioptions) => {
  const projectDir = options.projectName.trim();
  console.log(options);
  let dbTypeDriver: any;

  let typeormDatabaseDriverMap: Idatabasetype = {
    mssql: "mssql",
    mysql: "mysql",
    sqlite: "sqlite3",
    cockroachdb: "pg",
    postgres: "pg",
    oracle: "oracledb",
    mariadb: "mysql",
  };

  const tsconfigJson = {
    compilerOptions: {
      module: "commonjs",
      esModuleInterop: true,
      target: "es6",
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      moduleResolution: "node",
      sourceMap: true,
      outDir: "dist",
      resolveJsonModule: true,
    },
    lib: ["es2015"],
    exclude: ["node_modules", "**/__tests__/*"],
  };
  const packageJson = {
    name: options.projectName,
    version: "0.0.1",
    description: "A minimal project structure",
    license: options.porjectLicense,
    script: { test: "echo run some tests!" },
    author: options.projectAuthor,
    dependencies: {
      "reflect-metadata": "^0.1.10",
      typeorm: "latest",
      express: "^4.17.1",
      dotenv: "^8.2.0",
    },
    devDependencies: {
      tslint: "~5.11.0",
      "@types/node": "^14.0.11",
      typescript: "^3.9.5",
    },
  };
  if (options.databaseType) {
    dbTypeDriver = (typeormDatabaseDriverMap as any)[
      options.databaseType
    ] as string;
    Object.assign(packageJson["dependencies"], { [dbTypeDriver]: "latest" });
  }

  const print = (msg: string, type: string) => {
    const error = chalk.red,
      success = chalk.blue,
      warning = chalk.keyword("orange");
    switch (type) {
      case "E":
        console.log(error(`${msg} \u2715`));
        break;
      case "S":
        console.log(success(`${msg} \u2713`));
        break;
      case "W":
        console.log(warning(`${msg} \u0021`));
        break;
      default:
        console.log(msg);
    }
  };

  fse.ensureDir(projectDir, (err: any) => {
    if (err) {
      print(err, "E");
      process.exit(1);
    }
    print("1. Project Directory created", "S");
    // process.chdir(projectDir);
    fse.writeJson(
      `${projectDir}/package.json`,
      packageJson,
      { spaces: "\t" },
      (err: any) => {
        if (err) {
          print(err, "E");
        }
        print("2. Package JSON created", "S");
      }
    );
    // tsconfig.json
    fse.writeJson(
      `${projectDir}/tsconfig.json`,
      tsconfigJson,
      { spaces: "\t" },
      (err: any) => {
        if (err) {
          print(err, "E");
        }
        print("3. tsconfig.json created", "S");
      }
    );
  });
};
