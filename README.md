### Simple demo nodejs cluster controller

#### How to run
```
# Dependencies
$ npm install

# Start master
$ node master.js [num of instances]
```

#### Hot to update

Make a change to your code (line 6 in `modules/instance.js`).

Then make a HTTP GET request on `http://localhost:8081/update/:secret`
Where `:secret` is set in `master.js` on line 6 (default is `k0k0dajs`).

Master will now fork new instances, wait for them to go online and drop
old instances.

Instance is available on `http://localhost:8080`