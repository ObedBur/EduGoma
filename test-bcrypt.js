const bcrypt = require('bcryptjs');
console.log('Bcrypt loaded successfully');
bcrypt.hash('test', 10, (err, hash) => {
  if (err) console.error(err);
  else console.log('Hash generated:', hash);
});
