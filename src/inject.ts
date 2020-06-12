import { Ioptions, Idatabasetype } from "./interface";
const fse = require("fs-extra");
const chalk = require("chalk");
const fetch = require('node-fetch');

export const inject = (options: Ioptions) => {

    const projectDir = options.projectName.trim();
    let dbTypeDriver: any;
    const tseoAssets = ['server.ts', 'app.ts', 'db.ts', 'model.ts', 'checkAuth.ts']

    let typeormDatabaseDriverMap: Idatabasetype = {
        mssql: "mssql",
        mysql: "mysql",
        sqlite: "sqlite3",
        cockroachdb: "pg",
        postgres: "pg",
        oracle: "oracledb",
        mariadb: "mysql",
    };

    const envContent = [
                        {key: "DB_SERVER", value: 'localhost'},
                        {key: "DB_PORT", value: '5432'},
                        {key: "DB_USER", value: 'test'},
                        {key: "DB_PASSWORD", value: 'test' },
                        {key: "DB_TYPE", value: options.databaseType},
                        {key: "DB_NAME", value: 'tseo'},
                        {key: "JWT_SECRET", value: 'mytseosecret'}
                    ]

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
        scripts: { 
          "test": "echo run some tests!",
          "start": "ts-node src/index.ts" 
        },
        author: options.projectAuthor,
        dependencies: {
            "reflect-metadata": "^0.1.10",
            typeorm: "latest",
            express: "^4.17.1",
            "@types/express": "4.17.1",
            dotenv: "^8.2.0",
            "cors": "^2.8.4",
            "express-bearer-token": "2.2.0",
            "jsonwebtoken": "^8.5.1",
            "ldapjs": "^2.0.0",
            "nodemon": "^2.0.4",
        },
        devDependencies: {
            tslint: "~5.11.0",
            "@types/node": "^14.0.11",
            typescript: "^3.9.5",
            "@types/cors": "^2.8.4",
            "ts-node": "^8.10.2"
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
                console.log(error(`\u2715 ${msg}`));
                break;
            case "S":
                console.log(success(`\u2713 ${msg}`));
                break;
            case "W":
                console.log(warning(`\u0021 ${msg}`));
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
        print("Project Directory created", "S");

        fse.writeJson(`${projectDir}/package.json`, packageJson, { spaces: "\t" }, (err: any) => {
                if (err) {
                    print(err, "E");
                    process.exit(1);
                }
                print("package.json created", "S");
            }
        );
        // tsconfig.json
        fse.writeJson(`${projectDir}/tsconfig.json`, tsconfigJson, { spaces: "\t" }, (err: any) => {
                if (err) {
                    print(err, "E");
                    process.exit(1);
                }
                print("tsconfig.json created", "S");
            }
        );

        // add .env
        let envData = ''
        envContent.forEach((val: {key:string, value:string | undefined}) => {
            envData +=  `${val.key}=${val.value}\n`;
        })
        envData = envData.trim()
        fse.writeFile(`${projectDir}/.env`, envData, (err: string)=>{
            if(err){
                print(err, 'E');
                process.exit(1)
            } else{
                print(".env created", 'S')
            }
        })
        // get server.ts
        let response, respBody;
        tseoAssets.forEach((val: string)=>{
            (async(fileName: string)=>{
                    response = await fetch(`https://raw.githubusercontent.com/amjha/tseo-assets/master/${fileName}`);
                    
                    if(response.status == 200){
                        respBody = await response.text();
                        fse.outputFile(`${projectDir}/src/${fileName}`, respBody, (err: string)=>{
                            if(err) print(err, 'E')
                            else print(`${fileName} created`, "S");
                        })
                    } else{
                        print(`${response.status}: ${fileName} could not be retrieved. Check your network connection!`, 'E');
                    }
            })(val);
        })
    });
};