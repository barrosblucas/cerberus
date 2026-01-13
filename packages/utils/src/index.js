Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.err = err;
function ok(value) {
  return { ok: true, value: value };
}
function err(error) {
  return { ok: false, error: error };
}
