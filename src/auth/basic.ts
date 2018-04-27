import * as crypto from 'crypto';
import * as events from 'events';
import {Request, Response} from 'express-serve-static-core';
import {readFileSync} from 'fs';

import {sha1} from './util';



export class Basic extends events.EventEmitter {
  private options: any;

  constructor(options: any) {
    super();

    if (!options.msg401) {
      options.msg401 = '401 Unauthorized';
    }
    if (!options.contentType) {
      options.contentType = 'text/plain';
    }

    if (!options.realm) {
      options.realm = 'users';
    }

    this.options = options;

    this.options.users = [];

    if (options.file) {
      this.loadUsers();
    }
  }

  generateHeader() {
    return `Basic realm=\"${this.options.realm}\"`;
  }

  ask(res: Response) {
    res.setHeader('Content-Type', this.options.contentType);
    res.setHeader('WWW-authenticate', `Basic realm=\"${this.options.realm}\"`);
    res.writeHead(401);
    res.end(this.options.msg401);
  }

  check(req: any, res: any, callback: Function) {
    this.isAuthenticated(req, (result: any) => {
      if (result instanceof Error) {
        this.emit('error', result, req);

        if (callback) {
          callback(result);
        }
      } else if (!result.pass) {
        this.emit('fail', result, req);
        this.ask(res);
      } else {
        this.emit('success', result, req);

        req.user = result.user;
        if (callback) {
          callback();
        }
      }
    });
  }


  isAuthenticated(req: Request, cb: Function) {
    const header: string = <string>req.headers['authorization'];

    let searching: boolean = false;

    let token;
    if (header) {
      const token = this.parseAuthorization(header);
      if (token) {
        searching = true;
        this.findUser(req, token, (result: any) => {
          cb(result);
        });
      }
    }

    if (!searching) {
      cb({});
    }
  }

  findUser(req: Request, hash: string, cb: Function) {
    const splitHash = new Buffer(hash, 'base64').toString('utf8').split(':');
    const username = splitHash[0];
    const password = splitHash[1];

    let pass: boolean = false;

    this.options.users.forEach((user: any) => {
      if (user.username === username && this.validate(user.hash, password)) {
        pass = true;
      }
    });

    cb({user: username, pass: pass});
  }

  validate(hash: string, password: string) {
    if (hash.substr(0, 5) === '{SHA}') {
      hash = hash.substr(5);
      return hash === sha1(hash);
    } else {
      return hash === password;
    }
  }

  parseAuthorization(header: string) {
    const h = header.split(' ');
    if (h[0] === 'Basic') {
      return h[1];
    }
  }

  loadUsers() {
    let users = readFileSync(this.options.file, 'UTF-8')
                    .replace(/\r\n/g, '\n')
                    .split('\n');

    users.forEach(u => {
      if (u && !u.match(/^\s*#.*/)) {
        const lineSplit = u.split(':');
        const username = lineSplit[0];
        const hash = lineSplit[1];

        this.options.users.push({username, hash});
      }
    });
  }
}
