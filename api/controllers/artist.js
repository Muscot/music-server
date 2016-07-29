
export function list(req, res, next) {

    res.json(
    [
        {
            "mbid" :  "5b11f4ce­a62d­471e­81fc­a69a8278c7da" ,
            "description" : " < p > < b > N i r v a n a < / b > w a s a n A m e r i c a n r o c k b a n d t h a t w a s f o r m e d . . . o s v o s v . . . ",  
            "albums" :[
                {
                    "title" : "Nevermind",
                    "id" : "1b022e01­4da6­387b­8658­8678046e4cef",  
                    "image" : "http://coverartarchive.org/release/a146429a­cedc­3ab0­9e41­1aaf5f6cdc2d/3012495605.jpg"
                }
            ]
        }
    ]);    
}

export function get(req, res, next) {

    res.json(
    {
        "mbid" :  "5b11f4ce­a62d­471e­81fc­a69a8278c7da" ,
        "description" : " < p > < b > N i r v a n a < / b > w a s a n A m e r i c a n r o c k b a n d t h a t w a s f o r m e d . . . o s v o s v . . . ",  
        "albums" :[
            {
                "title" : "Nevermind",
                "id" : "1b022e01­4da6­387b­8658­8678046e4cef",  
                "image" : "http://coverartarchive.org/release/a146429a­cedc­3ab0­9e41­1aaf5f6cdc2d/3012495605.jpg"
            }
        ]
    }
    ); 
}


