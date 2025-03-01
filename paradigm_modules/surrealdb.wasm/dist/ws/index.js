// compiled/ws/shimmed.js
var Deno = globalThis.Deno ?? (typeof global === "undefined" ? void 0 : {
  readFile: (await import("node:fs")).readFileSync
});
var module = await (async () => {
  const crypto = globalThis.crypto ?? await import("node:crypto");
  return {
    require: (string) => {
      if (string !== "crypto")
        throw new Error("Unexpected require " + string);
      return crypto;
    }
  };
})();
var heap = new Array(128).fill(void 0);
heap.push(void 0, null, true, false);
function getObject(idx) {
  return heap[idx];
}
function isLikeNone(x) {
  return x === void 0 || x === null;
}
var cachedFloat64Memory0 = null;
function getFloat64Memory0() {
  if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
    cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
  }
  return cachedFloat64Memory0;
}
var cachedInt32Memory0 = null;
function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}
var WASM_VECTOR_LEN = 0;
var cachedUint8Memory0 = null;
function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}
var cachedTextEncoder = typeof TextEncoder !== "undefined" ? new TextEncoder("utf-8") : { encode: () => {
  throw Error("TextEncoder not available");
} };
var encodeString = function(arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
};
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length, 1) >>> 0;
    getUint8Memory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8Memory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127)
      break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
