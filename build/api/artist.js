'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
var util = require('util');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  hello: hello
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function hello(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);

  // this sends back a JSON response which is a single string
  res.json(hello);
}

function get(req, res, next) {

  var hello = util.format('Hello, %s!', name);

  // this sends back a JSON response which is a single string
  res.json(hello);

  /*
  ioserver.incRequestStat('get');
   var path = req.swagger.swaggerObject.paths[req.swagger.apiPath];
  var xStorage = path['x-storage'];
  var schema = req.swagger.operation.responses['200'].schema;
  if (schema.type == 'array')
      _getAll(req, res, next);
  else
      _getOne(req, res, next);
  */
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwaS9jb250cm9sbGVycy9hcnRpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTs7Ozs7QUFLQTs7Ozs7Ozs7OztRQXVDZ0IsRyxHQUFBLEc7QUFqQ2hCLElBQUksT0FBTyxRQUFRLE1BQVIsQ0FBWDs7QUFFQTs7Ozs7Ozs7Ozs7O0FBWUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsU0FBTztBQURRLENBQWpCOztBQUlBOzs7Ozs7QUFNQSxTQUFTLEtBQVQsQ0FBZSxHQUFmLEVBQW9CLEdBQXBCLEVBQXlCO0FBQ3ZCO0FBQ0EsTUFBSSxPQUFPLElBQUksT0FBSixDQUFZLE1BQVosQ0FBbUIsSUFBbkIsQ0FBd0IsS0FBeEIsSUFBaUMsVUFBNUM7QUFDQSxNQUFJLFFBQVEsS0FBSyxNQUFMLENBQVksWUFBWixFQUEwQixJQUExQixDQUFaOztBQUVBO0FBQ0EsTUFBSSxJQUFKLENBQVMsS0FBVDtBQUNEOztBQUVNLFNBQVMsR0FBVCxDQUFhLEdBQWIsRUFBa0IsR0FBbEIsRUFBdUIsSUFBdkIsRUFBNkI7O0FBRWhDLE1BQUksUUFBUSxLQUFLLE1BQUwsQ0FBWSxZQUFaLEVBQTBCLElBQTFCLENBQVo7O0FBRUE7QUFDQSxNQUFJLElBQUosQ0FBUyxLQUFUOztBQUVBOzs7Ozs7Ozs7O0FBV0giLCJmaWxlIjoiYXJ0aXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuLypcbiAndXNlIHN0cmljdCcgaXMgbm90IHJlcXVpcmVkIGJ1dCBoZWxwZnVsIGZvciB0dXJuaW5nIHN5bnRhY3RpY2FsIGVycm9ycyBpbnRvIHRydWUgZXJyb3JzIGluIHRoZSBwcm9ncmFtIGZsb3dcbiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9TdHJpY3RfbW9kZVxuKi9cblxuLypcbiBNb2R1bGVzIG1ha2UgaXQgcG9zc2libGUgdG8gaW1wb3J0IEphdmFTY3JpcHQgZmlsZXMgaW50byB5b3VyIGFwcGxpY2F0aW9uLiAgTW9kdWxlcyBhcmUgaW1wb3J0ZWRcbiB1c2luZyAncmVxdWlyZScgc3RhdGVtZW50cyB0aGF0IGdpdmUgeW91IGEgcmVmZXJlbmNlIHRvIHRoZSBtb2R1bGUuXG5cbiAgSXQgaXMgYSBnb29kIGlkZWEgdG8gbGlzdCB0aGUgbW9kdWxlcyB0aGF0IHlvdXIgYXBwbGljYXRpb24gZGVwZW5kcyBvbiBpbiB0aGUgcGFja2FnZS5qc29uIGluIHRoZSBwcm9qZWN0IHJvb3RcbiAqL1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cbi8qXG4gT25jZSB5b3UgJ3JlcXVpcmUnIGEgbW9kdWxlIHlvdSBjYW4gcmVmZXJlbmNlIHRoZSB0aGluZ3MgdGhhdCBpdCBleHBvcnRzLiAgVGhlc2UgYXJlIGRlZmluZWQgaW4gbW9kdWxlLmV4cG9ydHMuXG5cbiBGb3IgYSBjb250cm9sbGVyIGluIGExMjcgKHdoaWNoIHRoaXMgaXMpIHlvdSBzaG91bGQgZXhwb3J0IHRoZSBmdW5jdGlvbnMgcmVmZXJlbmNlZCBpbiB5b3VyIFN3YWdnZXIgZG9jdW1lbnQgYnkgbmFtZS5cblxuIEVpdGhlcjpcbiAgLSBUaGUgSFRUUCBWZXJiIG9mIHRoZSBjb3JyZXNwb25kaW5nIG9wZXJhdGlvbiAoZ2V0LCBwdXQsIHBvc3QsIGRlbGV0ZSwgZXRjKVxuICAtIE9yIHRoZSBvcGVyYXRpb25JZCBhc3NvY2lhdGVkIHdpdGggdGhlIG9wZXJhdGlvbiBpbiB5b3VyIFN3YWdnZXIgZG9jdW1lbnRcblxuICBJbiB0aGUgc3RhcnRlci9za2VsZXRvbiBwcm9qZWN0IHRoZSAnZ2V0JyBvcGVyYXRpb24gb24gdGhlICcvaGVsbG8nIHBhdGggaGFzIGFuIG9wZXJhdGlvbklkIG5hbWVkICdoZWxsbycuICBIZXJlLFxuICB3ZSBzcGVjaWZ5IHRoYXQgaW4gdGhlIGV4cG9ydHMgb2YgdGhpcyBtb2R1bGUgdGhhdCAnaGVsbG8nIG1hcHMgdG8gdGhlIGZ1bmN0aW9uIG5hbWVkICdoZWxsbydcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGhlbGxvOiBoZWxsb1xufTtcblxuLypcbiAgRnVuY3Rpb25zIGluIGExMjcgY29udHJvbGxlcnMgdXNlZCBmb3Igb3BlcmF0aW9ucyBzaG91bGQgdGFrZSB0d28gcGFyYW1ldGVyczpcblxuICBQYXJhbSAxOiBhIGhhbmRsZSB0byB0aGUgcmVxdWVzdCBvYmplY3RcbiAgUGFyYW0gMjogYSBoYW5kbGUgdG8gdGhlIHJlc3BvbnNlIG9iamVjdFxuICovXG5mdW5jdGlvbiBoZWxsbyhyZXEsIHJlcykge1xuICAvLyB2YXJpYWJsZXMgZGVmaW5lZCBpbiB0aGUgU3dhZ2dlciBkb2N1bWVudCBjYW4gYmUgcmVmZXJlbmNlZCB1c2luZyByZXEuc3dhZ2dlci5wYXJhbXMue3BhcmFtZXRlcl9uYW1lfVxuICB2YXIgbmFtZSA9IHJlcS5zd2FnZ2VyLnBhcmFtcy5uYW1lLnZhbHVlIHx8ICdzdHJhbmdlcic7XG4gIHZhciBoZWxsbyA9IHV0aWwuZm9ybWF0KCdIZWxsbywgJXMhJywgbmFtZSk7XG5cbiAgLy8gdGhpcyBzZW5kcyBiYWNrIGEgSlNPTiByZXNwb25zZSB3aGljaCBpcyBhIHNpbmdsZSBzdHJpbmdcbiAgcmVzLmpzb24oaGVsbG8pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0KHJlcSwgcmVzLCBuZXh0KSB7XG5cbiAgICB2YXIgaGVsbG8gPSB1dGlsLmZvcm1hdCgnSGVsbG8sICVzIScsIG5hbWUpO1xuXG4gICAgLy8gdGhpcyBzZW5kcyBiYWNrIGEgSlNPTiByZXNwb25zZSB3aGljaCBpcyBhIHNpbmdsZSBzdHJpbmdcbiAgICByZXMuanNvbihoZWxsbyk7XG4gICAgXG4gICAgLypcbiAgICBpb3NlcnZlci5pbmNSZXF1ZXN0U3RhdCgnZ2V0Jyk7XG5cbiAgICB2YXIgcGF0aCA9IHJlcS5zd2FnZ2VyLnN3YWdnZXJPYmplY3QucGF0aHNbcmVxLnN3YWdnZXIuYXBpUGF0aF07XG4gICAgdmFyIHhTdG9yYWdlID0gcGF0aFsneC1zdG9yYWdlJ107XG4gICAgdmFyIHNjaGVtYSA9IHJlcS5zd2FnZ2VyLm9wZXJhdGlvbi5yZXNwb25zZXNbJzIwMCddLnNjaGVtYTtcbiAgICBpZiAoc2NoZW1hLnR5cGUgPT0gJ2FycmF5JylcbiAgICAgICAgX2dldEFsbChyZXEsIHJlcywgbmV4dCk7XG4gICAgZWxzZVxuICAgICAgICBfZ2V0T25lKHJlcSwgcmVzLCBuZXh0KTtcbiAgICAqL1xufVxuXG5cbiJdfQ==