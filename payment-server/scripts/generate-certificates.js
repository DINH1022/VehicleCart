const fs = require('fs');
const forge = require('node-forge');
const path = require('path');

// Create certificates directory if it doesn't exist
const certDir = path.join(__dirname, '..', 'certificates');
if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir);
}

// Generate a new key pair
const keys = forge.pki.rsa.generateKeyPair(2048);

// Create a certificate
const cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

// Add certificate attributes
const attrs = [{
    name: 'commonName',
    value: 'localhost'
}, {
    name: 'countryName',
    value: 'VN'
}, {
    name: 'organizationName',
    value: 'VehicleCart Payment Server'
}, {
    shortName: 'OU',
    value: 'Development'
}];

cert.setSubject(attrs);
cert.setIssuer(attrs);

// Sign the certificate
cert.sign(keys.privateKey);

// Convert to PEM format
const privatePem = forge.pki.privateKeyToPem(keys.privateKey);
const certPem = forge.pki.certificateToPem(cert);

// Save the files
fs.writeFileSync(path.join(certDir, 'private-key.pem'), privatePem);
fs.writeFileSync(path.join(certDir, 'certificate.pem'), certPem);

console.log('Certificates generated successfully!');
