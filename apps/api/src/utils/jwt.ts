import * as jwt from 'jsonwebtoken';

import config from './config';

const { JWT_EXPIRES_IN, JWT_SECRET } = config;

export namespace Token {
  export function sign(data: JwtPayloadData) {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        { data },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token!);
          }
        }
      );
    });
  }

  export function verify(token: string) {
    return new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as JwtPayload);
        }
      });
    });
  }
}

export interface JwtPayload extends jwt.JwtPayload {
  data: JwtPayloadData;
}

export interface JwtPayloadData {
  id: number;
}
