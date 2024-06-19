let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let cachedBigUint64Memory0 = null;

function getBigUint64Memory0() {
    if (cachedBigUint64Memory0 === null || cachedBigUint64Memory0.byteLength === 0) {
        cachedBigUint64Memory0 = new BigUint64Array(wasm.memory.buffer);
    }
    return cachedBigUint64Memory0;
}

function getArrayU64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getBigUint64Memory0().subarray(ptr / 8, ptr / 8 + len);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

const ConstantsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_constants_free(ptr >>> 0));
/**
*/
export class Constants {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Constants.prototype);
        obj.__wbg_ptr = ptr;
        ConstantsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ConstantsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_constants_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = wasm.constants_new();
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
    /**
    * @param {number} epsilon
    */
    set epsilon(epsilon) {
        wasm.constants_set_epsilon(this.__wbg_ptr, epsilon);
    }
    /**
    * @param {number} friction
    */
    set friction(friction) {
        wasm.constants_set_friction(this.__wbg_ptr, friction);
    }
    /**
    * @param {number} repulsion
    */
    set repulsion(repulsion) {
        wasm.constants_set_repulsion(this.__wbg_ptr, repulsion);
    }
    /**
    * @param {number} attraction
    */
    set attraction(attraction) {
        wasm.constants_set_attraction(this.__wbg_ptr, attraction);
    }
    /**
    * @param {number} time_step
    */
    set time_step(time_step) {
        wasm.constants_set_time_step(this.__wbg_ptr, time_step);
    }
    /**
    * @param {number} theta
    */
    set theta(theta) {
        wasm.constants_set_theta(this.__wbg_ptr, theta);
    }
    /**
    * @param {number} inner_distance
    */
    set inner_distance(inner_distance) {
        wasm.constants_set_inner_distance(this.__wbg_ptr, inner_distance);
    }
    /**
    * @returns {number}
    */
    get epsilon() {
        const ret = wasm.constants_epsilon(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get friction() {
        const ret = wasm.constants_friction(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get repulsion() {
        const ret = wasm.constants_repulsion(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get attraction() {
        const ret = wasm.constants_attraction(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get time_step() {
        const ret = wasm.constants_time_step(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get theta() {
        const ret = wasm.constants_theta(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get inner_distance() {
        const ret = wasm.constants_inner_distance(this.__wbg_ptr);
        return ret;
    }
}

const GraphFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_graph_free(ptr >>> 0));
/**
*/
export class Graph {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GraphFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_graph_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = wasm.graph_new();
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
    /**
    * @returns {(VertexData)[]}
    */
    update() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.graph_update(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {bigint}
    */
    add_vertex() {
        const ret = wasm.graph_add_vertex(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} source_id
    * @param {bigint} target_id
    * @returns {bigint}
    */
    add_edge(source_id, target_id) {
        const ret = wasm.graph_add_edge(this.__wbg_ptr, source_id, target_id);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} id
    */
    remove_vertex(id) {
        wasm.graph_remove_vertex(this.__wbg_ptr, id);
    }
    /**
    * @param {bigint} id
    */
    remove_edge(id) {
        wasm.graph_remove_edge(this.__wbg_ptr, id);
    }
    /**
    * @returns {Constants}
    */
    get get_constants() {
        const ret = wasm.graph_get_constants(this.__wbg_ptr);
        return Constants.__wrap(ret);
    }
    /**
    * @param {Constants} constants
    */
    set constants(constants) {
        _assertClass(constants, Constants);
        var ptr0 = constants.__destroy_into_raw();
        wasm.graph_set_constants(this.__wbg_ptr, ptr0);
    }
    /**
    * @param {Vector3} source_pos
    * @param {Vector3} target_pos
    * @param {Constants} constants
    * @param {number} strength
    * @returns {Vector3}
    */
    static attraction(source_pos, target_pos, constants, strength) {
        _assertClass(source_pos, Vector3);
        _assertClass(target_pos, Vector3);
        _assertClass(constants, Constants);
        const ret = wasm.graph_attraction(source_pos.__wbg_ptr, target_pos.__wbg_ptr, constants.__wbg_ptr, strength);
        return Vector3.__wrap(ret);
    }
    /**
    * @param {Vector3} source_pos
    * @param {Vector3} target_pos
    * @param {Constants} constants
    * @returns {Vector3}
    */
    static repulsion(source_pos, target_pos, constants) {
        _assertClass(source_pos, Vector3);
        _assertClass(target_pos, Vector3);
        _assertClass(constants, Constants);
        const ret = wasm.graph_repulsion(source_pos.__wbg_ptr, target_pos.__wbg_ptr, constants.__wbg_ptr);
        return Vector3.__wrap(ret);
    }
    /**
    * @returns {Vector3}
    */
    center() {
        const ret = wasm.graph_center(this.__wbg_ptr);
        return Vector3.__wrap(ret);
    }
    /**
    * @returns {any}
    */
    middle() {
        const ret = wasm.graph_middle(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * @param {bigint} id
    * @returns {BigUint64Array}
    */
    incident_edges(id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.graph_incident_edges(retptr, this.__wbg_ptr, id);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {number}
    */
    get_epsilon() {
        const ret = wasm.graph_get_epsilon(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get_friction() {
        const ret = wasm.graph_get_friction(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get_repulsion() {
        const ret = wasm.graph_get_repulsion(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get_attraction() {
        const ret = wasm.graph_get_attraction(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get_time_step() {
        const ret = wasm.graph_get_time_step(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get_theta() {
        const ret = wasm.graph_get_theta(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get_inner_distance() {
        const ret = wasm.graph_get_inner_distance(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} epsilon
    */
    set_epsilon(epsilon) {
        wasm.graph_set_epsilon(this.__wbg_ptr, epsilon);
    }
    /**
    * @param {number} friction
    */
    set_friction(friction) {
        wasm.graph_set_friction(this.__wbg_ptr, friction);
    }
    /**
    * @param {number} repulsion
    */
    set_repulsion(repulsion) {
        wasm.graph_set_repulsion(this.__wbg_ptr, repulsion);
    }
    /**
    * @param {number} attraction
    */
    set_attraction(attraction) {
        wasm.graph_set_attraction(this.__wbg_ptr, attraction);
    }
    /**
    * @param {number} time_step
    */
    set_time_step(time_step) {
        wasm.graph_set_time_step(this.__wbg_ptr, time_step);
    }
    /**
    * @param {number} theta
    */
    set_theta(theta) {
        wasm.graph_set_theta(this.__wbg_ptr, theta);
    }
    /**
    * @param {number} inner_distance
    */
    set_inner_distance(inner_distance) {
        wasm.graph_set_inner_distance(this.__wbg_ptr, inner_distance);
    }
}

const Vector3Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_vector3_free(ptr >>> 0));
/**
*/
export class Vector3 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Vector3.prototype);
        obj.__wbg_ptr = ptr;
        Vector3Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Vector3Finalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vector3_free(ptr);
    }
    /**
    * @returns {number}
    */
    get x() {
        const ret = wasm.__wbg_get_vector3_x(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set x(arg0) {
        wasm.__wbg_set_vector3_x(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get y() {
        const ret = wasm.__wbg_get_vector3_y(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set y(arg0) {
        wasm.__wbg_set_vector3_y(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get z() {
        const ret = wasm.__wbg_get_vector3_z(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set z(arg0) {
        wasm.__wbg_set_vector3_z(this.__wbg_ptr, arg0);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @returns {Vector3}
    */
    static new(x, y, z) {
        const ret = wasm.vector3_new(x, y, z);
        return Vector3.__wrap(ret);
    }
    /**
    * @returns {Vector3}
    */
    static zero() {
        const ret = wasm.vector3_zero();
        return Vector3.__wrap(ret);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @returns {Vector3}
    */
    static from_u32(x, y, z) {
        const ret = wasm.vector3_from_u32(x, y, z);
        return Vector3.__wrap(ret);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @returns {Vector3}
    */
    static from_i32(x, y, z) {
        const ret = wasm.vector3_from_i32(x, y, z);
        return Vector3.__wrap(ret);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @returns {Vector3}
    */
    static from_f32(x, y, z) {
        const ret = wasm.vector3_from_f32(x, y, z);
        return Vector3.__wrap(ret);
    }
}

const VertexDataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_vertexdata_free(ptr >>> 0));
/**
*/
export class VertexData {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VertexData.prototype);
        obj.__wbg_ptr = ptr;
        VertexDataFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VertexDataFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vertexdata_free(ptr);
    }
    /**
    * @param {bigint} id
    * @param {Vector3} position
    */
    constructor(id, position) {
        _assertClass(position, Vector3);
        var ptr0 = position.__destroy_into_raw();
        const ret = wasm.vertexdata_new(id, ptr0);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
    /**
    * @returns {bigint}
    */
    get id() {
        const ret = wasm.vertexdata_id(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @returns {Vector3}
    */
    get position() {
        const ret = wasm.vertexdata_position(this.__wbg_ptr);
        return Vector3.__wrap(ret);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_vertexdata_new = function(arg0) {
        const ret = VertexData.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_crypto_1d1f22824a6a080c = function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_process_4a72847cc503995b = function(arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_versions_f686565e586dd935 = function(arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_104a2ff8d6ea03a2 = function(arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_require_cca90b1a94a0255b = function() { return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_msCrypto_eb05e62b530a1508 = function(arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_randomFillSync_5c9c955aa56b6049 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).randomFillSync(takeObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_3aa56aa6edec874c = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_newnoargs_e258087cd0daa0ea = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbg_self_ce0dbfc45cf2f5be = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_c6fb939a7f436783 = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_d1e6af4856ba331b = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_207b558942527489 = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_27c0f87801dedf93 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_b3ca7c6051f9bec1 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_buffer_12d079cc21e14bdb = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_63b92bc8671ed464 = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithlength_e9b4878cebadb3d3 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subarray_a1f73cd4b5b42fe1 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_a47bac70306a19a7 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedBigUint64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('layout_graph_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
