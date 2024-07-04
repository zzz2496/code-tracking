/* tslint:disable */
/* eslint-disable */
/**
*/
export function setup(): void;


type SuperUserAuth = {
	username: string;
	password: string;
};

type NamespaceUserAuth = {
	namespace: string;
	username: string;
	password: string;
};

type DatabaseUserAuth = {
	namespace: string;
	database: string;
	username: string;
	password: string;
};

type ScopeUserAuth = {
	namespace: string;
	database: string;
	scope: string;
	[k: string]: unknown;
};

type AnyAuth = SuperUserAuth | NamespaceUserAuth | DatabaseUserAuth | ScopeUserAuth;

type CapabilitiesAllowDenyList = {
	allow?: boolean | string[];
	deny?: boolean | string[];
};

type ConnectionOptions = {
    capacity?: number;
	strict?: boolean;
	notifications?: boolean;
	query_timeout?: number;
	transaction_timeout?: number;
	tick_interval?: number;
	user?: AnyAuth;
	capabilities?: boolean | {
		guest_access?: boolean;
		functions?: boolean | string[] | CapabilitiesAllowDenyList;
		network_targets?: boolean | string[] | CapabilitiesAllowDenyList;
	}
}

type UseOptions = {
	namespace?: string;
	database?: string;
};

type BasePatch<T = string> = {
	path: T;
};

export type AddPatch<T = string, U = unknown> = BasePatch<T> & {
	op: "add";
	value: U;
};

export type RemovePatch<T = string> = BasePatch<T> & {
	op: "remove";
};

export type ReplacePatch<T = string, U = unknown> = BasePatch<T> & {
	op: "replace";
	value: U;
};

export type ChangePatch<T = string, U = string> = BasePatch<T> & {
	op: "change";
	value: U;
};

export type Patch =
	| AddPatch
	| RemovePatch
	| ReplacePatch
	| ChangePatch;


