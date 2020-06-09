export interface Ioptions {
  projectName: string;
  projectAuthor?: string;
  porjectLicense?: string;
  databaseType?: string;
}

export interface Idatabasetype {
  mssql: string;
  mysql: string;
  sqlite: string;
  cockroachdb: string;
  postgres: string;
  oracle: string;
  mariadb: string;
}
