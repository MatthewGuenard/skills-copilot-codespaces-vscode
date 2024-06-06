// Create web server
// 1. Create a web server
// 2. Handle requests and responses
// 3. Read the file and send the content to the client
// 4. Start the server and listen on port 3000

// 1. Create a web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 2. Handle requests and responses
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // 3. Read the file and send the content to the client
  if (req.method === 'GET' && req.url === '/comments') {
    fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'File not found' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      }
    });
  } else if (req.method === 'POST' && req.url === '/comments') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const newComment = JSON.parse(body);
      fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'File not found' }));
        } else {
          const comments = JSON.parse(data);
          comments.push(newComment);
          fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), err => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Internal server error' }));
            } else {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(newComment));
            }
          });
        }
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not