<h1>Project MBox</h1>

<p><b>MBox</b> <p>is a unique platform designed to enjoy music without quality loss. Here, you will be able to listen to audio in FLAC format, enjoy Internet radio and various audio streams, as well as stay up to date on the latest news from the world of music and concert events. <b>MBox</b> <p>will resemble well-known services like Spotify, Deezer and Last FM, but our goal is to provide unique opportunities for true music lovers and enthusiasts.</p>

<h2>Authotization and Registration</h2>
<p>To use the MBox application, you'll need to go through the authentication process and, if you're a new user, register an account.</p>

<h2>Authorization API. HTTP Method POST </h2>
<p>The Authentication Module is responsible for verifying user credentials and granting access to secure parts of the application. It utilizes the following components:</p>

<h3>Format request to <code>/localhost/api/auth/login</code></h3>
<pre>
{
    "Email": "",
    "Password": ""
}
</pre>

<ul>
  <li><b>Database Module:</b> Stores user credentials and authentication information.</li>
</ul>

<h2>Registration API. HTTP Method POST</h2>
<p>The Registration Module provides the ability for new users to create an account within the application. It includes the following components:</p>

<h3>Format request to <code>/localhost/api/auth/register</code></h3>
<pre>
{
    "Name": "",
    "Email": "",
    "Password": "",
    "Birthday": ""
}
</pre>

<ul>
  <li><b>Database Module:</b> Saves data of new users after a successful registration.</li>
  <li><b>Validation Module:</b> Checks and validates the data provided during registration.</li>
</ul>

<h2>Modules </h2>
<h2>Tokens Module</h2>
<p>The Tokens Module ensures secure management of authentication and access tokens. It interacts with the Authentication Module to generate and verify tokens.</p>

<h2>Storage Module</h2>
<p>The Storage Module handles the storage and retrieval of user data, such as profile settings and related information.</p>

<h2>Rabbit Module</h2>
<p>The Rabbit Module can be utilized for asynchronous tasks and notifications within the application.</p>

# Install dependencies for local running:
```bash
$ npm install
$ npm run dev
```
# Generate jwt secret 
```bash
$ sudo apt install openssl -y
$ openssl rand -hex 32
```

<h2>Contact</h2>
<p>If you have any questions about the code structure, authentication, authorization or registration, please feel free to contact us at <a href="mailto:sergey.rikhter@outlook.com">sergey.rikhter@outlook.com</a>.</p>

#(C) All right reserved by Array Studio Inc  
