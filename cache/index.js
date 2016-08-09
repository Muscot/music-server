import LruCache from 'simple-lru-cache';
import {cache as config} from '../config';

// Cache to store all pending request so we can share the promises.
export var pending = new LruCache({"maxSize": 1000});

// Cache for the most common result, it's better to just cache the result than promises
// the server will use less memory. We cache the serialized version it will help the CPU alot
// not need to serialize all the responses. 
export var cache = new LruCache({"maxSize": config.maxSize});