/**
*/
export class IntoUnderlyingByteSource {
  free(): void;
/**
* @param {ReadableByteStreamController} controller
*/
  start(controller: ReadableByteStreamController): void;
/**
* @param {ReadableByteStreamController} controller
* @returns {Promise<any>}
*/
  pull(controller: ReadableByteStreamController): Promise<any>;
/**
*/
  cancel(): void;
/**
*/
  readonly autoAllocateChunkSize: number;
/**
*/
  readonly type: string;
}
/**
*/
export class IntoUnderlyingSink {
  free(): void;
/**
* @param {any} chunk
* @returns {Promise<any>}
*/
  write(chunk: any): Promise<any>;
/**
* @returns {Promise<any>}
*/
  close(): Promise<any>;
/**
* @param {any} reason
* @returns {Promise<any>}
*/
  abort(reason: any): Promise<any>;
}
/**
*/
export class IntoUnderlyingSource {
  free(): void;
/**
* @param {ReadableStreamDefaultController} controller
* @returns {Promise<any>}
*/
  pull(controller: ReadableStreamDefaultController): Promise<any>;
/**
*/
  cancel(): void;
}
/**
*/
export class Surreal {
  free(): void;
/**
* Construct the database engine
*
* ```js
* const db = new Surreal();
* ```
*/
  constructor();
/**
* Connect to a database engine
*
* ```js
* const db = new Surreal();
*
* // Connect to a WebSocket engine
* await db.connect('ws://localhost:8000');
*
* // Connect to an HTTP engine
* await db.connect('http://localhost:8000');
*
* // Connect to a memory engine
* await db.connect('mem://');
*
* // Connect to an IndxDB engine
* await db.connect('indxdb://MyDatabase');
*
* // Limit number of concurrent connections
* await db.connect('indxdb://MyDatabase', { capacity: 100000 });
*
* // Enable strict mode on a local engine
* await db.connect('indxdb://MyDatabase', { strict: true });
*
* // Set query timeout time in seconds
* await db.connect('indxdb://MyDatabase', { query_timeout: 60 });
*
* // Set transaction timeout time in seconds
* await db.connect('indxdb://MyDatabase', { transaction_timeout: 60 });
*
* // Set changefeeds tick interval in seconds
* await db.connect('indxdb://MyDatabase', { tick_interval: 60 });
*
* // Configure a system user
* await db.connect('indxdb://MyDatabase', { user: { username: "root", password: "root" } });
*
* // Enable all capabilities
* await db.connect('indxdb://MyDatabase', { capabilities: true });
*
* // Disable all capabilities
* await db.connect('indxdb://MyDatabase', { capabilities: false });
*
* // Allow guest access
* await db.connect('indxdb://MyDatabase', { capabilities: { guest_access: true } });
*
* // Enable live query notifications
* await db.connect('indxdb://MyDatabase', { capabilities: { live_query_notifications: true } });
*
* // Allow all SurrealQL functions
* await db.connect('indxdb://MyDatabase', { capabilities: { functions: true } });
*
* // Disallow all SurrealQL functions
* await db.connect('indxdb://MyDatabase', { capabilities: { functions: false } });
*
* // Allow only certain SurrealQL functions
* await db.connect('indxdb://MyDatabase', { capabilities: { functions: ["fn", "string", "array::join"] } });
*
* // Allow and disallow certain SurrealQL functions
* await db.connect('indxdb://MyDatabase', {
*     capabilities: {
*         functions: {
*             allow: ["fn", "string", "array::join"], // You can also use `true` or `false` here to allow all or allow none
*             deny: ["array"],                        // You can also use `true` or `false` here to deny all or deny none
*         },
*     },
* });
*
* // Allow all network targets
* await db.connect('indxdb://MyDatabase', { capabilities: { network_targets: true } });
*
* // Disallow all network targets
* await db.connect('indxdb://MyDatabase', { capabilities: { network_targets: false } });
*
* // Allow only certain network targets
* await db.connect('indxdb://MyDatabase', { capabilities: { network_targets: ["http"] } });
*
* // Allow and disallow certain network targets
* await db.connect('indxdb://MyDatabase', {
*     capabilities: {
*         network_targets: {
*             allow: ["http"],                      // You can also use `true` or `false` here to allow all or allow none
*             deny: ["ssh"],                        // You can also use `true` or `false` here to deny all or deny none
*         },
*     },
* });
* ```
* @param {string} endpoint
* @param {ConnectionOptions | undefined} [opts]
* @returns {Promise<void>}
*/
  connect(endpoint: string, opts?: ConnectionOptions): Promise<void>;
/**
* Switch to a specific namespace or database
*
* ```js
* const db = new Surreal();
*
* // Switch to a namespace
* await db.use({ namespace: 'namespace' });
*
* // Switch to a database
* await db.use({ database: 'database' });
*
* // Switch both
* await db.use({ namespace: 'namespace', database: 'database' });
* ```
* @param {UseOptions | undefined} [opts]
* @returns {Promise<void>}
*/
  use(opts?: UseOptions): Promise<void>;
/**
* Assign a value as a parameter for this connection
*
* ```js
* await db.set('name', { first: 'Tobie', last: 'Morgan Hitchcock' });
* ```
* @param {string} key
* @param {unknown} value
* @returns {Promise<void>}
*/
  set(key: string, value: unknown): Promise<void>;
/**
* Remove a parameter from this connection
*
* ```js
* await db.unset('name');
* ```
* @param {string} key
* @returns {Promise<void>}
*/
  unset(key: string): Promise<void>;
/**
* Sign up a user to a specific authentication scope
*
* ```js
* const token = await db.signup({
*     namespace: 'namespace',
*     database: 'database',
*     scope: 'user_scope',
*     email: 'john.doe@example.com',
*     password: 'password123'
* });
* ```
* @param {ScopeUserAuth} credentials
* @returns {Promise<string>}
*/
  signup(credentials: ScopeUserAuth): Promise<string>;
/**
* Sign this connection in to a specific authentication scope
*
* ```js
* const token = await db.signin({
*     namespace: 'namespace',
*     database: 'database',
*     scope: 'user_scope',
*     email: 'john.doe@example.com',
*     password: 'password123'
* });
* ```
* @param {AnyAuth} credentials
* @returns {Promise<string>}
*/
  signin(credentials: AnyAuth): Promise<string>;
/**
* Invalidates the authentication for the current connection
*
* ```js
* await db.invalidate();
* ```
* @returns {Promise<void>}
*/
  invalidate(): Promise<void>;
/**
* Authenticates the current connection with a JWT token
*
* ```js
* await db.authenticate('<secret token>');
* ```
* @param {string} token
* @returns {Promise<boolean>}
*/
  authenticate(token: string): Promise<boolean>;
/**
* Run a SurrealQL query against the database
*
* ```js
* // Run a query without bindings
* const people = await db.query('SELECT * FROM person');
*
* // Run a query with bindings
* const people = await db.query('SELECT * FROM type::table($table)', { table: 'person' });
* ```
* @param {string} sql
* @param {Record<string, unknown> | undefined} [bindings]
* @returns {Promise<unknown[]>}
*/
  query(sql: string, bindings?: Record<string, unknown>): Promise<unknown[]>;
/**
* Select all records in a table, or a specific record
*
* ```js
* // Select all records from a table
* const people = await db.select('person');
*
* // Select a range records from a table
* const people = await db.select('person:jane..john');
*
* // Select a specific record from a table
* const person = await db.select('person:h5wxrf2ewk8xjxosxtyc');
* ```
* @param {string} resource
* @returns {Promise<Record<string, unknown>[]>}
*/
  select(resource: string): Promise<Record<string, unknown>[]>;
/**
* Live select all records in a table, or a specific record
*
* ```js
* // Live select all records from a table
* const stream = await db.live('person');
*
* // Live select a range records from a table
* const stream = await db.live('person:jane..john');
*
* // Live select a specific record from a table
* const stream = await db.live('person:jane');
*
* // Get a reader
* const reader = stream.getReader();
*
* // Listen for changes
* while (true) {
*   // Read from the stream
*   const {done, notification} = await reader.read();
*
*   // Do something with each notification
*   console.log(notification);
*
*   // Exit the loop if done
*   if (done) break;
* }
* ```
* @param {string} resource
* @returns {Promise<ReadableStream>}
*/
  live(resource: string): Promise<ReadableStream>;
/**
* Create a record in the database
*
* ```js
* // Create a record with no fields set
* const person = await db.create('person');
*
* Create a record with fields set
* const person = await db.create('person', {
*     name: 'Tobie',
*     settings: {
*         active: true,
*         marketing: true
*     }
* });
* ```
* @param {string} resource
* @param {Record<string, unknown> | undefined} [data]
* @returns {Promise<Record<string, unknown>[]>}
*/
  create(resource: string, data?: Record<string, unknown>): Promise<Record<string, unknown>[]>;
/**
* Update all records in a table, or a specific record
*
* ```js
* // Replace all records in a table with the specified data.
* const people = await db.update('person', {
*     name: 'Tobie',
*     settings: {
*         active: true,
*         marketing: true
*     }
* });
*
* // Replace a range of records with the specified data.
* const person = await db.update('person:jane..john', {
*     name: 'Tobie',
*     settings: {
*         active: true,
*         marketing: true
*     }
* });
*
* // Replace the current document / record data with the specified data.
* const person = await db.update('person:tobie', {
*     name: 'Tobie',
*     settings: {
*         active: true,
*         marketing: true
*     }
* });
* ```
* @param {string} resource
* @param {Record<string, unknown> | undefined} [data]
* @returns {Promise<Record<string, unknown>[]>}
*/
  update(resource: string, data?: Record<string, unknown>): Promise<Record<string, unknown>[]>;
/**
* Merge records in a table with specified data
*
* ```js
* // Merge all records in a table with specified data.
* const person = await db.merge('person', {
*     marketing: true
* });
*
* // Merge a range of records with the specified data.
* const person = await db.merge('person:jane..john', {
*     marketing: true
* });
*
* // Merge the current document / record data with the specified data.
* const person = await db.merge('person:tobie', {
*     marketing: true
* });
* ```
* @param {string} resource
* @param {Record<string, unknown>} data
* @returns {Promise<Record<string, unknown>[]>}
*/
  merge(resource: string, data: Record<string, unknown>): Promise<Record<string, unknown>[]>;
/**
* Patch all records in a table or a specific record
*
* ```js
* // Apply JSON Patch changes to all records in the database.
* const person = await db.patch('person', [{
*     op: 'replace',
*     path: '/settings/active',
*     value: false
* }]);
*
* // Apply JSON Patch to a range of records.
* const person = await db.patch('person:jane..john', [{
*     op: 'replace',
*     path: '/settings/active',
*     value: false
* }]);
*
* // Apply JSON Patch to a specific record.
* const person = await db.patch('person:tobie', [{
*     op: 'replace',
*     path: '/settings/active',
*     value: false
* }]);
* ```
* @param {string} resource
* @param {Patch[]} data
* @returns {Promise<Record<string, unknown>[]>}
*/
  patch(resource: string, data: Patch[]): Promise<Record<string, unknown>[]>;
/**
* Delete all records, or a specific record
*
* ```js
* // Delete all records from a table
* const records = await db.delete('person');
*
* // Delete a range records from a table
* const people = await db.delete('person:jane..john');
*
* // Delete a specific record from a table
* const record = await db.delete('person:h5wxrf2ewk8xjxosxtyc');
* ```
* @param {string} resource
* @returns {Promise<Record<string, unknown>[]>}
*/
  delete(resource: string): Promise<Record<string, unknown>[]>;
/**
* Return the version of the server
*
* ```js
* const version = await db.version();
* ```
* @returns {Promise<string>}
*/
  version(): Promise<string>;
/**
* Check whether the server is healthy or not
*
* ```js
* await db.health();
* ```
* @returns {Promise<void>}
*/
  health(): Promise<void>;
}
