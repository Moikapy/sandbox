const crypto = require('crypto');
export default (data, secretkey) => {
  if (secretkey) {
    const algorithm = 'aes-256-cbc';
    let key = Buffer.alloc(32);
    let iv = Buffer.alloc(16);
    // make the key something other than a blank buffer
    key = Buffer.concat([Buffer.from('moi')], key.length);

    // randomize the iv, for best results
    iv = Buffer.from(
      Array.prototype.map.call(iv, () => {
        return Math.floor(Math.random() * 256);
      })
    );
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } else {
    throw new Error('To Encrpyt Data Please Add Secret Key');
  }
};
