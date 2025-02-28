*Note: For development you can create a self-signed certificate to use.
Or implement something else, up to you.

The nginx.conf and Dockerfile will copy files in this `ssl/` directory and used to 
specify the certificate for serving this application under https.

### Generating a self-signed certificate

1. **Generate a Private Key:**
    ```sh
    openssl genrsa -out ngdev.key 2048
    ```

2. **Create a Certificate Signing Request (CSR):**
    ```sh
    openssl req -new -key ngdev.key -out ngdev.csr
    ```

3. **Generate a Self-Signed Certificate:**
    ```sh
    openssl req -x509 -newkey rsa:2048 -keyout ngdev.key -out ngdev.crt -days 365
    ```
