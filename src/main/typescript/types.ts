export type Maybe<T> = T
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  _FieldSet: any
}

export interface Query {
  __typename?: 'Query'
  app?: Maybe<Application>
  me?: Maybe<User>
}

export interface Application {
  __typename?: '_Application'
  id: Scalars['ID']
  version?: Maybe<Scalars['String']>
}

export interface User {
  __typename?: '_User'
  id?: Maybe<Scalars['ID']>
  roles?: Maybe<Array<Maybe<Scalars['String']>>>
}
