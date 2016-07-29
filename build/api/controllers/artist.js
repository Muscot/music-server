"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.list = list;
exports.get = get;
function list(req, res, next) {

    res.json([{
        "mbid": "5b11f4ce­a62d­471e­81fc­a69a8278c7da",
        "description": " < p > < b > N i r v a n a < / b > w a s a n A m e r i c a n r o c k b a n d t h a t w a s f o r m e d . . . o s v o s v . . . ",
        "albums": [{
            "title": "Nevermind",
            "id": "1b022e01­4da6­387b­8658­8678046e4cef",
            "image": "http://coverartarchive.org/release/a146429a­cedc­3ab0­9e41­1aaf5f6cdc2d/3012495605.jpg"
        }]
    }]);
}

function get(req, res, next) {

    res.json({
        "mbid": "5b11f4ce­a62d­471e­81fc­a69a8278c7da",
        "description": " < p > < b > N i r v a n a < / b > w a s a n A m e r i c a n r o c k b a n d t h a t w a s f o r m e d . . . o s v o s v . . . ",
        "albums": [{
            "title": "Nevermind",
            "id": "1b022e01­4da6­387b­8658­8678046e4cef",
            "image": "http://coverartarchive.org/release/a146429a­cedc­3ab0­9e41­1aaf5f6cdc2d/3012495605.jpg"
        }]
    });

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwaS9jb250cm9sbGVycy9hcnRpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFDZ0IsSSxHQUFBLEk7UUFrQkEsRyxHQUFBLEc7QUFsQlQsU0FBUyxJQUFULENBQWMsR0FBZCxFQUFtQixHQUFuQixFQUF3QixJQUF4QixFQUE4Qjs7QUFFakMsUUFBSSxJQUFKLENBQ0EsQ0FDSTtBQUNJLGdCQUFVLHNDQURkO0FBRUksdUJBQWdCLGlJQUZwQjtBQUdJLGtCQUFVLENBQ047QUFDSSxxQkFBVSxXQURkO0FBRUksa0JBQU8sc0NBRlg7QUFHSSxxQkFBVTtBQUhkLFNBRE07QUFIZCxLQURKLENBREE7QUFjSDs7QUFFTSxTQUFTLEdBQVQsQ0FBYSxHQUFiLEVBQWtCLEdBQWxCLEVBQXVCLElBQXZCLEVBQTZCOztBQUVoQyxRQUFJLElBQUosQ0FDQTtBQUNJLGdCQUFVLHNDQURkO0FBRUksdUJBQWdCLGlJQUZwQjtBQUdJLGtCQUFVLENBQ047QUFDSSxxQkFBVSxXQURkO0FBRUksa0JBQU8sc0NBRlg7QUFHSSxxQkFBVTtBQUhkLFNBRE07QUFIZCxLQURBOztBQWVBOzs7Ozs7Ozs7O0FBV0giLCJmaWxlIjoiYXJ0aXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgZnVuY3Rpb24gbGlzdChyZXEsIHJlcywgbmV4dCkge1xuXG4gICAgcmVzLmpzb24oXG4gICAgW1xuICAgICAgICB7XG4gICAgICAgICAgICBcIm1iaWRcIiA6ICBcIjViMTFmNGNlwq1hNjJkwq00NzFlwq04MWZjwq1hNjlhODI3OGM3ZGFcIiAsXG4gICAgICAgICAgICBcImRlc2NyaXB0aW9uXCIgOiBcIiA8IHAgPiA8IGIgPiBOIGkgciB2IGEgbiBhIDwgLyBiID4gdyBhIHMgYSBuIEEgbSBlIHIgaSBjIGEgbiByIG8gYyBrIGIgYSBuIGQgdCBoIGEgdCB3IGEgcyBmIG8gciBtIGUgZCAuIC4gLiBvIHMgdiBvIHMgdiAuIC4gLiBcIiwgIFxuICAgICAgICAgICAgXCJhbGJ1bXNcIiA6W1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJOZXZlcm1pbmRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiIDogXCIxYjAyMmUwMcKtNGRhNsKtMzg3YsKtODY1OMKtODY3ODA0NmU0Y2VmXCIsICBcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZVwiIDogXCJodHRwOi8vY292ZXJhcnRhcmNoaXZlLm9yZy9yZWxlYXNlL2ExNDY0Mjlhwq1jZWRjwq0zYWIwwq05ZTQxwq0xYWFmNWY2Y2RjMmQvMzAxMjQ5NTYwNS5qcGdcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF0pOyAgICBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldChyZXEsIHJlcywgbmV4dCkge1xuXG4gICAgcmVzLmpzb24oXG4gICAge1xuICAgICAgICBcIm1iaWRcIiA6ICBcIjViMTFmNGNlwq1hNjJkwq00NzFlwq04MWZjwq1hNjlhODI3OGM3ZGFcIiAsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIiA6IFwiIDwgcCA+IDwgYiA+IE4gaSByIHYgYSBuIGEgPCAvIGIgPiB3IGEgcyBhIG4gQSBtIGUgciBpIGMgYSBuIHIgbyBjIGsgYiBhIG4gZCB0IGggYSB0IHcgYSBzIGYgbyByIG0gZSBkIC4gLiAuIG8gcyB2IG8gcyB2IC4gLiAuIFwiLCAgXG4gICAgICAgIFwiYWxidW1zXCIgOltcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcIk5ldmVybWluZFwiLFxuICAgICAgICAgICAgICAgIFwiaWRcIiA6IFwiMWIwMjJlMDHCrTRkYTbCrTM4N2LCrTg2NTjCrTg2NzgwNDZlNGNlZlwiLCAgXG4gICAgICAgICAgICAgICAgXCJpbWFnZVwiIDogXCJodHRwOi8vY292ZXJhcnRhcmNoaXZlLm9yZy9yZWxlYXNlL2ExNDY0Mjlhwq1jZWRjwq0zYWIwwq05ZTQxwq0xYWFmNWY2Y2RjMmQvMzAxMjQ5NTYwNS5qcGdcIlxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfVxuICAgICk7IFxuXG5cbiAgICAvKlxuICAgIGlvc2VydmVyLmluY1JlcXVlc3RTdGF0KCdnZXQnKTtcblxuICAgIHZhciBwYXRoID0gcmVxLnN3YWdnZXIuc3dhZ2dlck9iamVjdC5wYXRoc1tyZXEuc3dhZ2dlci5hcGlQYXRoXTtcbiAgICB2YXIgeFN0b3JhZ2UgPSBwYXRoWyd4LXN0b3JhZ2UnXTtcbiAgICB2YXIgc2NoZW1hID0gcmVxLnN3YWdnZXIub3BlcmF0aW9uLnJlc3BvbnNlc1snMjAwJ10uc2NoZW1hO1xuICAgIGlmIChzY2hlbWEudHlwZSA9PSAnYXJyYXknKVxuICAgICAgICBfZ2V0QWxsKHJlcSwgcmVzLCBuZXh0KTtcbiAgICBlbHNlXG4gICAgICAgIF9nZXRPbmUocmVxLCByZXMsIG5leHQpO1xuICAgICovXG59XG5cblxuIl19