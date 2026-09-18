const base = 'http://127.0.0.1:5174';
const check = async (path, needle) => {
  try {
    const res = await fetch(base + path);
    const text = await res.text();
    console.log(`${path} -> status ${res.status}, needle "${needle}": ${text.includes(needle)}`);
  } catch (e) {
    console.log(`${path} -> ERROR: ${e.message}`);
  }
};
await check('/', 'id="root"');
await check('/src/main.jsx', './App');
await check('/src/services/firebase.js', 'dynImport');
await check('/src/App.jsx', 'ProtectedRoute');