# Private
`openssl genrsa -out private.pem 2048`

# Public 
`openssl rsa -in private.pem -pubout -out public.pem`