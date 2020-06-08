import { inject } from "./inject"
export const promptsFn = () => {
  const prompts = require("prompts");
  const properties = [
    {
      type: "text",
      name: "projectName",
      message: "Project name:",
      validate: (projectName: string) => projectName.match(/^[a-zA-Z0-9\s\-_]+$/) ? true : "Project name must only conaton letters, numbers or dashes",
    },
    {
      type: "text",
      name: "projectAuthor",
      validate: (username: string) => username.match(/^[a-zA-Z\s\-]+$/) ? true : "Username must be only letters, spaces, or dashes",
      message: "Author name: ",
    },
    {
      type: "text",
      name: "porjectLicense",
      message: "License (MIT):",
    },
    {
      type: 'select',
      name: 'databaseType',
      message: 'Pick a Databse Type:',
      choices: [
        { title: 'MySQL', value: 'mysql' },
        { title: 'PostgreSQL', value: 'postgres' },
        { title: 'SQLite', value: 'sqlite' },
        { title: 'MSSql', value: 'mssql' },
        { title: 'Oracle', value: 'oracle' },
        { title: 'CockroachDB', value: 'cockroachdb'},
        { title: 'MariaDB', value: 'mariadb'}
      ],
      initial: 0
    }
  ];

  (async () => {
    const result = await prompts(properties);
    // console.log("  Username: " + result.username);
    // console.log("  Password: " + result.password);
    // console.log("  Project: " + result.projectName);
    inject(result);
  })();
};