var heap_next = heap.length;
function addHeapObject(obj) {
  if (heap_next === heap.length)
    heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];
  heap[idx] = obj;
  return idx;
}
var cachedTextDecoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }) : { decode: () => {
  throw Error("TextDecoder not available");
} };
if (typeof TextDecoder !== "undefined") {
  cachedTextDecoder.decode();
}
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
function dropObject(idx) {
  if (idx < 132)
    return;
  heap[idx] = heap_next;
  heap_next = idx;
}
function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
var cachedBigInt64Memory0 = null;
function getBigInt64Memory0() {
  if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.byteLength === 0) {
    cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
  }
  return cachedBigInt64Memory0;
}
function debugString(val) {
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    return toString.call(val);
  }
  if (className == "Object") {
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  if (val instanceof Error) {
    return `${val.name}: ${val.message}
${val.stack}`;
  }
  return className;
}
var CLOSURE_DTORS = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((state) => {
  wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
});
function makeMutClosure(arg0, arg1, dtor, f) {
  const state = { a: arg0, b: arg1, cnt: 1, dtor };
  const real = (...args) => {
    state.cnt++;
    const a = state.a;
    state.a = 0;
    try {
      return f(a, state.b, ...args);
    } finally {
      if (--state.cnt === 0) {
        wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);
        CLOSURE_DTORS.unregister(state);
      } else {
        state.a = a;
      }
    }
  };
  real.original = state;
  CLOSURE_DTORS.register(real, state, state);
  return real;
}
function __wbg_adapter_50(arg0, arg1, arg2) {
  wasm.__wbindgen_export_3(arg0, arg1, addHeapObject(arg2));
}
function __wbg_adapter_53(arg0, arg1, arg2) {
  wasm.__wbindgen_export_4(arg0, arg1, addHeapObject(arg2));
}
function __wbg_adapter_56(arg0, arg1) {
  wasm.__wbindgen_export_5(arg0, arg1);
}
function __wbg_adapter_59(arg0, arg1, arg2) {
  wasm.__wbindgen_export_6(arg0, arg1, addHeapObject(arg2));
}
function setup() {
  wasm.setup();
}
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_export_8(addHeapObject(e));
  }
}
function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
function __wbg_adapter_234(arg0, arg1, arg2, arg3) {
  wasm.__wbindgen_export_9(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}
var IntoUnderlyingByteSourceFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_intounderlyingbytesource_free(ptr >>> 0));
var IntoUnderlyingByteSource = class {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    IntoUnderlyingByteSourceFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_intounderlyingbytesource_free(ptr);
  }
  /**
  * @returns {string}
  */
  get type() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.intounderlyingbytesource_type(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export_7(deferred1_0, deferred1_1, 1);
    }
  }
  /**
  * @returns {number}
  */
  get autoAllocateChunkSize() {
    const ret = wasm.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
  * @param {ReadableByteStreamController} controller
  */
  start(controller) {
    wasm.intounderlyingbytesource_start(this.__wbg_ptr, addHeapObject(controller));
  }
  /**
  * @param {ReadableByteStreamController} controller
  * @returns {Promise<any>}
  */
  pull(controller) {
    const ret = wasm.intounderlyingbytesource_pull(this.__wbg_ptr, addHeapObject(controller));
    return takeObject(ret);
  }
  /**
  */
  cancel() {
    const ptr = this.__destroy_into_raw();
    wasm.intounderlyingbytesource_cancel(ptr);
  }
};
var IntoUnderlyingSinkFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_intounderlyingsink_free(ptr >>> 0));
var IntoUnderlyingSink = class {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    IntoUnderlyingSinkFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_intounderlyingsink_free(ptr);
  }
  /**
  * @param {any} chunk
  * @returns {Promise<any>}
  */
  write(chunk) {
    const ret = wasm.intounderlyingsink_write(this.__wbg_ptr, addHeapObject(chunk));
    return takeObject(ret);
  }
  /**
  * @returns {Promise<any>}
  */
  close() {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.intounderlyingsink_close(ptr);
    return takeObject(ret);
  }
  /**
  * @param {any} reason
  * @returns {Promise<any>}
  */
  abort(reason) {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.intounderlyingsink_abort(ptr, addHeapObject(reason));
    return takeObject(ret);
  }
};
var IntoUnderlyingSourceFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_intounderlyingsource_free(ptr >>> 0));
var IntoUnderlyingSource = class {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(IntoUnderlyingSource.prototype);
    obj.__wbg_ptr = ptr;
    IntoUnderlyingSourceFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    IntoUnderlyingSourceFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_intounderlyingsource_free(ptr);
  }
  /**
  * @param {ReadableStreamDefaultController} controller
  * @returns {Promise<any>}
  */
  pull(controller) {
    const ret = wasm.intounderlyingsource_pull(this.__wbg_ptr, addHeapObject(controller));
    return takeObject(ret);
  }
  /**
  */
  cancel() {
    const ptr = this.__destroy_into_raw();
    wasm.intounderlyingsource_cancel(ptr);
  }
};
var SurrealFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_surreal_free(ptr >>> 0));
var Surreal = class {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    SurrealFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_surreal_free(ptr);
  }
  /**
  * Construct the database engine
  *
  * ```js
  * const db = new Surreal();
  * ```
  */
  constructor() {
    const ret = wasm.surreal_init();
    this.__wbg_ptr = ret >>> 0;
    return this;
  }
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
  connect(endpoint, opts) {
    const ptr0 = passStringToWasm0(endpoint, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.surreal_connect(this.__wbg_ptr, ptr0, len0, isLikeNone(opts) ? 0 : addHeapObject(opts));
    return takeObject(ret);
  }
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
  use(opts) {
    const ret = wasm.surreal_use(this.__wbg_ptr, isLikeNone(opts) ? 0 : addHeapObject(opts));
    return takeObject(ret);
  }
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
  set(key, value) {
    const ptr0 = passStringToWasm0(key, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.surreal_set(this.__wbg_ptr, ptr0, len0, addHeapObject(value));
    return takeObject(ret);
  }
  /**
  * Remove a parameter from this connection
  *
  * ```js
  * await db.unset('name');
  * ```
  * @param {string} key
  * @returns {Promise<void>}
  */
  unset(key) {
    const ptr0 = passStringToWasm0(key, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.surreal_unset(this.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
  }
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
  signup(credentials) {
    const ret = wasm.surreal_signup(this.__wbg_ptr, addHeapObject(credentials));
    return takeObject(ret);
  }
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
  signin(credentials) {
    const ret = wasm.surreal_signin(this.__wbg_ptr, addHeapObject(credentials));
    return takeObject(ret);
  }
  /**
  * Invalidates the authentication for the current connection
  *
  * ```js
  * await db.invalidate();
  * ```
  * @returns {Promise<void>}
  */
  invalidate() {
    const ret = wasm.surreal_invalidate(this.__wbg_ptr);
    return takeObject(ret);
  }
  /**
  * Authenticates the current connection with a JWT token
  *
  * ```js
  * await db.authenticate('<secret token>');
  * ```
  * @param {string} token
  * @returns {Promise<boolean>}
  */
  authenticate(token) {
    const ptr0 = passStringToWasm0(token, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.surreal_authenticate(this.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
  }
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
  query(sql, bindings) {
    const ptr0 = passStringToWasm0(sql, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.surreal_query(this.__wbg_ptr, ptr0, len0, isLikeNone(bindings) ? 0 : addHeapObject(bindings));
    return takeObject(ret);
  }
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
  select(resource) {
    const ptr0 = passStringToWasm0(resource, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.surreal_select(this.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
  }
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
  live(resource) {
    const ptr0 = passStringToWasm0(resource, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.surreal_live(this.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
  }
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
  create(resource, data) {
    const ptr0 = passStringToWasm0(resource, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.surreal_create(this.__wbg_ptr, ptr0, len0, isLikeNone(data) ? 0 : addHeapObject(data));
    return takeObject(ret);
  }
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
  update(resource, data) {
    const ptr0 = passStringToWasm0(resource, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.surreal_update(this.__wbg_ptr, ptr0, len0, isLikeNone(data) ? 0 : addHeapObject(data));
    return takeObject(ret);
  }
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
  merge(resource, data) {
    const ptr0 = passStringToWasm0(resource, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.surreal_merge(this.__wbg_ptr, ptr0, len0, addHeapObject(data));
    return takeObject(ret);
  }
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
  patch(resource, data) {
    const ptr0 = passStringToWasm0(resource, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.surreal_patch(this.__wbg_ptr, ptr0, len0, addHeapObject(data));
    return takeObject(ret);
  }
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
  delete(resource) {
    const ptr0 = passStringToWasm0(resource, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.surreal_delete(this.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
  }
  /**
  * Return the version of the server
  *
  * ```js
  * const version = await db.version();
  * ```
  * @returns {Promise<string>}
  */
  version() {
    const ret = wasm.surreal_version(this.__wbg_ptr);
    return takeObject(ret);
  }
  /**
  * Check whether the server is healthy or not
  *
  * ```js
  * await db.health();
  * ```
  * @returns {Promise<void>}
  */
  health() {
    const ret = wasm.surreal_health(this.__wbg_ptr);
    return takeObject(ret);
  }
};
var imports = {
  __wbindgen_placeholder__: {
    __wbindgen_is_undefined: function(arg0) {
      const ret = getObject(arg0) === void 0;
      return ret;
    },
    __wbindgen_in: function(arg0, arg1) {
      const ret = getObject(arg0) in getObject(arg1);
      return ret;
    },
    __wbindgen_number_get: function(arg0, arg1) {
      const obj = getObject(arg1);
      const ret = typeof obj === "number" ? obj : void 0;
      getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
      getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    },
    __wbindgen_boolean_get: function(arg0) {
      const v = getObject(arg0);
      const ret = typeof v === "boolean" ? v ? 1 : 0 : 2;
      return ret;
    },
    __wbindgen_string_get: function(arg0, arg1) {
      const obj = getObject(arg1);
      const ret = typeof obj === "string" ? obj : void 0;
      var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
      var len1 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len1;
      getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    },
    __wbindgen_is_bigint: function(arg0) {
      const ret = typeof getObject(arg0) === "bigint";
      return ret;
    },
    __wbindgen_is_object: function(arg0) {
      const val = getObject(arg0);
      const ret = typeof val === "object" && val !== null;
      return ret;
    },
    __wbindgen_bigint_from_i64: function(arg0) {
      const ret = arg0;
      return addHeapObject(ret);
    },
    __wbindgen_bigint_from_u64: function(arg0) {
      const ret = BigInt.asUintN(64, arg0);
      return addHeapObject(ret);
    },
    __wbindgen_error_new: function(arg0, arg1) {
      const ret = new Error(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbindgen_string_new: function(arg0, arg1) {
      const ret = getStringFromWasm0(arg0, arg1);
      return addHeapObject(ret);
    },
    __wbindgen_jsval_eq: function(arg0, arg1) {
      const ret = getObject(arg0) === getObject(arg1);
      return ret;
    },
    __wbindgen_object_drop_ref: function(arg0) {
      takeObject(arg0);
    },
    __wbg_sethighWaterMark_ea50ed3ec2143088: function(arg0, arg1) {
      getObject(arg0).highWaterMark = arg1;
    },
    __wbg_newwithintounderlyingsource_a03a82aa1bbbb292: function(arg0, arg1) {
      const ret = new ReadableStream(IntoUnderlyingSource.__wrap(arg0), takeObject(arg1));
      return addHeapObject(ret);
    },
    __wbindgen_object_clone_ref: function(arg0) {
      const ret = getObject(arg0);
      return addHeapObject(ret);
    },
    __wbindgen_jsval_loose_eq: function(arg0, arg1) {
      const ret = getObject(arg0) == getObject(arg1);
      return ret;
    },
    __wbindgen_as_number: function(arg0) {
      const ret = +getObject(arg0);
      return ret;
    },
    __wbg_String_b9412f8799faab3e: function(arg0, arg1) {
      const ret = String(getObject(arg1));
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
      const len1 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len1;
      getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    },
    __wbindgen_number_new: function(arg0) {
      const ret = arg0;
      return addHeapObject(ret);
    },
    __wbg_getwithrefkey_edc2c8960f0f1191: function(arg0, arg1) {
      const ret = getObject(arg0)[getObject(arg1)];
      return addHeapObject(ret);
    },
    __wbg_set_f975102236d3c502: function(arg0, arg1, arg2) {
      getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
    },
    __wbindgen_cb_drop: function(arg0) {
      const obj = takeObject(arg0).original;
      if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
      }
      const ret = false;
      return ret;
    },
    __wbindgen_is_string: function(arg0) {
      const ret = typeof getObject(arg0) === "string";
      return ret;
    },
    __wbg_performance_1430613edb72ce03: function(arg0) {
      const ret = getObject(arg0).performance;
      return addHeapObject(ret);
    },
    __wbg_now_eab901b1d3b8a295: function(arg0) {
      const ret = getObject(arg0).now();
      return ret;
    },
    __wbg_setTimeout_fba1b48a90e30862: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
        return ret;
      }, arguments);
    },
    __wbg_queueMicrotask_3cbae2ec6b6cd3d6: function(arg0) {
      const ret = getObject(arg0).queueMicrotask;
      return addHeapObject(ret);
    },
    __wbindgen_is_function: function(arg0) {
      const ret = typeof getObject(arg0) === "function";
      return ret;
    },
    __wbg_queueMicrotask_481971b0d87f3dd4: function(arg0) {
      queueMicrotask(getObject(arg0));
    },
    __wbg_crypto_d05b68a3572bb8ca: function(arg0) {
      const ret = getObject(arg0).crypto;
      return addHeapObject(ret);
    },
    __wbg_process_b02b3570280d0366: function(arg0) {
      const ret = getObject(arg0).process;
      return addHeapObject(ret);
    },
    __wbg_versions_c1cb42213cedf0f5: function(arg0) {
      const ret = getObject(arg0).versions;
      return addHeapObject(ret);
    },
    __wbg_node_43b1089f407e4ec2: function(arg0) {
      const ret = getObject(arg0).node;
      return addHeapObject(ret);
    },
    __wbg_require_9a7e0f667ead4995: function() {
      return handleError(function() {
        const ret = module.require;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_msCrypto_10fc94afee92bd76: function(arg0) {
      const ret = getObject(arg0).msCrypto;
      return addHeapObject(ret);
    },
    __wbg_randomFillSync_b70ccbdf4926a99d: function() {
      return handleError(function(arg0, arg1) {
        getObject(arg0).randomFillSync(takeObject(arg1));
      }, arguments);
    },
    __wbg_getRandomValues_7e42b4fb8779dc6d: function() {
      return handleError(function(arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
      }, arguments);
    },
    __wbg_instanceof_Blob_83ad3dd4c9c406f0: function(arg0) {
      let result;
      try {
        result = getObject(arg0) instanceof Blob;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_wasClean_8222e9acf5c5ad07: function(arg0) {
      const ret = getObject(arg0).wasClean;
      return ret;
    },
    __wbg_code_5ee5dcc2842228cd: function(arg0) {
      const ret = getObject(arg0).code;
      return ret;
    },
    __wbg_reason_5ed6709323849cb1: function(arg0, arg1) {
      const ret = getObject(arg1).reason;
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
      const len1 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len1;
      getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    },
    __wbg_code_bddcff79610894cf: function(arg0) {
      const ret = getObject(arg0).code;
      return ret;
    },
    __wbg_data_3ce7c145ca4fbcdc: function(arg0) {
      const ret = getObject(arg0).data;
      return addHeapObject(ret);
    },
    __wbg_now_4e659b3d15f470d9: function(arg0) {
      const ret = getObject(arg0).now();
      return ret;
    },
    __wbg_byobRequest_72fca99f9c32c193: function(arg0) {
      const ret = getObject(arg0).byobRequest;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    },
    __wbg_close_184931724d961ccc: function() {
      return handleError(function(arg0) {
        getObject(arg0).close();
      }, arguments);
    },
    __wbg_view_7f0ce470793a340f: function(arg0) {
      const ret = getObject(arg0).view;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    },
    __wbg_respond_b1a43b2e3a06d525: function() {
      return handleError(function(arg0, arg1) {
        getObject(arg0).respond(arg1 >>> 0);
      }, arguments);
    },
    __wbg_close_a994f9425dab445c: function() {
      return handleError(function(arg0) {
        getObject(arg0).close();
      }, arguments);
    },
    __wbg_enqueue_ea194723156c0cc2: function() {
      return handleError(function(arg0, arg1) {
        getObject(arg0).enqueue(getObject(arg1));
      }, arguments);
    },
    __wbg_url_1ac02c9add50c527: function(arg0, arg1) {
      const ret = getObject(arg1).url;
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
      const len1 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len1;
      getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    },
    __wbg_readyState_1c157e4ea17c134a: function(arg0) {
      const ret = getObject(arg0).readyState;
      return ret;
    },
    __wbg_setonopen_ce7a4c51e5cf5788: function(arg0, arg1) {
      getObject(arg0).onopen = getObject(arg1);
    },
    __wbg_setonerror_39a785302b0cd2e9: function(arg0, arg1) {
      getObject(arg0).onerror = getObject(arg1);
    },
    __wbg_setonclose_b9929b1c1624dff3: function(arg0, arg1) {
      getObject(arg0).onclose = getObject(arg1);
    },
    __wbg_setonmessage_2af154ce83a3dc94: function(arg0, arg1) {
      getObject(arg0).onmessage = getObject(arg1);
    },
    __wbg_setbinaryType_b0cf5103cd561959: function(arg0, arg1) {
      getObject(arg0).binaryType = takeObject(arg1);
    },
    __wbg_new_6c74223c77cfabad: function() {
      return handleError(function(arg0, arg1) {
        const ret = new WebSocket(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_newwithstrsequence_9bc178264d955680: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = new WebSocket(getStringFromWasm0(arg0, arg1), getObject(arg2));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_close_acd9532ff5c093ea: function() {
      return handleError(function(arg0) {
        getObject(arg0).close();
      }, arguments);
    },
    __wbg_send_70603dff16b81b66: function() {
      return handleError(function(arg0, arg1, arg2) {
        getObject(arg0).send(getStringFromWasm0(arg1, arg2));
      }, arguments);
    },
    __wbg_send_5fcd7bab9777194e: function() {
      return handleError(function(arg0, arg1, arg2) {
        getObject(arg0).send(getArrayU8FromWasm0(arg1, arg2));
      }, arguments);
    },
    __wbg_debug_5fb96680aecf5dc8: function(arg0) {
      console.debug(getObject(arg0));
    },
    __wbg_error_8e3928cfb8a43e2b: function(arg0) {
      console.error(getObject(arg0));
    },
    __wbg_info_530a29cb2e4e3304: function(arg0) {
      console.info(getObject(arg0));
    },
    __wbg_log_5bb5f88f245d7762: function(arg0) {
      console.log(getObject(arg0));
    },
    __wbg_warn_63bbae1730aead09: function(arg0) {
      console.warn(getObject(arg0));
    },
    __wbg_self_ce0dbfc45cf2f5be: function() {
      return handleError(function() {
        const ret = self.self;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_window_c6fb939a7f436783: function() {
      return handleError(function() {
        const ret = window.window;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_globalThis_d1e6af4856ba331b: function() {
      return handleError(function() {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_global_207b558942527489: function() {
      return handleError(function() {
        const ret = global.global;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_newnoargs_e258087cd0daa0ea: function(arg0, arg1) {
      const ret = new Function(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbg_length_cd7af8117672b8b8: function(arg0) {
      const ret = getObject(arg0).length;
      return ret;
    },
    __wbg_new_16b304a2cfa7ff4a: function() {
      const ret = new Array();
      return addHeapObject(ret);
    },
    __wbg_new_d9bc3a0147634640: function() {
      const ret = /* @__PURE__ */ new Map();
      return addHeapObject(ret);
    },
    __wbg_next_40fc327bfc8770e6: function(arg0) {
      const ret = getObject(arg0).next;
      return addHeapObject(ret);
    },
    __wbg_value_d93c65011f51a456: function(arg0) {
      const ret = getObject(arg0).value;
      return addHeapObject(ret);
    },
    __wbg_iterator_2cee6dadfd956dfa: function() {
      const ret = Symbol.iterator;
      return addHeapObject(ret);
    },
    __wbg_new_72fb9a18b5ae2624: function() {
      const ret = new Object();
      return addHeapObject(ret);
    },
    __wbg_get_bd8e338fbd5f5cc8: function(arg0, arg1) {
      const ret = getObject(arg0)[arg1 >>> 0];
      return addHeapObject(ret);
    },
    __wbg_set_d4638f722068f043: function(arg0, arg1, arg2) {
      getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
    },
    __wbg_isArray_2ab64d95e09ea0ae: function(arg0) {
      const ret = Array.isArray(getObject(arg0));
      return ret;
    },
    __wbg_push_a5b05aedc7234f9f: function(arg0, arg1) {
      const ret = getObject(arg0).push(getObject(arg1));
      return ret;
    },
    __wbg_instanceof_ArrayBuffer_836825be07d4c9d2: function(arg0) {
      let result;
      try {
        result = getObject(arg0) instanceof ArrayBuffer;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_new_28c511d9baebfa89: function(arg0, arg1) {
      const ret = new Error(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbg_call_27c0f87801dedf93: function() {
      return handleError(function(arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_call_b3ca7c6051f9bec1: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_instanceof_Map_87917e0a7aaf4012: function(arg0) {
      let result;
      try {
        result = getObject(arg0) instanceof Map;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_set_8417257aaedc936b: function(arg0, arg1, arg2) {
      const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
      return addHeapObject(ret);
    },
    __wbg_next_196c84450b364254: function() {
      return handleError(function(arg0) {
        const ret = getObject(arg0).next();
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_done_298b57d23c0fc80c: function(arg0) {
      const ret = getObject(arg0).done;
      return ret;
    },
    __wbg_isSafeInteger_f7b04ef02296c4d2: function(arg0) {
      const ret = Number.isSafeInteger(getObject(arg0));
      return ret;
    },
    __wbg_entries_95cc2c823b285a09: function(arg0) {
      const ret = Object.entries(getObject(arg0));
      return addHeapObject(ret);
    },
    __wbg_get_e3c254076557e348: function() {
      return handleError(function(arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_buffer_12d079cc21e14bdb: function(arg0) {
      const ret = getObject(arg0).buffer;
      return addHeapObject(ret);
    },
    __wbg_new_81740750da40724f: function(arg0, arg1) {
      try {
        var state0 = { a: arg0, b: arg1 };
        var cb0 = (arg02, arg12) => {
          const a = state0.a;
          state0.a = 0;
          try {
            return __wbg_adapter_234(a, state0.b, arg02, arg12);
          } finally {
            state0.a = a;
          }
        };
        const ret = new Promise(cb0);
        return addHeapObject(ret);
      } finally {
        state0.a = state0.b = 0;
      }
    },
    __wbg_resolve_b0083a7967828ec8: function(arg0) {
      const ret = Promise.resolve(getObject(arg0));
      return addHeapObject(ret);
    },
    __wbg_then_0c86a60e8fcfe9f6: function(arg0, arg1) {
      const ret = getObject(arg0).then(getObject(arg1));
      return addHeapObject(ret);
    },
    __wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb: function(arg0, arg1, arg2) {
      const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
      return addHeapObject(ret);
    },
    __wbg_new_63b92bc8671ed464: function(arg0) {
      const ret = new Uint8Array(getObject(arg0));
      return addHeapObject(ret);
    },
    __wbg_instanceof_Uint8Array_2b3bbecd033d19f6: function(arg0) {
      let result;
      try {
        result = getObject(arg0) instanceof Uint8Array;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_newwithlength_e9b4878cebadb3d3: function(arg0) {
      const ret = new Uint8Array(arg0 >>> 0);
      return addHeapObject(ret);
    },
    __wbg_buffer_dd7f74bc60f1faab: function(arg0) {
      const ret = getObject(arg0).buffer;
      return addHeapObject(ret);
    },
    __wbg_subarray_a1f73cd4b5b42fe1: function(arg0, arg1, arg2) {
      const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
      return addHeapObject(ret);
    },
    __wbg_length_c20a40f15020d68a: function(arg0) {
      const ret = getObject(arg0).length;
      return ret;
    },
    __wbg_byteLength_58f7b4fab1919d44: function(arg0) {
      const ret = getObject(arg0).byteLength;
      return ret;
    },
    __wbg_byteOffset_81d60f7392524f62: function(arg0) {
      const ret = getObject(arg0).byteOffset;
      return ret;
    },
    __wbg_set_a47bac70306a19a7: function(arg0, arg1, arg2) {
      getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    },
    __wbindgen_bigint_get_as_i64: function(arg0, arg1) {
      const v = getObject(arg1);
      const ret = typeof v === "bigint" ? v : void 0;
      getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
      getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    },
    __wbindgen_debug_string: function(arg0, arg1) {
      const ret = debugString(getObject(arg1));
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
      const len1 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len1;
      getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    },
    __wbindgen_throw: function(arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    },
    __wbindgen_memory: function() {
      const ret = wasm.memory;
      return addHeapObject(ret);
    },
    __wbindgen_closure_wrapper15770: function(arg0, arg1, arg2) {
      const ret = makeMutClosure(arg0, arg1, 251, __wbg_adapter_50);
      return addHeapObject(ret);
    },
    __wbindgen_closure_wrapper22691: function(arg0, arg1, arg2) {
      const ret = makeMutClosure(arg0, arg1, 1069, __wbg_adapter_53);
      return addHeapObject(ret);
    },
    __wbindgen_closure_wrapper22894: function(arg0, arg1, arg2) {
      const ret = makeMutClosure(arg0, arg1, 1101, __wbg_adapter_56);
      return addHeapObject(ret);
    },
    __wbindgen_closure_wrapper23067: function(arg0, arg1, arg2) {
      const ret = makeMutClosure(arg0, arg1, 1126, __wbg_adapter_59);
      return addHeapObject(ret);
    }
  }
};
var wasm_url = new URL("index_bg.wasm", import.meta.url);
var wasmCode = "";
switch (wasm_url.protocol) {
  case "file:":
    wasmCode = await Deno.readFile(wasm_url);
    break;
  case "https:":
  case "http:":
    wasmCode = await (await fetch(wasm_url)).arrayBuffer();
    break;
  default:
    throw new Error(`Unsupported protocol: ${wasm_url.protocol}`);
}
var wasmInstance = (await WebAssembly.instantiate(wasmCode, imports)).instance;
var wasm = wasmInstance.exports;
wasm.__wbindgen_start();
export {
  IntoUnderlyingByteSource,
  IntoUnderlyingSink,
  IntoUnderlyingSource,
  Surreal,
  setup
};
//# sourceMappingURL=index.js.map
