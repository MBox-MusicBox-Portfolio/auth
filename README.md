<h1>🔐 Auth Microservice</h1>

<p>A microservice for user authentication, authorization, and registration. Supports JWT tokens, validation, and Swagger documentation.</p>
<hr />

<h2>📚 Swagger Documentation</h2>
<ul>
  <li>🐳 <strong>From inside Docker:</strong> 
    <a href="http://localhost/swagger/auth" target="_blank">http://localhost/swagger/auth</a>
  </li>
  <li>💻 <strong>From the host machine:</strong> 
    <a href="http://localhost:4000/api/auth/docs" target="_blank">http://localhost:4000/api/auth/docs</a>
  </li>
</ul>

<hr />

<h2>Install Dependencies & Run Locally</h2>
<pre>
<code>
$ npm install     
</code>
</pre>

<hr />

<h2>🚀 Runnable Microservice on Local Machine</h2>
<p>Use the following commands to run the microservice in different environments:</p>
<pre>
<code>
$ npm run build  # Compile the TypeScript code to JavaScript
$ npm run prod   # Start the production build
$ npm run dev    # Start the development server (with auto-reload)
</code>
</pre>
<hr />


<h2>🔑 Generate JWT Secret</h2>
<pre>
<code>
$ sudo apt install openssl -y
$ openssl rand -hex 32
</code>
</pre>

<p>Copy the generated secret and add it to your <code>.env</code> file:</p>
<pre>
<code>
JWT_SECRET=your_generated_secret
</code>
</pre>

<hr />

<h2>📬 Contact</h2>
<p>If you have any questions about the code structure, authentication, authorization, or registration process, feel free to contact us:</p>
<p>📧 <a href="mailto:sergey.rikhter@outlook.com">sergey.rikhter@outlook.com</a></p>
<hr />

<h2>🛡️ Copyright</h2>
<p>&copy; All rights reserved.<br>
<strong>Array Studio Inc</strong></p>
