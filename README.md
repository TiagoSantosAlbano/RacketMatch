O ficheiro não vem com os models, fazer no terminal do vscode

npm install

 também não vem com o .env do backend, carregar com o botão do lado direito do rato em cima do racketmatch backend common e depois em criar novo ficheiro e nomealo de .env e em seguida colar o seguinte codigo:

MONGODB_URI=mongodb+srv://racketmachtadmin:mysecretkey123@racketmatch.v68gr.mongodb.net/
JWT_SECRET=mysecretkey123
PORT=5000

EMAIL_FROM=racketmatch@gmail.com
EMAIL_PASS=RacketMatch-282

VITE_API_URL=http://31.97.177.93:5000
EXPO_PUBLIC_API_URL=http://31.97.177.93:5000/api

# PayPal sandbox credentials
PAYPAL_CLIENT_ID=AS8MFnQdkUb3rbF9ADnBXfpaYBWspGHLj7-XG2lKXBhELeECNzPjZqT6W17pTXohvunUyuoU21DETFZt
PAYPAL_CLIENT_SECRET=EEv7wwzc4BTHyqxWjBJ0SLTZsFu4V6_i6loeWC0NTy_jze0HYkhFri4akRIUFu6D61IuysL2xhEGovCG9

PAYPAL_RETURN_URL=http://31.97.177.93:5000/api/paypal/capture-payment
PAYPAL_CANCEL_URL=http://31.97.177.93:5000/paypal-cancel



A Base de dados é acedida através da tarefeé o link do mongodb atlas
 o email de acesso é tiago.macieira.albano.epic@gmail.com
 e a palavra passe está nas tarefas