```
npm install
npm run dev
```

```
open http://localhost:3000
```

# Generate RSA256 keys

1. generate rsa private key

```bash
openssl genrsa -out keys/jwtRSA256-private.pem 2048
```

2. extract public key from private key

```bash
openssl rsa -in keys/jwtRSA256-private.pem -pubout -outform PEM -out keys/jwtRSA256-public.pem
```

# Generate ECDSA keys

1. generate rsa private key

```bash
openssl ecparam -name secp256k1 -genkey -noout -out keys/ec-secp256k1-priv-key.pem
```

2. extract public key from private key

```bash
openssl ec -in keys/ec-secp256k1-priv-key.pem -pubout > keys/ec-secp256k1-pub-key.pem
```
